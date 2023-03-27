const popupWrap = document.querySelector('.popup-wrap');
const isLogin = localStorage.getItem('token');
const loader = document.querySelector('.loader-wrap');

const loginForm = document.forms.SignIn;
const btnSignIn = document.querySelector('.btn__signin_js');
const popupLogin = document.querySelector('.popup-sign-in');
const btnLoginClose = document.querySelector('.popup-sign-in__close');

const btnLogOut = document.querySelector('.buttonLogOut-js');
const btnLogOutMobile = document.querySelector('.buttonLogOutMobile-js');

const registerForm = document.forms.register;

const messageForm = document.forms.messageForm;

const popupSuccess = document.querySelector('.form-success');
const popupError = document.querySelector('.form-unsuccess');

const openMenuBtn = document.querySelector('.open__menu_js');
const closeMenuBtn = document.querySelector('.close__menu_js');



// авторизация
(function initLogin() {
	const isLogin = localStorage.getItem('token');

	if(isLogin) rerenderLinks();

	const login = (e) => {
		e.preventDefault();

		let data = {};
		let errors = {};
		let truths = {};

		data.email = loginForm.email.value;
		data.password = loginForm.password.value;

		clearErrors(loginForm);
		clearTruths(loginForm);

		if(!isEmailValid(data.email)) {
			errors.email = 'Please enter a valid email address (your entry is not in the format "somebody@example.com")';
		} else {
			truths.email = 'All right';
		}
		
		if(data.password.length < 6) {
			errors.password = 'Please increase your password';
		} else {
			truths.password = 'All right';
		}

		if(Object.keys(truths).length) {
			Object.keys(truths).forEach((key) => {
				const messageTrurh = truths[key];
				const input = loginForm.elements[key];
				setTruthText(input, messageTrurh);
			})
		}	
		if(Object.keys(errors).length) {
			Object.keys(errors).forEach((key) => {
				const messageError = errors[key];
				const input = loginForm.elements[key];
				setErrorText(input, messageError);
			})
			return;
		}

		showLoader();
		showLoader();
		sendRequest({
			method: 'POST',
			url: '/api/users/login',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(res => {
			if(res.success) {
				popupSuccess.classList.add('open');
				hideLoader();
				setTimeout(() => {
					popupSuccess.classList.remove('open')
					popupWrap.classList.remove('open');
				}, 2000);
                
			} else {
				throw res;
			}
			localStorage.setItem('token', res.data.token);
			localStorage.setItem('userId', res.data.userId);
			rerenderLinks();
		})
		.catch(err => {
			popupError.classList.add('open');
			hideLoader();
			setTimeout(() => {
				popupError.classList.remove('open')
				popupWrap.classList.remove('open');
			}, 2000);

			clearTruths(loginForm);
			clearErrors(loginForm);
		})
		.finally(() => {
				popupLogin.classList.remove('open');
		})
		
	}
	
	loginForm.addEventListener('submit', login);
})();


// регистрация
(function registration() {
	const isLogin = localStorage.getItem('token');

	if(isLogin) rerenderLinks();

	const register = (e) => {
		e.preventDefault();

		let data = {};
		let errors = {};
		let truths = {};

		data.email = registerForm.email.value;
		data.name = registerForm.name.value;
		data.surname = registerForm.surname.value;
		data.password = registerForm.password.value;
		data.repeatPassword = registerForm.repeatPassword.value;
		data.location = registerForm.location.value;
		data.age = +registerForm.age.value;

		clearErrors(registerForm);
		clearTruths(registerForm);

		if(!isEmailValid(data.email)) {
			errors.email = 'Please enter a valid email address (your entry is not in the format "somebody@example.com")';
		} else {
			truths.email = 'All right';
		}
		
		if(data.password.length < 6) {
			errors.password = 'Enter your password';
		} else {
			truths.password = 'All right';
		}

		if(!data.repeatPassword) {
			errors.repeatPassword = 'Enter your password again';
		} else {
			if(data.repeatPassword === data.password) {
				truths.repeatPassword = 'Passwords match';
			} else { 
				errors.repeatPassword = 'Passwords do not match';
			}
		}
		
		if(data.name.length === 0) {
			errors.name = 'This field is required';
		} else if(data.name.length < 3) {
			errors.name = 'The name is too short';
		} else {
			truths.name = 'All right';
		}

		if(!data.surname.length) {
			errors.surname = 'This field is required';
		} else if(data.surname.length < 3) {
			errors.surname = 'The surname is too short';
		} else {
			truths.surname = 'All right';
		}
		
		if(!data.location.length) {
			errors.location = 'This field is required';
		} else if(data.location.length <= 3) {
			errors.location = 'This location is too short';
		} else {
			truths.location = 'All right';
		}
		
		if(!data.age) {
			errors.age = 'This field is required';
		} else if(data.age < 18) {
			errors.age = 'This age is too short';
		} else {
			truths.age = 'All right';
		}
		
		if(Object.keys(truths).length) {
			Object.keys(truths).forEach((key) => {
				const messageTrurh = truths[key];
				const input = registerForm.elements[key];
				setTruthText(input, messageTrurh);
			})
		}	
		if(Object.keys(errors).length) {
			Object.keys(errors).forEach((key) => {
				const messageError = errors[key];
				const input = registerForm.elements[key];
				setErrorText(input, messageError);
			})
			return;
		}

		showLoader();
		showLoader();
		sendRequest({
			method: 'POST',
			url: '/api/users',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(res => {
			if(res.success) {
				popupSuccess.classList.add('open');
				hideLoader();
				setTimeout(() => {
					popupSuccess.classList.remove('open')
					popupWrap.classList.remove('open');
				}, 2000);
			} else {
				throw res;
			}
			localStorage.setItem('token', res.data.token);
			localStorage.setItem('userId', res.data.userId);
			rerenderLinks();
		})
		.catch(err => {
			popupError.classList.add('open');
			hideLoader();
			setTimeout(() => {
				popupError.classList.remove('open')
				popupWrap.classList.remove('open');
			}, 2000);
		})
		.finally(() => {
			popupRegister.classList.remove('open');
		})
	}

	
	registerForm.addEventListener('submit', register);
})();


// выход из профиля
btnLogOut.addEventListener('click', function() {
	localStorage.removeItem('token');
	rerenderLinks();
	location.pathname = '/';
});

btnLogOutMobile.addEventListener('click', function() {
	localStorage.removeItem('token');
	rerenderLinks();
	location.pathname = '/';
});


// перерисовка хедера
function rerenderLinks() {
	const isLogin = localStorage.getItem('token');
	const btnSignIn = document.querySelector('.buttonOpenSignIn-js');
	const btnSignInMobile = document.querySelector('.buttonOpenSignInMobile-js');
	const registerButton = document.querySelector('.buttonOpenRegister-js');
	const registerButtonMobile = document.querySelector('.buttonOpenRegisterMobile-js');
	const toProfileButton = document.querySelector('.buttonOpenProfile-js');
	const toProfileButtonMobile = document.querySelector('.buttonOpenProfileMobile-js');
	const btnLogOut = document.querySelector('.buttonLogOut-js');
	const btnLogOutMobile = document.querySelector('.buttonLogOutMobile-js');
	

	if(isLogin) {
		btnSignIn.classList.add('close');
		btnSignInMobile.classList.add('close');
		registerButton.classList.add('close');
		registerButtonMobile.classList.add('close');
		toProfileButton.classList.remove('close');
		toProfileButtonMobile.classList.remove('close');
		btnLogOut.classList.remove('close');
		btnLogOutMobile.classList.remove('close');
	} 
	else {
		btnSignIn.classList.remove('close');
		btnSignInMobile.classList.remove('close');
		registerButton.classList.remove('close');
		registerButtonMobile.classList.remove('close');
		toProfileButton.classList.add('close');
		toProfileButtonMobile.classList.add('close');
		btnLogOut.classList.add('close');
		btnLogOutMobile.classList.add('close');
	}
};

// отправка сообщения
(function sendMessage() {

	const message = (e) => {
		e.preventDefault();

		let data = {};
		let errors = {};
		let truths = {};

		data.name = messageForm.name.value;
		data.email = messageForm.email.value;
		data.theme = messageForm.theme.value;
		data.phone = messageForm.phone.value;
		data.message = messageForm.message.value;

		let newData = {
			to: messageForm.email.value,
			body: JSON.stringify(data),
		};

		clearErrors(messageForm);
		clearTruths(messageForm);

		if(data.name.length === 0) {
			errors.name = 'Enter name';
		} else if(data.name.length < 3) {
			errors.name = 'The name is too short';
		} else {
			truths.name = 'All right';
		}
		
		if(data.theme.length < 4) {
			errors.theme = 'Enter subject';
		} else {
			truths.theme = 'All right';
		}
		
		if(!isEmailValid(data.email)) {
			errors.email = 'Please enter a valid email address (your entry is not in the format "somebody@example.com")';
		} else {
			truths.email = 'All right';
		}

		if(!data.phone) {
			errors.phone = 'Enter phone number';
		} else if(!isNumberValid(data.phone)) {
			errors.phone = 'Phone number entered incorrectly';
		} else {
			truths.phone = 'All right';
		}

		if(!data.message.length) {
			errors.message = 'Enter message';
		} else if(data.message.length < 15) {
			errors.message = 'Add something else';
		} else {
			truths.message = 'Thank you!';
		}

		
		if(Object.keys(truths).length) {
			Object.keys(truths).forEach((key) => {
				const messageTrurh = truths[key];
				const input = messageForm.elements[key];
				setTruthText(input, messageTrurh);
			})
		}	
		if(Object.keys(errors).length) {
			Object.keys(errors).forEach((key) => {
				const messageError = errors[key];
				const input = messageForm.elements[key];
				setErrorText(input, messageError);
			})
			return;
		}

		showLoader();
		showLoader();
		showLoader();
		sendRequest({
			method: 'POST',
			url: '/api/emails',
			body: JSON.stringify(newData),
			headers: {
				"Content-Type": "application/json",
			}
		})
		.then(res => res.json())
		.then(res => {
			if(res.success) {
				popupSuccess.classList.add('open');
				hideLoader();
				setTimeout(() => {
					popupSuccess.classList.remove('open')
					popupWrap.classList.remove('open');
				}, 2000);
			} else {
				throw res;
			}
		})
		.catch(err => {
			popupError.classList.add('open');
				hideLoader();
				setTimeout(() => {
					popupError.classList.remove('open')
					popupWrap.classList.remove('open');
				}, 2000);
			if(err._message) {
				popupError.classList.add('open');
				hideLoader();
				setTimeout(() => {
					popupError.classList.remove('open')
					popupWrap.classList.remove('open');
				}, 2000);
			}
		})
		.finally(() => {
			popupMessage.classList.remove('open');
			messageForm.reset();
			clearErrors(messageForm);
			clearTruths(messageForm);
		})
	}
	
	messageForm.addEventListener('submit', message);
})();

// лоадер
function showLoader() {
	loader.classList.remove('close');
};

function hideLoader() {
	loader.classList.add('close');
};

