// --------------------------------------------------------------
// file    : b747_aft_view.js
// purpose : Graphical B747, aft view for Dutch roll animation
// --------------------------------------------------------------
//  2026-07-03 PL TODO add lift, side force arrows
//  2026-06-22 PL new, cloned from lever.js
// --------------------------------------------------------------

/* Place these lines in the calling routine :
     ( just after HTML created the canvas )
   <script>
      let canvas = document.getElementById("canvas");
      let ctx    = canvas.getContext("2d");
   </script> 
*/

// -------------------------------------------------------------
let B747 = function()  {                     // constructor

   // B747-100, old type, for Etkin 3d.ed.
   //    X = positive aft from CG at main gear         *inverted here*
   //    Y = spanwise (right)
   //    Z = vertical (up, becomes down in pixels)     *inverted here*
   // Use a scale of 5px per meter at this.scale == 1.
   // B747-100 span is 59.6 m * 5 px = 300 px.
   
   // right wing from root, start along the top spar
   this.xW  = [ 0,    0,    0,    0,     0,   0,     0 ];
   // TODO    Make the wing root change over a bit nicer around psi = 0 ///
   this.yW  = [  13,  50,  118,  120,  118,   50,    7 ];
   this.yWL = [ -13, -50, -118, -120, -118,  -50,   -7 ];
   this.zW  = [  -2,   0,   8,    7,     6,   -5,  -12 ];

   // stabilizer, bottom right first
   this.xS = [ 120, 120, 120, 120, 120, 120, 120 ];
   this.yS = [   0,  45,   45,  0, -45, -45,   0 ];
   this.zS = [   4,  15,   16,  9,  16,  15,   4 ];

   // fin
   // base TE, base LE (spar, tip LE (spar), tip TE
   // separate left and right surface
   this.xF  = [ 140,  90,  140,  155  ];   // LE a bit more forward
   this.yFR = [  0,  3.2,    1,    0   ];
   this.yFL = [  0, -3.2,   -1,    0   ];
   this.zF  = [  5,  11,   56,   56  ];
   
   // fuselage crutch 
   //   (along the top from nose to tail, then back along the bottom )
   this.xC = [ -75,  40, 150,     150,  70,   40,  -75 ];
   this.yC = [  0,    0,   0,       0,   0,    0,    0  ];
   this.zC = [ 20,   13,  11,      1, -11,  -13,  -13  ];
   
}; // end B747 constructor

// -------------------------------------------------------------
// note : This function cannot be called "fill"
B747.prototype.draw = function( x=0, y=0, phi=0, psi=0, scale=1 )  {

   // clear the canvas for a fresh drawing :
   ctx.beginPath();       // needed for clearRect()
   ctx.clearRect( 0, 0, canvas.width, canvas.height);
 //  canvas.style.backgroundColor = '#FAFCFF';  // sky
   canvas.style.backgroundColor = '#FBFBFF';  // sky

   // initial calculations 
   this.setPose( x, y, phi, psi, scale);

   // wing
   let yW1 = [];
   let yW2 = [];
   N = this.yW.length;
   for ( k=0; k<N; k++ )  {
      yW1.push( -this.yW[k] );
      yW2.push(  this.yW[k] );
   }
   yW1[0]   = 0;
   yW2[0]   = 0;

   // forward yawed (leading) wing
   let wingColor   = '#F0F0F0';  // silver is too dark
//   let wingOutline = 'dimgray';
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
   
   /* screen coordinates of XY axes zero ( y is down ) */
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
/*
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
