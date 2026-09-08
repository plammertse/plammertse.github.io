/*--------------------------------------------------------------
 file    : pendulum.js
 purpose : Rotating pendulum eigenvector,
              modelling and SVG rendering
 --------------------------------------------------------------
  2026-09-07 PL cloned for pendulum
  2026-08-28 PL short period
--------------------------------------------------------------*/

// TODO      MAKE THESE VARIABLES LOCAL TO THE OBJECT
// get SVG as opened in HTML
let svg  = document.getElementById("svg");

// initialize SVG plot of rotating eigenvectors
//   ( it will contain a number of Arrow objects )

let vecPlot = new Eigenvector();
svg.setAttribute( "viewBox", vecPlot.viewBox );
// svg.setAttribute( "background-color", "red"); STYLE, THIS WON'T WORK
// console.log( vecPlot.viewBox);
//svg.style.background-color = "red"; YES, BUT NUMBERED PROPERTIES ??

vecPlot.addVector( 1.0, 0 );          // mag, phase, color, name
vecPlot.addVector( 0.8, 1.7, "red" );

// initialize simulation parameters
let amp   = 1;          ////////   GLOBAL FOR NOW   ////////
let phase = 0;
let tSim  = 0;
let tPrev = performance.now();
let isRunning = true;

// -------------------------------------------------------------
function onLoad() {
svg.setAttribute( "background-color", "red");
   attachMouse( svg );    // from mouse.js
   run();                 // start loop, see below
}

// -------------------------------------------------------------
function run() {
   mouseDownHandle();

   simulate();
   
   vecPlot.update( amp, phase);
   svg.innerHTML = vecPlot.svgString;

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

      // Short period time [ms], Etkin 3d.ed., Table 6.3.
   let T = 7080;

      // rotate the whole bunch of vectors to this angle
   phase = tSim/T * 2 * Math.PI;
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
