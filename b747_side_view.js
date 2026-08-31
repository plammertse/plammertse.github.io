// --------------------------------------------------------------
// file    : b747_side_view.js
// purpose : Graphical B747, side view for short period animation
//           SVG version — same geometry as the canvas original,
//           rendered as <path> elements with a single group
//           transform instead of per-point trig every frame.
// --------------------------------------------------------------
//  2026-08-27 PL more development around viewBox etc.
//  2026-08-22 PL simplified the SVG string building,
//                dropped _SVG from filename
//  2026-07-26 PL converted to SVG rendering; fixed xTC off-by-one
//  2026-07-12 PL more or less finished (canvas version)
//  2026-07-11 PL new, cloned from b747_aft_view.js
// --------------------------------------------------------------


// -------------------------------------------------------------
let B747 = function()  {                     // constructor
   this.setViewBox();

   // define the colors
   let bodyFill   = ' fill   = "white" '
   let bodyStroke = ' stroke = "black" ';
   let wingFill   = ' fill   = "#F0F0F0"';  // silver is too dark
   let wingStroke = ' stroke = "black"';
   this.fB = '"white"';     // note quote in quote
   this.sB = '"black"';
   this.fW = '"#F0F0F0"';  // silver is too dark
   this.sW = '"black"';

   // B747-100, old type, for Etkin 3d.ed., p.371
   //   millimeters measured in 1:380 print of 3-view
   //     x = positive aft from nose
   //     z = vertical (up, becomes down in pixels)     INVERT LATER
   // Uses a scale of print millimeters to px for now.
   // Scaled 182 mm equals 70.66 m full size (231'10"),
   // so L(m) = 0.388 * L(mm)
   // See memo PL-26-072

   // The this.* construct does not work here ???
// TODO : TRY AGAIN NOW THAT CONSTRUCTOR DOES NOT KNOW ABOUT svg ANYMORE   
   // Put these constants in scale() function to avoid global constants.
   //   this.Xcg   = 80;      // in scanned mm units
   //   this.Scale = 0.388;   // scale from scanned mm to full size m
   // Put these constants in scale() function to avoid global constants :
   //   Xcg   = 80;      // in scanned mm units
   //   Scale = 0.388;   // scale from scanned mm to full size m

   // fuselage stations - from nose
   let X0 =  0;      // nose point
   let X1 = 11;      // start of windscreen
   let X2 = 20;      // top of cockpit bulge
   let X3 = 40;      // start of cylindrical fuselage
   let X4 = 60;      // end of upper deck
   let R  = 11;      // cylindrical fuselage radius
   
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
   let N = 10;
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
   N = 20;
   for ( let k=N; k>=0; k-- )  {
      x = (k/N)**2 * X3;      // finer nose distances, x^3 is not better
      this.xB.push( x);
      let yTop = a0*Math.sqrt( x ) + a1*x  + a2*x**2 + a3*x**3;
      this.yB.push( -yTop );
   }
   [ this.xB, this.yB] = this.scale( this.xB, this.yB);  
   
   // THIS FINISHES xB, yB.

   // cockpit windows start at X1
   this.xC = [ 11, 12.5,  17,  17,  13, 11 ];
   this.yC = [  7,  8.5,  8.5, 6.5,  7,  7 ];
   [ this.xC, this.yC] = this.scale( this.xC, this.yC);  

   // cabin window strip
   this.xQ = [ 9, 9, 136, 136 ];
   this.yQ = [ 0, 2,  2,   0  ];
   [ this.xQ, this.yQ] = this.scale( this.xQ, this.yQ);  
   this.xQQ = [ 9, 136 ];
   this.yQQ = [ 1,  1  ];
   [ this.xQQ, this.yQQ] = this.scale( this.xQQ, this.yQQ);  

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
   [ this.xF, this.yF] = this.scale( this.xF, this.yF);  

   // rudder outline
   this.xR = [ 162.5, 179, 182, 172.5 ];
   this.yR = [  R,  R+25, R+25,   R ];
   [ this.xR, this.yR] = this.scale( this.xR, this.yR);  

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
   this.xH.push( this.xH[0] );
   this.yH.push( this.yH[0] );
   [ this.xH, this.yH] = this.scale( this.xH, this.yH);  

   // wing
   let fB = 15/12;   // thicker wing root, 15%
   this.xW = [];
   this.yW = [];
   // reverse back along bottom
   for ( let k=xNaca.length-1; k>=0; k-- )  {
      this.xW.push( 51 + 41*xNaca[k] );
      this.yW.push( -5 - 41*yNaca[k] * fB );
   }
   // root, up LE to k=4
   for ( let k=1; k<5; k++ )  {
      this.xW.push( 51 + 41*xNaca[k] );
      this.yW.push( -5 + 41*yNaca[k] * fB );
   }
   // tip, start just past LE k=3
   for ( let k=3; k<xNaca.length; k++ )  {
      this.xW.push( 114 + 10*xNaca[k] );
      this.yW.push(  3  + 10*yNaca[k] );
   }
      
      // close contour
   this.xW.push( this.xW[0]);
   this.yW.push( this.yW[0]);

      // scale to metres
   [ this.xW, this.yW] = this.scale( this.xW, this.yW);  

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
   [ this.xP1, this.yP1] = this.scale( this.xP1, this.yP1);  
   [ this.xP2, this.yP2] = this.scale( this.xP2, this.yP2);  

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
   [ this.xE1, this.yE1] = this.scale( this.xE1, this.yE1);
   [ this.xE2, this.yE2] = this.scale( this.xE2, this.yE2);  

   let xBcn =  30;
   let yBcn =  R+1.2;
//   let r    =    0.6;
   let r    =    0.45;
//   this.xBeacon = [ xBcn-r, xBcn-0.7*r, xBcn,   xBcn+0.7*r, xBcn+r ];
   this.xBeacon = [ xBcn-2*r, xBcn-1.4*r, xBcn,   xBcn+1.4*r, xBcn+2*r ];
   this.yBeacon = [ yBcn,   yBcn+0.7*r, yBcn+r, yBcn+0.7*r, yBcn   ];
   [ this.xBeacon, this.yBeacon] = this.scale( this.xBeacon, this.yBeacon);
   
   this.xCGmarker = [ -1, +1, +1, -1, -1 ];    // CG square in m, not mm
   this.yCGmarker = [ -1, -1, +1, +1, +1 ];    // no need to scale this

}; // end B747 constructor

