const popup = document.querySelector('.popup-sign-in');
const buttonOpen = document.querySelector('.buttonOpenSignIn-js');
const buttonClose = document.querySelector('.popup-sign-in__close');

buttonOpen.addEventListener('click', function () {
    popup.classList.add('open');
})

buttonClose.addEventListener('click', function () {
    popup.classList.remove('open');
})

window.addEventListener('keydown', function(event) {
    if(event.code === "Escape" && popup.classList.contains('open')) {
        popup.classList.remove('open');
    }
})