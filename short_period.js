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
    // COM needs a different name than CG_marker ??
let CG  = new CG_marker( 0, 0, rCG );

let rYY = 12.47;                    // Ixx in Etkin, see memo PL 25-057
let YY1 = new CG_marker( -rYY, 0, 0.7*rCG, 'white', 'grey' );
let YY2 = new CG_marker(  rYY, 0, 0.7*rCG, 'white', 'grey' );

// initialize MAC marker
const xMAC = 8.324/4;               // 25 % of Etkin p.65 MAC
// tried : light_orange = '#F0F000'; cyan, lightcyan, turquoise
let MAC  = new CG_marker( xMAC, 0, rCG, 'cyan' );  // "air" color

// initialize lift arrow
let liftArrow = new Arrow( 5, 3, 1.2, 2);  // head L, W, stem, edge (centered)
liftArrow.setColors( 'blue', 'white');   // white outline if base close to MAC

let liftSpring = new Spring( 20, 8, 4 );
liftSpring.setColor( 'mediumblue');

let  springAnchor = new Floor( 5, 3, 2, 4 );  // width, N, H, tL
springAnchor.setColor( 'blue');   // lightblue is also nice

let tempString = '&Delta;L<tspan baseline-shift="sub">&alpha;</tspan>';
let liftText   = new Text( tempString, 4, 'darkblue' );

// initialize simulation parameters
let theta = 0;
let yCG   = 0;
let tSim  = 0;
//let tNow  = performance.now();
let tPrev = performance.now();
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
   
      // draw Y-axis
   svg.innerHTML = X_axis + Y_axis; 

      // move B747 airplane
   b747.update( 0, yCG, theta);
   svg.innerHTML += b747.svgString;        // re-start the string

      // hide spring under MAC marker
   let lift      = 150*theta;
   liftSpring.update( xMAC, yCG, xMAC, liftSpring.S0 );
   svg.innerHTML += liftSpring.svgString;
   springAnchor.update( xMAC, liftSpring.S0);
   svg.innerHTML += springAnchor.svgString;
   
   // move CG and Iyy markers
   CG.update( 0, yCG, theta);
   svg.innerHTML += CG.svgString;
   YY1.update( 0, yCG, theta);
   svg.innerHTML += YY1.svgString;
   YY2.update( 0, yCG, theta);
   svg.innerHTML += YY2.svgString;

   // move MAC marker
   MAC.update( 0, yCG, theta);
   svg.innerHTML += MAC.svgString;
   
   // move lift arrow
   // TODO  Tilt the lift only by gamma = theta-alpha, not by theta.
   //       Show the air direction gamma ( by parallel flowing lines ? ),
   //       and the airplane drifting down through these lines,
   //       with w=alpha*V so you *do* see the airplane bobbing
   //       up and down.
   let tLift     = 0.5*Math.PI*( 1-Math.sign(lift) );  // up or down
   liftArrow.update( xMAC+10,  yCG + liftSpring.S0 + 0.2*lift,  // x, y,
                     tLift, Math.abs( lift));       // direction, length
/*                     
   svg.innerHTML += liftArrow.svgString;
*/
      
      // lift text
   liftText.update( xMAC+6, liftSpring.S0-4-0.1*lift ); // minus for +Y
   svg.innerHTML += liftText.svgString;

   requestAnimationFrame( run);
}

// -------------------------------------------------------------
function simulate() {

   // find past dT
   let tNow   = performance.now();
   let dT = tNow - tPrev;
   tPrev  = tNow;

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

   // do a very coarse estimate of the CG motion,
   // for a center of percusson of -80 m in phase,
   // which it is *not* ( see PL-26-100 ).
   yCG = -80.0*theta;

}
