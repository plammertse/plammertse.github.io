// --------------------------------------------------------------
// file    : svg_text.js
// purpose : Graphical SVG text
// note    : SVG test jitters a bit on pixel edges. 
//           No working solution found. See also text.css.
// --------------------------------------------------------------
//  2026-08-31 PL new, cloned from arrow.m.
// --------------------------------------------------------------

let Text = function( string, fontsize=4, fill="black" )  {

   this.string   = string;
   this.fontsize = fontsize;
   this.fill     = fill;
}; // end constructor

Text.prototype.update = function( x, y )  {
   
   // This centers text horizontally and vertically.
   // Like the shapes, it flips y positive up.
   // The text color is called "fill" in text.
   this.svgString = '<text x="' +   x.toFixed(3)    + '"' +
                         ' y="' + (-y).toFixed(3)   + '"' +
                    ' font-size="' +
                           this.fontsize.toFixed(3) + '"' +
                    ' text-anchor="middle" '        +
                    ' dominant-baseline="central" ' +
                    ' fill="' + this.fill + '" >'   +
                     this.string + ' </text> \n';
}