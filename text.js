/*-------------------------------------------------------------
-- file    : text.js
-- purpose : Handle persistent option to show or hide draft text
---------------------------------------------------------------
-- history :
--   2026-08-19 PL new
------------------------------------------------------------ */

const root       = document.documentElement;
const buttonShow = document.getElementById('showDraft');
const buttonHide = document.getElementById('hideDraft');

/* Add an event listener (avoids replacing onload)           */
window.addEventListener( 'load', getShowDraft );

/* Get persistent value from local storage if available,     */
/* then set the value in the CSS variable in text.css        */
function getShowDraft( event ) {
   let  showDraft = 'none';
   let  temp  = localStorage.getItem( 'showDraft');
   if ( temp != null )  { showDraft = temp };
   
   root.style.setProperty( '--show-draft', showDraft );
}

/* Add these buttons, somewhere in the HTML :                */
/*   <button id="showDraft";> Show drafts </button>          */ 
/*   <button id="hideDraft";> Hide drafts </button>          */ 
   
buttonShow.addEventListener(
   'click', () => {
      root.style.setProperty( '--show-draft', 'block' );
      localStorage.setItem(     'showDraft' , 'block' );
   }
);

buttonHide.addEventListener(
   'click', () => {
      root.style.setProperty( '--show-draft', 'none' );
      localStorage.setItem(     'showDraft',  'none' );
   }
);

