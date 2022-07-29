import genres from '../genres.json';

export default function getGenres(id) {
  return genres[id];
}
