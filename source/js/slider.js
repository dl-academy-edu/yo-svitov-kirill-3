const slider = document.querySelector('.intro__slider');
const wrapper = document.querySelector('.intro__slider-wrap');
const innerWrapper = document.querySelector('.intro__slider-inner-wrap');
const buttonBack = document.querySelector('.slider__button-back');
const buttonNext = document.querySelector('.slider__button-next');
const slides = [...document.querySelectorAll('.intro__slider-slide')];
const slidesCount = slides.length;
const pagination = document.querySelector('.slider__pagination')
const animationTime = 500;

let timer = null;
let dots = [];
let sliderWidth = wrapper.offsetWidth;
let activeSlideIndex;


// Добавляем активный слайд в localStorage
const updateActiveSlide = () => {
	+localStorage.getItem('activeSlideIndex')
	? (activeSlideIndex = +localStorage.getItem('activeSlideIndex'))
	: (activeSlideIndex = 0);
}
updateActiveSlide();


window.addEventListener('resize', () => {
	initWidth();
	setActiveSlide(activeSlideIndex, false);
});

createDots();

// Переключения слайдов
function setActiveSlide (index, withAnimation = true) {
	if (index < 0 || index >= slidesCount) return;
	innerWrapper.style.transform = `translateX(${index * sliderWidth * (-1)}px)`

	buttonBack.removeAttribute('disabled');
	buttonNext.removeAttribute('disabled');

	if (withAnimation) {
		clearTimeout(timer);
		innerWrapper.style.transition = `transform ${animationTime}ms`;
		timer = setTimeout(() => {
			innerWrapper.style.transition = '';
		}, animationTime)
	}

	if (index === 0) {
		buttonBack.setAttribute('disabled', '');
	}
	if (index === slidesCount - 1) {
		buttonNext.setAttribute('disabled', '');
	}

	dots[activeSlideIndex].classList.remove('slider__dot__active');
	dots[index].classList.add('slider__dot__active');
	activeSlideIndex = index;
	localStorage.setItem('activeSlideIndex', activeSlideIndex);
};

initWidth();
setActiveSlide(activeSlideIndex);


// Инициилизируем ширину/адаптация слайдера
function initWidth () {
	sliderWidth = wrapper.offsetWidth;

	// Узнаем ширину слайдов
	slides.forEach(slide => {
		slide.style.width = `${sliderWidth}px`;
	});
};


// Кнопки переключения
buttonNext.addEventListener ('click', () => {
	setActiveSlide(activeSlideIndex + 1);
	// localStorage.setItem('activeSlideIndex', activeSlideIndex);
});

buttonBack.addEventListener ('click', () => {
	setActiveSlide(activeSlideIndex - 1);
	// localStorage.setItem('activeSlideIndex', activeSlideIndex);
});


// Создаем точки
function createDots() {
	for (let i = 0; i < slidesCount; i++) {
		const dot = createDot(i);
		dots.push(dot);
		pagination.insertAdjacentElement('beforeend', dot);
	}
};

function createDot(index) {
	const dot = document.createElement('button');
	dot.classList.add('slider__dot');

	if (index === activeSlideIndex) {
		dot.classList.add('slider__dot__active');
	}

	dot.addEventListener('click', () => {
		setActiveSlide(index);
	})

	return dot;
};

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});