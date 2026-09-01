// --------------------------------------------------------------
// file    : CG_marker.js
// purpose : Graphical CG_marker, useful for animation
// usage   : uses shape.js, and variables canvas+ctx
// --------------------------------------------------------------
//  2026-06-22 PL new, cloned from dumbbell.js
// --------------------------------------------------------------

// TODO : SET COLORS HERE

let CG_marker = function( xCG=10, yCG=0, R=1, fill="white", stroke="black" )  {
//let CG_marker = function()  {

   this.fill   = fill;
   this.stroke = stroke;   
   this.X  = [];
   this.Y  = [];
   this.X1 = [ 0 ];
   this.Y1 = [ 0 ];
   this.X2 = [ 0 ];
   this.Y2 = [ 0 ];
   let N = 36;
   
   // outer circle and 'empty' background
   // no point N, drawShape() already closes the shape
   let theta;
   for ( k = 0; k<=N; k++ )  { 
      theta = 2*Math.PI*k/N;
      this.X.push( R*Math.cos( theta));
      this.Y.push( R*Math.sin( theta));
   };

   // TODO : COMBINE X1 AND X2 INTO ONE FILL CONTOUR
   for ( k = 0; k<=+N/4; k++ )  { 
      theta = 2*Math.PI*k/N;
      this.X1.push( -R*Math.cos( theta));
      this.Y1.push(  R*Math.sin( theta));
      this.X2.push(  R*Math.cos( theta));
      this.Y2.push( -R*Math.sin( theta));
   };
   
   // TODO : GET move FROM ELSEWHERE THAN b747
   [ this.X,  this.Y  ] = move_xy( this.X, this.Y,  xCG, yCG);
   [ this.X1, this.Y1 ] = move_xy( this.X1,this.Y1, xCG, yCG);
   [ this.X2, this.Y2 ] = move_xy( this.X2,this.Y2, xCG, yCG);
   
   
}; // end CG_marker constructor

// -------------------------------------------------------------
CG_marker.prototype.update = function( xPos, yPos, theta )  {
   
   cosTheta = Math.cos( theta);
   sinTheta = Math.sin( theta);
   
   // Fill the svg string with path data,
   //    translated and rotated as appropriate.

      // outer circle, solid fill
let   [ x, y ] = move_xy( this.X, this.Y,     // from svg_tools.js
                    xPos, yPos, cosTheta, sinTheta);
   let svgString  = '<path d = ' + svg_d( x, y );  // keep this one local
   svgString += '    fill="'   + this.fill + '"' + 
                 ' stroke="'   + this.stroke + '" />\n';
      // quadrant 1
   [ x, y ] = move_xy( this.X1, this.Y1,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = ' + svg_d( x, y );
   svgString += '    fill="'   + this.stroke + '"' + 
                 ' stroke="none" />\n';
      // quadrant 2
   [ x, y ] = move_xy( this.X2, this.Y2,
                    xPos, yPos, cosTheta, sinTheta);
   svgString += '<path d = ' + svg_d( x, y );
   svgString += '    fill="'   + this.stroke + '"' +
                 ' stroke="none" />\n';

   this.svgString = svgString;
//   console.log( svgString);
}


