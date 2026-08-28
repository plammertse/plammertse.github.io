/*-------------------------------------------------------------
-- file    : draft.js
-- purpose : Read persistent option to show or hide draft text
---------------------------------------------------------------
-- usage   :
--   Call this  *.js in every HTML containting draft text.
--   Change the setting via draft_button.js
---------------------------------------------------------------
-- history :
--   2026-08-19 PL new
------------------------------------------------------------ */

/* Add an event listener for this (avoids replacing onload)  */
window.addEventListener( 'load', getShowDraft );

/* Get persistent value from local storage if available,     */
/* then set the value in the CSS variable in text.css        */
function getShowDraft( event ) {
   let  showDraft = 'none';
   let  temp  = localStorage.getItem( 'showDraft');
   if ( temp != null )
      { showDraft = temp };
   
   const root = document.documentElement;
   root.style.setProperty( '--show-draft', showDraft );
}
