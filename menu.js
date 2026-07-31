/*-------------------------------------------------------------
-- file    : menu.js
-- purpose : Toggle hamburger button for mobiles
--
-- note    : See the HTML file for the button itself.
--      Each span is a small bar, see CSS.
--      The hamburger collapses the vertical menu on small
--      screens (mobiles) so you don't have to scroll
--      all the way past the menu to the text below it.
---------------------------------------------------------------
-- history :
--   2026-07-18 PL new, code first by Mistral, then Claude
------------------------------------------------------------ */

   const navToggle = document.querySelector('.nav-toggle');
   const menu = document.querySelector('.dropdown-menu > ul');

   // Hamburger button opens/closes the whole menu on small screens
   navToggle.addEventListener('click', () => {
       const isOpen = menu.classList.toggle('open');
       navToggle.classList.toggle('open', isOpen);
       navToggle.setAttribute('aria-expanded', isOpen);
   });

   // Tap-to-open for items that have a submenu (since :hover doesn't
   // work reliably on touch devices). Desktop hover still works via CSS.
   document.querySelectorAll('.dropdown-parent > a').forEach(link => {
       link.addEventListener('click', function (e) {
      const parentLi = this.parentElement;
      const submenu = this.nextElementSibling;
      if (!submenu) return;

      // Only intercept the click on touch/mobile-width screens;
      // on desktop, let hover handle it and allow normal clicks.
      if (window.matchMedia('(hover: none), (max-width: 768px)').matches) {
          e.preventDefault();
          const isOpen = parentLi.classList.toggle('open');

          // close sibling menus at the same level
          Array.from(parentLi.parentElement.children).forEach(sib => {
         if (sib !== parentLi) sib.classList.remove('open');
          });
      }
       });
   });

   // Close the mobile menu when a leaf link (no submenu) is tapped
   document.querySelectorAll('.dropdown-menu a').forEach(link => {
       link.addEventListener('click', function () {
      if (!this.parentElement.classList.contains('dropdown-parent')) {
          menu.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', false);
      }
       });
   });
    
