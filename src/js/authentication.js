import googleIcon from '../images/google.svg';
import * as basicLightbox from 'basiclightbox';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';

const loginUser = new Event('isLogedIn');
const provider = new GoogleAuthProvider();
const firebaseConfig = {
    apiKey: 'AIzaSyA5Rlj0L2mDk1x_n-ysmA7r6zBCd7fyn60',
    authDomain: 'goit-js-project-filmoteka.firebaseapp.com',
    databaseURL:
        'https://goit-js-project-filmoteka-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'goit-js-project-filmoteka',
    storageBucket: 'goit-js-project-filmoteka.appspot.com',
    messagingSenderId: '221296181202',
    appId: '1:221296181202:web:aef293a7dffbafe8ce920b',
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const signUp = document.querySelector('#user');

let regisrationForm, form, user, google, formLog, cancelBtn;

signUp.addEventListener('click', registerOpen);

export function registerOpen(event) {
    event.preventDefault();
    regisrationForm = basicLightbox.create(/*html*/ `
        <form class="form" id='loginForm'>
        <h2 class="form__title">Login</h2>
        <label class="form__label">E-mail
            <input class="form__input" name='emailLog'/>
        </label>
        <label class="form__label">Password
            <input class="form__input" name='passwordLog' type="password"/>
        </label>  
        <div class="form__thumb">
            <button class ="form__button" type='submit' id='login'>Login</button>
            <button class ="form__button" type='button' id='google'>
                <img src="${googleIcon}"/>
                <span>Sign-in with Google</span>
            </button>
        </div>
        
    </form>
        <form class="form" id='registrationForm'>
        <h2 class="form__title">
            <span class="form__text">or&nbsp;</span>join</h2>
        <label class="form__label"> Name
            <input class="form__input" name='login'/>
        </label>
        <label class="form__label">E-mail
            <input class="form__input" name='email'/>
        </label>
        <label class="form__label">Password
            <input class="form__input" name='password' type="password"/>
        </label>
        <div class="form__thumb">
            <button class ="form__button" type='submit'>Join</button>
            <button class ="form__button" type='button' id='cancel'>Cancel</button>
    </form>
    
    `);
    regisrationForm.show();
    form = document.querySelector('#registrationForm');
    google = document.querySelector('#google');
    form.addEventListener('submit', registration);
    google.addEventListener('click', googleOpen);

    formLog = document.querySelector('#loginForm');
    formLog.addEventListener('submit', login);

    cancelBtn = document.querySelector('#cancel');
    cancelBtn.addEventListener('click', modalClose);
}

function modalClose() {
    regisrationForm.close();
}

async function registration(event) {
    event.preventDefault();
    const email = form.email.value;
    const password = form.password.value;
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        user = userCredential.user;
        user.displayName = form.login.value;
        updateUser(user.displayName);
        sessionStorage.setItem('user', JSON.stringify(user));
        signUp.dispatchEvent(loginUser);
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        regisrationForm.close();
    }
    signUp.textContent = user.displayName || 'Anonymous';
    signUp.removeEventListener('click', registerOpen);
    signUp.addEventListener('click', logOutForm);
    return user;
}

function login(event) {
    event.preventDefault();
    const email = formLog.emailLog.value;
    const password = formLog.passwordLog.value;
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            user = userCredential.user;
            sessionStorage.setItem('user', JSON.stringify(user));
            signUp.dispatchEvent(loginUser);
            signUp.textContent = user.displayName || 'Anonymous';
            signUp.removeEventListener('click', registerOpen);
            signUp.addEventListener('click', logOutForm);
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(
                'errorCode =',
                error.code,
                'errorMessage =',
                error.message
            );
        })
        .finally(() => {
            regisrationForm.close();
        });
}

function updateUser(userName) {
    updateProfile(auth.currentUser, {
        displayName: userName,
    }).then(
        function () {
            console.log(user.displayName);
        },
        function (error) {
            console.log(error);
        }
    );
}

function googleOpen() {
    signInWithPopup(auth, provider)
        .then(result => {
            user = result.user;
            sessionStorage.setItem('user', JSON.stringify(user));
            signUp.dispatchEvent(loginUser);
            signUp.textContent = user.displayName;
            signUp.removeEventListener('click', registerOpen);
            signUp.addEventListener('click', logOutForm);
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        })
        .finally(() => {
            regisrationForm.close();
        });
}

export function logOutForm() {
    regisrationForm = basicLightbox.create(/*html*/ `
    <div class="form__container">
        <p class="form__question">Do you want to finish your session?</p>
        <button class ="form__button" type='button' id='logOutBtn'>Logout</button>
        <button class ="form__button" type='button' id='cancel'>Cancel</button>
    </div>`);
    regisrationForm.show();
    const logOutBtn = document.querySelector('#logOutBtn');
    logOutBtn.addEventListener('click', logOut);
    const cancelBtn = document.querySelector('#cancel');
    cancelBtn.addEventListener('click', modalClose);
}

function logOut() {
    sessionStorage.removeItem('user');
    signUp.removeEventListener('click', logOutForm);
    signUp.addEventListener('click', registerOpen);
    signUp.textContent = 'Login | Join';
    regisrationForm.close();

    document.location.reload();
}
