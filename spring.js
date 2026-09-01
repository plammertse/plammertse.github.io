// --------------------------------------------------------------
// file    : spring.js
// purpose : Graphical spring (zig-zag)
// --------------------------------------------------------------
//  2026-08-29 PL converted to svg
//  2026-06-22 PL new, cloned from arrow.js and *_spring.m.
// --------------------------------------------------------------

let Spring = function( S0=100, N=6, SW=2, a=0.2, b=a )  {

   this.stroke = 'black';
   // S is the relaxed overall length,
   // including the straight fractions a and b.
   // The relaxed spring becomes S = Sa + L + Sb.
   // The relaxed zig-zag length is L.
   this.S0 = S0;
   this.Sa = a*S0;
   this.Sb = b*S0;
   this.SW = SW;

   // relaxed zig-zag angle is a design parameter
//   let angle = 55/180*Math.PI;
   let angle = 45/180*Math.PI;

   // get relaxed "width"
   let L0  = S0 * (1-a-b);
   let P0  = L0/N;
   let w  = Math.tan( angle)*P0;

   // create length-normalized L=1 zig-zag part of width w
   this.X = [ 0 ];
   this.Y = [ 0 ];
   for ( let k=0; k<N; k++ )  {
      this.X.push(  0.5/N+k/N );         // [   0  ..   1  ]
      this.Y.push( ( k%2 - 0.5)  * w );          // [ -0.5 .. +0.5 ] * w
   }
   this.X.push( 1 );
   this.Y.push( 0 );
   
}; // end Spring constructor

// -------------------------------------------------------------
Spring.prototype.setColor = function( stroke ) {
   this.stroke = stroke;
}
// -------------------------------------------------------------
// If the end points are not absolute but have to move ( like
// with some other object ), then use
//   move_xy( [ x1 x2 }, [ y1 y2 ]) 
// on them first, *before* calling this update() function.
Spring.prototype.update = function( x1=0, y1=0, x2=x1+50, y2=y1 ) {
                                     
   // calculate total overall length s, "stretching" S0
   let s = Math.sqrt( (x2-x1)*(x2-x1)
                    + (y2-y1)*(y2-y1) );
                     
   // zig-zag length = total length - straight ends
   let L = Math.max( 0, s - this.Sa - this.Sb);
   
   // local XY, spring stretched but still horizontal
   //    straight begin
   let X = [ 0, Math.min( s, this.Sa) ];
   let Y = [ 0, 0  ];
   // zig-zag section sized to fit total length  // TODO What Sa to use if L == 0
   let N = this.X.length;
   for ( let k=0; k<N; k++)  {
      X.push( this.Sa + L*this.X[k] );
      Y.push(             this.Y[k] );   // scaled to width w
   }
   // add straight end
   X.push( s );
   Y.push( 0 );

   // important : keep this phi local
   //    The minus sign is because move_xy already flips Y
   let phi = -Math.atan2( y2-y1, x2-x1 );
   let [ x, y ] = move_xy( X, Y, x1, y1, Math.cos(phi), Math.sin(phi) );
   
   // svg_d flips +y up
   let svgString  = '<path d = ' + svg_d( x, y );
   svgString += ' stroke-width="' + this.SW.toFixed(3) + 
               '" stroke="'       + this.stroke        + 
               '" fill="none" />\n';
                
   this.svgString = svgString;
}
