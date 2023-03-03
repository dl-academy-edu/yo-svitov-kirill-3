let menuBtn = document.querySelector('.header__burger');
let menu = document.querySelector('.header__burger-menu');

menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
})