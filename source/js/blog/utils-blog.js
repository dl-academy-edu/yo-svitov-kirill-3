import {
  showPreloader,
  deletePreloader
} from '../forms/utils-form.js';

import {getNumbersFromString, URL} from '../common.js';
import {checkLeftSlide, checkRightSlide} from '../slider-index/utilsSliders.js';

const SELECTOR_CUSTOM_CHECKBOX = 'custom-checkbox-js';
const SELECTOR_SMALL_STICK = 'custom-checkbox-js--small-stick';
const SELECTOR_BIG_STICK = 'custom-checkbox-js--big-stick';

function createMarker(marker, id, color) {
  const newMarker = marker.cloneNode(true);

  newMarker.setAttribute('data-marker-id', id);
  newMarker.style.backgroundColor = color;

  return newMarker;
}

function createMarkers(marker, objOptionsMarker) {
  let markers = [];

  objOptionsMarker.forEach((optionsMarker) => {
    const newMarker = createMarker(marker, optionsMarker.id, optionsMarker.color);
    markers.push(newMarker);
  });

  return markers;
}

function getTimeForMan(strTime) {
  const data = new Date(strTime);

  return {
    number: data.getDate() < 10 ? `'0${data.getDate()}` : `${data.getDate()}`,
    month: data.getMonth() + 1 < 10 ? `0${data.getMonth() + 1}` : `${data.getMonth()}`,
    year: String(data.getFullYear())
  };
}

function createPost(Template, {id, title, tags, date, views, commentsCount, text, photo}) {
  const blog = Template.content.cloneNode(true);

  const article = blog.querySelector('.blog');
  const titleBlog = blog.querySelector('.blog__title');
  const markerBlog = blog.querySelector('.blog__marker');
  const wrapMarker = blog.querySelector('.blog__wrap-markers');
  const timeBlog = blog.querySelector('.blog__time');
  const viewsBlog = blog.querySelector('.blog__views');
  const commentsBlog = blog.querySelector('.blog__comments');
  const textBlog = blog.querySelector('.blog__text');
  const imgBlog = blog.querySelector('.blog__img');
  const imgTabletBlog = blog.querySelector('.blog__img-tablet');
  const imgMobileBlog = blog.querySelector('.blog__img-mobile');

  const arrayMarkers = createMarkers(markerBlog, tags);
  const {number, month, year} = getTimeForMan(date);

  article.setAttribute('data-blog-id', id);

  titleBlog.textContent = title;

  wrapMarker.innerHTML = '';
  wrapMarker.append(...arrayMarkers);

  timeBlog.dateTime = `${year}-${month}-${number}`;
  timeBlog.textContent = `${number}.${month}.${year}`;

  viewsBlog.innerHTML = `${views} views`;

  commentsBlog.innerHTML = `${commentsCount} comments`;

  textBlog.innerHTML = text;

  imgBlog.src = `${URL}${photo.desktopPhotoUrl}`;
  imgBlog.srcset = `${URL}${photo.desktop2xPhotoUrl} 2x`;
  imgTabletBlog.srcset = `${URL}${photo.tabletPhotoUrl}, ${URL}${photo.tablet2xPhotoUrl} 2x`;
  imgMobileBlog.srcset = `${URL}${photo.mobilePhotoUrl}, ${URL}${photo.mobile2xPhotoUrl} 2x`;

  return blog;
}

function showPosts(parentPosts, arrayPosts) {
  parentPosts.append(...arrayPosts);
}

function createTag({id, color}, arrayCheckedTags) {
  const tag = `
  <div class="filters__wrap-input-tag filters__wrap-input-tag--js">
          <input class="visually-hidden" type="checkbox" value="${id}" name="tags" id="${id}">
          <label class="filters__label-tag filters__label-tag--js" for="${id}">blue</label>
          <span class="${SELECTOR_CUSTOM_CHECKBOX}">
             <span class="${SELECTOR_SMALL_STICK}"></span>
             <span class="${SELECTOR_BIG_STICK}"></span>
          </span>
        </div>`;

  const li = document.createElement('li');
  li.innerHTML = tag;

  const checkbox = li.querySelector('input[type="checkbox"]');
  const customCheckbox = li.querySelector('.custom-checkbox-js');
  const smallStick = li.querySelector('.custom-checkbox-js--small-stick');
  const bigStick = li.querySelector('.custom-checkbox-js--big-stick');

  if (arrayCheckedTags && arrayCheckedTags.indexOf(String(id)) !== -1) {
    checkbox.checked = true;
    smallStick.style.backgroundColor = color;
    bigStick.style.backgroundColor = color;
  }

  customCheckbox.style.color = color;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      smallStick.style.backgroundColor = color;
      bigStick.style.backgroundColor = color;
      return;
    }

    smallStick.style.backgroundColor = 'transparent';
    bigStick.style.backgroundColor = 'transparent';
  });

  checkbox.addEventListener('focusin', () => {
    customCheckbox.style.outline = `2px solid ${color}`;
  });

  checkbox.addEventListener('focusout', (e) => {
    customCheckbox.style.outline = `2px solid transparent`;
  });

  return li;
}

