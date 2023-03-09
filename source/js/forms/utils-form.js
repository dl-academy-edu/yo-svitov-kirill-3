import {URL, MODAL_CLOSE_BUTTON_SELECTOR} from '../common.js';

const TIME_DELETE_MODAL = 2000;
const SUCCESS_MESSAGE = 'All right';
const SELECTOR_MESSAGE_INVALID = 'message--error';
const INPUT_STATE_SELECTOR_INVALID = 'input-default--invalid-js';
const SELECTOR_MESSAGE_VALID = 'message--success';
const INPUT_STATE_SELECTOR_VALID = 'input-default--valid-js';
const REGULAR_EMAIL = /^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i;
const REGULAR_PHONE = /(\+7|8)[\s(]?(\d{3})[\s)]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/g;
const MODAL_MESSAGE_TEXT_ERROR = 'The form was sent but the server transmits an error: “The form was sent but the server transmits an error”';
const MODAL_MESSAGE_TEXT_SUCCESS = 'Form has been sent successfully';
const MODAL_MESSAGE_INVALID = 'modal-message__text--error';
const MODAL_MESSAGE_VALID = 'modal-message__text--success';
const VALIDATE_FORM = 'validate';
//3 константы которые идут после этого коментария должны называться так как требует этого бэкенд
const NAME_REPEAT_PASSWORD = 'repeatPassword';
const NAME_NEW_PASSWORD = 'newPassword';
const NAME_PASSWORD = 'oldPassword';

function createModalMessage(text, selectorStateModalMessage, selectorButtonCloseModal = MODAL_CLOSE_BUTTON_SELECTOR) {
  const innerModal = `<div class="modal-message__inner-wrap">
    <button class="close-modal" type="button" aria-label="Закрыть окно с сообщением"></button>
    <p class="modal-message__text ${selectorStateModalMessage}">${text}</p>
  </div>`;
  const modal = document.createElement('div');
  modal.classList.add('modal-message');
  modal.classList.add('modal');
  modal.innerHTML = innerModal;

  const buttonCloseModal = modal.querySelector(`.${selectorButtonCloseModal}`);
  buttonCloseModal.addEventListener('click', (e) => {
    modal.remove();
  });

  return modal;
}

function showModalMessage(modal) {
  document.body.append(modal);
}

function removeLaterModalMessage(modal) {
  const timerRemove = setTimeout(() => {
    modal.remove();
    clearTimeout(timerRemove);
  }, TIME_DELETE_MODAL);
}

function closeModalForm(modal, selectorButtonClose) {
  const button = modal.querySelector(`.${selectorButtonClose}`);
  button.click();
}

function formValidation(form, objError = {}) {
  let objInvalidInputs;

  //отчищаем все инпуты в форме от пометок и сообщений
  clearForm(form);

  objInvalidInputs = Object.keys(objError).length ? objError : getInvalidInputs(form);
  const boolean = errorFormHandler(objInvalidInputs, form);

  const objValidInputs = getValidInputs(form);
  successFormHandler(objValidInputs, form);

  return boolean;
}

function clearForm(form, objValid = {
                     selectorMessage: SELECTOR_MESSAGE_VALID,
                     inputState: INPUT_STATE_SELECTOR_VALID
                   },
                   objInvalid = {
                     selectorMessage: SELECTOR_MESSAGE_INVALID,
                     inputState: INPUT_STATE_SELECTOR_INVALID
                   }) {
  removeAllMessages(form, objValid.selectorMessage);
  removeMarkedInputs(form, objValid.inputState);
  removeAllMessages(form, objInvalid.selectorMessage);
  removeMarkedInputs(form, objInvalid.inputState);
}

function getObjDataForm(form) {
  const inputs = [...form.elements];

  let data = {};

  inputs.forEach((input) => {
    if (input.localName === 'button' || input.localName === 'fieldset') return;

    switch (input.type) {
      case 'radio':
        const inputsRadio = [...form.elements[input.name]].find((radio) => radio.checked);
        data[input.name] = inputsRadio.value || '';
        break;

      case 'file':
        data[input.name] = input.files[0] || '';
        break;

      default:
        data[input.name] = input.value || '';
    }
  });

  return data;
}

