// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
  window.URL = window.URL || window.webkitURL;

  var imgInput = document.getElementById('image-input');
  imgInput.onchange=function(){handleFunction(this.files)};

  var canvas = document.getElementById("user-image");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
   function handleFunction(files){
   if(files.length)
   {
     img.src = window.URL.createObjectURL(files[0]);
      //img.onload = function(){window.URL.revokeObjectURL(this.src)}
    }
  }

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  var imgWidth = img.width;
  var imgHeight = img.height;
  var imgInfo = getDimmensions(canvas.width, canvas.height, imgWidth, imgHeight);
  console.log(canvas.width,canvas.height);
  ctx.drawImage(img, imgInfo.startX, imgInfo.startY, imgInfo.width, imgInfo.height);

  img.alt=handleInfo(document.getElementById('image-input').files);
  console.log(img.alt);
  
  function handleInfo(files){
    if(files.length)
    {
      var nameInfo = files[0].name;
      return nameInfo;
    }
  }
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

var submitBtn = document.querySelector("[type='submit']");
  console.log(submitBtn);

  submitBtn.addEventListener('click', function(event){
    
    event.preventDefault();

    var butGroup = document.getElementsByTagName('button');
    console.log(butGroup);
    butGroup[1].disabled=false;
    butGroup[2].disabled=false;
    console.log(butGroup[1]);
    console.log(butGroup[2]);
    var topText = document.getElementById('text-top').value;
    var botText = document.getElementById('text-bottom').value;

    ctx.fillStyle="red";
    ctx.font="50px bold Arial";
    ctx.textAlign="center";
    ctx.fillText(topText,200,50);
    ctx.fillText(botText,200,370);
    
    //clear the canvas and button
    butGroup[1].addEventListener('click', function(){
      //canvas.remove();
      ctx.fillStyle='#000000';
      ctx.fillRect(0,0,400,400);

      butGroup[1].disabled=true;
      butGroup[2].disabled=true;
    });
  });

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
  }else {
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
