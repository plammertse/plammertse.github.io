// --------------------------------------------------------------
// file    : svg_tools.js
// purpose : Auxiliary functions to build SVG data paths.
//           Include in the HTML file before the *.js that uses it.
// --------------------------------------------------------------
//  2026-08-26 PL isolated from b747_side_view.js
// --------------------------------------------------------------

// --------------------------------------------------------------
// Build a "M x,y L x,y L x,y ... [Z]" string from x, y arrays
// Take the opportunity to invert y.
// It will now show positive up (from y=0) in the viewBox.
// --------------------------------------------------------------

function svg_d( x, y )  {
   
   let data = 'M ' +
         x[0].toFixed(3) + ',' + -y[0].toFixed(3) + ' ';
   for ( let k=1; k<x.length; k++ )  {
      data += 'L ' +
         x[k].toFixed(3) + ',' + -y[k].toFixed(3) + ' ';
   }
   data += 'Z"';
//   data += 'Z" \n';
   
   return data;
}

// -------------------------------------------------------------
// Translate and rotate xy data
function move_xy( x, y, dx, dy, cosTheta=1, sinTheta=0 )  {
   let N = x.length;
   if ( y.length !== N ) {
      console.log( 'array size error in b747...move()' );
      return;
   }

   let xx = [];
   let yy = [];
   for ( let k=0; k<N; k++ )  {
      xx[k] =  dx + x[k]*cosTheta + y[k]*sinTheta;
      yy[k] =  dy - x[k]*sinTheta + y[k]*cosTheta;
   }

   return[ xx, yy ];
}
