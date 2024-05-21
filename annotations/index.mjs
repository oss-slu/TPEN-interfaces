document.addEventListener('DOMContentLoaded', () => {
 const imageUpload = document.getElementById('imageUpload');
 const imageContainer = document.getElementById('imageContainer');
 const uploadedImage = document.getElementById('uploadedImage');
 const drawTool = document.getElementById('drawTool');
 let isDrawing = false;
 let startX = 0;
 let startY = 0;
 let currentRectangle;

 let shapeData;

 imageUpload.addEventListener('change', handleImageUpload);
 imageContainer.addEventListener('mousedown', startDrawing);
 imageContainer.addEventListener('mousemove', drawRectangle);
 imageContainer.addEventListener('mouseup', endDrawing);
 drawTool.addEventListener('change', toggleDrawingMode);

 function handleImageUpload(event) {
   const file = event.target.files[0];
   if (file) {
     const reader = new FileReader();
     reader.onload = function(e) {
       uploadedImage.src = e.target.result;
     };
     reader.readAsDataURL(file);
   }
 }

 function startDrawing(event) {
   if (!drawTool.checked) return; 
   isDrawing = true;
   const rect = uploadedImage.getBoundingClientRect();
   startX = ((event.clientX - rect.left) / rect.width) * 100;
   startY = ((event.clientY - rect.top) / rect.height) * 100;
   currentRectangle = document.createElement('div');
   currentRectangle.classList.add('rectangle');
   currentRectangle.style.background = 'rgba(255, 255, 0, 0.3)';  
   currentRectangle.style.border = '1px solid grey';
   updateRectangleSize(event);
   imageContainer.appendChild(currentRectangle);
 }

 function drawRectangle(event) {
   if (!isDrawing || !drawTool.checked) return; 
   updateRectangleSize(event);
 }

 function endDrawing() {
   if (!currentRectangle) return;
   isDrawing = false;
   currentRectangle.style.background = '';  
   currentRectangle.style.border = '2px solid red'; 
   
   shapeData = {
    left:currentRectangle.style.left,
    top:currentRectangle.style.top,
    width:currentRectangle.style.width,
    height:currentRectangle.style.height,
   }

   saveArea(shapeData)
 }

 function updateRectangleSize(event) {
   if (!currentRectangle) return;
   const rect = uploadedImage.getBoundingClientRect();
   const currentX = ((event.clientX - rect.left) / rect.width) * 100;
   const currentY = ((event.clientY - rect.top) / rect.height) * 100;
   const width = currentX - startX;
   const height = currentY - startY;
   currentRectangle.style.width = Math.abs(width) + '%';
   currentRectangle.style.height = Math.abs(height) + '%';
   currentRectangle.style.left = (width >= 0 ? startX : startX + width) + '%';
   currentRectangle.style.top = (height >= 0 ? startY : startY + height) + '%';
 }

 function toggleDrawingMode() {
   if (!drawTool.checked && currentRectangle) { 
     imageContainer.removeChild(currentRectangle);
     currentRectangle = null;
     isDrawing = false;
   }
 }


 function saveArea(data){
  return //function under construction
  if(!data) return
  fetch("https://www.baseURL/annotation/area", {
   method:POST,
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify(data)
  }).then((resp)=>console.log(resp.json())).catch((error)=>console.log(error))
 }


});

