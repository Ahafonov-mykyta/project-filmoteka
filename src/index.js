import debounce from 'lodash.debounce';
import { Report } from 'notiflix/build/notiflix-report-aio';
import Delivery from './js/Delivery';
import { logOutForm, registerOpen } from './js/authentication';
import { createMarkup } from './js/markupFilmCard';
import getPagination from './js/pagination';
import loading from './js/loadingSpinner';
import { refs } from './js/filters';
import './js/modalSingUp';
import './js/modal';
import './js/filters';
import './js/authentication';

const container = document.getElementById('tui-pagination-container');
const listRef = document.querySelector('.list__film');
const signUp = document.querySelector('#user');
const search = document.querySelector('#search-box');
const delivery = new Delivery();
const user = JSON.parse(sessionStorage.getItem('user'));

search.addEventListener('input', debounce(searchMovies, 500));
refs.resetBtnRef.addEventListener('click', resetFilters);

let instance;
if (user) {
    signUp.textContent = user.displayName || 'Anonymous';
    signUp.removeEventListener('click', registerOpen);
    signUp.addEventListener('click', logOutForm);
} else {
    signUp.removeEventListener('click', logOutForm);
    signUp.addEventListener('click', registerOpen);
    signUp.textContent = 'Login | Join';
}

searchMovies();

async function searchMovies() {
    if (instance) {
        instance.reset();
    }

    container.removeAttribute('style');
    const query = search.value.trim();
    delivery.query = query;
    const data = await getMovies();
    if (data.total_results) {
        instance = getPagination(data.total_results, 20);
        instance.on('afterMove', loadPage);
    } else {
        container.setAttribute('style', 'display: none');
        Report.failure(
            'Search result not successful &#9785 ',
            'Enter the correct movie name and try again.',
            'Okay',
            {
                width: '400px',
                svgSize: '100px',
                titleFontSize: '20px',
                messageFontSize: '18px',
                buttonFontSize: '20px',
                borderRadius: '10px',
            }
        );
    }
}

async function getMovies() {
    loading.show();
    let data;

    try {
        data = delivery.query
            ? await delivery.search()
            : await delivery.trend();
        const markup = createMarkup(data.results);
        listRef.innerHTML = markup;
    } catch (error) {
        console.log('ERROR = ', error);
    }
    loading.close();

    return data;
}

function loadPage(event) {
    delivery.page = event.page;
    getMovies();
}

export async function addFilter(year = '', boolean = false) {
    if (instance) {
        instance.reset();
    }
    const query = search.value.trim();
    delivery.query = query;
    delivery.primary_release_year = year;
    delivery.include_adult = boolean;
    let data;
    try {
        if (!delivery.query) {
            delivery.query = 'all';
        }
        data = await delivery.search();
        const markup = createMarkup(data.results);
        listRef.innerHTML = markup;
    } catch (error) {
        console.log('ERROR = ', error);
    }
    return data;
}

async function resetFilters() {
    if (instance) {
        instance.reset();
    }
    search.value = '';
    delivery.primary_release_year = '';
    refs.forAdult.checked = false;
    refs.rangeSlider.value = 2022;
    refs.rangeBullet.innerHTML = refs.rangeSlider.value;
    let data;
    try {
        data = await refs.delivery.trend();
        const markup = createMarkup(data.results);
        refs.listRef.innerHTML = markup;
    } catch (error) {
        console.log('ERROR = ', error);
    }
    return data;
}