function getArrayTags(response, arrayCheckedTags) {
  const arrayTags = [];

  response.data.forEach(({id, color}) => {
    const tag = createTag({id, color}, arrayCheckedTags);
    arrayTags.push(tag);
  });

  return arrayTags;
}

function resetTags(arrayInputsTagsElements) {
  arrayInputsTagsElements.forEach((inputTag) => {
    if (inputTag.checked) {
      inputTag.checked = false;

      const inputParent = inputTag.parentElement;

      const smallStick = inputParent.querySelector(`.${SELECTOR_SMALL_STICK}`);
      const bigStick = inputParent.querySelector(`.${SELECTOR_BIG_STICK}`);

      smallStick.style.backgroundColor = 'transparent';
      bigStick.style.backgroundColor = 'transparent';
    }
  });
}

function showTags(elemTarget, arrayTags) {
  elemTarget.append(...arrayTags);
}

function requestPageBlog(objOptionsRequest, onSuccess, onError) {

  const xhr = new XMLHttpRequest();
  xhr.open(objOptionsRequest.method, `${URL}${objOptionsRequest.url}`);
  if (objOptionsRequest.headers) {
    xhr.setRequestHeader(objOptionsRequest.headers.name, objOptionsRequest.headers.value);
  }
  xhr.responseType = 'json';
  showPreloader();
  xhr.send();
  xhr.onload = () => {
    if (xhr.response.success || xhr.status === 200) {
      if (onSuccess) {
        onSuccess(xhr.response);
      }
    }
    deletePreloader();
  };

  xhr.onerror = () => {

  };
}

function initializeForm(form, objParams) {
  for (const name in objParams) {
    if (objParams.hasOwnProperty(name)) {
      const inputs = form.querySelectorAll(`input[name=${name}]`);

      for (const input of inputs) {
        switch (input.type) {
          case 'search':
          case 'text':
            if (input.name in objParams) {
              input.value = objParams[name][0];
            }
            break;

          default:
            if (objParams[name].indexOf(input.value) !== -1) {
              input.checked = true;
              break;
            }

            input.checked = false;
            break;
        }
      }
    }
  }
}

function getObjParamsLocationSearch() {
  const arrayParamsSearch = location.search.slice(1)
                                    .split('&');
  let params = {};

  arrayParamsSearch.forEach((itemParam) => {
    const [name, value] = itemParam.split('=');

    if (params[name]) {
      params[name].push(value);
    } else {
      params[name] = [value];
    }
  });

  return params;
}

function getObjParamsFormFilter(form) {
  const inputs = form.querySelectorAll('input');
  const objParamsForm = {page: [0]};

  [...inputs].forEach((input) => {
    switch (input.type) {
      case 'search':
      case 'text':
        objParamsForm[input.name] = [input.value];
        break;

      default:
        if (input.checked) {
          if (objParamsForm[input.name]) {
            objParamsForm[input.name].push(input.value);
            break;
          }

          objParamsForm[input.name] = [input.value];
        }
        break;
    }
  });

  console.log(objParamsForm);
  return objParamsForm;
}

function convertFormParametersToString(objFormParamsFilter) {
  let ifTheFirstElement = true;
  let strSearch = '';

  for (const name in objFormParamsFilter) {
    if (objFormParamsFilter.hasOwnProperty(name)) {
      objFormParamsFilter[name].forEach((value) => {
        if (ifTheFirstElement) {
          strSearch += `${name}=${value}`;
          ifTheFirstElement = false;
          return;
        }

        strSearch += `&${name}=${value}`;
      });
    }
  }

  return strSearch;
}

function convertObjParametersSearchForRequest(objParamsForm) {

  const dataForm = {
    filter: {},
    limit: objParamsForm.show ? +objParamsForm.show[0] : 9,
    page: objParamsForm.page || 0,
  };

  dataForm.offset = dataForm.page * dataForm.limit;

  for (const name in objParamsForm) {
    if (objParamsForm.hasOwnProperty(name)) {
      switch (name) {
        case 'commentsCount':
        case 'views':
          const arrayNumbers = getNumbersFromString(objParamsForm[name].join());
          const min = Math.min.apply(null, arrayNumbers);
          const max = Math.max.apply(null, arrayNumbers);

          dataForm.filter[name] = {$between: [min, max]};
          break;

        case 'search':
          dataForm.filter['title'] = objParamsForm[name][0];
          break;

        default:
          dataForm[name] = objParamsForm[name];
          break;
      }
    }
  }

  return dataForm;
}

function setLocationSearch(formParameterString) {
  location = `${location.origin}${location.pathname}?${formParameterString}`;
}

