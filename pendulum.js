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

// give the eigenvectors here or later.
let vecPlot = new Eigenvector();
svg.setAttribute( "viewBox", vecPlot.viewBox );
console.log( vecPlot.viewBox);

// initialize simulation parameters
let amp   = 0;          ////////   GLOBAL FOR NOW   ////////
let phase = 0;
let tSim  = 0;
let tPrev = performance.now();
let isRunning = true;

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

   if ( isRunning) { }
   else {
      tSim = 10*pXMouse;
   }
}

// -------------------------------------------------------------
function run() {
   mouseDownHandle();

   simulate();
   
   vecPlot.update( amp, phase );
   svg.innerHTML = vecPlot.svgString;     // re-start the string

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

      // phase of phi (start diving)
   let phaseTheta  = tSim/T * 2 * Math.PI - Math.PI/2;

      // choose nice pitch angle amplitude
   let thetaMax = 0.075;

      // propagate theta
   theta =  thetaMax * Math.sin( phaseTheta );
}