function getInvalidInputs(form) {
  //получаем все инпуты формы
  const inputs = [...form.elements];

  //создаём пустой рбъект ошибок
  let errors = {};

  //перебираем все полученные инпуты
  inputs.forEach((input) => {
    //если у инпута есть атрибут 'required' то значит этот инпут надо проверить
    //и мы его проверяем
    if (input.hasAttribute('required')) {
      //проверка инпутов будет зависить от их типа
      //поэтому мы проверяем тип инпута
      switch (input.type) {
        //если тип инпута радио
        case 'radio':
          //тогда мы находим в форме все радио с таким же именем
          // и при помощи метода 'find' ищем первый попавшийся выбранный инпут радио
          const inputsRadio = [...form.elements[input.name]].find((radio) => radio.checked);
          //если метод find не нашел ни одного выбраного инпута радио
          //то мы складываем в объект ошибок: имя инпута(в качестве свойства), сам инпут
          //и сообщение об ошибке в качестве значения
          if (!inputsRadio) {
            errors[input.name] = {input: input, message: 'Choose one of the values'};
          } else {
            //если метод find нашел выбранный инпут радио, тогда мы проверяем устраивает ли нас
            //его значение, и если нет, то мы складываем в объект ошибок: имя инпута(в качестве свойства), сам инпут
            //и сообщение об ошибке в качестве значения
            if (inputsRadio.value !== 'yes') {
              errors[input.name] = {input: input, message: 'Choose another value'};
            }
          }
          break;

        case 'password':
          if (!input.value.length) {
            errors[input.name] = {input: input, message: 'This field is required'};
            break;
          }

          if (input.name === NAME_REPEAT_PASSWORD) {
            const form = input.form;
            const repeatPassword = input;
            const newPassword = form.querySelector(`input[name=${NAME_NEW_PASSWORD}]`);
            const password = form.querySelector(`input[name=${NAME_PASSWORD}]`);

            let passwordToCheck = newPassword || password;

            if (repeatPassword.value !== passwordToCheck.value) {
              errors[input.name] = {input: input, message: 'Passwords do not match'};
            }
          }
          break;

        //если тип инпута email
        case 'email':
          //тогда мы проверяем его значение регулярным выражением, и если проверка не прошла
          //мы складываем в объект ошибок: имя инпута(в качестве свойства), сам инпут
          //и сообщение об ошибке в качестве значения
          if (!input.value.match(REGULAR_EMAIL)) {
            errors[input.name] = {
              input: input,
              message: 'Please enter a valid email address (your entry is not in the format "somebody@example.com")'
            };
          }
          break;

        //здесь тоже самое что и с email только tel
        case 'tel':
          if (!input.value.match(REGULAR_PHONE)) {
            errors[input.name] = {
              input: input,
              message: 'Please enter a valid phone (your entry is not in the format "+7-9xx-xxx-xx-xx" or "8-9xx-xxx-xx-xx")'
            };
          }
          break;

        //здесь проверяем все остальные инпуты на пустую строку, и если значение пустая строка
        //то мы складываем в объект ошибок: имя инпута(в качестве свойства), сам инпут
        //и сообщение об ошибке в качестве значения
        default:
          if (!input.value.length) {
            errors[input.name] = {input: input, message: 'This field is required'};
          }
      }
    }
  });

  return errors;
}

function getValidInputs(form, invalidInputStateSelector = INPUT_STATE_SELECTOR_INVALID) {
  //заводим объект под валидные инпуты
  let validInputs = {};

  //находим все элементы в форме
  const inputs = [...form.elements];

  //перебераем все элементы формы
  inputs.forEach((elem) => {
    //проверяем чтобы эти элементы не являлись кнопкой и филдсетом
    if (elem.localName === 'button' || elem.localName === 'fieldset' || elem.type === 'checkbox') return;

    //в таргете мы смотрим, если в форме есть несколько инпутов с одним именем то скорее
    //всего это инпут radio , в этом случае нам надо будет
    //подсветить зеленым родительский элемент, а если нет то подсвечивать будем сам инпут
    const target = form.elements[elem.name].length ? elem.parentElement : form.elements[elem.name];

    //здесь проверяем нет ли на таргете класса с ошибкой, и если нету то это значит что
    //инпут заполнен коректно и добавляем его в наш объект валидных инпутов
    if (!target.classList.contains(invalidInputStateSelector)) {
      validInputs[elem.name] = {
        input: elem,
        message: SUCCESS_MESSAGE
      };
    }
  });

  return validInputs;
}

function errorFormHandler(objError, form) {
  //заведем булевую переменную для того чтобы вернуть её из функци
  let boolean = true;
  //проверяем есть ли у нас ошибки
  if (Object.keys(objError).length) {
    //если есть то берём каждый инпут и показываем под его родителем сообщение об ошибке
    //и подсвечиваем сам инпут красным
    Object.keys(objError)
          .forEach(key => {
            const message = createMessage(objError[key].message || objError[key], SELECTOR_MESSAGE_INVALID);
            showMessage(form.elements[key], message);
            markErrorInput(form.elements[key]);
          });
    //и после показа соощений меняем значение булевой переменной на false
    boolean = false;
  }

  return boolean;
}

function successFormHandler(objSuccess, form) {
  //проверяем пустой у нас объект или нет
  if (Object.keys(objSuccess).length) {
    //если не пустой то берём каждый инпут и показываем под его родителем сообщение, что все
    //хорошо и подсвечиваем сам инпут зеленым
    Object.keys(objSuccess)
          .forEach(key => {
            const message = createMessage(objSuccess[key].message || objSuccess[key], SELECTOR_MESSAGE_VALID);
            showMessage(form.elements[key], message);
            markSuccessInput(form.elements[key]);
          });
  }
}

