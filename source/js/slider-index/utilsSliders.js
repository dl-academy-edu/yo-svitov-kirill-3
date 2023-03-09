function createControls(numberControls, itemControl, selectorActive, start, type) {
  const result = [];

  for (let i = 0; i < numberControls; i++) {
    const item = itemControl.cloneNode(true);
    const buttonControl = item.querySelector('button');

    buttonControl.setAttribute('aria-label', `Переключить на ${i + 1} слайдер`);
    buttonControl.dataset.buttonNumber = i.toString();

    if (type === 'numbers') {
      buttonControl.textContent = i + 1;
    }

    // Делаем все кнопки слайдера не активными
    if (buttonControl.classList.contains(selectorActive)) {
      buttonControl.classList.remove(selectorActive);
    }

    result.push(item);
  }

  // делаем одну кнопку активной
  result[start].querySelector('button')
               .classList
               .add(selectorActive);

  return result;
}

function hideSlide({parentSlides, selectorActive, selectorHidden}, prevSlide, time) {
  const previousSlide = parentSlides.children[prevSlide];

  // Прячем текущий слайдер
  previousSlide.classList.remove(selectorActive);
  // Если слайд спрятан, то убераем его доступность
  const timeout = setTimeout(() => {
    if (!previousSlide.classList.contains(selectorActive)) {
      previousSlide.classList.add(selectorHidden);
    }
    clearTimeout(timeout);
  }, time);
}

function showSlide({parentSlides, selectorActive, selectorHidden}, numberSlide, time) {
  const currentSlide = parentSlides.children[numberSlide];

  // Делаем следующий слайд доступным
  currentSlide.classList.remove(selectorHidden);
  // Показываем следующий слайд
  const timeout = setTimeout(() => {
    currentSlide.classList.add(selectorActive);
    clearTimeout(timeout);
  }, time);
}

function changeCounterArrows({parentSlides, step, visibleSlides, counter}, side) {
  let count = counter;

  switch (side) {
    case 'left':
      return count -= Math.min(step, parentSlides.children.length - (parentSlides.children.length - counter));

    case 'right':
      return count += Math.min(step, parentSlides.children.length - counter - visibleSlides);
  }
}

function makeDotActive(parentDots, prevDot, currentDot, selectorActive) {
  parentDots.children[prevDot].querySelector('button')
                              .classList
                              .remove(selectorActive);
  parentDots.children[currentDot].querySelector('button')
                                 .classList
                                 .add(selectorActive);
}

function checkLeftSlide(counter, step) {
  return counter + 1 - step <= 0;
}

function checkRightSlide(parentSlides, counter, step) {
  return counter + step >= parentSlides.children.length;
}

export {
  createControls,
  hideSlide,
  showSlide,
  changeCounterArrows,
  makeDotActive,
  checkLeftSlide,
  checkRightSlide,
};
