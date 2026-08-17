/* -------------------------------------------------------------
// file    : dutch_roll.js
// purpose : Boeing B747 Dutch roll animation (Etkin 3d.ed.)
// -------------------------------------------------------------
//  2026-08-17 PL moved out of dutch_roll.html
//  2026-06-22 PL new, cloned from dumbbell.js
// -----------------------------------------------------------*/

let canvas = document.getElementById("canvas"); 
let ctx    = canvas.getContext("2d");

// -------------------------------------------------------------
// For some reason, these lines cannot go into onLoad() :
let b747 = new B747();     // airplane constructor

// initialize simulation
let phi   = 0;
let psi   = 0;
let tSim  = 0;
let tNow  = performance.now();
let tPrev = tNow;
let isRunning = true;

// -------------------------------------------------------------
function onLoad() {
   attachMouse();    // from mouse.js
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
   // use zoom scale == 1.5 for now
   b747.draw( canvas.width/2, canvas.height/2, phi, psi, 1.5 );       // from b747.js
 
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

   // Dutch roll period [ms], Etkin 3d.ed., Table 6.8.
   let T = 6640;           
   
   // phase of phi
   let phasePhi  = tSim/T * 2 * Math.PI;
   
   // phase of psi w.r.t. phi, Table 6.9, p.188.
   let dPhasePsi = 155.7 * Math.PI/180;
   let phasePsi  = phasePhi + dPhasePsi;
   
   // magnitude of psi w.r.t. phi, Table 6.9, p.188.
   let magPsi    = 0.31; 
   
   // choose nice roll angle amplitude
   let phiMax = 0.25;    // 0.5
   
   // propagate phi and psi
   //  Temporary, fix later :
   //        convert psi down (Etkin) to psi up (my plot)
   phi =  phiMax *          Math.sin( phasePhi );
   psi = -phiMax * magPsi * Math.sin( phasePsi );
}
