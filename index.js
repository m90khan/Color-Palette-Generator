//Global selections and variables
const colorBoxes = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const settingBtn = document.querySelector(".setting");
const lockBtn = document.querySelector(".lock");
let initialColors;

const testdivs = document.querySelectorAll(".testkit");
//EventListners
generateBtn.addEventListener("click", function () {
  randomColor();
});
//
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorBoxes.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});
//Functions
//test
function testcase() {
  const color1 = chroma.random();
  const color2 = chroma.random();
  const hexCode1 = chroma.scale([color1, color2]).mode("lch").colors(5);
  for (let i = 0; i < hexCode1.length; i++) {
    // console.log(hexCode[i]);
    testdivs[i].style.backgroundColor = hexCode1[i];
  }
}

//enerate HEX
function generateHex() {
  const color1 = chroma.random();
  const color2 = chroma.random();
  const hexCode = chroma.scale([color1, color2]).mode("lch").colors(6);
  //manual way for generating hexcode
  //   const letters = "0123456789ABCDEF";
  //   let hash = "#";
  //   for (let i = 0; i < 6; i++) {
  //     hash = hash + letters[Math.floor(Math.random() * 15)];
  //   }
  //   return hash;
  for (let i = 0; i < hexCode.length; i++) {
    // console.log(hexCode[i]);
    console.log();
    return hexCode[i];
  }
}

function randomColor() {
  colorBoxes.forEach((div, index) => {
    const hexText = div.children[0];

    const randomCol = generateHex();

    div.style.backgroundColor = randomCol;
    hexText.innerText = randomCol;
    //check contrast
    checkContrast(randomCol, hexText);
    //initialize colors sliders
    const color = chroma(randomCol);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    // console.log(hue, brightness, sat);

    colorizeSliders(color, hue, brightness, saturation);
  });
}

//to change color based on brightness
function checkContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

// sliders colors
function colorizeSliders(color, hue, brightness, saturation) {
  //Scale Saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //Scale Brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  //Update Input Colors
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )},${scaleBright(0.5)} ,${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

//hslcontrol for input controls
function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = colorBoxes[index].querySelector("h2").innerText;

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);
  colorBoxes[index].style.backgroundColor = color;
  // colorBoxes[index].style.backgroundColor = color;
}

function updateTextUI(index) {
  const activeDiv = colorBoxes[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
}
