/*-------------------------------------------------------------
-- file    : draft_button.js
-- purpose : Set option to show or hide draft text
---------------------------------------------------------------
-- usage   :
--   Add these buttons in the HTML calling this *.js :
--     <button id="showDraft";> Show drafts </button> 
--     <button id="hideDraft";> Hide drafts </button>
---------------------------------------------------------------
-- history :
--   2026-08-19 PL new
------------------------------------------------------------ */

const buttonShow = document.getElementById('showDraft');
const buttonHide = document.getElementById('hideDraft');
   
buttonShow.addEventListener(
   'click', () => {
      const root = document.documentElement;
      root.style.setProperty( '--show-draft', 'block' );
      localStorage.setItem(     'showDraft' , 'block' );
   }
);

buttonHide.addEventListener(
   'click', () => {
      const root = document.documentElement;
      root.style.setProperty( '--show-draft', 'none' );
      localStorage.setItem(     'showDraft',  'none' );
   }
);

