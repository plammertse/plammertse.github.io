/*--------------------------------------------------------------
 file    : short_period.js
 purpose : Modelling and SVG rendering of B747 short period mode
 note    : animation (Etkin 3d.ed.)
 --------------------------------------------------------------
  2026-08-28 PL moving B747 with CG, MAC markers and lift arrow
  2026-08-17 PL extracted the *.js from the *.html
  2026-07-26 PL converted to SVG rendering
  2026-07-12 PL more or less finished (canvas version)
  2026-06-22 PL new, cloned from dumbbell.js
--------------------------------------------------------------*/

// TODO      MAKE THESE VARIABLES LOCAL TO THE OBJECT
// get SVG as opened in HTML
let svg  = document.getElementById("svg");

let X_axis = '<line x1="0" y1="-100" x2="0" y2="100" stroke="gray" stroke-width="0.1 " />'
let Y_axis = '<line x1="-100" y1="0" x2="100" y2="0" stroke="gray" stroke-width="0.1" />'

// initialize SVG model of B747
let b747 = new B747();
svg.setAttribute( "viewBox", b747.viewBox );

// initialize CG and Iyy markers
const rCG = 1.7;                  // nice size in[m]
let CG  = new CG_marker( 0, 0, rCG );

let rYY = 12.47;                    // Ixx in Etkin, see memo PL 25-057
let YY1 = new CG_marker( -rYY, 0, 0.7*rCG, 'white', 'dimgrey' );
let YY2 = new CG_marker(  rYY, 0, 0.7*rCG, 'white', 'dimgrey' );

// initialize MAC marker
const xMAC = 8.324/4;               // 25 % of Etkin p.65 MAC
// tried : light_orange = '#F0F000'; cyan, lightcyan, turquoise
let MAC  = new CG_marker( xMAC, 0, rCG, 'cyan' );  // "air" color

// initialize lift arrow
let liftArrow = new Arrow( 5, 3, 1.2, 2);  // head L, W, stem, edge (centered)
liftArrow.setColors( 'blue', 'white');   // white outline if base close to MAC

//let liftSpring = new Spring( 20, 8, 4 );   // zero length, N coils, line width
let liftSpring = new Spring( 20, 8, 0.5 );   // zero length, N coils, line width
liftSpring.setColor( 'mediumblue');

//let  springAnchor = new Floor( 5, 3, 2, 4 );  // length, height, N, thickness
let  springAnchor = new Floor( 5, 3, 2, 0.5 );  // length, height, N, thickness
springAnchor.setColor( 'blue');   // lightblue is also nice

let tempString = '&Delta;L<tspan baseline-shift="sub">&alpha;</tspan>';
let liftText   = new Text( tempString, 4, 'darkblue' );

// initialize simulation parameters
let theta = 0;          // global nose up, opposite to svg plot theta 
let yCG   = 0;
let tSim  = 0;
let tPrev = performance.now();
let isRunning = true;

let Jawel  = document.getElementById("Jawel");

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
   
   Jawel.innerHTML = mouseIsDown + ' ' + pXMouse.toFixed(3);
}

// -------------------------------------------------------------
function run() {
   mouseDownHandle();

   simulate();
   
      // draw Y-axis
   svg.innerHTML = X_axis + Y_axis;       // re-start the string

   let plotTheta = -theta;
   
      // move B747 airplane
   b747.update( 0, yCG, plotTheta);
   svg.innerHTML += b747.svgString;

      // hide spring under MAC marker
   let lift      = 150*plotTheta;
   liftSpring.update( xMAC, yCG, xMAC, liftSpring.S0 );
   svg.innerHTML += liftSpring.svgString;
   springAnchor.update( xMAC, liftSpring.S0);
   svg.innerHTML += springAnchor.svgString;
   
   // move CG and Iyy markers
   CG.update( 0, yCG, plotTheta);
   svg.innerHTML += CG.svgString;
   YY1.update( 0, yCG, plotTheta);
   svg.innerHTML += YY1.svgString;
   YY2.update( 0, yCG, plotTheta);
   svg.innerHTML += YY2.svgString;

   // move MAC marker
   MAC.update( 0, yCG, plotTheta);
   svg.innerHTML += MAC.svgString;
   
   // move lift arrow
   // TODO  Tilt the lift only by gamma = theta-alpha, not by theta.
   //       Show the air direction gamma ( by parallel flowing lines ? ),
   //       and the airplane drifting down through these lines,
   //       with w=alpha*V so you *do* see the airplane bobbing
   //       up and down.
   let dirLift     = 0.5*Math.PI*( 1-Math.sign(lift) );  // up or down ( swapped ? )
   liftArrow.update( xMAC+10,  yCG + liftSpring.S0 + 0.2*lift,  // x, y,
                     Math.abs( lift), dirLift);    // length, direction
/*                     
   svg.innerHTML += liftArrow.svgString;
*/
      
      // lift text
//   liftText.update( xMAC+6, liftSpring.S0-4-0.1*lift ); // minus for +Y
   liftText.update( xMAC+6, liftSpring.S0-4.5+0.2*lift ); // minus for +Y
   svg.innerHTML += liftText.svgString;

/* THIS DOESN'T WORK YET, ALTHOUGH IT DOES GET THE RIGHT <g . . .>
let b747_svg  = document.getElementById("b747");
console.log( b747_svg);
attachMouse( b747_svg);
*/

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

      // short period time [ms], Etkin 3d.ed., Table 6.3.
   let T = 7080;

      // phase of phi (start diving)
   let phaseTheta  = tSim/T * 2 * Math.PI - Math.PI/2;

      // choose nice pitch angle amplitude
   let thetaMax = 0.075;

      // propagate airplane theta
      // (nose up, clockwise in plot)
   theta =  thetaMax * Math.sin( phaseTheta );

      // do a very coarse estimate of the CG motion,
      // for a center of percusson of -80 m in phase,
      // which it is *not* ( see PL-26-100 ).
   yCG = -80.0*theta;

}
