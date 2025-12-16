document.addEventListener("DOMContentLoaded", () => {
            const colorInput = document.getElementById('changeColor');
            const hexInput = document.getElementById('hex');
            const rgbInput = document.getElementById('rgb');
            const colorPreview = document.getElementById('colorPreview');
            const copyBtns = document.querySelectorAll('.copy-btn');
            const shareBtn = document.getElementById('shareBtn');
            const toast = document.getElementById('toast');
            const toastText = toast.querySelector('span');

            const hexToRgb = (hex) => {
                const r = parseInt(hex.substring(1, 3), 16);
                const g = parseInt(hex.substring(3, 5), 16);
                const b = parseInt(hex.substring(5, 7), 16);
                return `rgb(${r}, ${g}, ${b})`;
            }

            const adjustBrightness = (col, amt) => {
                let usePound = false;
                if (col[0] == "#") {
                    col = col.slice(1);
                    usePound = true;
                }
                let num = parseInt(col, 16);
                let r = (num >> 16) + amt;
                if (r > 255) r = 255; else if (r < 0) r = 0;
                let b = ((num >> 8) & 0x00FF) + amt;
                if (b > 255) b = 255; else if (b < 0) b = 0;
                let g = (num & 0x0000FF) + amt;
                if (g > 255) g = 255; else if (g < 0) g = 0;
                return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
            }
  
            const checkContrast = (hex) => {
                const r = parseInt(hex.substring(1, 3), 16);
                const g = parseInt(hex.substring(3, 5), 16);
                const b = parseInt(hex.substring(5, 7), 16);
                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

                if (yiq >= 160) {
                    document.body.classList.add('light-theme');
                } else {
                    document.body.classList.remove('light-theme');
                }
            }

            const updateUI = (color) => {
                hexInput.value = color;
                rgbInput.value = hexToRgb(color);
                colorPreview.style.backgroundColor = color;
                
                const darkerColor = adjustBrightness(color, -40);
                document.body.style.background = `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`;
                checkContrast(color);

                const newUrl = new URL(window.location);
                newUrl.searchParams.set('color', color.substring(1));
                window.history.replaceState({}, '', newUrl);
            };

            const showToast = (message) => {
                toastText.innerText = message;
                toast.className = "show";
                setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
            }

            colorInput.addEventListener('input', (e) => {
                updateUI(e.target.value);
            });

            colorPreview.addEventListener('click', () => {
                colorInput.click();
            });

            copyBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetId = btn.getAttribute('data-target');
                    const input = document.getElementById(targetId);
                    
                    navigator.clipboard.writeText(input.value).then(() => {
                        showToast(`${targetId.toUpperCase()} copied!`);
                        const icon = btn.querySelector('i');
                        const originalClass = icon.className;
                        icon.className = "fa-solid fa-check";
                        setTimeout(() => icon.className = originalClass, 2000);
                    });
                });
            });

            shareBtn.addEventListener('click', () => {
                const shareUrl = window.location.href;
                navigator.clipboard.writeText(shareUrl).then(() => {
                    showToast("Link copied to clipboard!");
                });
            });

            const urlParams = new URLSearchParams(window.location.search);
            const sharedColor = urlParams.get('color');
            
            if (sharedColor && /^[0-9A-F]{6}$/i.test(sharedColor)) {
                const colorHex = '#' + sharedColor;
                colorInput.value = colorHex;
                updateUI(colorHex);
            } else {
                const initialColor = '#ff9a9e';
                colorInput.value = initialColor;
                updateUI(initialColor);
            }
        });
