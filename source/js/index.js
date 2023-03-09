import {
  onFormSubmission,
} from './forms/utils-form.js';

import {
  accessToSubmitButton,
  resolveFormSignIn,
  renderLinks,
  signOut,
  activeModalForm
} from './common.js';

renderLinks();

const formSignInModal = document.querySelector('.sign-in__form');
const modalSignIn = document.querySelector('.sign-in');
const formRegisterModal = document.querySelector('.register__form');
const modalRegister = document.querySelector('.register');
const formMessageModal = document.querySelector('.message__form');
const modalMessage = document.querySelector('.message');

const ITEM_OPEN_SIGN_IN_MODAL = 'header__item--sign-in-js';
const ITEM_OPEN_SIGN_OUT_MODAL = 'header__item--sign-out-js';
const ITEM_OPEN_REGISTER_MODAL = 'header__item--register-js';
const BUTTON_OPEN_MESSAGE_MODAL = 'footer__message-button--js';

document.addEventListener('click', (e) => {
  const target = e.target;

  
  if (target.closest(`.${ITEM_OPEN_SIGN_IN_MODAL}`)) {
    const objRemoveEvent = {
      formSignInModal: {
        element: formSignInModal,
        event: 'submit',
        callback: onFormSubmission
      }
    };

    activeModalForm(modalSignIn, objRemoveEvent);

    const optionsRequestSignIn = {
      url: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      modal: modalSignIn
    };

    formSignInModal.addEventListener('submit', onFormSubmission(optionsRequestSignIn, 'validate', resolveFormSignIn));
  }

  if (target.closest(`.${ITEM_OPEN_SIGN_OUT_MODAL}`)) {
    signOut();
  }

  if (target.closest(`.${ITEM_OPEN_REGISTER_MODAL}`)) {
    const objEventButtonSubmit = accessToSubmitButton(formRegisterModal);

    const objRemoveEvent = {
      ...objEventButtonSubmit,
      formRegisterModal: {
        element: formRegisterModal,
        event: 'submit',
        callback: onFormSubmission
      }
    };

    activeModalForm(modalRegister, objRemoveEvent);

    const optionsRequestRegister = {
      url: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      modal: modalRegister,
    };

    formRegisterModal.addEventListener('submit', onFormSubmission(optionsRequestRegister));
  }

  if (target.closest(`.${BUTTON_OPEN_MESSAGE_MODAL}`)) {
    const objEventButtonSubmit = accessToSubmitButton(formMessageModal);

    const objRemoveEvent = {
      ...objEventButtonSubmit,
      formMessageModal: {
        element: formMessageModal,
        event: 'submit',
        callback: onFormSubmission
      }
    };

    activeModalForm(modalMessage, objRemoveEvent);

    const optionsRequestSignIn = {
      url: '/api/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      modal: modalMessage,
      extendedData: true
    };

    formMessageModal.addEventListener('submit', onFormSubmission(optionsRequestSignIn, 'validate'));
  }
});

const button = docElement.querySelector('.header__burger-button');
const nav = docElement.querySelector('.header__nav');

const BUTTON_CLOSE = 'header__burger-button--close';
const BUTTON_OPEN = 'header__burger-button--open';
const NAV_DISABLED = 'hidden';
const NAV_ACTIVE = 'header__nav--active';

if (!nav.classList.contains(NAV_DISABLED)) {
  nav.classList.add(NAV_DISABLED);
}

button.addEventListener('click', onBurgerClick);

function onBurgerClick(e) {
  const target = e.currentTarget;

  if (!target.classList.contains(BUTTON_OPEN) && !target.classList.contains(BUTTON_CLOSE)) {
    target.classList.toggle(BUTTON_OPEN);


    nav.classList.toggle(NAV_DISABLED);
    const timeoutShow = setTimeout(() => {
      nav.classList.toggle(NAV_ACTIVE);
      clearTimeout(timeoutShow);
    }, 0);

    return;
  }

  target.classList.toggle(BUTTON_CLOSE);
  target.classList.toggle(BUTTON_OPEN);


  nav.classList.toggle(NAV_ACTIVE);
  const timeoutDisabled = setTimeout(() => {
    nav.classList.toggle(NAV_DISABLED);
    clearTimeout(timeoutDisabled);
  }, 0);
}
