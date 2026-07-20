// -------------------------------------------------------------
//  file    : mouse.js
//  purpose : Handle mouse and touch screen events
// -------------------------------------------------------------
//  This script needs an external variable "canvas",
//    both for the touch positions and for attachMouse()
//  Create it in a short script section in the HTML body,
//    right *after* the HTML canvas has been created.
//  Then insert mouse.js just before the HTML </body> end.  
// -------------------------------------------------------------
//  history :
//    2026-05-28 PL moved most handling to application script
// -------------------------------------------------------------

// -- current mouse state - positions in pixel coordinates -- //
let mouseIsDown = false;
let mouseIsUp   = !mouseIsDown;

let pXMouse     = 0;
let pYMouse     = 0;

// -- mouse history for mouseGetMove() ---------------------- //
let pXPrev      = 0;
let pYPrev      = 0;
let pXMove      = 0;
let pYMove      = 0;

// -- function to be called from the animation loop --------- //
function mouseGetMove() {
   pXMove = pXMouse - pXPrev;
   pXPrev = pXMouse;
   pYMove = pYMouse - pYPrev;
   pYPrev = pYMouse;
}

//-- EVENT LISTENERS ---------------------------------------- //

function onMouseDown(e) {
   mouseIsDown = true;
   mouseIsUp   = false;
   pXMouse = e.offsetX;
   pYMouse = e.offsetY;
   pXPrev  = pXMouse;
   pYPrev  = pYMouse;
}

function onMouseUp(e) {
   mouseIsDown = false;
   mouseIsUp   = true;
}
	
function onMouseMove(e) {
   pXMouse = e.offsetX;
   pYMouse = e.offsetY;
   // pXPrev will be set outside, at animation intervals
}
   
// Touchmove does not seem to support offsetX and movementX.
// Pointermove X coordinate does not work well on mobiles,
// so use older mouse/touch fixes.
function onTouchMove(e) {
   let rect = canvas.getBoundingClientRect();
   pXMouse = e.touches[0].clientX - rect.left;
   pYMouse = e.touches[0].clientY - rect.top;
   // Prev and Move will be set outside, at animation intervals

   // Do not also handle a mouse event
   if ( e.target == canvas ) e.preventDefault();
}

function onTouchStart(e) {
   mouseIsDown = true;
         
   let rect = canvas.getBoundingClientRect();
   pXMouse = e.touches[0].clientX - rect.left;
   pYMouse = e.touches[0].clientY - rect.top;
   pXPrev  = pXMouse;
   pYPrev  = pYMouse;
                
   // Do not also handle a mouse event
   if ( evt.target == canvas ) evt.preventDefault();
}
      
function onTouchEnd(e) {
   mouseIsDown = false;

   // Do not also handle a mouse event
   if ( e.target == canvas ) e.preventDefault();
}

function attachMouse() {
   console.log( 'attached mouse');
   canvas.addEventListener( "mousemove",  onMouseMove  );
   canvas.addEventListener( "mousedown",  onMouseDown  );
   canvas.addEventListener( "mouseup",    onMouseUp    );
//   canvas.addEventListener( "mouseleave", onMouseUp    ); // OK ?
   canvas.addEventListener( "mouseout",   onMouseUp    ); // OK ?
   canvas.addEventListener( "touchmove",  onTouchMove  );
   canvas.addEventListener( "touchstart", onTouchStart );
   canvas.addEventListener( "touchend",   onTouchEnd   );
}
