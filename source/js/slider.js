const wrapper = document.querySelector(".intro__slider-wrap");
const innerWrapper = document.querySelector(".intro__slider-inner-wrap");
const pagination = document.querySelector(".slider__pagination");
const buttonBack = document.querySelector(".slider__button-back");
const buttonNext = document.querySelector(".slider__button-next");
const slides = document.querySelectorAll(".intro__slider-slide");

let shearWidth = +getComputedStyle(wrapper).width.split("px")[0];
let numberSlides = innerWrapper.childElementCount - 1;

let activeSlide = 0;
let timerID;

const timerLogic = () => {
  if (timerID) clearTimeout(timerID);
  timerID = setTimeout(() => {
    innerWrapper.style.transition = "";
  }, 500);
};
const addWidthSlides = () => {
  for (slide of slides) {
    slide.style.width = `${shearWidth}px`;
  }
};
const changeActivePoint = (index) => {
  const activePoint = document.querySelector(".slider__dot_active");
  activePoint.classList.remove("slider__dot_active");
  pagination.children[index].classList.add("slider__dot_active");
  
  index === 0
    ? buttonBack.setAttribute("disabled", "disabled")
    : buttonBack.removeAttribute("disabled");
  
  index === numberSlides
    ? buttonNext.setAttribute("disabled", "disabled")
    : buttonNext.removeAttribute("disabled");
};
const changeActiveSlide = (whereTo) => {
  const indentML = +innerWrapper.style.marginLeft.split("px")[0];
  innerWrapper.style.transition = "margin-left .5s";
  switch (whereTo) {
    case "next":
      if (activeSlide < numberSlides) {
        innerWrapper.style.marginLeft = `${indentML - shearWidth}px`;
        activeSlide = activeSlide + 1;
        buttonBack.removeAttribute("disabled");
      }
      if (activeSlide === numberSlides) {
        buttonNext.setAttribute("disabled", "disabled");
      }
      break;
    case "back":
      if (activeSlide !== 0) {
        innerWrapper.style.marginLeft = `${indentML + shearWidth}px`;
        activeSlide = activeSlide - 1;
        buttonNext.removeAttribute("disabled");
      }
      if (activeSlide === 0) {
        buttonBack.setAttribute("disabled", "disabled");
      }
      break;
  }
  changeActivePoint(activeSlide);
  timerLogic();
};

buttonBack.setAttribute("disabled", "disabled");
addWidthSlides();
for (i = 0; i < innerWrapper.children.length; i++) {
  let newElem = document.createElement("button");
  i === activeSlide
    ? newElem.classList.add("slider__dot", "slider__dot_active")
    : newElem.classList.add("slider__dot");
  const activeIndex = i;
  newElem.addEventListener("click", () => {
    innerWrapper.style.transition = "margin-left .5s";
    innerWrapper.style.marginLeft = `-${activeIndex * shearWidth}px`;
    activeSlide = activeIndex;
    changeActivePoint(activeIndex);
    timerLogic();
  });
  pagination.append(newElem);
}
buttonBack.addEventListener("click", () => changeActiveSlide("back"));
buttonNext.addEventListener("click", () => changeActiveSlide("next"));
window.addEventListener("resize", () => {
  shearWidth = +getComputedStyle(wrapper).width.split("px")[0];
  addWidthSlides();
  if (activeSlide > 0) {
    innerWrapper.style.marginLeft = `-${activeSlide * shearWidth}px`;
  }
});
