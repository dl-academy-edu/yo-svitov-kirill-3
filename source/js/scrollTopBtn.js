const scrollBtn = document.querySelector('.scrollTopBtn');


scrollBtn.addEventListener('click', goScroll);
window.addEventListener('scroll', trackScroll);

function trackScroll() {
    const offSet = window.pageYOffset;
    if (offSet > 1500) {
        scrollBtn.classList.add('scrollTopBtn-show')
    } else {
        scrollBtn.classList.remove('scrollTopBtn-show')
    }
}


function goScroll() {
    if (window.pageYOffset > 0) {
        window.scrollBy(0, -50);
        setTimeout(goScroll, 0);
    }
}