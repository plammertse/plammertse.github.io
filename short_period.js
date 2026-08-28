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

// TODO      MAKE THESE VARIABLES LOCAL TO THE OBJECT
// get SVG as opened in HTML
let svg  = document.getElementById("svg");

// initialize SVG model of B747
let b747 = new B747();
svg.setAttribute( "viewBox", b747.viewBox );

// initialize CG markers and arrows
const rCG = 1.7;                  // nice size in[m]
    // COM needs a different name than CG_marker ??
let CG  = new CG_marker( '', 0, rCG );

const xMAC = 8.324/4;                  // 25 % of Etkin p.65 MAC
// let light_orange = '#F0F000';
// let MAC  = new CG_marker( xMAC, 0, rCG, light_orange );  // light orange
// cyan, lightcyan, turquoise
let MAC  = new CG_marker( xMAC, 0, rCG, 'cyan' );     // "air" color
let lift = new Arrow( );
lift.setColors( 'blue');

// initialize simulation parameters
let theta = 0;
let tSim  = 0;
let tNow  = performance.now();
let tPrev = tNow;
let isRunning = true;

// -------------------------------------------------------------
function onLoad() {
   attachMouse( svg );    // from mouse.js
   run();                 // start loop, see below
}

// -------------------------------------------------------------
function mouseDownHandle() {
   isRunning = !mouseIsDown;
}

// -------------------------------------------------------------
function run() {
   mouseDownHandle();

   simulate();
   
   b747.update( 0, 0, theta);
   svg.innerHTML = b747.svgString;        // re-start the string
   
   CG.update( 0, 0, theta);
   svg.innerHTML += CG.svgString;

   MAC.update( 0, 0, theta);
   svg.innerHTML += MAC.svgString;
   
   // TODO  Tilt the lift only by gamma = theta-alpha, not by theta.
   //       Show the air direction gamma ( by parallel flowing lines ? ),
   //       and the airplane drifting down through these lines,
   //       with w=alpha*V so you *do* see the airplane bobbing
   //       up and down.
   // if ( lift > 0 ) lift arrow is up, and above the airplane
   lift.update( xMAC, 8);      // up, above MAC
   svg.innerHTML += lift.svgString;

   // TODO  Later show the damping force at the correct moment arm.
   // TODO  Later show the I_xx balls, maybe in grey/white.

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
