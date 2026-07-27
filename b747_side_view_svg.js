// --------------------------------------------------------------
// file    : b747_side_view_svg.js
// purpose : Graphical B747, side view for short period animation
//           SVG version — same geometry as the canvas original,
//           rendered as <path> elements with a single group
//           transform instead of per-point trig every frame.
// --------------------------------------------------------------
//  2026-07-26 PL converted to SVG rendering; fixed xTC off-by-one
//  2026-07-12 PL more or less finished (canvas version)
//  2026-07-11 PL new, cloned from b747_aft_view.js
// --------------------------------------------------------------

/* Place these lines in the calling routine, before this script:
     let canvas = { width: 400, height: 400 };  // shim, see below
     let svg    = document.getElementById("svg");
   Then after construction:
     b747.createSVG( svg );
*/

// -------------------------------------------------------------
let B747 = function()  {                     // constructor

   // default location and scale in canvas window
   this.setCenter( canvas.width/2, canvas.height/2);
   this.fScale = 1;

   // B747-100, old type, for Etkin 3d.ed.
   //   millimeters measured in 1:380 print of 3-view
   //     x = positive aft from nose
   //     z = vertical (up, becomes down in pixels)     INVERT LATER
   // Uses a scale of print millimeters to px for now.

   // fuselage stations - from nose
   let X0 =  0;      // nose point
   let X1 = 11;      // start of windscreen
   let X2 = 20;      // top of cockpit bulge
   let X3 = 40;      // start of cylindrical fuselage
   let X4 = 60;      // end of upper deck

   let R  = 11;      // cylindrical fuselage radius
   this.Xcg = 80;    // point of rotation for drawShape()

   // nose polynomial coefficients - they must be *very* exact
   let a0 =  1.414213562373095;
   let a1 =  0.330737254218789;
   let a2 = -0.011762287570313;
   let a3 =  0.000103842156777;

   // bulge polynomial coefficients
   let b1 = 0.8;
   let b2 = -0.0741;
   let b3 = 0.0022;

   // upper nose up to windscreen
   let N = 5;
   let x;           // coordinate from nose
   this.xB = [];
   this.yB = [];
   for ( let k=0; k<=N; k++ )  {
      x = (k/N)**2;      // finer nose distances, x^3 is not better
      x = X1*x;
      let yTop = a0*Math.sqrt( x ) + a1*x  + a2*x**2 + a3*x**3;
      this.yB.push( yTop );
      this.xB.push( x);
   }

   // X1 to X2 : cockpit bulge on top of nose shape
   N = 5;
   for ( let k=1; k<=N; k++ )  {
      let x1 = k/N * (X2-X1);
      x  = x1+X1;
      this.xB.push( x );
      let yTop = a0*Math.sqrt( x ) + a1*x  + a2*x**2 + a3*x**3;
      this.yB.push( yTop + b1*x1 + b2*x1**2 + b3*x1**3);
   }

   // X2 to X3 : cockpit fairing on top of basic fuselage shape
   let H2 = 2.8;                   // cockpit bulge height
   let S  = 1.5*H2/(X3-X2);        // S is non-dimensional end slope

   N = 5;
   for ( let k=0; k<=N; k++ )  {
      let x2 = k/N;
      x  = x2 + X2;
      let yTop = a0*Math.sqrt( x ) + a1*x  + a2*x**2 + a3*x**3;
      if ( x > X3 ) {
         yTop = R;
      }
      this.xB.push( x );
      this.yB.push( yTop + H2 - S*x2**2 + S*x2**3/3);
   }

   // straight fuselage back
   this.xB.push(  60  );
   this.yB.push(  R  );
   this.xB.push( 177.8);
   this.yB.push(  R  );

   // fuselage and tail cone (listed in reverse)
   let xTC = [ 177.8, 177.5, 177.0, 176.5, 175.5, 135.0, 122.0, 112.0, 100.0,  40.0 ];
   let yTC = [ 10.0,   7.0,    6.0,  5.5,    5.0,  -5.0,  -8.2, -9.5,  -10.0, -10.0 ];
   for ( let k=0; k<xTC.length; k++ )  {           // fixed: was k<=xTC.length
      this.xB.push( xTC[k] );
      this.yB.push( yTC[k] );
   }

   // lower nose (listed in reverse)
   N = 10;
   for ( let k=N; k>=0; k-- )  {
      x = (k/N)**2 * X3;      // finer nose distances, x^3 is not better
      this.xB.push( x);
      let yTop = a0*Math.sqrt( x ) + a1*x  + a2*x**2 + a3*x**3;
      this.yB.push( -yTop );
   }

   // cockpit windows start at X1
   this.xC = [ 11, 12.5,  17,  17,  13, 11 ];
   this.yC = [  7,  8.5,  8.5, 6.5,  7,  7 ];

   // cabin window strip
   this.xQ = [ 9, 136 ];
   this.yQ = [  1,  1 ];

   // flying surfaces
   //   generic NACA 0012 section
   N = 7;
   let xNaca = [];
   let yNaca = [];
   for ( let k=0; k<=N; k++ )  {
      let x = (k/N)**3;
      xNaca.push( x );
      yNaca.push( this.naca0012( x ));
   }

   // fin
   this.xF = [ 141 ];
   this.yF = [  R  ];
   for ( let k=0; k<xNaca.length; k++ )  {
      this.xF.push( 172    + 11*xNaca[k] );
      this.yF.push( R+27.5 + 11*yNaca[k] );
   }
   this.xF.push( 172.5 );
   this.yF.push(   R   );
   // rudder outline
   this.xR = [ 162.5, 179, 182 ];
   this.yR = [  R,  R+25, R+25 ];

   // stabilizer
   let yH0 = 6;
   let yH1 = 11;
   this.xH = [];
   this.yH = [];

   // reverse stab back along bottom
   for ( let k=xNaca.length-1; k>=0; k-- )  {
      this.xH.push( 152 + 22*xNaca[k] );
      this.yH.push( yH0 - 22*yNaca[k] );
   }
   // start up LE, k=1:2
   this.xH.push( 152 + 22*xNaca[1] );
   this.yH.push( yH0 + 22*yNaca[1] );
   this.xH.push( 152 + 22*xNaca[2] );
   this.yH.push( yH0 + 22*yNaca[2] );
   // start tip just aft of LE, k=2
   for ( let k=2;k<xNaca.length; k++ )  {
      this.xH.push( 172 + 8*xNaca[k] );
      this.yH.push( yH1 + 8*yNaca[k] );
   }

   // wing
   let fB = 15/12;   // thicker wing root, 15%
   this.xW = [];
   this.yW = [];
   // reverse back along bottom
   for ( let k=xNaca.length-1; k>=0; k-- )  {
      this.xW.push( 51 + 41*xNaca[k] );
      this.yW.push( -5 - 41*yNaca[k] * fB );
   }
   // root up LE to k=4
   for ( let k=1; k<5; k++ )  {
      this.xW.push( 51 + 41*xNaca[k] );
      this.yW.push( -5 + 41*yNaca[k] * fB );
   }
   // tip, start just past LE k=3
   for ( let k=3; k<xNaca.length; k++ )  {
      this.xW.push( 114 + 10*xNaca[k] );
      this.yW.push(  3  + 10*yNaca[k] );
   }

   // pylons
   //   generic shape
   let xP = [  3,  3,   4,   13,   25,  14,  3 ];
   let yP = [  0, 3.5,  4,  5.5,  4.3, 1.5,  0 ];
   //   individual pylons #1 and #2 engines
   this.xP1 = [];
   this.yP1 = [];
   this.xP2 = [];
   this.yP2 = [];
   for ( let k=0; k<xP.length; k++ )  {
      this.xP1.push(  82  + xP[k] );
      this.yP1.push( -5.5 + yP[k] );
      this.xP2.push(  60  + xP[k] );
      this.yP2.push( -7.5 + yP[k] );
   }

   // engines
   // generic shape (note vertical lines at x = 6 and 13.5 )
   let xE = [  0,  0,   0.3,  1.5, 3.5,  6,   6,
           6,  7.5, 10, 13.5, 13.5, 13.5, 16.5 ];
   let yE = [  0, 2.8, 3.25,  3.5, 3.5,  3.1,  0,
          2.1, 2.2, 2.1, 1.7,  0,   1.25,  0.1 ];
   N = xE.length;

   // mirror engine bottoms, back to front
   for ( let k=N-1; k>=0; k-- )  {
      xE.push(  xE[k] );
      yE.push( -yE[k] );
   }

   // individual engines #1 and #2
   this.xE1 = [];      // #1 outboard left engine
   this.yE1 = [];
   this.xE2 = [];      // #2 inboard  left engine
   this.yE2 = [];

   // tilt engines up by 3 degrees and position them
   let alpha = 3/60;   // engines up tilt
   for ( let k=0; k<xE.length; k++ )  {
      this.xE1.push(  82  + xE[k] + alpha*yE[k] );
      this.yE1.push( -5.5 + yE[k] - alpha*yE[k] );
      this.xE2.push(  60  + xE[k] + alpha*yE[k] );
      this.yE2.push( -7.5 + yE[k] - alpha*yE[k] );
   }

}; // end B747 constructor

