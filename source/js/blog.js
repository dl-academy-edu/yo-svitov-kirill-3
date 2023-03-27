const filterForm = document.forms.blogFilterForm;

(function () {
	const tagsBox = document.querySelector('.select-of-box-js');
		const tagHTML = createTag();
		tagsBox.insertAdjacentHTML('beforeend', tagHTML);
})();

if(location.search) {
	const params = {};

	const arrayStringParams = location.search.substring(1).split('&');

	for(let stringParam of arrayStringParams) {
		let param = stringParam.split('=');
		let nameParam = param[0];
		let valueParam = param[1];

		if(nameParam in params) {
			params[nameParam].push(valueParam);
		} else {
			params[nameParam] = [valueParam];
		}
	}

	const updateInput = (gInputs, typeParam) => {
		for(let input of gInputs) {
			const param = params[typeParam];
			if (!param) return;
			for(partParam of param) {
				if(partParam === input.value) input.checked = true;
			}
		}
	}

	updateInput(filterForm.tags, 'tags');
	updateInput(filterForm.views, 'views');
	updateInput(filterForm.comments, 'comments');
	updateInput(filterForm.limit, 'limit');
	updateInput(filterForm.sort, 'sort');



	const url = new URL(location.pathname, location.origin);
	filterForm.addEventListener('submit', (e) => {
		e.preventDefault();

		url.searchParams.delete('tags');
		url.searchParams.delete('views');
		url.searchParams.delete('comments');
		url.searchParams.delete('limit');
		url.searchParams.delete('sort');

		const addChekedinput = (nameGroupInput, typeParam) => {
			for(checkbox of nameGroupInput) {
				if(checkbox.cheked) {
					url.searchParams.append(typeParam, checkbox.value);
				}
			}
		}

		addChekedinput(e.target.tags, 'tags');
		addChekedinput(e.target.views, 'views');
		addChekedinput(e.target.comments, 'comments');
		addChekedinput(e.target.limit, 'limit');
		addChekedinput(e.target.sort, 'sort');

		history.replaceState(null, '', url);
	})
};

const LIMIT = 5;
(function() {
	filterForm.addEventListener('submit', (e) => {
		e.preventDefault();

		let data = {
			page: 0,
		};

		data.tags = ([...filterForm.elements.tags]
			.filter(checkbox => checkbox.checked)
			.map(checkbox => checkbox.value));
		data.comments = ([...filterForm.elements.comments]
			.filter(checkbox => checkbox.checked)
			.map(checkbox => checkbox.value))
		data.views = ([...filterForm.elements.views]
			.find(radio => radio.checked) || {value: null}).value;
		data.limit = +filterForm.elements.limit.value || 5;
		data.sort = ([...filterForm.elements.sort]
			.find(radio => radio.checked) || {value: null}).value;
		data.search = filterForm.elements.search.value === "" ? null : filterForm.elements.search.value;
		getData(data);
		setSearchParams(data);
	})
	
	const params = getParamsFromLocation();
	setDataToFilter(params);
	getData(params);
})();

function getParamsFromLocation() {
	let searchParams = new URLSearchParams(location.search);
	return {
		tags: searchParams.getAll('tags'),
		views: searchParams.get('views'),
		comments: searchParams.getAll('comments'),
		limit: searchParams.get('limit'),
		sort: searchParams.get('sort'),
		search: searchParams.get('search') || null,
		page: +searchParams.get('page') || 0,
	};
};

function setSearchParams(data) {
	let searchParams = new URLSearchParams();

	data.tags.forEach(tag => {
		searchParams.append('tags', tag);
	});

	if(data.page) {
		searchParams.set('page', data.page);
	} else {
		searchParams.set('page', 0);
	}

	if(data.views) {
		searchParams.set('views', data.views);
	}

	data.comments.forEach(comment => {
		searchParams.append('comments', comment);
	});

	if(data.limit) {
		searchParams.set('limit', data.limit);
	}

	if(data.sort) {
		searchParams.set('sort', data.sort);
	}

	if(data.search) {
		searchParams.set('search', data.search);
	}

	history.replaceState(null, document.title, '?' + searchParams.toString());
};

function getData(params) {
	const result = document.querySelector('.blog__posts');
	let xhr = new XMLHttpRequest();
	let searchParams = new URLSearchParams();

	let filter = {};
	let limit = params.limit ? params.limit : LIMIT;

	if(params.tags && Array.isArray(params.tags) && params.tags.length) {
		searchParams.set('tags', JSON.stringify(params.tags));
	}

	if(params.views) {
		filter.views = {};
		filter.views.$between = [params.views.split('-')[0], params.views.split('-')[1]];
	}
	
	if(params.comments.length != 0) {
		if(params.comments[0] === "0") {
			filter.commentsCount = {};
			filter.commentsCount.$between = [0, 0];
		} else {
			filter.commentsCount = {};
			filter.commentsCount.$between = [params.comments[0].split('-')[0], params.comments[0].split('-')[1]] || [params.comments];
		}
	}

	if(params.sort) {
		searchParams.set('sort', JSON.stringify([params.sort, 'DESC']));
	}

	if(params.search) {
		filter.title = params.search;
	}

	if(+params.page) {
		searchParams.set('offset', (+params.page) * limit);
	}

	searchParams.set('v', '1.0.0');
	searchParams.set('filter', JSON.stringify(filter));
	searchParams.set('limit', limit);

	xhr.open('GET', BASE_SERVER_PATH + '/api/posts?' + searchParams.toString());
	xhr.send();
	showLoader();
	result.innerHTML = '';
	const links = document.querySelector('.blog__pages');
	links.innerHTML = '';
	xhr.onload = () => {
		const response = JSON.parse(xhr.response);
		let dataPosts = '';
		response.data.forEach(post => {
			dataPosts += cardCreate({
				title: post.title,
				text: post.text,
				src: post.photo.desktopPhotoUrl,
				tags: post.tags,
				date: dateCorrecting(post.date),
				comments: post.commentsCount,
				views: post.views,
			});
		})
		result.innerHTML = dataPosts;
		const pageCount = Math.ceil(response.count / limit);
		for(let i = 0; i < pageCount; i++) {
			const link = linkElementCreate(i);
			links.insertAdjacentElement('beforeend', link);
			links.insertAdjacentHTML('beforeend', '');
		}
		hideLoader();
	}
};

