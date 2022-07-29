export default function libraryMarkup(moviesSet) {
    return moviesSet
        .map(
            ({
                poster_path,
                title,
                genres,
                release_date,
                vote_average,
                id,
            }) => {
                let movieGenres = genres.map(genre => genre.name);
                if (movieGenres.length > 2) {
                    movieGenres = `${movieGenres[0]}, ${movieGenres[1]}, Other`;
                }
                return /*html*/ `<li class="list__item" id="${id}">
        <img class="list__img" src="https://image.tmdb.org/t/p/original/${poster_path}" alt="${title}"></img>
        <div class="list__text">
        <h2 class="list__title">${title}</h2>
        <p class="list__genre">${movieGenres} | ${release_date.slice(
                    0,
                    4
                )}&nbsp&nbsp
        <span class="list__vote">${vote_average.toFixed(1)}</span></p>
        </div>
      </li>`;
            }
        )
        .join('');
}
