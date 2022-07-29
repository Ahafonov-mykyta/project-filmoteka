import getGenres from './getGenre';
import poster from '../images/noposter.jpg';

export function createMarkup(data) {
    return data
        .map(({ genre_ids, title, release_date, poster_path, id }) => {
            let genres = genre_ids.map(id => getGenres(id));
            if (genres.length > 2) {
                genres = `${genres[0]}, ${genres[1]}, Other`;
            }
            let posterUrl;
            if (!poster_path) {
                posterUrl = poster;
            } else {
                posterUrl = `https://image.tmdb.org/t/p/original/${poster_path}`;
            }
            return /*html*/ `<li class="list__item" id="${id}">
            <img src="${posterUrl}" alt="" class="list__img" />
            <div class="list__text">
              <h2 class="list__title">${title}</h2>
              <p class="list__genre">${genres} | ${release_date.slice(0, 4)}</p>
            </div>
          </li>`;
        })
        .join('');
}