function linkElementCreate(page) {
	const link = document.createElement('a');
	link.href = '?page=' + page;
	link.innerText = (page + 1);
	link.classList.add('blog__pages-link');
	link.classList.add('pages__link_js');

	let params = getParamsFromLocation();
	if(page === +params.page) {
		link.classList.add('blog__pages-active');
	}

	link.addEventListener('click', (e) => {
		e.preventDefault();
		const links = document.querySelectorAll('.pages__link_js');
		let searchParams = new URLSearchParams(location.search);
		let params = getParamsFromLocation();
		links[params.page].classList.remove('.blog__pages-active');
		searchParams.set('page', page);
		links[page].classList.add('blog__pages-active');
		history.replaceState(null, document.title, '?' + searchParams.toString());
		getData(getParamsFromLocation());
	});
	return link;
};

function setDataToFilter (data) {
	filterForm.elements.tags.forEach(checkbox => {
		checkbox.checked = data.tags.includes(checkbox.value);
	});
	filterForm.elements.views.forEach(radio => {
		radio.checked = data.views === radio.value;
	});
	filterForm.elements.comments.forEach(checkbox => {
		checkbox.checked = data.comments.includes(checkbox.value);
	});
	filterForm.elements.limit.forEach(radio => {
		radio.checked = data.limit === radio.value;
	});
	filterForm.elements.sort.forEach(radio => {
		radio.checked = data.sort === radio.value;
	});
	filterForm.elements.search = data.search;
};


function dateCorrecting (serverDate) {
	let date = new Date(serverDate);

	let dayDate = date.getDate();
	let monthDate = date.getMonth() + 1;
	let yearDate = date.getFullYear();

	if(dayDate < 10) {
		dayDate = '0' + dayDate;
	}

	if (monthDate < 10 ) {
		monthDate = '0' + monthDate;
	}

	const finalDate = `${dayDate}.${monthDate}.${yearDate}`;
	return finalDate;
};

function cardCreate({title, text, tags, date, comments, views, src}) {
	return `
	<hr class="blog__line">
	<div class="blog__posts-card">
			<img class="card__img" src="${BASE_SERVER_PATH}${src}" alt="${title}" width="320" height="236">
		<div class="card-info">
			<div class="card-tags">${tags.map(tag => `
				<span class="card-tag" style="background: ${tag.color}" alt="${tag.name}"></span>`).join(' ')}
			</div>
			<div class="card-data">
				<p class="card-data-date">${date}</p>
				<p class="card-data-views">${views} views</p>
				<p class="card-data-comments">${comments} comments</p>
			</div>
			<h4 class="card-title" tabindex="0">${title}</h4>
			<p class="card-text">${text}</p>
			<a href="#" class="card-link">Go to this post</a>
		</div>
	</div>
	`
};

function createTag() {
	return `
	<input class="checkbox-stock-blue" type="checkbox" value="1" name="tags" id="checkbox-blue" aria-label="Color blue.">
	<label class="checkbox-custom-blue checkbox-custom" for="checkbox-blue"></label>

	<input class="checkbox-stock-lightBlue" type="checkbox" value="2" name="tags" id="checkbox-lightBlue" aria-label="Color light blue.">
	<label class="checkbox-custom-lightBlue checkbox-custom" for="checkbox-lightBlue"></label>

	<input class="checkbox-stock-yellow" type="checkbox" value="3" name="tags" id="checkbox-yellow" aria-label="Color yellow.">
	<label class="checkbox-custom-yellow checkbox-custom" for="checkbox-yellow"></label>
									
	<input class="checkbox-stock-turquoise" type="checkbox" value="4" name="tags" id="checkbox-turquoise" aria-label="Color turquoise.">
	<label class="checkbox-custom-turquoise checkbox-custom" for="checkbox-turquoise"></label>
									
	<input class="checkbox-stock-orange" type="checkbox" value="5" name="tags" id="checkbox-orange" aria-label="Color orange.">
	<label class="checkbox-custom-orange checkbox-custom" for="checkbox-orange"></label>
									
	<input class="checkbox-stock-pink" type="checkbox" value="6" name="tags" id="checkbox-pink" aria-label="Color pink.">
	<label class="checkbox-custom-pink checkbox-custom" for="checkbox-pink"></label>
									
	<input class="checkbox-stock-purple" type="checkbox" value="7" name="tags" id="checkbox-purple" aria-label="Color purple.">
	<label class="checkbox-custom-purple checkbox-custom" for="checkbox-purple"></label>
									
	<input class="checkbox-stock-green" type="checkbox" value="8" name="tags" id="checkbox-green" aria-label="Color green.">
	<label class="checkbox-custom-green checkbox-custom" for="checkbox-green"></label>
	`
};