// -------------------------------------------------------------
// unity naca0012 function, range x=0..1
B747.prototype.naca0012 = function ( x )  {
    let n0 =  0.20;
    let n1 = -0.15;
    let n2 = -0.05;
    return ( n0*Math.sqrt(x) + n1*x + n2*x**2 )
}

// -------------------------------------------------------------
B747.prototype.setCenter = function( x, y )  {
   this.xCenter = x;
   this.yCenter = y;
}

// -------------------------------------------------------------
B747.prototype.setScale = function( f )  {
   this.fScale = f;
}

// -------------------------------------------------------------
// build a "M x,y L x,y L x,y ... [Z]" path string from arrays
B747.prototype.pathD = function( X, Y, closed )  {
   let d = '';
   for ( let k=0; k<X.length; k++ )  {
      d += (k===0 ? 'M ' : 'L ') + X[k].toFixed(3) + ',' + Y[k].toFixed(3) + ' ';
   }
   if ( closed ) d += 'Z';
   return d;
}

// -------------------------------------------------------------
// create all the <path> elements once, in raw (unscaled,
// uncentered) geometry coordinates. Positioning, scaling and
// rotation all happen later via a single group transform in
// updatePose() — never touch these <path> "d" strings again.
B747.prototype.createSVG = function( svgRoot )  {

   let bodyFill    = 'white';
   let bodyOutline = 'black';
   let wingFill    = '#F0F0F0';  // silver is too dark
   let wingOutline = 'black';

   // [ X, Y, fill, stroke, lineWidth, closed, scaleStroke ]
   //   scaleStroke=true  -> stroke width scales with aircraft (fScale)
   //   scaleStroke=false -> stroke stays constant screen-pixel width
   //                        (matches canvas ctx.lineWidth behaviour)
   const shapes = [
      [ this.xB,  this.yB,  bodyFill,  bodyOutline, 0.5, true,  false ], // fuselage
      [ this.xC,  this.yC,  'white',   'black',     0.5, true,  false ], // cockpit windows
      [ this.xQ,  this.yQ,  '',        '#B0B0FF',   2,   false, true  ], // cabin window strip
      [ this.xF,  this.yF,  '#F5F5F5', wingOutline, 0.5, true,  false ], // fin
      [ this.xR,  this.yR,  '',        'black',     0.3, false, false ], // rudder outline
      [ this.xH,  this.yH,  wingFill,  wingOutline, 0.5, true,  false ], // stabilizer
      [ this.xW,  this.yW,  wingFill,  wingOutline, 0.5, true,  false ], // wing
      [ this.xP1, this.yP1, wingFill,  wingOutline, 0.5, true,  false ], // pylon 1
      [ this.xP2, this.yP2, wingFill,  wingOutline, 0.5, true,  false ], // pylon 2
      [ this.xE2, this.yE2, wingFill,  wingOutline, 0.5, true,  false ], // engine 2 (drawn first)
      [ this.xE1, this.yE1, wingFill,  wingOutline, 0.5, true,  false ], // engine 1 (drawn on top)
   ];

   // build the whole group as one markup string and let the SVG
   // parser figure out the element namespaces itself — inserting
   // markup into an <svg> node parses its children as SVG content
   // automatically, so no explicit namespace URI is needed anywhere.
   let html = '<g>';
   for ( const [X, Y, fill, stroke, lw, closed, scaleStroke] of shapes )  {
      html += '<path d="'            + this.pathD( X, Y, closed )      + '"'
            + ' fill="'              + ( fill   === '' ? 'none' : fill )   + '"'
            + ' stroke="'            + ( stroke === '' ? 'none' : stroke ) + '"'
            + ' stroke-width="'      + lw + '"'
            + ' stroke-linejoin="round"'
            + ( scaleStroke ? '' : ' vector-effect="non-scaling-stroke"' )
            + '/>';
   }
   html += '</g>';

   svgRoot.insertAdjacentHTML( 'beforeend', html );
   this.group = svgRoot.lastElementChild;
   this.paths = Array.from( this.group.children );
}

