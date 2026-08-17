/*--------------------------------------------------------------
 file    : short_period.js
 purpose : Modelling and SVG rendering of B747 short period mode
 note    : animation (Etkin 3d.ed.)
           SVG version — same simulate() as the canvas original,
 --------------------------------------------------------------
  2026-08-17 PL extracted *.js from *.html
  2026-07-26 PL converted to SVG rendering
  2026-07-12 PL more or less finished (canvas version)
  2026-06-22 PL new, cloned from dumbbell.js
--------------------------------------------------------------*/


// initialize SVG viewbox
let svg  = document.getElementById("svg");
svg.setAttribute( "viewBox", "0 50 400 300");
                              /* (top left) x  y width height */

// initialize SVG model of B747
let b747 = new B747();     // airplane constructor, defaults
b747.setScale( 1.8 );
/*
b747.setCenter( 200, 200 ); // svg viewBox is 400x400, so center at 200,200  ??????????
*/
b747.createSVG( svg );      // build the <path> elements once

// initialize simulation parameters
let theta  = 0;
let tSim  = 0;
let tNow  = performance.now();
let tPrev = tNow;
let isRunning = true;

// -------------------------------------------------------------
function onLoad() {
   attachMouse( svg );    // from mouse.js
   run();
}

// -------------------------------------------------------------
function mouseDownHandle() {
   isRunning = !mouseIsDown;
}

// -------------------------------------------------------------
function run() {
   mouseDownHandle();

   simulate();
   b747.draw( 0, 0, theta);       // from b747_side_view_svg.js

   requestAnimationFrame( run);
}

// -------------------------------------------------------------
function simulate() {

   // find past dT
   tNow   = performance.now();
   let dT = tNow - tPrev;
   tPrev  = tNow;

   // propagate simulation time, unless paused by mouse down
   if ( isRunning )  {
      tSim = tSim + dT;
   }

   // Short period time [ms], Etkin 3d.ed., Table 6.3.
   let T = 7080;

   // phase of phi
   let phaseTheta  = tSim/T * 2 * Math.PI;

   // choose nice pitch angle amplitude
   let thetaMax = 0.1;

   // propagate theta
   theta =  thetaMax *  Math.sin( phaseTheta );
}
