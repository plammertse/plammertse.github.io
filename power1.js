/* --------------------------------------------------------------
-- file    : power1.js
-- purpose : Display two sliding Gaussian bumps
-- status  : Under development, first UI attempt in Javascript.
--------------------------------------------------------------*/
 
// VARIABLES --------------------------------------------->
   
let   canvas;
let   ctx;
// dpr (device pixel ratio) acts against blur and zoom problems
let   dpr;                    // screen scaling
const dT = 30;                // drawing interval

// screen scaling             // from canvas top left corner
const canvasWidth   =  600;
const canvasHeight  =  400;
const pXZero        =  200;
const pXGain        =   50;
const pYZero        =  200;
// pYGain gives a square grid for 3 sigma ~ pdf = 0.4
const pYGain        = -375;
// mouseGain moves selected objects in x less than mouse
const mouseGain     =  0.25/pXGain;

// mouse history
let mouseIsDown     = false;
let pXMouse         = 0;
let pYMouse         = 0;
let pXPrev          = 0;
let pYPrev          = 0;
let pXMove          = 0;
let pYMove          = 0;
let select          = "none";

// statistical data
const sqrtTwoPi     = Math.sqrt( 2 * Math.PI );
let xEffect         = 3;
let xCutoff         = 2;
   

//--   PERSISTENCE ( LOCAL STORAGE ) -------------------------->

function setDefaults() {
      xCutoff = 2;
      xEffect = 3;
      syncInputFields();
}

function loadLocalStorage() {
   let temp  = localStorage.getItem("cutoff");
   if ( temp != null )  { xCutoff = 1*temp };
   temp  = localStorage.getItem("effect");
   if ( temp != null )  { xEffect = 1*temp };

   syncInputFields();
}  

function saveLocalStorage() {
   localStorage.setItem("cutoff", xCutoff.toString() );
   localStorage.setItem("effect", xEffect.toString() );
}

function onVisibilityChange() {
   // visibility event fires when user exits screen
   if (document.visibilityState == 'hidden') {
      saveLocalStorage()
   }
}

//--  DATA FUNCTIONS ------------------------------------------>
   
function xRange( xL, xR ) {
   const N = 50;      // points per sigma
   let x = [];
   let x_ = xL;
   while ( x_ <= xR  ) {
           x_ = x_ + 1/N;
           x.push( x_);
   }
   return x;
   // TODO  Make distribution denser near the peak.
   //       Use steps of x.dx for an x^2 distribution.
}

function gaussBumpArray( x ) {
	// Unit area) Gauss bump.
   let y = [];
   for( let x_ of x ) {
      y.push( Math.exp( -0.5 * x_*x_) / sqrtTwoPi);
   }
   return y;
   // The full probability density function is :
   // const p1 = 1 / (stdDev * Math.sqrt(2 * Math.PI));
   // const p2 = Math.exp( -0.5 *
   //             Math.pow((x - mean) / stdDev, 2));
   // return p1 * p2;
}
	  
function erf(x) {
   // constants
   let a1 =  0.254829592;
   let a2 = -0.284496736;
   let a3 =  1.421413741;
   let a4 = -1.453152027;
   let a5 =  1.061405429;
   let p  =  0.3275911;

   // Save the sign of x
   let sign = 1;
   if (x < 0) {
      sign = -1;
   }
   x = Math.abs(x) / Math.sqrt(2);  // !!!

   // A&S formula 7.1.26
   let t = 1.0/(1.0 + p*x);
   let y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)
		           * t *Math.exp(-x*x);
   return sign*y;
   // from : picomath
   // Greg Hewgill, from John D. Cook
   // polynomial A&S formula 7.1.26
   // Abramowitz and Stegun, Handbook of Mathematical Functions,
   // with sign and Horner's function for O(n) performance.
}
	  
function cdf(x) {
   // erf() ranges from -0.5 to +0.5,
   // cumulative probabilty density from 0 to 1
   return 0.5*( 1 + erf(x));
}

//--   DRAWING FUNCTIONS -------------------------------------->

