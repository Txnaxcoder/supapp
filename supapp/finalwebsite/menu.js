
  // menu.js
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
  
    menuToggle.addEventListener('click', function () {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
  
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        menu.style.display = 'inline';
      } else {
        menu.style.display = 'none';
      }
    });
  });
  
  