import {
  renderLinks,
  URL,
  deleteDataUser
} from '../../common.js';

function onSuccessDelete(data) {
  changesUserData(data, '');
  location.pathname = '/';
  deleteDataUser();
  renderLinks();
}

function onSuccessFormData(data) {
  changesUserData(data);
}

function getOnChangeFileFunction(labelFileCustom) {
  return function (e) {
    const target = e.target;
    const file = target.files[0];

    if (file) {
      labelFileCustom.innerText = file.name;
    }
  };
}

function changesUserData(dataUser, type = 'fill') {
  const profile = document.querySelector('.profile--js');
  const img = profile.querySelector('.profile__img--js');
  const name = profile.querySelector('.profile__value--name-js');
  const surname = profile.querySelector('.profile__value--surname-js');
  const email = profile.querySelector('.profile__value--email-js');
  const locationUser = profile.querySelector('.profile__value--location-js');
  const age = profile.querySelector('.profile__value--age-js');

  if (type === 'fill' && dataUser) {
    name.textContent = dataUser.name;
    surname.textContent = dataUser.surname;
    email.textContent = dataUser.email;
    locationUser.textContent = dataUser.location;
    age.textContent = dataUser.age;
    img.src = `${URL}${dataUser.photoUrl}`;
    return;
  }

  name.textContent = '';
  surname.textContent = '';
  email.textContent = '';
  locationUser.textContent = '';
  age.textContent = '';
  img.src = './img/svg/no-photo.svg';
}

export {
  onSuccessDelete,
  onSuccessFormData,
  getOnChangeFileFunction,
  changesUserData
};