function setCanvas()  {
   // Set actual size in memory (scaled for DPI)  (??)
   canvas.width  = canvasWidth;
   canvas.height = canvasHeight;
		 
   // Scaling ctx.scale by dpr is a known trick to prevent
   // blurry text and lines, but it makes the pixels
   // inside the canvas larger (TBC), zooming in on the scene,
   // without increasing the canvas area, so an incrasing part
   // of the scene falls outside the canvas frame, which is 
   // undesirable.
   // The pointer event positions are still in external
   // canvas coordinates, so there is a mismatch there too.
   // We will scale back the pixel drawing coordinates
   // by dpr to keep the drawing inside the canvas the same,
   // regardless of dpr. Not sure this is the best method.
   dpr = window.devicePixelRatio || 1;

   ctx.scale( dpr, dpr);
}
	  
//-- Scale and offset x and y to screen (pixel) axes : ------->

function sX( x ) {
   return ( pXZero + pXGain*x )/dpr;
}   
function sY( y ) {
   return ( pYZero + pYGain*y )/dpr;
}   

function drawLine( x, y, color = 'black' ) {
   ctx.beginPath();
   ctx.moveTo( sX( x[0]), sY( y[0]));
   let i = 1;
   while ( i < x.length ) {
      ctx.lineTo( sX( x[i]), sY( y[i]) );
      i++;
   }
   ctx.strokeStyle = color;
   ctx.stroke();
}

function drawGrid() {
   // TODO Make this a loop
   ctx.beginPath();
   ctx.moveTo( sX(-10), sY(0) );
   ctx.lineTo( sX( 10), sY(0) );
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo( sX(-10), sY(0.4) );
   ctx.lineTo( sX( 10), sY(0.4) );
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo( sX(-10), sY(-0.4) );
   ctx.lineTo( sX( 10), sY(-0.4) );
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo( sX(0), sY(-10) );
   ctx.lineTo( sX(0), sY( 10) );
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo( sX(3), sY(-10) );
   ctx.lineTo( sX(3), sY( 10) );
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo( sX(-3), sY(-10) );
   ctx.lineTo( sX(-3), sY( 10) );
   ctx.stroke();

   ctx.beginPath();
   ctx.moveTo( sX(6), sY(-10) );
   ctx.lineTo( sX(6), sY( 10) );
   ctx.stroke();
}

function fillToZero( x, y, fillColor = 'yellow' ) {
   ctx.beginPath();
   ctx.moveTo( sX( x[0]), sY(  0  ));
   ctx.lineTo( sX( x[0]), sY( y[0]));
   let i = 0;
   while ( i < x.length ) {
      ctx.lineTo( sX( x[i]), sY( y[i]) );
      i++;
   }
   ctx.lineTo( sX( x[ x.length-1] ), sY( 0 ) );  // vertical end
   ctx.lineTo( sX( x[0] ), sY(  0 )  );          // vertical begin
   ctx.lineTo( sX( x[0] ), sY( y[0]) );          // close the fill area 
   // This last statement is not needed in Chrome.

   ctx.fillStyle = fillColor;
   ctx.fill();
}
	  
function addScalar( x, dx ) { 
   let i = 0;
   while ( i < x.length ) {
      x[i] = x[i] + dx;
      i++;
   }
	return x;
}
	  
function mulScalar( x, fx )  {
   let i = 0;
   while ( i < x.length ) {
      x[i] = x[i] * fx;
		i++;
	}
	return x;
}
	  
function setText( text, x, y, FS = 12, color = 'black' )  {
   let FS_ = FS/dpr;
   ctx.font = FS_.toString() + "px Arial";
		 
	// Kludge a white background box with block characters.
	// Dirty fix /2 because the block character is rather wide.	 
	let temp = '\u2588';
	for ( let i = 1; i<text.length/2; i++ ) {
		temp = temp + '\u2588';
	}
	ctx.fillStyle = 'white';
	ctx.fillText( temp, sX(x), sY(y) );
		 
   ctx.fillStyle = color;
   ctx.fillText( text, sX(x), sY(y) );
}

//-- EVENT LISTENERS ------------------------------------------>

/*
function OnClick(e) { }
*/

// This function never detects a mobile phone !?!
// If needed, set isMobile it as soon as there is a touch event
/*
function IsMobile() {
   return ( window.navigator.maxTouchPoints > 1 );
   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
   return window.matchMedia("(any-hover:none)").matches; 
}
*/

function OnMouseDown(e) {
   mouseIsDown = true;
   pXMouse = e.offsetX;
   pYMouse = e.offsetY;
   pXMove  = e.movementX;
   pYMove  = e.movementY;
   mouseDownHandle();     
}

function OnMouseUp(e) {
   mouseIsDown = false;
   mouseDownHandle();     
}
	
