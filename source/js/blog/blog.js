import {
  convertFormParametersToString,
  getObjParamsFormFilter,
  requestPageBlog,
  resetTags,
  setLocationSearch,
  onSuccessTags,
  convertObjParametersSearchForRequest
} from './utils-blog.js';

if (document.querySelector('.page-blog--js')) {
  const formFilters = document.querySelector('.filters__form');
  const buttonReset = document.querySelector('button[type="reset"]');
  const wrapTags = document.querySelector('.filters__list');
  const wrapPosts = document.querySelector('.blogs__list-posts');
  const wrapLinks = document.querySelector('.controls__list--blog-js');
  const template = document.querySelector('#blog');

  formFilters.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const objParamsForm = getObjParamsFormFilter(form);

    const strParamsForm = convertFormParametersToString(objParamsForm);
    console.log(strParamsForm);
    setLocationSearch(strParamsForm);
  });

  //отправка запроса на сервер при загрузке страницы
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page');
  if (!page) {
    searchParams.set('page', 0);
    setLocationSearch(searchParams);
  }

  const optionsRequestTags = {
    url: '/api/tags',
    method: 'GET',
  };
  requestPageBlog(optionsRequestTags, onSuccessTags(wrapTags, template, wrapPosts, wrapLinks));

  buttonReset.addEventListener('click', (e) => {
    const target = e.target;
    const tags = target.form.querySelectorAll('input[name="tags"]');
    resetTags(tags);
  });
}


