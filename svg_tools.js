// --------------------------------------------------------------
// file    : svg_tools.js
// purpose : Auxiliary functions to build SVG data paths.
//           Include in the HTML file before the *.js that uses it.
// --------------------------------------------------------------
//  2026-09-08 PL changed theta to anti-clockwise
//  2026-08-26 PL isolated from b747_side_view.js
// --------------------------------------------------------------

// --------------------------------------------------------------
// Build a "M x,y L x,y L x,y ... [Z]" string from x, y arrays
// Take the opportunity to invert y.
// It will now show positive up (from y=0) in the viewBox.
// --------------------------------------------------------------

// -------------------------------------------------------------
// Set a decent svg viewBox (maybe shift and zoom later)
function svg_viewbox( x, y )  {
   // Convert axis coordinates with Y positive up
   // to SVG string with top left corner and width, height.
   // Top left corner becomes y_screen = -y_my_coordinates.
   // ParseFloat strips trailing zeros.
   // Use this viewBox string outside, in a calling *.js, via :
   //   (svg).set Attribute( "viewBox", vB);
   if ( x.length == undefined )  {
      return "";
   }
   let w  = x[1] - x[0];
   let h  = y[1] - y[0];
   return ( parseFloat(  x[0].toFixed(3)) + ' ' +
            parseFloat( -y[1].toFixed(3)) + ' ' +
            parseFloat(     w.toFixed(3)) + ' ' +
            parseFloat(     h.toFixed(3)) );
}

// -------------------------------------------------------------
function svg_title( title ) {
   
   let svgString = ' ';
   if ( title !== undefined )  {
      svgString = '<!---- ' + title + ' ----> \n';
   }
   return svgString;
}

// -------------------------------------------------------------
function svg_data_xy( x, y )  {

if ( x.length == undefined )  {
   return "";
}
   
   let data = '"M ' +
         x[0].toFixed(3) + ',' + -y[0].toFixed(3) + ' ';
   for ( let k=1; k<x.length; k++ )  {
      data += 'L ' +
         x[k].toFixed(3) + ',' + -y[k].toFixed(3) + ' ';
   }
//   data += 'Z" \n';
   data += '"';
   // better close your own lines ?
   // without Z the fill still acts as if closed,
   //  only the stroke does not
   // with Z, all stroke lines get closed,
   // whether you like it or not.
   
   return data;
}

// -------------------------------------------------------------
// Translate and rotate xy data
// note : theta is anti-clockwise
//          (Z-axis pointing out of paper)
//        Y is inverted to show positive up on screen
//          (svg screen Y points down).
function move_xy( x, y, dx, dy, cosTheta=1, sinTheta=0 )  {
   let N = x.length;
   if ( y.length !== N ) {
      console.log( 'array size error in move_xy()' );
      return;
   }

   let xx = [];
   let yy = [];
   for ( let k=0; k<N; k++ )  {
//      xx[k] =  dx + x[k]*cosTheta + y[k]*sinTheta;
//      yy[k] =  dy - x[k]*sinTheta + y[k]*cosTheta;
      xx[k] =  dx + x[k]*cosTheta - y[k]*sinTheta;
      yy[k] =  dy + x[k]*sinTheta + y[k]*cosTheta;
   }

   return[ xx, yy ];
}

// -------------------------------------------------------------
// Scale xy data
function scale_xy( x, y, sx=1, sy=1 )  {
   let N = x.length;
   if ( y.length !== N ) {
      console.log( 'array size error in scale_xy()' );
      return;
   }

   let xx = [];   // or use *.map()
   let yy = [];
   for ( let k=0; k<N; k++ )  {
      xx[k] =  sx * x[k];
      yy[k] =  sy * y[k];
   }

   return[ xx, yy ];
}