function OnMouseMove(e) {
   pXMouse = e.offsetX;
   pYMouse = e.offsetY;
   pXMove  = e.movementX;
   pYMove  = e.movementY;
   mouseMovementHandle();
}
   

   
// pointermove X coordinate does not work well on mobiles,
// so use older mouse/touch fixes.
// Touchmove does not seem to support offsetX and movementX.
function OnTouchMove(e) {
   let rect = canvas.getBoundingClientRect();
   pXMouse = e.touches[0].clientX - rect.left;
   pYMouse = e.touches[0].clientY - rect.top;
   pXMove  = pXMouse - pXPrev;
   pXPrev  = pXMouse;
   pYMove  = pYMouse - pYPrev;
   pYPrev  = pYMouse;
         
   mouseMovementHandle();

   // Do not also handle a mouse event
   if ( e.target == canvas ) e.preventDefault();
}

function OnTouchStart(e) {
   mouseIsDown = true;
         
   let rect = canvas.getBoundingClientRect();
   pXMouse = e.touches[0].clientX - rect.left;
   pYMouse = e.touches[0].clientY - rect.top;
   pXMove = 0;
   pXPrev = pXMouse;
   pYMove = 0;
   pYPrev = pYMouse;
         
   mouseDownHandle();
         
   // Do not also handle a mouse event
   if ( evt.target == canvas ) evt.preventDefault();
}
      
function OnTouchEnd(e) {
   mouseIsDown = false;
   mouseDownHandle();     

   // Do not also handle a mouse event
   if ( e.target == canvas ) e.preventDefault();
}

function updateCutoff(e) {
   xCutoff = 1 * e.target.value;
}
   
   
function mouseDownHandle()  {
   // Handle mouse down state (not event)

   if ( !mouseIsDown ) {
      select = "none  "; return;
   }
   if ( !select == 'none' ) { return }
      
   // Mouse is down and nothing is selected.
   // See if you can select something.
      
   if ( pYMouse > pYZero)  {
      select = "effect";
   }
   if ( pYMouse < pYZero)  {
      select = "cutoff";
   }
}
   
function mouseMovementHandle()  {
   // Handle mouse moves
   if ( select == "effect" )  {
      xEffect = xEffect + mouseGain * pXMove;
      if ( Math.abs(xEffect) < 0.001 ) { xEffect = 0 }
   }   
   if ( select == "cutoff" )  {
      xCutoff = xCutoff + mouseGain * pXMove;
      if ( Math.abs( xCutoff) < 0.001 )  { xCutoff = 0; }
   }

   syncInputFields();
}
   
//  INPUT FIELD HANDLERS   ------------------------------------>

function syncInputFields()  {
   // Show the current parameter values in the input fields.
   // Call this(only) after mouse or calculation updates.
   // ( setting the field values in the main loop doesn't work,
   //   because it overrides the typing ).
   
   inputEffect.value = xEffect.toFixed(2);
   inputCutoff.value = xCutoff.toFixed(2);
}
  
function updateEffectSize(e) {
   // This needs the 1 * to make it numerical..
   xEffect = 1 * e.target.value;
}
function updateCutoff(e) {
   xCutoff = 1 * e.target.value;
}
    
//   CANVAS MAIN DRAWING -------------------------------------->
   
