// --------------------------------------------------------------
// file    : arrow.js
// purpose : Graphical arrow
// --------------------------------------------------------------
//  2026-06-22 PL new, cloned from lever.js and arrow.m.
// --------------------------------------------------------------

/* Place this in calling HTML, just after creating canvas :
   let canvas = document.getElementById("canvas");
   let ctx    = canvas.getContext("2d");
*/

let Arrow = function( hL = 5, hW = hL/2, sW = 0.3*hW )  {

   // Sets head length and head width, shaft width

   // For narrow measurement lines, use the defaults :
   //    head width  = 0.5 * head length,
   //    shaft width = 0.3 * head width
   // For forces etc., use :
   //    head width  = 0.65 * head length,
   //    shaft width = 0.4  * head width

   this.hL = hL;
   this.hW = hW;
   this.sW = sW;
   
   // set default colors
   this.fill   = 'black';
   this.stroke = 'none';
   
   // set a few defaults for the end points
   this.xB = 0;
   this.yB = 0;
   this.xP = 0;
   this.yP = 4*hL;

   // temp
      // base is "zero", drawking order :
   //      base, shaft, point, and back.
   let sL = 10;
   let tL = sL+hL;
   this.Y = [  0,   sL,   sL,  tL,   sL,    sL,    0   ];
   this.X = [ sW/2, sW/2, hW/2, 0, -hW/2, -sW/2, -sW/2 ];

}; // end Arrow constructor

Arrow.prototype.setColors = function( fill='yellow',
                                      stroke='none') {
   this.fill   = fill;
   this.stroke = stroke;
}
/*
// -------------------------------------------------------------
Arrow.prototype.setBase = function( xB, yB )  {
   this.makeSvg();
}

// -------------------------------------------------------------
Arrow.prototype.setPoint = function( xP, yP )  {
}

// -------------------------------------------------------------
Arrow.prototype.setEnds = function( xB, yB, xP, yP )  {
                                    
   // calculate total (overall) arrow length
   let tL = Math.sqrt( (xP-xB)*(xP-xB)
                     + (yP-yB)*(yP-yB) );
                     
   // shaft length = total length - arrowhead length
   sL = Math.max( 0, tL-this.hL);
   
   // Cut the head short from the rear if tL < hL,
   // like when the arrow emerges from a wall.
   // This narrows the base of the arrowhead.
   if ( tL < this.hL )  {     // total shorter than head
      hW = tL/this.hL *hW;
   }

   // tail is "zero" - start from tail :
   //    tail, shaft, total(=tip), and back.
   X = [ sW/2, sW/2, hW/2, 0, -hW/2, -sW/2, -sW/2 ];
   Y = [  0,   sL,   sL,  tL,   sL,    sL,    0   ];

   phi = Math.atan2( yHead-yTail, xTail-xHead );
   
   // call external function from shape.js, draw from tail
   move_xy( X, Y, xPos, yPos, theta );
};
*/

Arrow.prototype.update = function( xBase=0, yBase=0,
                                   theta=0, L=this.L )  {
   
   cosTheta = Math.cos( theta);
   sinTheta = Math.sin( theta);
   
   // Re-calculate arrow points for length L :
   // TODO

      // it's a single outline
   [ x, y ] = move_xy( this.X, this.Y,
                    xBase, yBase, cosTheta, sinTheta);
   let svgString  = '<path d = "' + svg_d( x, y );  // keep this one local
   svgString += '    fill="'   + this.fill + '"' + 
                 ' stroke="'   + this.stroke + '" />\n';

   this.svgString = svgString;
}