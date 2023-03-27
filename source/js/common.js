const BASE_SERVER_PATH = 'https://academy.directlinedev.com';

// все для попапов

const popup = document.querySelector('.popup-sign-in');
const buttonOpen = document.querySelector('.buttonOpenSignIn-js');
const buttonOpenMobile = document.querySelector('.buttonOpenSignInMobile-js');
const buttonClose = document.querySelector('.popup-sign-in__close');
const popupRegister = document.querySelector('.popup-register');
const buttonOpenRegister = document.querySelector('.buttonOpenRegister-js');
const buttonOpenRegisterMobile = document.querySelector('.buttonOpenRegisterMobile-js');
const btnRegisterClose = document.querySelector('.popup-register__close');
// переменные даты здесь а код в конце профиля(на всякий случай)
const buttonCloseChangeData = document.querySelector('.popup-change-data__close');
const popupChangeData = document.querySelector('.popup-change-data');
const openChangeData = document.querySelector('.change-data-form-open-js');
// переменные смены пароля
const popupChangePassword = document.querySelector('.popup-change-password');
const openChangePassword = document.querySelector('.change-password-form-open-js');
const buttonCloseChangePassword = document.querySelector('.popup-change-password__close');
// отправка сообщения
const popupMessage = document.querySelector('.popup-message');
const buttonOpenMessage = document.querySelector('.buttonOpenMessage-js');
const btnMessageClose = document.querySelector('.popup-message__close');

// проверка нажатия чекбокса для отправки формы
const registerCheckbox = document.querySelector('.popup-register__accept-checkbox');
const registerSubmitDisabled = document.querySelector('.register-submit-disabled');
const registerSubmitNormal = document.querySelector('.register-submit-normal');

registerCheckbox.addEventListener('change', () => {
	if (registerCheckbox.checked) {
		registerSubmitDisabled.classList.add('close');
		registerSubmitNormal.classList.remove('close');
	} else {
		registerSubmitDisabled.classList.remove('close');
		registerSubmitNormal.classList.add('close');
	}
});


const messageCheckbox = document.querySelector('.popup-message__accept-checkbox');
const messageSubmitDisabled = document.querySelector('.message-submit-disabled');
const messageSubmitNormal = document.querySelector('.message-submit-normal');

messageCheckbox.addEventListener('change', () => {
	if (messageCheckbox.checked) {
		messageSubmitDisabled.classList.add('close');
		messageSubmitNormal.classList.remove('close');
	} else {
		messageSubmitDisabled.classList.remove('close');
		messageSubmitNormal.classList.add('close');
	}
});
// 

		// сообщения
        const popupSuccessClose = document.querySelector('.form-success-close');
		const popupErrorClose = document.querySelector('.form-unsuccess-close');
        

        popupSuccessClose.addEventListener('click', function () {
            popupSuccess.classList.remove('open');
            popupWrap.classList.remove('open');
        })

        window.addEventListener('keydown', function(event) {
            if(event.code === "Escape" && popupSuccess.classList.contains('open')) {
                popupSuccess.classList.remove('open');
            }
        })


		popupErrorClose.addEventListener('click', function () {
			popupError.classList.remove('open');
			popupWrap.classList.remove('open');
		})

		window.addEventListener('keydown', function(event) {
			if(event.code === "Escape" && popupError.classList.contains('open')) {
				popupError.classList.remove('open');
			}
		})



buttonOpenRegister.addEventListener('click', function () {
	popupRegister.classList.add('open');
	popupWrap.classList.add('open');
})

buttonOpenRegisterMobile.addEventListener('click', function () {
	popupRegister.classList.add('open');
	popupWrap.classList.add('open');
})

btnRegisterClose.addEventListener('click', function () {
	popupRegister.classList.remove('open');
    popupWrap.classList.remove('open');
})

buttonOpenMessage.addEventListener('click', function () {
	popupMessage.classList.add('open');
	popupWrap.classList.add('open');
})

btnMessageClose.addEventListener('click', function () {
	popupMessage.classList.remove('open');
    popupWrap.classList.remove('open');
})

buttonOpen.addEventListener('click', function () {
	popup.classList.add('open');
    popupWrap.classList.add('open');
})

buttonClose.addEventListener('click', function () {
    popupWrap.classList.remove('open');
})

buttonClose.addEventListener('click', function () {
    popup.classList.remove('open');
	popupWrap.classList.remove('open');
})

buttonOpenMobile.addEventListener('click', function () {
	popup.classList.add('open');
    popupWrap.classList.add('open');
})

window.addEventListener('keydown', function(event) {
    if(event.code === "Escape" && popupWrap.classList.contains('open')) {
        popupWrap.classList.remove('open');
		popup.classList.remove('open');
		popupRegister.classList.remove('open');
		popupMessage.classList.remove('open');
		popupChangePassword.classList.remove('open');
		popupChangeData.classList.remove('open');
    }
})


// создание ошибок
const errorCreator = (message) => {
	let messageErrorDiv = document.createElement('div');
	messageErrorDiv.classList.add('invalid-feedback');
	messageErrorDiv.innerText = message;
	return messageErrorDiv;
};
const setErrorText = (input, errorMessage) => {
	const error = errorCreator(errorMessage);
	input.classList.add('is-invalid');
	input.insertAdjacentElement('afterend', error);
	input.addEventListener('input', () => {
		error.remove();
		input.classList.remove('is-invalid');
	});
};

// создание успеха
const truthCreator = (message) => {
	let messageTruthDiv = document.createElement('div');
	messageTruthDiv.classList.add('excellent-feedback'); 
	messageTruthDiv.innerText = message;
	return messageTruthDiv;
};
const setTruthText = (input, truthMessage) => {
	const truth = truthCreator(truthMessage);
	input.classList.add('is-excellent'); 
	input.insertAdjacentElement('afterend', truth);
	input.addEventListener('input', () => {
		truth.remove();
		input.classList.remove('is-excellent'); 
	});
};

// очистка ошибок и успеха
function clearErrors(element) {
	const messageError = element.querySelectorAll('.invalid-feedback');
	const inputError = element.querySelectorAll('.is-invalid');
	messageError.forEach(message => message.remove());
	inputError.forEach(invalid => invalid.classList.remove('is-invalid'));
};
function clearTruths(element) {
	const messageTruth = element.querySelectorAll('.excellent-feedback');
	const inputTruth = element.querySelectorAll('.is-excellent');
	messageTruth.forEach(message => message.remove());
	inputTruth.forEach(invalid => invalid.classList.remove('is-excellent'));
};


// email
function isEmailValid(email) {
	return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
};


// phone
function isNumberValid(phone) {
	return phone.match(/^\d[\d\(\)\ -]{4,14}\d$/);
};


// отправка на бэк
function sendRequest ({url, method = 'GET', headers, body = null}) {
	return fetch(BASE_SERVER_PATH + url + '?v=0.0.1', {
		method,
		headers,
		body,
	})
};

function interactionModal(modal) {
    popupWrap.classList.toggle('close');
    modal.classList.toggle('close');
}

function closeEsc(modal) {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            popupWrap.classList.add('close');
            modal.classList.add('close');
        }
    })
}


// бургер 

let menuBtn = document.querySelector('.header__burger');
let menu = document.querySelector('.header__burger-menu');

menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
})

// кнопка скрола наверх

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

function reloadPage() {
	location.reload();
};

function goToMain() {
	location.pathname = '/';
};