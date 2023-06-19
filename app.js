$(document).ready(function () {
  let input = document.querySelector("#changeColor");

  input.addEventListener("input", update, false);
  input.select();

  function colorValues(color) {
    if (!color) return;
    if (color.toLowerCase() === "transparent") return [0, 0, 0, 0];
    if (color[0] === "#") {
      if (color.length < 7) {
        color =
          "#" +
          color[1] +
          color[1] +
          color[2] +
          color[2] +
          color[3] +
          color[3] +
          (color.length > 4 ? color[4] + color[4] : "");
      }
      return [
        parseInt(color.substr(1, 2), 16),
        parseInt(color.substr(3, 2), 16),
        parseInt(color.substr(5, 2), 16),
        color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1,
      ];
    }
    if (color.indexOf("rgb") === -1) {
      var temp_elem = document.body.appendChild(
        document.createElement("fictum")
      );
      var flag = "rgb(1, 2, 3)";
      temp_elem.style.color = flag;
      if (temp_elem.style.color !== flag) return;
      temp_elem.style.color = color;
      if (temp_elem.style.color === flag || temp_elem.style.color === "")
        return;
      color = getComputedStyle(temp_elem).color;
      document.body.removeChild(temp_elem);
    }
    if (color.indexOf("rgb") === 0) {
      if (color.indexOf("rgba") === -1) color += ",1";
      return color.match(/[\.\d]+/g).map(function (a) {
        return +a;
      });
    }
  }

  function valueToHex(e) {
    let hex = e.toString(16);
    return hex;
  }

  function update(event) {
    let box = document.querySelector(".container");
    let text = document.querySelector("#header-text");
    let hex = document.querySelector("#hex");
    let rgb = document.querySelector("#rgb");
    let instagram = document.querySelector("#instagram");
    let github = document.querySelector("#github");
    let fields = document.querySelector(".fields");

    if (box && text) {
      box.style.backgroundColor = event.target.value;
      let rgbVal = colorValues(event.target.value);
      rgb.value = `rgb(${rgbVal});`;
      hex.value = event.target.value;
      let colors = colorValues(event.target.value);
      let r = colors[1];
      let g = colors[2];
      let b = colors[3];

      let o = Math.round(
        (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1001
      );

      if (o >= 120) {
        text.style.color = "black";
        instagram.style.color = "black";
        github.style.color = "black";
        instagram.style.borderColor = "black";
        github.style.borderColor = "black";
        fields.style.color = "black";
      } else {
        text.style.color = "white";
        instagram.style.color = "white";
        github.style.color = "white";
        instagram.style.borderColor = "white";
        github.style.borderColor = "white";
        fields.style.color = "white";
      }
    }
  }
});
