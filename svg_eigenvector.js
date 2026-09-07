// --------------------------------------------------------------
// file    : svg_eigenvector.js
// purpose : Rotating eigenvector animation
// --------------------------------------------------------------
//  2026-06-22 PL new, cloned from Arrow.js.
// --------------------------------------------------------------

let Eigenvector = function( L = 1, zeta=0.7071)  {

   this.setViewBox();

// --------------------------------
// EXPLANATION
// theta = x/L;
// F = -m*g*sin(theta)
//   ~ -m*g/L*x
// a = -F/m
//   = g/L*x
// The state elements are :
//  [ x v ]'
// --------------------------------

const g = 9.81;
let   b = 0.1;

this.arrows = [];
/*
for ( let k=0; k<2; k++ )  {
   push this.arrows( new Arrow() );
}
*/

/*
this.A = [ [   0    1 ],
           [  -g/L -b ]  ];
*/
// eigenvector elements : amplitude, phase
this.amp   = [ 1, 0.5 ];
this.phase = [ 0, Math.PI + 0.1 ];
   
}; // end Eigenvector constructor

// -------------------------------------------------------------
Eigenvector.prototype.setViewBox = function()  {
   // Size and scale the viewBox.
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
   //   in a calling *.js like pendulum.js,
   //   via :
   //    svgRoot.setAttribute( "viewBox", vB);
   //       /* (top left) x  y width height */
}

// -------------------------------------------------------
Eigenvector.prototype.setColors = function( colors ) {
   this.colors = colors;
}

// -------------------------------------------------------
Eigenvector.prototype.update = function( time )  {
   
   let phase = this.omega*time;
   
   let svgString = 
      '<line x1="-2" y1="0" x2="2" y2="0"' +
      ' stroke="black" stroke-width="0.01" />';      
   svgString += 
      '<circle cx="0" cy="0" r="1"'  +
      ' fill="red" stroke="black" stroke-width = "0.01"; />';
   console.log( svgString);

   this.svgString = svgString;
   // console.log( svgString);
}