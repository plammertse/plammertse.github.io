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

let Arrow = function( hL = 5, hW = hL/2, sW = 0.3*hW, eW )  {

   // For narrow measurement lines, use the defaults :
   //    head width  = 0.5 * head length,
   //    shaft width = 0.3 * head width
   // For forces etc., use :
   //    head width  = 0.65 * head length,
   //    shaft width = 0.4  * head width

   // Head length and head width,
   //  shaft width and line width.

   this.hL = hL;
   this.hW = hW;
   this.sW = sW;
   this.eW = eW;        // useful if edge is white
   
   // Default colors
   this.fill   = 'black';
   this.stroke = 'none';
   
   this.tL = 4*hL;       // total length default
}; // end Arrow constructor

Arrow.prototype.setColors = function( fill  = 'yellow',
                                      stroke= 'none') {
   this.fill   = fill;
   this.stroke = stroke;   // white can be useful too
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
                                   theta=0, tL=this.tL )  {
   
   let cosTheta = Math.cos( theta);
   let sinTheta = Math.sin( theta);
   
   // Re-calculate arrow points for length L :
   // TODO
   // shaft length = total length - arrowhead length
   let sL = Math.max( 0, tL-this.hL);
   
   // Cut the head short from the rear if tL < hL,
   // like when the arrow emerges from a wall.
   // This narrows the base of the arrowhead.
   let hW = this.hW;
   if ( tL < this.hL )  {     // total shorter than head
      hW = tL/this.hL *this.hW;
   }
   
   this.X = [ this.sW/2, this.sW/2, hW/2, 0, -hW/2, -this.sW/2, -this.sW/2 ];
   this.Y = [  0,   sL,   sL,  tL,   sL,    sL,    0   ];
   

      // it's a single outline
   [ x, y ] = move_xy( this.X, this.Y,
                    xBase, yBase, cosTheta, sinTheta);
   let svgString  = '<path d = "' + svg_d( x, y );  // keep this one local
   if ( this.eW !== undefined ) {
      svgString += '    stroke-width='   + (this.eW).toFixed(3);
   }
   svgString += '    fill="'   + this.fill + '"' + 
                 ' stroke="'   + this.stroke + '" />\n';

   this.svgString = svgString;
   // console.log( svgString);
}