// -------------------------------------------------------------
// Set a decent xvg viewBox (maybe shift and zoom later)
B747.prototype.setViewBox = function()  {
   // Size and scale the viewBox.
   // Place the zero at center for now.
   // Unfortunately Y is positive down in SVG. 
   // This will be handled here in code, not via SVG transforms.
   let h  =  50;
   let y0 = -h/2;
   let w  = 100;
   let x0 = -w/2;
   this.viewBox =  x0.toFixed(3) + ' ' + y0.toFixed(3) + ' ' +
                    w.toFixed(3) + ' ' +  h.toFixed(3);
   // Use this viewBox outside, in a calling *.js, via :
   //   svgRoot.setAttribute( "viewBox", vB);
   //       /* (top left) x  y width height */
}

// -------------------------------------------------------------
// Scale b747 graph paper [mm] coordinates to meters
B747.prototype.scale = function( X, Y )  {
   let N = X.length;
   if ( Y.length !== N ) {
      console.log( 'array size error in b747...scale()' );
      return;
   }
   const Xcg   =  80;     // in graph paper mm units
   const Scale = 0.388;   // scale from scanned mm to full size m
   
   let x = [];
   let y = [];
   for ( let k=0; k<N; k++ )  {
      x[k] =  Scale * ( X[k] - Xcg );
      y[k] =  Scale *   Y[k];
   }
   return [ x, y ];
}

