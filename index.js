/*
0. Generate Button invokes the color generator program 
1. Generate 5 random colors and append them to each div[i]
2. change the text based on the colors
3. change the color of the text [black, white] based on the luminance of the genrated color background. 
4. Add functionality to the input sliders for hue, brightness and saturation
5. take the text innertext for the color and change the background of divs based on input change
5. Change the text of colors when slider input values are changes
/ Error: 1 
Whenever we change the saturation color to black, we lose the oriinal color.
 and the brightness will either be black or white. and saturation is lost too.
  the solution would be to create a reference to initial colors . initialcolors array to save colors
  Error 2: 
  When we picked a different color from the input, the  input background does not change
/
6. Add copy to clipboard. create a element to store the text ,execCommand to copy then del the element
and active classes to the copy container for the 'copy to clipboard animation'
7. add the active classes to the setting to toggle sliders panels along with active class to close the panel on close button
8. Add the lock functionality  check initalcolors before and aafter push colors and add locked class
9. Save & Library : create another variable to store multiple objects to save into localstorae
/ first create an object of name (input value) , colors (innertext of colors), index number of 
savePalettes.  then we check this to localStorage to check if null then empty else getItem
 
/
10.Generate Palette for the Library . create elements basedd on the data from Local storage
*/
//Global selections and variables
const colorBoxes = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const sliderContainers = document.querySelectorAll(".sliders");
const settingBtns = document.querySelectorAll(".setting");
const lockBtns = document.querySelectorAll(".lock");
const popup = document.querySelector(".copy-container");
const closeBtns = document.querySelectorAll(".sliders__close");

const generateBrew = document.querySelector(".generate-brew");

const brewBoxes = document.querySelectorAll(".brew-color");
const brewSection = document.querySelector(".section-header-brew");

let initialColors;
let savePaletts = [];
/* _________     EventListners      ___________*/
// 1. Generate Button
generateBtn.addEventListener("click", randomColor);
randomColor();
// 4 change background based on input
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
// 5. updating the text based on input
colorBoxes.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

// Copy the color based on click on text
currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});
//clear copy box once transitionend
popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("--active");
  popupBox.classList.remove("--active");
});
//open and close sliders on setting btn clicked
settingBtns.forEach((button, index) => {
  button.addEventListener("click", () => {
    openSliderPanels(index);
  });
});
closeBtns.forEach((button, index) => {
  button.addEventListener("click", () => {
    closeSliderPanels(index);
  });
});

//lock button
lockBtns.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    lockLayer(e, index);
  });
});

generateBrew.addEventListener("click", () => {
  testcase();
});
testcase();

/* ___________    Functions      ___________*/
//test
function testcase() {
  const color1 = chroma.random();
  const color2 = chroma.random();
  const hexCode1 = chroma.scale([color1, color2]).mode("lch").colors(5);
  for (let i = 0; i < hexCode1.length; i++) {
    // console.log(hexCode[i]);

    brewBoxes[i].style.backgroundColor = hexCode1[i];
    brewBoxes[i].innerText = hexCode1[i];

    brewSection.style.backgroundImage = `linear-gradient(to right, ${hexCode1})`;
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

    return hexCode[i];
  }
}

function randomColor() {
  initialColors = [];
  colorBoxes.forEach((div, index) => {
    const hexText = div.children[0];
    const randomCol = generateHex();
    //Add it to the array
    //check lock
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomCol).hex());
    }

    // console.log(randomCol);
    div.style.backgroundColor = randomCol;
    hexText.innerText = randomCol;

    //check contrast
    checkContrast(randomCol, hexText);
    //initialize colors sliders
    const color = chroma(randomCol);
    const sliders = div.querySelectorAll(".sliders input");
    //select hue,brightness and saturation from sliders
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    // console.log(hue, brightness, sat);

    colorizeSliders(color, hue, brightness, saturation);
  });
  // reset inputs
  resetInputs();
  //check for buttons contrasts
  settingBtns.forEach((button, index) => {
    checkContrast(initialColors[index], button);
    checkContrast(initialColors[index], lockBtns[index]);
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
  const noSat = color.set("hsl.s", 0); // desaturate
  const fullSat = color.set("hsl.s", 1); //full saturate
  const scaleSat = chroma.scale([noSat, color, fullSat]); //take a scale out of it
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
  // on change of input, get the parent div sliders then select hue, brihtness and saturation one by one from all sliders.
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  //get the color from text
  // const bgColor = colorBoxes[index].querySelector("h2").innerText;
  //Error 1 : Solution -> instead of relying on the text of color , we save our saved array for refeence
  const bgColor = initialColors[index];
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value) // SET : Changes a single channel and returns the result a new chroma object.
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);
  colorBoxes[index].style.backgroundColor = color;
  // update sliders colors of inputs
  colorizeSliders(color, hue, brightness, saturation);
}
//update text
function updateTextUI(index) {
  const activeDiv = colorBoxes[index];
  const color = chroma(activeDiv.style.backgroundColor); // take rgb color into chroma
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex(); // convert rgb to hex usin hex()
  //chnage the contrast of the text based on the input change
  checkContrast(color, textHex);
  for (icon of icons) {
    checkContrast(color, icon);
  }
}