// -------------------------------------------------------------
// replaces setPose() + the per-point trig in the old drawShape():
// one affine matrix on the group, derived directly from
//   pixelX = xCenter + cosT*fScale*(X-Xcg) + sinT*fScale*Y
//   pixelY = yCenter + sinT*fScale*(X-Xcg) - cosT*fScale*Y
B747.prototype.updatePose = function( xCenter, yCenter, theta, fScale )  {

   this.fScale = fScale;
   const cosT = Math.cos( theta );
   const sinT = Math.sin( theta );
   const Xcg  = this.Xcg;

   const a =  fScale * cosT;
   const b =  fScale * sinT;
   const c =  fScale * sinT;
   const d = -fScale * cosT;
   const e = xCenter - fScale * cosT * Xcg;
   const f = yCenter - fScale * sinT * Xcg;

   this.group.setAttribute( 'transform',
      `matrix(${a.toFixed(6)},${b.toFixed(6)},${c.toFixed(6)},${d.toFixed(6)},${e.toFixed(6)},${f.toFixed(6)})` );
}

// -------------------------------------------------------------
// note : This function cannot be called "fill"
// kept for API compatibility with the canvas version's draw(x,y,theta)
B747.prototype.draw = function( x=0, y=0, theta=0 )  {
   this.updatePose( this.xCenter + x, this.yCenter + y, theta, this.fScale );
}
