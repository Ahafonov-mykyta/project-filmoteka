import { Notify } from 'notiflix';
import lsAPI from './localestorage';
import getDataBase from './dataBase';

const db = getDataBase();

const LS_WATCHED_KEY = 'watched';
const LS_QUEUE_KEY = 'queue';
const LS_LIBRARY_STATE = 'library-state';

let user = JSON.parse(sessionStorage.getItem('user'));
let currentPage = lsAPI.load(LS_LIBRARY_STATE);
let addToWatchedBtn = document.querySelector('.js-addtowatched');
let addToQueueBtn = document.querySelector('.js-addtoqueue');
let watchList, queueList, userDatabase;
let movieModal = {};

export function setMovie(movieFromModal) {
    movieModal = movieFromModal;
}

export async function addModalButtons() {
    user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        userDatabase = await db.readUserData(user.uid);
        watchList = userDatabase.watched || [];
        queueList = userDatabase.queue || [];
    } else {
        watchList = lsAPI.load(LS_WATCHED_KEY) || [];
        queueList = lsAPI.load(LS_QUEUE_KEY) || [];
    }

    addToWatchedBtn = document.querySelector('.js-addtowatched');
    addToQueueBtn = document.querySelector('.js-addtoqueue');

    addToWatchedBtn.addEventListener('click', addToWatchedBtnClick);
    addToQueueBtn.addEventListener('click', addToQueueBtnClick);

    const isInWatchList = watchList.findIndex(
        movie => movie.id === movieModal.id
    );
    const isInQueueList = queueList.findIndex(
        movie => movie.id === movieModal.id
    );

    addToWatchedBtn.textContent =
        isInWatchList < 0 ? 'Add to watched' : 'remove from watched';
    addToQueueBtn.textContent =
        isInQueueList < 0 ? 'Add to queue' : 'remove from queue';
}

async function addToWatchedBtnClick() {
    user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        userDatabase = await db.readUserData(user.uid);
        watchList = userDatabase.watched || [];
        currentPage = userDatabase.state;
    } else {
        currentPage = lsAPI.load(LS_LIBRARY_STATE);
        watchList = lsAPI.load(LS_WATCHED_KEY) || [];
    }

    const isInWatchList = watchList.findIndex(
        movie => movie.id === movieModal.id
    );

    if (isInWatchList === -1) {
        Notify.success('Movie is added to Watched!');
        watchList.push(movieModal);
        if (user) {
            userDatabase.watched = watchList;
            db.writeUserData(
                user.uid,
                userDatabase.watched || [],
                userDatabase.queue || [],
                userDatabase.state
            );
        } else {
            lsAPI.save(LS_WATCHED_KEY, watchList);
        }
        addToWatchedBtn.textContent = 'remove from watched';
        return;
    }

    Notify.info('Movie is removed from Watched!');
    addToWatchedBtn.textContent = 'add to watched';

    watchList.splice(isInWatchList, 1);
    if (user) {
        userDatabase.watched = watchList;
        db.writeUserData(
            user.uid,
            userDatabase.watched || [],
            userDatabase.queue || [],
            userDatabase.state
        );
    } else {
        lsAPI.save(LS_WATCHED_KEY, watchList);
    }
}

async function addToQueueBtnClick() {
    user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        userDatabase = await db.readUserData(user.uid);
        queueList = userDatabase.queue || [];
        currentPage = userDatabase.state;
    } else {
        currentPage = lsAPI.load(LS_LIBRARY_STATE);
        queueList = lsAPI.load(LS_QUEUE_KEY) || [];
    }

    const isInQueueList = queueList.findIndex(
        movie => movie.id === movieModal.id
    );

    if (isInQueueList === -1) {
        Notify.success('Movie is added to Queue!');
        queueList.push(movieModal);
        if (user) {
            userDatabase.queue = queueList;
            db.writeUserData(
                user.uid,
                userDatabase.watched || [],
                userDatabase.queue || [],
                userDatabase.state
            );
        } else {
            lsAPI.save(LS_QUEUE_KEY, queueList);
        }
        addToQueueBtn.textContent = 'remove from queue';
        return;
    }

    Notify.info('Movie is removed from Queue!');
    addToQueueBtn.textContent = 'add to queue';

    queueList.splice(isInQueueList, 1);
    if (user) {
        userDatabase.queue = queueList;
        db.writeUserData(
            user.uid,
            userDatabase.watched || [],
            userDatabase.queue || [],
            userDatabase.state
        );
    } else {
        lsAPI.save(LS_QUEUE_KEY, queueList);
    }
}
