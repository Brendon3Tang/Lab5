// script.js

// canvas and image
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext("2d");
const img = new Image(); // used to load image from <input> and draw to canvas
const imgInput = document.getElementById('image-input');

// page components
const form = document.getElementById('generate-meme');
const submitBtn = document.querySelector('button[type=submit]');
const clear = document.querySelector('button[type=reset]');

// variables for volumes
const volgroup = document.getElementById('volume-group');
const voicelist = document.getElementById('voice-selection');
const readtxt = document.querySelector('button[type=button]');
const volicon = volgroup.querySelector('img');
const volval = volgroup.querySelector('input');
let voices = [];
let volume = 1.0;

// variables for inserting texts
const topText = document.getElementById('text-top');
const botText = document.getElementById('text-bottom');
var inserted = false;

// initialize list
setVoiceList();

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 0;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  let dims = getDimmensions(canvas.width,canvas.height,img.width,img.height);
  ctx.drawImage(img,dims.startX,dims.startY,dims.width,dims.height);
  inserted = true;
});

imgInput.addEventListener('change', () => {
  img.src = window.URL.createObjectURL(imgInput.files[0]);
  img.alt = imgInput.files[0].name;
});

submitBtn.addEventListener('click',() => {
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  if(inserted){
    ctx.fillText(topText.value,canvas.width/2,35);
    ctx.fillText(botText.value,canvas.width/2,canvas.height - 10);
  }
  else {
    ctx.strokeText(topText.value,canvas.width/2,35);
    ctx.strokeText(botText.value,canvas.width/2,canvas.height - 10);
  }
  submitBtn.disabled = true;
  clear.disabled = readtxt.disabled = false;
});

clear.addEventListener('click',() => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  imgInput.value = null;
  submitBtn.disabled = inserted = false;
  clear.disabled = readtxt.disabled = true;
});

readtxt.addEventListener('click',() => {
  var utter = new SpeechSynthesisUtterance(topText.value+" "+botText.value);
  utter.volume = volume;
  if(voices.length != 0){
    // set selected voice
    let voiceOption = voicelist.selectedOptions[0].getAttribute('data-name');
    for(let i = 0; i < voices.length; i++){
      if(voices[i].name === voiceOption) {
        utter.voice = voices[i];
      }
    }
  }
  
  speechSynthesis.speak(utter);
});

volval.addEventListener('change',() =>{
  let val = volval.value;
  volume = val / 100.0;
  if (val >=67)
    volicon.src = "icons/volume-level-3.svg";
  else if(val >= 34)
    volicon.src = "icons/volume-level-2.svg";
  else if(val >= 1)
    volicon.src = "icons/volume-level-1.svg";
  else
    volicon.src = "icons/volume-level-0.svg";
});

// For voice list initialization
function setVoiceList() {
  let nochoice = voicelist.querySelector('option[value=none]');
  
  let interv = setInterval(() => { // wait until speechSynthesis is loaded
    voices = speechSynthesis.getVoices();
    if(voices.length != 0){
      // unlock choices
      voicelist.removeChild(nochoice);
      voicelist.disabled = false;
      // update choices
      for(let i = 0; i < voices.length; i++) {
        let option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if(voices[i].default) {
          option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voicelist.appendChild(option);
      }
      console.log(voices);
      console.log(voices.length);
      clearInterval(interv);
    }
  }, 10);  
}

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