// -------------------------------------------------------------
B747.prototype.update = function( xPos, yPos, theta=0 )  {

   // This function sets an SVG string in the HTML :
   let svgString  = ' ';             // keep this one local
   // It uses svg_d() from svg_d(ata_string.js
   
   // Calculate cos and sin outside move for efficiency
   cosTheta = Math.cos( theta);
   sinTheta = Math.sin( theta);
   
   // Fill the svg string with path data,
   //    translated and rotated as appropriate.
   
   // FUSELAGE
      // fuselage body
   let [ x, y ] = move_xy( this.xB, this.yB,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y );
   svgString += '    fill='   + this.fB + 
                 ' stroke='   + this.sB + ' />\n';
                 
      // *cockpit* windows               
   [ x, y ] = move_xy( this.xC, this.yC,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y );
   svgString += '    fill='   + this.fB + 
                 ' stroke='   + this.sB + ' />\n';
                 
      // *cabin* window strip
/*
   [ x, y ] = move_xy( this.xQ, this.yQ,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y );
   svgString += '    fill='   + '"#B0B0FF"' + 
                 ' stroke='   + '"#B0B0FF"' + ' />\n';
*/
      // actual cabin windows ( dotted line )
   [ x, y ] = move_xy( this.xQQ, this.yQQ,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y );
   svgString += ' stroke="darkgray" stroke-width="3" ' +
                ' stroke-dasharray="2.3,2.3" />\n';
                 
      // flashing beacon light
      // ( real beacon flashes 40 to 100 times/sec )
   [ x, y ] = move_xy( this.xBeacon, this.yBeacon,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y );
   
   let fBeacon = '"white"';   //  light off
   let sBeacon = '"white"';   //  light off
   const PERIOD = 1000;       // flash beacon every 1000 ms
   const ON     =  500;       // dury cycle "on" time
   if( ( performance.now() % PERIOD ) < ON ) {
      fBeacon = '"red"';      //  light on
      sBeacon = '"red"'; }    //  light on
   svgString += '    fill='   + fBeacon + 
                 ' stroke='   + sBeacon + ' />\n';
                 
   // FLYING SURFACES, ENGINES
      // centralize the aluminium color
      //  for shorter code and string.
      // this needs a </g> at the end of the flying surfaces
   svgString += '<g fill='   + this.fW + 
                ' stroke='   + this.sW + '>\n';
                 
      // fin               
   [ x, y ] = move_xy( this.xF, this.yF,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y ) + ' />\n';

      // rudder               
   [ x, y ] = move_xy( this.xR, this.yR,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y ) + ' />\n';   // TODO  thinner linewidth on rudder outline

      // horizontal stabilizer               
   [ x, y ] = move_xy( this.xH, this.yH,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y ) + ' />\n';

      // wing
   [ x, y ] = move_xy( this.xW, this.yW,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y ) + ' />\n';
 
      // pylon 1
   [ x, y ] = move_xy( this.xP1, this.yP1,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y );
 
      // pylon 2
   [ x, y ] = move_xy( this.xP2, this.yP2,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y ) + ' />\n';
 
      // engine 2 (drawn first)
   [ x, y ] = move_xy( this.xE2, this.yE2,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y ) + ' />\n';
 
      // engine 1 (on top)
   [ x, y ] = move_xy( this.xE1, this.yE1,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = "' + svg_d( x, y ) + ' />\n';

   // close the <g> coloring the flying surfaces
   svgString += '</g>\n';
 
   this.svgString = svgString;
}

// -------------------------------------------------------------
// normalized naca0012 function, chord is x==0..1
// TODO : replace this by the actual NACA formula
B747.prototype.naca0012 = function ( x )  {
    let n0 =  0.20;
    let n1 = -0.15;
    let n2 = -0.05;
    return ( n0*Math.sqrt(x) + n1*x + n2*x**2 )
}
