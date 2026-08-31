// --------------------------------------------------------------
// file    : floor.js
// purpose : Graphical floor base (hatched)
// --------------------------------------------------------------
//  2026-08-31 PL cloned from spring
// --------------------------------------------------------------

let Floor = function( L=10, N=3, H=2, tF=3, tH=0.6*tF )  {

   this.tF = tF;         // floor thickness                         
   this.tH = tH;         // hatchline thickness                      
   this.stroke = 'black';                      

   // flat floor line
   this.xF = [ -L/2, L/2 ];
   this.yF = [   0,   0  ]; 

   this.xH = [];
   this.yH = [];
//   let s = L/(N+1);
   let s = L/N;
   for ( let k=0; k<N; k++ ) {           // k is defined elsewhere, find out where
//      this.xH.push( -L/2+k/N*H);
      this.xH.push( -L/2 + s/4 + k*s);
      this.yH.push( 0 );
      this.xH.push( -L/2 + s/4 + k*s + H );
      this.yH.push( H );
      this.xH.push(  -L/2 + s/4 + k*s );
      this.yH.push( 0 );
   }   

}; // end Floor constructor

// -------------------------------------------------------------
Floor.prototype.setColor = function( stroke ) {
   this.stroke = stroke;
}
// -------------------------------------------------------------
Floor.prototype.update = function( xPos=0, yPos=0, theta=0 ) {
                                             
      // baseline
   let [ x, y ] = move_xy( this.xF, this.yF, xPos, yPos,
                           Math.cos(theta), Math.sin(theta) ); 
   let svgString  = '<path d = "' + svg_d( x, y );
   svgString += ' stroke-width="' + this.tF.toFixed(3) + 
               '" stroke="'       + this.stroke + 
               '" fill="none" />\n';

      // hatch
   [ x, y ] = move_xy( this.xH, this.yH, xPos, yPos,
                       Math.cos(theta), Math.sin(theta) );   
   svgString += '<path d = "' + svg_d( x, y );
   svgString += ' stroke-width="' + this.tH.toFixed(3) + 
               '" stroke="'       + this.stroke + 
               '" fill="none" />\n';
                
   this.svgString = svgString;
}