function getStrSearch(dataRequest) {
  const searchParams = new URLSearchParams();
  searchParams.set('v', '1.0.0');

  for (const name in dataRequest) {
    if (dataRequest.hasOwnProperty(name)) {
      if (name === 'sort') {
        searchParams.set(`${name}`, JSON.stringify([dataRequest[name][0], 'ASC']));
        continue;
      }

      searchParams.set(`${name}`, JSON.stringify(dataRequest[name]));

    }
  }

  return searchParams;
}

function createLinkPagination(page, parentLinks, templatePost, parentPosts) {
  const paramsLocationSearch = getObjParamsLocationSearch();
  const dataRequest = convertObjParametersSearchForRequest(paramsLocationSearch);

  const li = document.createElement('li');
  const link = document.createElement('a');

  li.classList.add('controls__item');
  link.classList.add('controls__link');
  link.innerText = page + 1;

  if (+dataRequest.page === page) {
    link.classList.add('controls__link--active');
  }

  link.addEventListener('click', (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    const paramsLocationSearch = getObjParamsLocationSearch();
    const dataRequest = convertObjParametersSearchForRequest(paramsLocationSearch);
    const strRequest = getStrSearch(dataRequest);

    const target = e.target;

    const activeLink = document.querySelector('.controls__link--active');
    activeLink.classList.remove('controls__link--active');
    target.classList.add('controls__link--active');

    searchParams.set('page', +target.innerText - 1);
    setLocationSearch(searchParams);
    const optionsRequestPosts = {
      url: `/api/posts?${strRequest}`,
      method: 'GET',
    };
    requestPageBlog(optionsRequestPosts, onSuccessPost(dataRequest.page, parentLinks, templatePost, parentPosts));
  });

  li.append(link);
  return li;
}

function showLinkPagination(parentLinks, arrayLinks) {
  parentLinks.append(...arrayLinks);
}

function onSuccessPost(parentLinks, template, parentPosts) {
  return function (response) {
    const paramsLocationSearch = getObjParamsLocationSearch();
    const dataRequest = convertObjParametersSearchForRequest(paramsLocationSearch);

    let arrayPosts = [];

    response.data.forEach((objPost) => {
      const li = document.createElement('li');
      const post = createPost(template, objPost);
      li.append(post);
      arrayPosts.push(li);
    });
    showPosts(parentPosts, arrayPosts);


    const numPage = Math.ceil(response.count / dataRequest.limit);
    let arrayLinks = [];

    for (let i = 0; i < numPage; i++) {
      const link = createLinkPagination(i, parentLinks, template, parentPosts);
      arrayLinks.push(link);
    }
    showLinkPagination(parentLinks, arrayLinks);

    const ARROW = '.controls__arrow';
    const parentControls = document.querySelector('.controls-js');
    const arrowRight = document.querySelector('.controls__arrow--right-js');
    const arrowLeft = document.querySelector('.controls__arrow--left-js');

    parentControls.addEventListener('click', (e) => {
      const target = e.target;

      if (target.closest(ARROW)) {
        const dataArrow = target.dataset.arrow;
        const searchParams = new URLSearchParams(location.search);
        const page = +searchParams.get('page');

        if (dataArrow === 'right' && page + 1 <= parentLinks.children.length - 1) {
          searchParams.set('page', page + 1);
          setLocationSearch(searchParams);
          return;
        }

        if (dataArrow === 'left' && page - 1 >= 0) {
          searchParams.set('page', page - 1);
          setLocationSearch(searchParams);
          return;
        }

      }
    });
    arrowRight.disabled = checkRightSlide(parentLinks, +dataRequest.page[0], 1);
    arrowLeft.disabled = checkLeftSlide(+dataRequest.page[0], 1);
    checkLeftSlide();
  };
}

function onSuccessTags(parentTags, templatePost, parentPosts, parentLinks) {
  return function (arrayTagsData) {
    const paramsSearch = getObjParamsLocationSearch();
    if (location.search) {
      [...document.forms].forEach((form) => {
        initializeForm(form, paramsSearch);
      });
    }

    const tags = getArrayTags(arrayTagsData, paramsSearch?.tags);
    showTags(parentTags, tags);

    const dataRequest = convertObjParametersSearchForRequest(paramsSearch);
    const strRequest = getStrSearch(dataRequest);

    const optionsRequestPosts = {
      url: `/api/posts?${strRequest}`,
      method: 'GET',
    };
    requestPageBlog(optionsRequestPosts, onSuccessPost(parentLinks, templatePost, parentPosts));
  };
}

export {
  createPost,
  showTags,
  getArrayTags,
  requestPageBlog,
  initializeForm,
  getObjParamsLocationSearch,
  resetTags,
  convertFormParametersToString,
  getObjParamsFormFilter,
  setLocationSearch,
  convertObjParametersSearchForRequest,
  getStrSearch,
  showPosts,
  createLinkPagination,
  showLinkPagination,
  onSuccessPost,
  onSuccessTags
};
