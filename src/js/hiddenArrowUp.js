export default (() => {
    const refs = {
        upbutton: document.querySelector('.link__up'),
    };

    window.addEventListener('scroll', showArrow);

    function showArrow() {
        if (window.pageYOffset < 100) refs.upbutton.classList.add('isnt-show');
        else refs.upbutton.classList.remove('isnt-show');
    }
})();
