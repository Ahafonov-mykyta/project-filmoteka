import poster from '../images/noposter.jpg';
import svg from '../images/icons.svg';

export function modalLibraryMarkup({
    poster_path,
    title,
    original_title,
    genres,
    vote_average,
    vote_count,
    popularity,
    overview,
}) {
    let movieGenres = genres.map(genre => genre.name);
    if (movieGenres.length > 2) {
        movieGenres = `${movieGenres[0]}, ${movieGenres[1]}, Other`;
    }
    let posterUrl;
    if (!poster_path) {
        posterUrl = poster;
    } else {
        posterUrl = `https://image.tmdb.org/t/p/original/${poster_path}`;
    }

    return /*html*/ `<div class="movie-modal__content">
      <img class="movie-modal__img" src="${posterUrl}" alt="${title}"></img>
  <div class="movie-modal__text">
    <h2 class="movie-modal__title">${title}</h2>
      <div class="movie-modal__figures"><ul class="movie-modal__properties list">
        <li>Vote / Votes</li>
        <li>Popularity</li>
        <li>Original Title</li>
        <li>Genre</li>
      </ul>
      <ul class="movie-modal__values list">
        <li><span class="movie-modal__vote-average">${vote_average.toFixed(
            1
        )}</span> / <span class="movie-modal__vote-count">${vote_count}</span></li>
        <li>${popularity.toFixed(1)}</li>
        <li class="movie-modal__title-original">${original_title}</li>
        <li>${movieGenres}</li>
      </ul></div>
      
      <h3 class="movie-modal__about--title">ABOUT</h3>
      <button type="button" class="modal__watch-button js-playtrailer">
      <svg class="movies-modal__play-icon" width="14" height="14">
        <use href="${svg}#icon-play"></use>
      </svg><span>Watch trailer</span>
      </button>
      
      <p class="movie-modal__about--text">${overview}</p>
      
      <div class="modal__btns">
        <button type="button" class="modal__btns__button js-addtowatched">add to watched</button>
        <button type="button" class="modal__btns__button js-addtoqueue">add to queue</button>
      </div>
  </div>
</div>
    `;
}
