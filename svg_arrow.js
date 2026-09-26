// --------------------------------------------------------------
// file    : svg_arrow.js
// purpose : Graphical arrow
// note    : Needs HTML to inlude svg_tools.js (for move_xy)
// --------------------------------------------------------------
//  2026-09-26 PL add default line width for blunter point
//  2026-09-24 PL handle negative arrow length gracefully
//  2026-06-22 PL new, cloned from lever.js and arrow.m.
// --------------------------------------------------------------

// --------------------------------------------------------------
let Arrow = function( hL = 5, hW = hL/2, sW = 0.25*hW, eW )  {

   // For narrow measurement lines, use the defaults :
   //    head width  = 0.5 * head length,
   //    shaft width = 0.3 * head width
   // For forces etc., use :
   //    head width  = 0.65 * head length,
   //    shaft width = 0.4  * head width
   // REVISION : FOR BLUNTER NOSE USE STROKE = FILL,
   //   AND sW = 0.2*hW 
   //       eW = 0.4*sW
   //   SO  sW + eW = 1.4*0.2*hW = 0.28*hW 

   // Head length, head width, shaft width
   // and edge (line) width.
   // Default edge with color gives a slighly blunt point,
   // whcih is needed visually to "reach" the end piont.
   // Take a smaller width if edge is white.
   // Consider subtracting edge width from the other sizes,
   // to always give the same total outline. 

   this.hL = hL;
   this.hW = hW;
   this.sW = sW;
   if ( eW === undefined )  {
      eW = 0.4*sW;
   }
   this.eW = eW;        
      
   // Default colors
   this.fill   = 'black';
   this.stroke = 'black';
   
   this.tL = 4*hL;       // total length default
}; // end constructor

// --------------------------------------------------------------
Arrow.prototype.setColors = function( fill   = 'yellow',
                                      stroke = fill ) {
   this.fill   = fill;
   this.stroke = stroke;   // none or white can be useful too
}
/*   // TODO

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

// --------------------------------------------------------------
Arrow.prototype.update = function( xBase=0, yBase=0,
                                   arrow_length=this.tL, theta_CCW=0 )  {

   let cosTheta = Math.cos( theta_CCW);
   let sinTheta = Math.sin( theta_CCW);
   let tL       =  arrow_length;
   // trick for negative arrow length
   if ( arrow_length < 0 )  {
      cosTheta = Math.cos( theta_CCW + Math.PI);
      sinTheta = Math.sin( theta_CCW + Math.PI);
      tL       = Math.abs( arrow_length);
   }
   
   // Re-calculate arrow points for length L :
   // TODO
   // shaft length = total length - arrowhead length
   let sL = Math.max( 0, tL-this.hL);
   
   // Cut the head short from the rear if tL < hL,
   // like when the arrow emerges from a wall.
   // This narrows the base of the arrowhead.
   let hW = this.hW;
   if ( tL < this.hL )  {     // if total shorter than head
      hW = tL/this.hL *this.hW;
   }
   
   this.X = [ this.sW/2, this.sW/2, hW/2, 0, -hW/2, -this.sW/2, -this.sW/2 ];
   this.Y = [  0,   sL,   sL,  tL,   sL,    sL,    0   ];
   
      // the arrow has a single outline
   let [ x, y ] = move_xy( this.X, this.Y,
                    xBase, yBase, cosTheta, sinTheta);
   let svgString  = '<path d = ' + svg_data_xy( x, y );  // keep this one local
   if ( this.eW !== undefined ) {
      svgString += '    stroke-width='   + (this.eW).toFixed(3);
   }
   
   svgString += '    fill="'   + this.fill   + '"' + 
                 ' stroke="'   + this.stroke + 
                 '" />\n';                                 // end <path .. />

   this.svgString = svgString;
   // console.log( svgString);
   
   // make the arrow tip location available to others
   this.xTip = x[3];
   this.yTip = y[3];
}