// --------------------------------------------------------------
// file    : svg_eigenvector.js
// purpose : Rotating eigenvector animation
// note    : Include svg_arrow.js in the calling HTML 
// --------------------------------------------------------------
//  2026-06-22 PL new, cloned from Arrow.js.
// --------------------------------------------------------------

let Eigenvector = function()  {

   this.niceViewBox();  // square box for unit circle

   // declare arrays for individual vector properties
   this.mag   = [];
   this.phase = [];
   this.color = [];
   this.name  = [];
   this.arrow = [];     // list of svg_arrow.js Arrow objects
  
}; // end Eigenvector constructor

// -------------------------------------------------------------
Eigenvector.prototype.addVector = function(
                                    mag = 1, phase = 0,
                                    color = "black",
                                    name  = "x")
{
   this.mag.push(    mag  );
   this.phase.push( phase );
   this.name.push(  name  );
      // HTML must include svg_arrow.js :
   this.arrow.push( new Arrow( 0.175) );    // head length
   this.arrow.at(-1).setColors( color);
}   

// -------------------------------------------------------------
Eigenvector.prototype.niceViewBox = function()  {
   // Size and scale a nice viewBox suggestion.
   // Use this in a calling *.js with access to svg, if desired.
   // Place the zero at center for now.
   // Unfortunately Y is positive down in SVG. 
   // This will be handled here in code, not via SVG transforms.
   let x0 = -1.1;
   let y0 = -1.1;
   let w  =  2.2;
   let h  =  2.2;
   this.viewBox =  x0.toFixed(3) + ' ' + y0.toFixed(3) + ' ' +
                    w.toFixed(3) + ' ' +  h.toFixed(3);
   // Use this viewBox outside,
   //   in a calling *.js like pendulum.js
   //   which has access to the svg element, via :
   //    (svg).set Attribute( "viewBox", vB);
   //       /* (top left) x  y width height */
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