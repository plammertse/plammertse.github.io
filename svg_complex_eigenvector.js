// --------------------------------------------------------------
// file    : svg_comlpex_eigenvector.js
// purpose : Contra-rotating complex eigenvector animation
// note    : Include svg_arrow.js in the calling HTML 
// --------------------------------------------------------------
//  2026-06-24 PL new, cloned from svg_eigenvector.js.
// --------------------------------------------------------------

let Eig2plot = function()  {

   this.viewBox = svg_viewbox( [ -1.1, 1.1 ], [ -1.1, 1.1 ]);

   this.phase = [];
   // Arrows from svg_arrow.js
   this.ImPos = new Arrow( 0.14);     // head length
   this.ImPos.setColors( 'red');
   this.ImNeg = new Arrow( 0.14);     // head length
   this.ImNeg.setColors( '#FFC0C0');  // pale red
   
   this.ImExt = new Arrow( 0.14);     // head length
   this.ImExt.setColors( 'red');
   
   this.ImSum = new Arrow( 0.16);     // head length
   this.ImSum.setColors( 'blue');

      // projection lines
   this.line0 = new Line( 0.0035, 'gray' );
   this.line1 = new Line( 0.0035, 'gray' );
   this.line2 = new Line( 0.0035, 'gray' );

}; // end constructor

// -------------------------------------------------------
Eig2plot.prototype.update = function( phase = 0 )
{
   this.ImPos.update( 0, 0, 0.5,  phase - Math.PI/2);
   this.ImNeg.update( 0, 0, 0.5, -phase - Math.PI/2);
   this.ImExt.update( this.ImPos.xTip, this.ImPos.yTip,
                            0.5,  phase - Math.PI/2);
   this.ImSum.update( 0, 0, Math.cos( phase), -Math.PI/2 );

      // start with unit circle outline
   let svgString = 
      '<circle cx="0" cy="0" r="1"'  +
      ' fill="white" stroke="black" stroke-width = "0.01"; /> \n';

      // add XY axes
   svgString += 
      '<line x1="-2" y1="0" x2="2" y2="0"' +
      ' stroke="silver" stroke-width="0.005" /> \n';      
   svgString += 
      '<line x1="0" y1="-2" x2="0" y2="2"' +
      ' stroke="silver" stroke-width="0.005" /> \n';      

      // line ****
   this.line0.updateData( [ this.ImPos.xTip, 2*this.ImPos.xTip ],
                          [ this.ImPos.yTip, 0 ] );
   svgString += this.line0.svgString;
   this.line1.updateData( [ this.ImNeg.xTip, 2*this.ImNeg.xTip ],
                          [ this.ImNeg.yTip, 0 ] );
   svgString += this.line1.svgString;
   this.line2.updateData( [ 2*this.ImPos.xTip, 2*this.ImPos.xTip ],
                          [ 2*this.ImPos.yTip, 0 ] );
   svgString += this.line2.svgString;

      // draw vector arrows
   svgString += this.ImNeg.svgString;
   svgString += this.ImPos.svgString;
   svgString += this.ImExt.svgString;
   svgString += this.ImSum.svgString;
   this.svgString = svgString;
}