function Draw() {
   setCanvas();               // size and dpr scaling

   ctx.clearRect( 0, 0, canvas.width, canvas.height);

   // Fill zero hypothesis confidence area
   let x = xRange( -10, xCutoff );
   let y = gaussBumpArray( x );
   fillToZero( x, y, 'aqua'  );

   // Fill Type I error area
   x = xRange( xCutoff, 10 );
   y = gaussBumpArray( x );
   fillToZero( x, y, "#ff4400"  );  // reddish

   // Outline zero-hypothesis bump
   x = xRange( -10, 10 );
   y = gaussBumpArray( x );
   drawLine( x, y );

   // Fill Type II error area
   x = xRange( -10, xCutoff-xEffect );
   y = gaussBumpArray( x );
   x = addScalar( x, xEffect);
   y = mulScalar( y, -1);
   fillToZero( x, y, 'red'  );

   // Fill power area
   x = xRange( xCutoff-xEffect, 5 );
   y = gaussBumpArray( x );
   x = addScalar( x, xEffect);
   y = mulScalar( y, -1);
   fillToZero( x, y, 'aqua'  );

   // Outline effect-hypothesis bump
   x = xRange( -20, 20 );
   y = gaussBumpArray( x );
   x = addScalar( x, xEffect);
   y = mulScalar( y, -1);
   drawLine( x, y );

   // Grid axes
   ctx.lineWidth = 0.2;  // makes it grey
   drawGrid();

   // Cutoff line dashed vertical
   ctx.lineWidth = 3;
   ctx.setLineDash([3,3]);
   x = [ xCutoff, xCutoff  ];
   y = [ -0.4, 0.4 ];
   drawLine( x, y, 'darkblue' );
   ctx.setLineDash([]);  // end dash

   // Cutoff line tick ends
   ctx.lineWidth = 2;
   x = [ xCutoff-0.12, xCutoff+0.12 ];
   y = [ -0.4, -0.4 ];
   drawLine( x, y, 'darkblue' );
   y = [  0.4,  0.4 ];
   drawLine( x, y, 'darkblue' );

   // Zero hypothesis label
   ctx.textAlign = "center";
   ctx.fillColor = 'black';
   setText( '  zero hypothesis  ', 0,  0.42 );
		 
   // Effect hypothesis label
   let s = '   effect hypothesis = ' +
           xEffect.toPrecision(2).toString() +
           ' ' + '\u03c3' + '   ';
   setText( s , xEffect,  -0.44 );
		 
   // Cutoff label
   ctx.textAlign = "center";
   ctx.fillColor = 'black';
   s = '  cutoff = ' +
   xCutoff.toPrecision(3).toString() +
      ' ' + '\u03c3' + '   ';
   setText(  s, xCutoff, 0.22 );

   // Type I error label
   let tail = 1-cdf( xCutoff);       // one-sided, right tail
   if ( Math.abs( tail) < 0.01 ) { tail = 0 }
   s = ' type I error = ' +
         tail.toPrecision(3).toString() + '      ';
   ctx.textAlign = "left";
   setText( s , xCutoff+0.3, +0.04 );
		 
   // Type II error label
   tail = cdf( xCutoff - xEffect);       // one-sided, left tail
   if ( tail < 0.01 )  { tail = 0 }
      s = '    type II error = ' +
              tail.toPrecision(2).toString() + '   ';
   ctx.textAlign = "right";
   setText( s, xCutoff-0.2, -0.06 );

   // Power label - calculate power
   let  power = 1 - tail;       // one-sided, right tail
   if ( power < 0.001 )  { power = 0 }

   // Place "power" label to right of cutoff and effect bump
   let xx = Math.max( xEffect+0.5, xCutoff+0.5);
   s = ' power = ' + power.toPrecision(2).toString() + '      ';
   ctx.textAlign = "start";
   setText( s, xx, -0.2 );
/*
   // Set temporary <p> text on mouse movements
   let test = document.getElementById( "touch test" );
      test.innerHTML = ' select =  ' + select +
                     '<br> mouseX = ' + pXMouse.toString() +
                     '<br> moveX  = ' + pXMove.toString();
*/
} // end Draw()
      
function OnLoad()  {
   // The event listeners have to be attached in, or by, the body.
   // We use onload to package these calls.
   // We will throw in setInterval here too.
   
   // sync saved user data
   document.addEventListener( 'visibilitychange',
                               onVisibilityChange);
   loadLocalStorage();    // no visibility change on load..
     
   // attach mouse event handlers
	let canvasId = "bumps";
   canvas = document.getElementById( canvasId );
   ctx    = canvas.getContext( "2d" );
   canvas.addEventListener( "mousemove",  OnMouseMove  );
   canvas.addEventListener( "mousedown",  OnMouseDown  );
   canvas.addEventListener( "mouseup",    OnMouseUp    );
   canvas.addEventListener( "mouseleave", OnMouseUp    );    // OK 
   canvas.addEventListener( "touchmove",  OnTouchMove  );
   canvas.addEventListener( "touchstart", OnTouchStart );
   canvas.addEventListener( "touchend",   OnTouchEnd   );
      
   // attach input field handlers
   let temp = document.getElementById("inputEffect");
   temp.addEventListener("change", updateEffectSize);   
   temp = document.getElementById("inputCutoff");
   temp.addEventListener("change", updateCutoff);
                                             
   // make the canvas run in a loop
   setInterval( Draw, dT );          // main drawing loop
}
   