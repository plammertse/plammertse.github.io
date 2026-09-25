// --------------------------------------------------------------
// file    : svg_eigenvector.js
// purpose : Rotating eigenvector animation
// note    : Include svg_arrow.js in the calling HTML 
// --------------------------------------------------------------
//  2026-06-22 PL new, cloned from Arrow.js.
// --------------------------------------------------------------

let Eigenvector = function()  {

      // suggest a square box around unit circle
   this.viewBox = svg_viewbox( [ -1.1 1.1 ], [ -1.1 1.1 ]);

   // declare arrays for individual vector properties
   this.mag   = [];
   this.phase = [];
   this.color = [];
   this.name  = [];
   this.arrow = [];     // list of svg_arrow.js Arrow objects
  
}; // end constructor

// -------------------------------------------------------------
Eigenvector.prototype.addVector = function(
                                    mag = 1, phase = 0,
                                    color = "black",
                                    name  = "x")
{  
   this.mag.push(   mag   );
   this.phase.push( phase );
   this.name.push(  name  );
      // HTML must include svg_arrow.js :
   this.arrow.push( new Arrow( 0.175) );    // head length
   this.arrow.at(-1).setColors( color);
}   

// -------------------------------------------------------
Eigenvector.prototype.update = function(
                                  mag = 1, phase = 0 )
{
      // draw the eigenvector plot with N vector arrows,
      // each reduced and rotated by mag and phase.
   
      // start with unit circle outline
   let svgString = 
      '<circle cx="0" cy="0" r="1"'  +
      ' fill="white" stroke="black" stroke-width = "0.01"; />';

      // add XY axes
   svgString += 
      '<line x1="-2" y1="0" x2="2" y2="0"' +
      ' stroke="silver" stroke-width="0.005" />';      
   svgString += 
      '<line x1="0" y1="-2" x2="0" y2="2"' +
      ' stroke="silver" stroke-width="0.005" />';      

      // add vector arrows
   let N = this.mag.length;
   for ( let k=0; k<N; k++ ) {
         // svg_arrow.js object Arrow starts up (+Y).
         // Turn the zero angle to horizontal   (+X)
         // for this eigenvector plot.
      let thetaPlot = this.phase[k] + phase - Math.PI/2;
      let magNow    = this.mag[k] * mag;
      this.arrow[k].update( 0, 0,
         magNow, thetaPlot );
      svgString += this.arrow[k].svgString;
   }
   this.svgString = svgString;
}