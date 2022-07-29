import { Notify } from 'notiflix';
import libraryMarkup from './libraryMarkup';
import getPagination from './pagination';
import getDataBase from './dataBase';

const db = getDataBase();
const libraryEl = document.querySelector('.js-library');
const watchedBtn = document.querySelector('.js-watched');
const queueBtn = document.querySelector('.js-queue');
const container = document.getElementById('tui-pagination-container');

let btn = 'watched';
let pagination, perPage, currentPage;

export function clickFirebase(event) {
    btn = event.target.name;
    btnClickFirebase();
}

export async function btnClickFirebase() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    let userDatabase = await db.readUserData(user.uid);
    if (!userDatabase) {
        db.writeUserData(user.uid, [], [], 'watched');
        userDatabase = await db.readUserData(user.uid);
    }

    if (btn === 'queue') {
        watchedBtn.classList.remove('active');
        queueBtn.classList.add('active');
    } else {
        watchedBtn.classList.add('active');
        queueBtn.classList.remove('active');
    }
    userDatabase.state = btn;
    db.writeUserData(
        user.uid,
        userDatabase.watched || [],
        userDatabase.queue || [],
        userDatabase.state
    );
    onPagination(userDatabase[btn]);
}

function onPagination(list) {
    if (window.innerWidth >= 1280) {
        perPage = 9;
    } else if (window.innerWidth >= 768) {
        perPage = 8;
    } else perPage = 4;

    if (list) {
        pagination = getPagination(list.length, perPage);
        container.removeAttribute('style');
        pagination.on('afterMove', event => {
            libraryEl.innerHTML = libraryMarkup(
                list.slice(event.page * perPage - perPage, event.page * perPage)
            );
            sessionStorage.setItem('page', event.page);
        });
        const savePage = sessionStorage.getItem('savePage') || 1;
        pagination.movePageTo(savePage);
        sessionStorage.removeItem('savePage');
    } else {
        container.setAttribute('style', 'display: none');
        libraryEl.innerHTML = '';
        Notify.info('Your library is empty. You can add something');
    }
}
