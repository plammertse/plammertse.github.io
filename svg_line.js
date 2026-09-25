// -------------------------------------------------------------
// file    : svg_line.js
// purpose : Graphical line ( Y is up )
// -------------------------------------------------------------
//  2026-09-24 PL new
// -------------------------------------------------------------

// -------------------------------------------------------------
// Define line properties only, update the xy data later
let Line = function( width=1, color='blue', dash )  {

   this.width  = width;
   this.stroke = color;
   this.dash   = dash;      // string, e.g. "0.1 0.1"
   this.phase  =  "0";      // string, e.g. "0.05"
   this.x = [];
   this.y = [];
}; // end constructor

// -------------------------------------------------------------
Line.prototype.setColor = function( stroke ) {
   this.stroke = stroke;
}

// -------------------------------------------------------------
// If needed use move_xy first, outside this function
Line.prototype.updateData = function( x, y ) {

   this.x = x;
   this.y = y;
   this.update();
}

// -------------------------------------------------------------
// "Phase" allows a "marching ants" effect.
// It also allows "drawing" a line by sliding along 
// a dash pattern equal to the line length.
Line.prototype.updatePhase = function( phase) {
   this.phase = phase;
   update();
}
                                    
// -------------------------------------------------------------
Line.prototype.update = function() {
                                     
//console.log( 'line x', this.x);
//console.log( 'line y', this.y);
                                     
   // svg_data_xy flips +Y up
   let svgString  = '<path d = '  + svg_data_xy( this.x, this.y );
   
   svgString += ' stroke-width="' + this.width.toString() + '"' + 
                ' stroke="'       + this.stroke           + 
                '" fill="none"';
               
   // if applicable, add (moving) dash pattern (strings!)
   if ( this.dash !== undefined )  {
      svgString += '\n stroke-dasharray="'  + this.dash  + '"';
      svgString +=   ' stroke-dashoffset="' + this.phase + '"';     
   }
   svgString += '/> \n';                 // end <path .. />
                
   this.svgString = svgString;
//   console.log( svgString);
}