//reset input
function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100; // to only get the first 3 values
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

// copy to clipboard
function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  const popupBox = popup.children[0];
  popup.classList.add("--active");
  popupBox.classList.add("--active");
}

//Open slider panels
//on setiing button
function openSliderPanels(index) {
  sliderContainers[index].classList.toggle("--active");
}
//on close button
function closeSliderPanels(index) {
  sliderContainers[index].classList.remove("--active");
}

//change the lock button
function lockLayer(e, index) {
  const lockSVG = e.target.children[0];
  const activeBg = colorBoxes[index];
  activeBg.classList.toggle("locked");

  if (lockSVG.classList.contains("fa-lock-open")) {
    e.target.innerHTML = '<i class="fas fa-lock"></i>';
  } else {
    e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
  }
}

/* ___________    Save & Library      ___________*/
//Save
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".save-close");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".library-close");
const resetLibrary = document.querySelector(".library-close--reset");

//Event Listeners
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);
resetLibrary.addEventListener("click", () => {
  localStorage.clear();
});

function openPalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("--active");
  popup.classList.add("--active");
}
function closePalette(e) {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("--active");
  popup.classList.add("remove");
}
function savePalette(e) {
  saveContainer.classList.remove("--active");
  popup.classList.remove("--active");
  const name = saveInput.value;
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });
  //fixing the index of color palette in library
  let palettsNr;
  const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletteObjects) {
    palettsNr = paletteObjects.length;
  } else {
    palettsNr = savePaletts.length;
  }
  // save the palette
  // let palettsNr = savePaletts.length;
  const paletteObj = { name: name, colors: colors, nr: palettsNr };
  savePaletts.push(paletteObj);
  console.log(savePaletts);
  savetoLocal(paletteObj);
  saveInput.value = "";

  //Generate the palette for Library
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("custom-palette-preview");
  //loop over each color in paletteobj
  paletteObj.colors.forEach((smallColor) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  });
  //select button in library
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("custom-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "Select";

  //Attach event to the Select btn
  paletteBtn.addEventListener("click", (e) => {
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    initialColors = [];
    savePaletts[paletteIndex].colors.forEach((color, index) => {
      initialColors.push(color);
      colorBoxes[index].style.backgroundColor = color;
      const text = colorBoxes[index].children[0];
      checkContrast(color, text);
      updateTextUI(index);
    });
    resetInputs();
  });

  //Append to Library
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}

//Library
function openLibrary(e) {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("--active");
  popup.classList.add("--active");
}
function closeLibrary(e) {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("--active");
  popup.classList.remove("remove");
}

// Local Storage

function savetoLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function getLocal() {
  if (localStorage.getItem("palettes") === null) {
    //Local Palettes
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    // *2

    savePaletts = [...paletteObjects];
    paletteObjects.forEach((paletteObj) => {
      //Generate the palette for Library
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("custom-palette-preview");
      paletteObj.colors.forEach((smallColor) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("custom-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "Select";

      //Attach event to the btn
      paletteBtn.addEventListener("click", (e) => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorBoxes[index].style.backgroundColor = color;
          const text = colorBoxes[index].children[0];
          checkContrast(color, text);
          updateTextUI(index);
        });
        resetInputs();
      });

      //Append to Library
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
  }
}
getLocal();
