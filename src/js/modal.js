import * as basicLightbox from 'basiclightbox';
import Delivery from './Delivery';
import { modalLibraryMarkup } from './modalLibraryMarkup';
import './buttonsModal';
import { addModalButtons, setMovie } from './buttonsModal';
import svg from '../images/icons.svg';
import { Notify } from 'notiflix';

const delivery = new Delivery();
let modalRef = {};
let movieId = 0;

const listRef = document.querySelector('.list__film');

listRef.addEventListener('click', onFilmClick);

async function onFilmClick(e) {
    e.preventDefault();
    if (e.target.nodeName === 'UL') {
        return;
    }
    const movieCard = e.target.closest('li[id]');
    movieId = getId(movieCard);
    const movie = await getMovieById(movieId);

    openModal(movie);
    setMovie(movie);
    addModalButtons();
    addTrailerPlayButton();
}

function getId(movieCard) {
    return movieCard.id;
}

async function getMovieById(movieId) {
    try {
        const movie = await delivery.fetchById(movieId);
        return movie;
    } catch (error) {
        console.log(error);
    }
}

function openModal(movie) {
    const moviesModalContent = modalLibraryMarkup(movie);
    const instance = basicLightbox.create(
        `
  <div class="movies-modal">
    <button type="button" class="movies-modal__close-btn" data-modal-close>
      <svg class="movies-modal__close-icon" width="16" height="16">
        <use href="${svg}#icon-close"></use>
      </svg>
    </button>
  ${moviesModalContent}
</div>
`,
        {
            onShow: instance => {
                instance
                    .element()
                    .querySelector('button[data-modal-close]').onclick =
                    instance.close;
                document.body.setAttribute('style', 'overflow: hidden');
                document.addEventListener('keydown', modalCloseByEsc);
            },
            onClose: () => {
                document.removeEventListener('keydown', modalCloseByEsc);
                document.body.removeAttribute('style');
                const btn = document.querySelector('.active');
                if (btn) {
                    sessionStorage.setItem(
                        'savePage',
                        sessionStorage.getItem('page')
                    );
                    btn.dispatchEvent(new Event('click'));
                }
            },
        }
    );
    instance.show();
    return (modalRef = instance);
}

function modalCloseByEsc(event) {
    event.preventDefault();
    const ESC_KEY_CODE = 'Escape';
    const isEscKey = event.code === ESC_KEY_CODE;
    if (isEscKey) {
        modalRef.close();
    }
}

// Trailer -----------------------------------------------------------------------

function addTrailerPlayButton() {
    const btnPlayRef = document.querySelector('.js-playtrailer');
    btnPlayRef.addEventListener('click', onTrailerPlay);
}

async function onTrailerPlay(event) {
    event.preventDefault();
    const movieVideos = await getTrailerById(movieId);
    console.log(movieVideos);
    const movieVideosall = movieVideos.results;
    const movieTrailer = movieVideosall.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    if (movieTrailer) {
        openTrailerModal(movieTrailer);
    } else {
        Notify.failure('Sorry, we can`t find any trailer of this movie.');
    }
    console.log(movieTrailer);
}

async function getTrailerById(movieId) {
    try {
        const videos = await delivery.fetchTrailer(movieId);
        return videos;
    } catch (error) {
        console.log('ERROR = ', error);
    }
    console.log(data);
}

function openTrailerModal(movieTrailer) {
    const instance = basicLightbox.create(
        `
  <iframe width="560" height="315" 
  src="https://www.youtube.com/embed/${movieTrailer.key}" 
  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen></iframe>
`,
        {
            onShow: instance => {
                instance.element();
                document.body.setAttribute('style', 'overflow: hidden');
            },
            onClose: () => {
                document.body.removeAttribute('style');
            },
        }
    );
    instance.show();
}
