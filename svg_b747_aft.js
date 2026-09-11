// --------------------------------------------------------------
// file    : svg_b747_aft.js
// purpose : Graphical B747, aft view for Dutch roll animation
// --------------------------------------------------------------
//  2026-09-11 PL converted from canvas to SVG
//  2026-07-03 PL    TODO add arrows for lift and side force
//  2026-06-22 PL new, cloned from lever.js
// --------------------------------------------------------------

// -------------------------------------------------------------
let B747 = function()  {                     // constructor
   this.niceViewBox();
   
   this.title = 'B747';  // default title
   this.id    = 'b747';  // default id
   
   // B747-100, old type, for Etkin 3d.ed.
   //    X = positive aft from CG at main gear         *inverted here*
   //    Y = spanwise (right)
   //    Z = vertical (up, becomes down in pixels)     *inverted here*
   // B747-100 span is 59.6 m.
   // Here it is 2*120 = 240, a scale of circa 4 larger.
   
   // right wing from root, start along the top spar
   this.xW  = [ 0,    0,    0,    0,     0,   0,     0 ];
   // TODO    Make the wing root change over a bit nicer around psi = 0 ///
   this.yW  = [  13,  50,  118,  120,  118,   50,    7 ];
   this.yWL = [ -13, -50, -118, -120, -118,  -50,   -7 ];
   this.zW  = [  -2,   0,   8,    7,     6,   -5,  -12 ];

   // V stabilizer ("spar"), bottom right first
   this.xS = [ 120, 120, 120, 120, 120, 120, 120 ];
   this.yS = [   0,  45,   45,  0, -45, -45,   0 ];
   this.zS = [   4,  15,   16,  9,  16,  15,   4 ];

   // fin
   // base TE -> base LE (spar, tip LE (spar) -> tip TE
   // separate left and right surface
/*   this.xF  = [ 140,  90,  140,  155  ];   // LE a bit more forward
   this.yFR = [  0,  3.2,   1,    0   ];
   this.yFL = [  0, -3.2,  -1,    0   ];
   this.zF  = [  5,  11,   56,   56  ];
*/   
   // TODO   MAKE THE TRAILING EDGE THINNER AROUND PSI=0,
   // MAYBE SUPPRESS THE SIDE PANELS IF PSI<(something),
   // LEAVING JUST THE SPAR.
   this.xF  = [ 140,  90,  140,  155, 140  ];   // LE a bit more forward
   this.yFR = [  0,  3.2,   1,    0,   0   ];
   this.yFL = [  0, -3.2,  -1,    0,   0   ];
   this.zF  = [  5,  11,   56,   56,   5  ];
   
   // fuselage crutch 
   //   (along the top from nose to tail, then back along the bottom )
   //   the awkward spot is hidden by the fin
   this.xC = [ -75,  40, 150,     150,  70,   40,  -75 ];
   this.yC = [  0,    0,   0,       0,   0,    0,    0  ];
   this.zC = [ 20,   13,  11,      1, -11,  -13,  -13  ];
   
}; // end B747 constructor

// -------------------------------------------------------------
// Set a decent svg viewBox (maybe shift and zoom later)
B747.prototype.niceViewBox = function()  {
   // Size and scale the viewBox.
   // Use this in a calling *.js with access to svg, if desired.   
   // Place the zero at center for now.
   // Unfortunately Y is positive down in SVG. 
   // This will be handled here in code, not via SVG transforms.
//   let h  =  300;
   let h  =  200;
   let y0 = -h/2;
//   let w  = 500;
   let w  = 300;
   let x0 = -w/2;
   this.viewBox =  x0.toFixed(3) + ' ' + y0.toFixed(3) + ' ' +
                    w.toFixed(3) + ' ' +  h.toFixed(3);
   // Use this viewBox outside, in a calling *.js, via :
   //   (svg).set Attribute( "viewBox", vB);
   //       /* (top left) x  y width height */
}

// -------------------------------------------------------------
// Set a non-default title
B747.prototype.setTitle = function( title )  {
   this.title = title;
}

// -------------------------------------------------------------
// Set an optional id
B747.prototype.setTitle = function( id )  {
   this.id = id;
}

//   TODO THIS IS GOING TO REPLACE DRAW() AND DRAWSHAPE()
// -------------------------------------------------------------
   // This function sets an SVG string in the HTML.
   // It uses several routines from svg_tools.js
