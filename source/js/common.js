const URL = 'https://academy.directlinedev.com';
const MODAL_CLOSE_BUTTON_SELECTOR = 'close-modal';
const SELECTOR_AGREEMENT_CHECKBOX = 'input[name=agreement]';
const SELECTOR_BUTTON_SUBMIT = 'button[type=submit]';

function activeButtonSubmit(e) {
  const target = e.target;
  const form = target.form;
  const buttonSubmit = form.querySelector(SELECTOR_BUTTON_SUBMIT);
  buttonSubmit.disabled = !target.checked;
}

function accessToSubmitButton(form) {
  const agreementCheckbox = form.querySelector(SELECTOR_AGREEMENT_CHECKBOX);
  if (agreementCheckbox) {
    const buttonSubmit = form.querySelector(SELECTOR_BUTTON_SUBMIT);
    buttonSubmit.disabled = true;
    agreementCheckbox.addEventListener('click', activeButtonSubmit);

    return {
      agreementCheckbox: {
        element: agreementCheckbox,
        event: 'click',
        callback: activeButtonSubmit
      }
    };
  }
}

function resolveFormSignIn(data) {
  saveDataUser(data);
  renderLinks();
}

function getNumbersFromString(str) {
  return str.match(/(\d+(\.\d+)?)/g)
            .map(v => +v);
}

function renderLinks(selectorHiddenItem = 'hide-completely') {
  const itemSign = document.querySelector('.header__item--sign-in-js');
  const itemRegister = document.querySelector('.header__item--register-js');
  const itemProfile = document.querySelector('.header__item--profile-js');
  const itemSignOut = document.querySelector('.header__item--sign-out-js');

  if (localStorage.token) {
    itemSign.classList.add(selectorHiddenItem);
    itemRegister.classList.add(selectorHiddenItem);
    itemProfile.classList.remove(selectorHiddenItem);
    itemSignOut.classList.remove(selectorHiddenItem);
  } else {
    itemSign.classList.remove(selectorHiddenItem);
    itemRegister.classList.remove(selectorHiddenItem);
    itemProfile.classList.add(selectorHiddenItem);
    itemSignOut.classList.add(selectorHiddenItem);
  }
}

function activeModalForm(modal, objEvent, selectorButtonCloseModal = MODAL_CLOSE_BUTTON_SELECTOR, selectorHiddenModal = 'hidden') {
  modal.classList.remove(selectorHiddenModal);

  const forms = [...modal.querySelectorAll('form')];
  const formActive = forms.find((form) => {
    return !form.classList.contains(selectorHiddenModal);
  });
  formActive.querySelector('input')
            .focus();

  const buttonCloseForm = modal.querySelector(`.${selectorButtonCloseModal}`);
  buttonCloseForm.addEventListener('click', closePopupButtonClick);

  document.addEventListener('keyup', closePopupKeyup);

  function closePopupButtonClick() {
    modal.classList.add(selectorHiddenModal);

    this.removeEventListener('click', closePopupButtonClick);
    modal.removeEventListener('keyup', closePopupKeyup);

    removeHandlers(objEvent);
  }

  function closePopupKeyup(e) {
    if (e.code === 'Escape') {
      modal.classList.add(selectorHiddenModal);

      document.removeEventListener('keyup', closePopupKeyup);
      buttonCloseForm.removeEventListener('click', closePopupButtonClick);

      removeHandlers(objEvent);
    }
  }
}

function removeHandlers(objEvent) {
  if (objEvent) {
    Object.keys(objEvent)
          .forEach((nameElement) => {
            objEvent[nameElement].element.removeEventListener(`${objEvent[nameElement].event}`, objEvent[nameElement].callback);
          });
  }
}

function signOut() {
  deleteDataUser();
  location.pathname = '/';
}

function saveDataUser(data) {
  localStorage.userId = data.userId;
  localStorage.token = data.token;
}

function deleteDataUser() {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
}

export {
  accessToSubmitButton,
  resolveFormSignIn,
  getNumbersFromString,
  renderLinks,
  signOut,
  activeModalForm,
  deleteDataUser,
  MODAL_CLOSE_BUTTON_SELECTOR,
  URL
};
