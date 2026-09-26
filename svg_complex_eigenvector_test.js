/*--------------------------------------------------------------
 file    : svg_complex_eigenvector_test.js
 purpose : Test eponymous HTML and JS files
 --------------------------------------------------------------
  2026-09-22 PL cloned from svg_eigenvector_test
--------------------------------------------------------------*/

// get SVG as opened in HTML
let svg  = document.getElementById("svg");

// initialize plot
let plot = new Eig2plot();
svg.setAttribute( "viewBox", plot.viewBox );

// initialize simulation parameters
let phase = 0; 
let tSim  = 0;
let tPrev = performance.now();
let isRunning = true;

// DON'T FORGET TO CALL THIS IN THE HTML :
// -------------------------------------------------------------
function onLoad() {
   attachMouse( svg );    // from mouse.js
   run();                 // start loop, see below
}

// -------------------------------------------------------------
function mouseDownHandle() {
   if ( isRunning && mouseIsDown ) {
      console.log( 'Stop!');
   }
   if ( !isRunning && !mouseIsDown ) {
      console.log( 'Start!');
   }
   isRunning = !mouseIsDown;
   // console.log( pXMouse);

/*
   if ( isRunning) { }
   else {
      tSim = 10*pXMouse;
   }
*/   
}

// -------------------------------------------------------------
function run() {
   mouseDownHandle();

   simulate();
   
   plot.update( phase);
   svg.innerHTML = plot.svgString;
   console.log( plot.svgString);

   requestAnimationFrame( run);
}

// -------------------------------------------------------------
function simulate() {

      // find dT over past time step
   let tNow = performance.now();
   let dT   = tNow - tPrev;
   tPrev    = tNow;

      // propagate simulation time, unless paused by mouse down
   if ( isRunning )  {
      tSim = tSim + dT;
   }

      // rotation time [ms]
   const T = 10000;

      // phase
   phase = tSim/T * 2 * Math.PI;
}