B747.prototype.update = function( xPos=0, yPos=0,
                                   phi=0,  psi=0 )  {

   this.xPos = xPos;
   this.yPos = yPos; 

   // preliminary calculations
   this.cosPhi = Math.cos( phi);
   this.cosPsi = Math.cos( psi);
   this.sinPhi = Math.sin( phi);
   this.sinPsi = Math.sin( psi);
   this.sinsin = this.sinPhi * this.sinPsi;
   this.coscos = this.cosPhi * this.cosPsi;
 
   // declare 2D screen coordinates
   let x = [];
   let y = [];
   
   // Fill the svg string with path data,
   //    translated and rotated as appropriate.
   
   // Note xy-data are flipped in the vertical (y)
   //  by svg_tools | data_xy,
   // Circle's are flipped here "by hand".
   
   // clear local string, start string off with title *comment*
   svgString  = svg_title( this.title );     // svg comment
   
   if ( this.id !== undefined ) {
   svgString    += '<g';
      svgString += ' id="' + this.id + '" > \n\n';
   }

   // START THE AIRPLANE
      // four turbojet engines
   let rFan   = 11/2;
   let rCore  =  2.75;
   let rPylon =  3/2;      // pylon "diameter"

   svgString += '   <!-- start <g> for jet engines --> \n'; 
   
      // nacelles are bit darker and have thinner outlines
      // than the later flying surfaces.
      
   svgString += '<g  fill="#E0E0E0"' +
                   ' stroke-width="0.2" stroke="black" > \n';

      // engine #1 (left outboard)
      // pylon
   [ x, y ] = this.rotate( [-15], [-85], [-0.5] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +  rPylon.toFixed(3) + '" />\n';
      // fan
   [ x, y ] = this.rotate( [0], [-85], [-7] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +    rFan.toFixed(3) + '" />\n';
      // core exhaust
   [ x, y ] = this.rotate( [25], [-85], [-7] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" '  +  rCore.toFixed(3) + '"' +
                       ' fill="darkgray" /> \n';   

      // engine #2 (left inboard)
      // pylon
   [ x, y ] = this.rotate( [-15], [-50], [-5.5] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +  rPylon.toFixed(3) + '" /> \n';
      // fan
   [ x, y ] = this.rotate( [0], [-50], [-12] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +    rFan.toFixed(3) + '" /> \n';
      // core
   [ x, y ] = this.rotate( [25], [-50], [-12] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +   rCore.toFixed(3) + '"' +
                       ' fill="darkgray" /> \n';
                       
      // engine #3 (right inboard)
      // pylon
   [ x, y ] = this.rotate( [-15], [50], [-5] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +  rPylon.toFixed(3) + '" /> \n';
      // fan
   [ x, y ] = this.rotate( [0], [50], [-12] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +    rFan.toFixed(3) + '" /> \n';
      // core
   [ x, y ] = this.rotate( [25], [50], [-12] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +   rCore.toFixed(3)    + '"' +
                       ' fill="darkgray" /> \n';   

      // engine #4 (right outboard)
      // pylon
   [ x, y ] = this.rotate( [-15], [85], [0] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +  rPylon.toFixed(3) + '" /> \n';   
      // fan
   [ x, y ] = this.rotate( [0], [85], [-7] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +    rFan.toFixed(3) + '" /> \n';
      // core
   [ x, y ] = this.rotate( [25], [85], [-7] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '"' +
                       ' r=" ' +   rCore.toFixed(3) + '"' +
                       ' fill="darkgray" /> \n'; 
   svgString += '</g>';
   svgString += '   <!-- end <g> for jet engines --> \n\n';

   // first (leading, partly hidden) wing
   svgString += '     <!-- start <g> for leading wing colors --> \n';
   svgString += '<g  fill="#F0F0F0"' +
                   ' stroke-width="0.4" stroke="black" > \n';
      // forward yawed (leading) wing
   if ( psi >= 0 )  {
         [ x, y ] = this.rotate( this.xW, this.yW, this.zW);
   } else  {
         [ x, y ] = this.rotate( this.xW, this.yWL, this.zW);
   }
   svgString += '<path d = ' + svg_data_xy( x, y ) + ' />\n';
   svgString += '</g>';
   svgString += '   <!-- end <g> for leading wing colors --> \n\n';

   // FUSELAGE
      // fuselage color
   svgString += '     <!-- start <g> for fuselage color --> \n';
   svgString += '<g fill="darkblue" stroke="none"> ';

      // cockpit bulkhead, X = -75 negative (i.e. ahead of CG)
      // cabin
   [ x, y ] = this.rotate( [-75], [0], [0]);  // needs to be an array
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '" r="13" /> \n';
      // cockpit
   [ x, y ] = this.rotate( [-75], [0], [11]);  // coordinates must be arrays
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '" r="9" /> \n';

      // aft bulkhead
      // (best distance aft of CG depends on psi max)
   [ x, y ] = this.rotate( [40], [0], [0]);  // needs to be an array
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '" r="13" /> \n';
     
   svgString += '   <!-- draw central crutch --> \n';
   [ x, y ] = this.rotate( this.xC, this.yC, this.zC);
   svgString += '<path d = ' + svg_data_xy( x, y ) + '/>\n';
   //  best distance aft of CG depends on psi max

   // close the <g> for the fuselage fill-only color,
   // back to light silver flying surfaces.
   svgString += '</g>';
   svgString += '     <!-- end <g> for fuselage color --> \n\n';

   // START FLYING SURFACES
   
   svgString += '   <!-- start <g> for flying surfaces --> \n'
   svgString += '<g  fill="#F0F0F0"' +
                   ' stroke-width="0.4" stroke="black" > \n';

   // second, aft-yawed (trailing) wing
   svgString += '   <!-- draw leading wing --> \n';
   if ( psi >= 0 )  {
         [ x, y ] = this.rotate( this.xW, this.yWL, this.zW);
   } else  {
         [ x, y ] = this.rotate( this.xW, this.yW,  this.zW);
   }
   svgString += '<path d = ' + svg_data_xy( x, y ) + ' />\n';

      // stabilizer
   [ x, y ] = this.rotate( this.xS, this.yS, this.zS);
   svgString += '<path d = ' + svg_data_xy( x, y ) + '/> \n';

      // fin
   svgString += '   <!-- draw fin --> \n';

   // fin - avoid double TE
   // TODO  Use only front spar if abs(psi)<0.05 or so,
   //       to avoid visible TE line in pure rear view
   if ( psi >= 0 )  {
      [ x, y ] = this.rotate( this.xF, this.yFR, this.zF);
      svgString += '<path d = ' + svg_data_xy( x, y ) + 
            'fill="#F0F0F0" stroke="black"' + '/>\n';
      [ x, y ] = this.rotate( this.xF, this.yFL, this.zF);
      svgString += '<path d = ' + svg_data_xy( x, y ) + 
            'fill="#F0F0F0" stroke="black"' + '/>\n';
   } else  {
      [ x, y ] = this.rotate( this.xF, this.yFL, this.zF);
      svgString += '<path d = ' + svg_data_xy( x, y ) + 
            'fill="#F0F0F0" stroke="black"' + '/>\n';
      [ x, y ] = this.rotate( this.xF, this.yFR, this.zF);
      svgString += '<path d = ' + svg_data_xy( x, y ) + 
            'fill="#F0F0F0" stroke="black"' + '/>\n';
   }                  

      // tail point light (transom)
   [ x, y ] = this.rotate( [120], [0], [6] );
   svgString += '<circle cx = "' +  x[0].toFixed(3) + '"' +
                       ' cy = "' + -y[0].toFixed(3) + '" r="2.25"' +
                       ' fill="white"' +
                       'stroke="black" stroke-width="0.2" /> \n';   

   svgString += '</g>';
   svgString += '   <!-- end <g> for flying surfaces \n\n';
   
   if ( this.id !== undefined ) {
      svgString += '</g>';
      svgString += '   <!-- end <g> for id --> \n';
   }

   this.svgString = svgString;
   console.log( this.svgString);
}

// -------------------------------------------------------------
// Rotate an array of XYZ data by phi and psi
// ( note debatable order of rotation )
B747.prototype.rotate = function( X, Y, Z )  {
   let N = X.length;
   // note : inputs need to be arrays, like [ 0 ],
   //        even if they are single numbers.
   // TODO :   Fix this later.
   // note : For later use by svg_tools.js | svg_data_xy(),
   //        this does *not* yet invert y for the screen.
   //        Do your own inversion in  circle etc.
   let x = [];
   let y = [];
   for ( let k=0; k < N; k++ )  {
      x.push(   X[k] * this.sinPsi * this.cosPhi
              + Y[k] * this.coscos
              + Z[k] * this.sinPhi );
      y.push(  -X[k] * this.sinsin
              - Y[k] * this.cosPsi * this.sinPhi
              + Z[k] * this.cosPhi );
   }
   return [ x, y];
}

   
/*
// -------------------------------------------------------------
// note : This function cannot be called "fill"
B747.prototype.draw = function( x=0, y=0, phi=0, psi=0, scale=1 )  {

   // clear the canvas for a fresh drawing :
   ctx.beginPath();       // needed for clearRect()
   ctx.clearRect( 0, 0, canvas.width, canvas.height);
   canvas.style.backgroundColor = '#FBFBFF';  // sky

   // initial calculations 
   this.setPose( x, y, phi, psi, scale);

   // wing
   // forward yawed (leading) wing
   let wingColor   = '#F0F0F0';  // silver is too dark
   let wingOutline = 'black';
   if ( psi >= 0 )
      this.drawShape( this.xW, this.yW, this.zW,
                      wingColor, wingOutline, 0.5 );  // right wing
   else  {
      this.drawShape( this.xW, this.yWL,  this.zW,
                      wingColor, wingOutline, 0.5 );  // left wing
   }

   let bodyColor = '#0000A0';                         // dark blue

   // cockpit bulkhead
   // X = -75 negative, ahead of CG
   this.drawPoint( -75, 0,  0, 26, bodyColor );       // cabin
   this.drawPoint( -75, 0, 11, 18, bodyColor );       // cockpit

   // aft bulkhead
   //   (best distance aft of CG depends on psi max)
   this.drawPoint( 40, 0, 0, 26, bodyColor );

   // fuselage crutch ("side view")
   this.drawShape( this.xC, this.yC, this.zC,
                     bodyColor, '', 0.5 );
                   
   // aft yawed (trailing) wing
   if ( psi >= 0 )  {
      this.drawShape( this.xW, this.yWL, this.zW,
                      wingColor, wingOutline, 0.5 );  // right wing
   } else {
      this.drawShape( this.xW, this.yW, this.zW,
                      wingColor, wingOutline, 0.5 );  // right wing
   }

   // stabilizer
   this.drawShape( this.xS, this.yS, this.zS,
                     wingColor, wingOutline, 0.5 );
                   
   // fin - avoid double TE
   // TODO  Use only front spar if abs(psi)<0.05 or so,
   //       to avoid visible TE line in pure rear view
   if ( psi >= 0 )  {
      this.drawShape( this.xF, this.yFR, this.zF,
                     'wingColor', wingOutline, 0.5 );
      this.drawShape( this.xF, this.yFL, this.zF,
                     'wingColor', wingOutline, 0.5 );
   } else  {
      this.drawShape( this.xF, this.yFL, this.zF,
                     'wingColor', wingOutline, 0.5 );
      this.drawShape( this.xF, this.yFR, this.zF,
                     'wingColor', wingOutline, 0.5 );
   }
                   
   // tail point light (transom)
   this.drawPoint( 120, 0, 6, 4.5, 'white' );

   // four turbojet engines
   let dFan   = 11;
   let dCore  =  5;
   let dPylon =  3;      // pylon "diameter"


   bodyColor = 'darkgray'; // for engines

   
   // engine #1 (left outboard)
   this.drawPoint(  0,  -85, -7, dFan,    bodyColor );     // fan
   this.drawPoint( -15, -85, 0,  dPylon,  bodyColor );     // pylon
   this.drawPoint(  25, -85, -7, dCore+2, bodyColor );     // aft fan
   this.drawPoint(  25, -85, -7, dCore,   wingColor );     // core

   // engine #2 (left inboard)
   this.drawPoint(  0,  -50, -12, dFan,    bodyColor );     // fan
   this.drawPoint( -15, -50,  -5, dPylon,  bodyColor );     // pylon
   this.drawPoint(  25, -50, -12, dCore+2, bodyColor );     // aft fan
   this.drawPoint(  25, -50, -12, dCore,   wingColor );     // core

   // engine #3 (right inboard)
   this.drawPoint(  0,  50, -12, dFan,    bodyColor );      // fan
   this.drawPoint( -15, 50,  -5, dPylon,  bodyColor );      // pylon
   this.drawPoint(  25, 50, -12, dCore+2, bodyColor );      // aft fan
   this.drawPoint(  25, 50, -12, dCore,   wingColor );      // core

   // engine #4 (right outboard)
   this.drawPoint(  0,  85, -7, dFan,     bodyColor );      // fan
   this.drawPoint( -15, 85, 0,  dPylon,   bodyColor );      // pylon
   this.drawPoint(  25, 85, -7, dCore+2,  bodyColor );      // aft fan
   this.drawPoint(  25, 85, -7, dCore,    wingColor );      // core
};

// -------------------------------------------------------------
B747.prototype.setPose = function( x, y, phi=0, psi=0, scale=1 )  {
   
   / * screen coordinates of XY axes zero ( y is down ) * /
   this.x = x;
   this.y = y;
   
   this.scale = scale;
   
   this.cosPhi = Math.cos( phi);
   this.cosPsi = Math.cos( psi);
   this.sinPhi = Math.sin( phi);
   this.sinPsi = Math.sin( psi);
   this.sinsin = this.sinPhi * this.sinPsi;
   this.coscos = this.cosPhi * this.cosPsi;
}

// -------------------------------------------------------------
B747.prototype.drawPoint = function( X, Y, Z, D, color='black' )  {
   
   let lineCapSave   = ctx.lineCap;
   let lineWidthSave = ctx.lineWidth;
   ctx.lineCap       = 'round';
   ctx.lineWidth     = this.scale*D;      // two half end caps is a circle
   ctx.strokeStyle   = color;
   
	let Y_ =  X * this.sinPsi * this.cosPhi +
             Y * this.coscos +
             Z * this.sinPhi;
	let Z_ = -X * this.sinsin +
            -Y * this.cosPsi * this.sinPhi +
             Z * this.cosPhi;
             
   ctx.beginPath();     // after this, no need for moveTo()
   ctx.lineTo(  this.x + this.scale * Y_,
                this.y - this.scale * Z_ );
   // do *not* use closePath ! or use multiple lineTo's.
   ctx.stroke();
   
   ctx.lineCap   = lineCapSave;
   ctx.lineWidth = lineWidthSave;
}

// -------------------------------------------------------------
B747.prototype.drawShape = function( X, Y, Z,
                  fillStyle   = '',
                  strokeStyle = 'black',
                  lineWidth   = 1 )  {
   let N = X.length;
   if ( ( Y.length !== N ) ||  ( Z.length !== N ) ) {
      console.log( 'array size error in drawShape()' );
      return;
   }
   ctx.beginPath();     // after this, no need for moveTo()
   for ( let k=0; k < N; k++ )  {
      let Y_ =  X[k] * this.sinPsi * this.cosPhi +
                Y[k] * this.coscos +
                Z[k] * this.sinPhi;
      let Z_ = -X[k] * this.sinsin +
               -Y[k] * this.cosPsi * this.sinPhi +
                Z[k] * this.cosPhi;
                
      // note : the -Z pixels sign is added here:
      ctx.lineTo( this.x + this.scale * Y_,
                  this.y - this.scale * Z_ );
   }
   ctx.closePath();
   
   if ( fillStyle !== '' )  {
      ctx.fillStyle = fillStyle;
      ctx.fill();
   }
   if ( strokeStyle !== '' )  {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth   = lineWidth;
      ctx.stroke();
   }
}

// -------------------------------------------------------------
// TEST BLOCK CODE
/ *
// temporary block (left, front, right, top )
xBL_ = [  0, -200, -200,  0  ];
yBL_ = [  0, sinPsi*200,  sinPsi*200,   0  ];
zBL  = [  0,   0,   100, 100 ];
ctx.fillStyle = 'red';
fillShape( yBL_, zBL, x, y, phi);

xBR = [  0, -200, -200,  0  ];
yBR = [  50,  50,  50,  50  ];
yBR_ = [  50,  50+psi*200,  50+psi*200,  50  ];
zBR = [  0,   0,   100, 100 ];
ctx.fillStyle = 'green';
fillShape( yBR_, zBR, x, y, phi);

xBF = [  0,   0,    0,    0  ];
yBF = [  0,   0,   50,  50 ];
zBF = [  0,  100,  100,   0  ];
ctx.fillStyle = 'black';
//fillShape( yBF, zBF, x, y, phi);
ctx.strokeStyle = 'black';
drawShape( yBF, zBF, x, y, phi);

xBL = [  0, -200, -200,  0  ];
yBL = [  0,   0,    0,   0  ];
this.fillShape( xBL, yBL, zBL );
this.fillShape( xBR, yBR, zBR );
this.fillShape( xBF, yBF, zBF );

*/
