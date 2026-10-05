/*-------------------------------------------------------------
-- file    : draft_button.js
-- purpose : Set option to show or hide draft text
---------------------------------------------------------------
-- usage   :
--   Add these buttons in the HTML calling this *.js :
--     <button id="showDraft";> Show drafts </button> 
--     <button id="hideDraft";> Hide drafts </button>
--  The --show-draft variable toggles the "display" property
--   for the class .draft in text.css.
---------------------------------------------------------------
-- history :
--   2026-08-19 PL new
------------------------------------------------------------ */

const buttonShow = document.getElementById('showDraft');
const buttonHide = document.getElementById('hideDraft');
   
buttonShow.addEventListener(
   'click', () => {
      const root = document.documentElement;
//      This works, but it puts <span>'s on separate line :      
      root.style.setProperty( '--show-draft', 'block' );
      localStorage.setItem(     'showDraft' , 'block' );
//      This does not make menu items yellow :     
//      root.style.setProperty( '--show-draft', 'inline' );
//      localStorage.setItem(     'showDraft' , 'inline' );
   }
);

buttonHide.addEventListener(
   'click', () => {
      const root = document.documentElement;
      root.style.setProperty( '--show-draft', 'none' );
      localStorage.setItem(     'showDraft',  'none' );
   }
);

