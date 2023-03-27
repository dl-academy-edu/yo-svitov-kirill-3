console.log(`userId: `+localStorage.getItem('userId'));

const passwordForm = document.forms.changePasswordForm;
const btnDelete = document.querySelector('.delete-account-js');



// данные профиля
(function() {
	const profileImg = document.querySelector('.profile__avatar');
	const profileDefaultImg = document.querySelector('.profile__avatar-img');	
	const profileName = document.querySelector('.profile__name');
	const profileSurname = document.querySelector('.profile__surname');
	const profileEmail = document.querySelector('.profile__email');
	const profileLocation = document.querySelector('.profile__location');
	const profileAge = document.querySelector('.profile__age');

	const changeDataForm = document.forms.changeDataForm;

	let profile = null;

	
	getProfile();

	function renderProfile() {
		profileImg.style.backgroundImage = `url(${BASE_SERVER_PATH + profile.photoUrl})`;
		profileName.innerText = profile.name;
		profileSurname.innerText = profile.surname;
		profileEmail.innerText = profile.email;
		profileLocation.innerText = profile.location;
		profileAge.innerText = profile.age;
		if(profileImg) {
			profileDefaultImg.classList.toggle('close');
		}
	}

	function getProfile() {
		showLoader();
		sendRequest({
			method: 'GET',
			url: `/api/users/${localStorage.getItem('userId')}`,
		})
		.then((res) => res.json())
		.then((res) => {
			if(res.success) {
				profile = res.data;
				renderProfile();
				hideLoader();
			} else {
				throw new Error(`${res.status} ${res.message}`)
			};
		})
		.catch((err) => {

		})
		
	}
	
    // изменение данных
	const changeData = (e) => {
		e.preventDefault();
		const data = new FormData(changeDataForm);
		showLoader();
		showLoader();
		sendRequest({
			method: 'PUT',
			url: '/api/users',
			body: data,
			headers: {
				'x-access-token': localStorage.getItem('token'),
			}
		})
		.then(res => {
			if(res.status === 401 || res.status === 403) {
				localStorage.removeItem('token');
				localStorage.removeItem('userId');
				location.pathname = '/';
				return;
			}
			return res.json();
		})
		.then(res => {
			if(res.success) {
				profile = res.data;
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
		})
		.finally(() => {
			popupChangeData.classList.remove('open');
			setTimeout(reloadPage, 2000);
		})
		
	}

	openChangeData.addEventListener('click', () => {
		changeDataForm.email.value = profile.email;
		changeDataForm.name.value = profile.name;
		changeDataForm.surname.value = profile.surname;
		changeDataForm.location.value = profile.location;
		changeDataForm.age.value = profile.age;
		popupChangeData.classList.add('open');
		
	});

	buttonCloseChangeData.addEventListener('click', function() {
		popupChangeData.classList.remove('open');
	});

	popupChangeData.addEventListener('submit', changeData);
})();

// форма смены пароля
(function changePassword() {

	const password = (e) => {
		e.preventDefault();
		

		let errors = {};
		let truths = {};

		clearErrors(passwordForm);
		clearTruths(passwordForm);

		const data = new FormData(passwordForm);

		const oldPassword = passwordForm.oldPassword.value;
		const newPassword = passwordForm.newPassword.value;
		const repeatPassword = passwordForm.repeatPassword.value;

		if(newPassword.length < 6) {
			errors.newPassword = 'Enter your password';
		} else {
			truths.newPassword = 'All right';
		}

		if(oldPassword.length < 6) {
			errors.oldPassword = 'Enter your password';
		} else {
			truths.oldPassword = 'Password is correct';
		}

		if(newPassword === repeatPassword) {
			truths.repeatPassword = 'Passwords match';
		} else { 
			errors.repeatPassword = 'Passwords do not match';
		}

		if(Object.keys(truths).length) {
			Object.keys(truths).forEach((key) => {
				const messageTrurh = truths[key];
				const input = passwordForm.elements[key];
				setTruthText(input, messageTrurh);
			})
		}	
		if(Object.keys(errors).length) {
			Object.keys(errors).forEach((key) => {
				const messageError = errors[key];
				const input = passwordForm.elements[key];
				setErrorText(input, messageError);
			})
			return;
		}


		showLoader();
		showLoader();
		sendRequest({
			url: '/api/users',
			method: 'PUT',
			body: data,
			headers: {
				'x-access-token': localStorage.getItem('token'),
				'userId': localStorage.getItem('userId'),
			},
		})
		.then(res => {
			if(res.status === 401 || res.status === 403) {
				return;
			}
			return res.json();
		})
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
				alert(err._message);
			}
			clearErrors(passwordForm);
		})
		.finally(() => {
			popupChangePassword.classList.remove('open');
			passwordForm.reset();
			clearErrors(passwordForm);
			clearTruths(passwordForm);
			setTimeout(reloadPage, 2000);
		})
	}

	popupChangePassword.addEventListener('submit', password);
})();


// замена имени файл инпута
(function changeInputName() {
	const changeDataForm = document.forms.changeDataForm;

	if(!changeDataForm) return;
	const inputFile = changeDataForm.elements.avatar;
	const inputFileName = document.querySelector(".input-file-name");	
  
	inputFile.addEventListener("change", function (e) {
	  	let fileName = this.files[0].name;
		const fileNameCorrect = trimFileName(fileName);
	  	if(fileNameCorrect) {
			inputFileName.innerHTML = '';
			inputFileName.innerHTML = fileNameCorrect;
	  	}
	});
})();

function trimFileName(fileName) {
	let delimiter = fileName.lastIndexOf('.');
	let extension = fileName.substr(delimiter);
	let file = fileName.substr(0, delimiter);

	let fileNameLen = 10; 
	return (file.length > fileNameLen ? file.substr(0, fileNameLen) + "..." : file) + extension;
};

// удаление аккаунта
btnDelete.addEventListener('click', function() {
	const isLogin = localStorage.getItem('token');

	if(isLogin) rerenderLinks();
	showLoader();
	showLoader();
	sendRequest({
		method: 'DELETE',
		url: `/api/users/${localStorage.getItem('userId')}`,
		headers: {
			'x-access-token': localStorage.getItem('token'),
		},
	})
	.then(res => res.json())
	.then(res => {
		localStorage.removeItem('token', res.data.token);
		localStorage.removeItem('userId', res.data.userId);
		popupSuccess.classList.add('open');
				hideLoader();
				setTimeout(() => {
					popupSuccess.classList.remove('open')
					popupWrap.classList.remove('open');
				}, 2000);
		setTimeout(goToMain, 1000);
	})
	.catch(err => {
		popupError.classList.add('open');
				hideLoader();
				setTimeout(() => {
					popupError.classList.remove('open')
					popupWrap.classList.remove('open');
				}, 2000);
				
	})
});


openChangeData.addEventListener('click', function () {
	popupChangeData.classList.add('open');
	popupWrap.classList.add('open');
})

buttonCloseChangeData.addEventListener('click', function () {
	popupChangeData.classList.remove('open');
	popupWrap.classList.remove('open');
})

openChangePassword.addEventListener('click', function () {
	popupChangePassword.classList.add('open');
	popupWrap.classList.add('open');
})

buttonCloseChangePassword.addEventListener('click', function () {
	popupChangePassword.classList.remove('open');
	popupWrap.classList.remove('open');
})

const footer = document.querySelector('.footer');

footer.classList.add('close');