function markSuccessInput(elem, validInputStateSelector = INPUT_STATE_SELECTOR_VALID, invalidInputStateSelector = INPUT_STATE_SELECTOR_INVALID) {
  const target = elem.length ? elem[0].parentElement : elem;

  if (!target.classList.contains(invalidInputStateSelector)) {
    target.classList.add(validInputStateSelector);
  }
}

function markErrorInput(elem, validInputStateSelector = INPUT_STATE_SELECTOR_VALID, invalidInputStateSelector = INPUT_STATE_SELECTOR_INVALID) {
  const target = elem.length ? elem[0].parentElement : elem;

  target.classList.remove(validInputStateSelector);
  target.classList.add(invalidInputStateSelector);
}

function removeMarkedInputs(form, inputStateSelector) {
  const correctInputs = form?.querySelectorAll(`.${inputStateSelector}`);

  if (correctInputs) {
    [...correctInputs].forEach((input) => input.classList.remove(inputStateSelector));
  }
}

function createMessage(text = '', selectorMessage) {
  const div = document.createElement('div');
  const p = document.createElement('p');

  div.classList.add('message');
  div.classList.add(selectorMessage);
  p.textContent = text;

  div.append(p);
  return div;
}

function showMessage(elem, message) {
  const target = elem?.length ? elem[0] : elem;

  target.parentElement.prepend(message);
}

function removeAllMessages(form, selectorMessage) {
  const messages = form?.querySelectorAll(`.${selectorMessage}`);

  if (messages) {
    [...messages].forEach((message) => message.remove());
  }
}

function showPreloader() {
  document.body.append(createPreloader());

  function createPreloader() {
    const div = document.createElement('div');
    const innerDiv = document.createElement('div');

    div.classList.add('preloader');
    div.append(innerDiv);

    innerDiv.classList.add('preloader__inner');
    return div;
  }
}

function deletePreloader() {
  const preloader = document.querySelector('.preloader');
  preloader.remove();
}

function sendRequestForForm(objOptionsRequest, method = 'GET', resolve, reject) {
  showPreloader();

  let body = JSON.stringify(objOptionsRequest?.body);

  if (objOptionsRequest.typeBody && objOptionsRequest.typeBody === 'formData') {
    body = new FormData(objOptionsRequest?.form);
  }

  fetch(`${URL}${objOptionsRequest.url}`, {
    method: method,
    headers: objOptionsRequest?.headers,
    body: body,
  })
    .then((response) => {
      if (response.ok || response.status === 422 || response.status === 401 || response.status === 400) {
        return response.json();
      } else {
        throw new Error(`status: ${response.status}`);
      }
    })
    .then((response) => {
      if (response.success) {
        if (resolve) {
          resolve(response.data);
        }

        if (objOptionsRequest.form) {
          clearForm(objOptionsRequest.form);
          objOptionsRequest.form.reset();
          closeModalForm(objOptionsRequest.modal, MODAL_CLOSE_BUTTON_SELECTOR);

          const modalMessageSuccess = createModalMessage(MODAL_MESSAGE_TEXT_SUCCESS, MODAL_MESSAGE_VALID);
          showModalMessage(modalMessageSuccess);
          removeLaterModalMessage(modalMessageSuccess);
        }
      } else {
        throw response;
      }
    })
    .catch((error) => {
      console.log(error);
      let modalMessageError;

      if (error._message) {
        clearForm(objOptionsRequest.form);
        modalMessageError = createModalMessage(error._message, MODAL_MESSAGE_INVALID);
        showModalMessage(modalMessageError);
        return;
      }

      if (error.errors && Object.keys(error.errors).length) {
        formValidation(objOptionsRequest.form, error.errors);
        return;
      }

      if (error) {
        modalMessageError = createModalMessage(MODAL_MESSAGE_TEXT_ERROR, MODAL_MESSAGE_INVALID);
        showModalMessage(modalMessageError);
        objOptionsRequest.form.reset();
        clearForm(objOptionsRequest.form);
      }
    })
    .finally(() => deletePreloader());
}

function onFormSubmission(objOptionsRequest, type = VALIDATE_FORM, resolve = null, reject = null) {
  return function (e) {
    e.preventDefault();
    const form = e.target;

    if (type === VALIDATE_FORM) {
      if (!formValidation(form)) return;
    }

    let data = getObjDataForm(form);

    if (objOptionsRequest.extendedData) {
      data = {
        to: 'asd@yandex.ru',
        body: JSON.stringify(data)
      };
    }

    const optionsRequest = {
      url: objOptionsRequest.url,
      headers: objOptionsRequest.headers,
      body: data,
      form: form,
      modal: objOptionsRequest.modal,
      typeBody: objOptionsRequest.typeBody
    };
    sendRequestForForm(optionsRequest, objOptionsRequest.method, resolve, reject);
  };
}

export {
  sendRequestForForm,
  onFormSubmission,
  showPreloader,
  deletePreloader,
};
