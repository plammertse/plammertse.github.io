// -------------------------------------------------------------
//  file    : mouse.js
//  purpose : Handle mouse and touch screen events
// -------------------------------------------------------------
//  Works with any target element (canvas OR svg) — pass it to
//  attachMouse(target). If you call attachMouse() with no
//  argument, it falls back to a global "canvas" variable, same
//  as the original canvas-only version.
// -------------------------------------------------------------
//  history :
//    2026-07-26 PL target any element via getBoundingClientRect,
//                  not just canvas offsetX/offsetY; fixed evt/e typo
//                  (this comment by Claude!)
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

// -- element listeners are attached to ---------------------- //
let mouseTarget = null;

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
   let rect = mouseTarget.getBoundingClientRect();
   pXMouse = e.clientX - rect.left;
   pYMouse = e.clientY - rect.top;
   pXPrev  = pXMouse;
   pYPrev  = pYMouse;
}

function onMouseUp(e) {
   mouseIsDown = false;
   mouseIsUp   = true;
}

function onMouseMove(e) {
   let rect = mouseTarget.getBoundingClientRect();
   pXMouse = e.clientX - rect.left;
   pYMouse = e.clientY - rect.top;
   // pXPrev will be set outside, at animation intervals
}

// Touchmove does not seem to support offsetX and movementX.
// Pointermove X coordinate does not work well on mobiles,
// so use older mouse/touch fixes.
function onTouchMove(e) {
   let rect = mouseTarget.getBoundingClientRect();
   pXMouse = e.touches[0].clientX - rect.left;
   pYMouse = e.touches[0].clientY - rect.top;
   // Prev and Move will be set outside, at animation intervals

   // Do not also handle a mouse event
   if ( e.target == mouseTarget ) e.preventDefault();
}

function onTouchStart(e) {
   mouseIsDown = true;

   let rect = mouseTarget.getBoundingClientRect();
   pXMouse = e.touches[0].clientX - rect.left;
   pYMouse = e.touches[0].clientY - rect.top;
   pXPrev  = pXMouse;
   pYPrev  = pYMouse;

   // Do not also handle a mouse event
   if ( e.target == mouseTarget ) e.preventDefault();   // fixed: was "evt"
}

function onTouchEnd(e) {
   mouseIsDown = false;

   // Do not also handle a mouse event
   if ( e.target == mouseTarget ) e.preventDefault();
}

function attachMouse(target) {
   mouseTarget = target;
   console.log( 'attached mouse to', mouseTarget );
   mouseTarget.addEventListener( "mousemove",  onMouseMove  );
   mouseTarget.addEventListener( "mousedown",  onMouseDown  );
   mouseTarget.addEventListener( "mouseup",    onMouseUp    );
   mouseTarget.addEventListener( "mouseup",    onMouseUp    );
   mouseTarget.addEventListener( "mouseout",   onMouseUp    );
   mouseTarget.addEventListener( "touchmove",  onTouchMove  );
   mouseTarget.addEventListener( "touchstart", onTouchStart );
   mouseTarget.addEventListener( "touchend",   onTouchEnd   );
}
