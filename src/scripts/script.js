// theme slider
const themeToogle = document.querySelector('#themeToogle');

// header elements
const body = document.querySelector('body');
const header = document.querySelector('header');
const logoImg = document.querySelector('.logo img');
const title = document.querySelector('h1');

themeToogle.addEventListener('change', () => {
    if(themeToogle.checked) {
        // removing light theme
        body.classList.remove('bodyLightTheme');
        header.classList.remove('headerLightTheme');
        title.classList.remove('titleLightTheme');

        // adding dark theme
        body.classList.add('bodyDarkTheme');
        header.classList.add('headerDarkTheme');
        logoImg.setAttribute('src', './src/images/logo-dark-theme.png')
        title.classList.add('titleDarkTheme');
    }else {
        // removing dark theme
        body.classList.remove('bodyDarkTheme');
        header.classList.remove('headerDarkTheme');
        title.classList.remove('titleDarkTheme');

        // adding dark theme
        body.classList.add('bodyLightTheme');
        header.classList.add('headerLightTheme');
        logoImg.setAttribute('src', './src/images/logo-light-theme.png')
        title.classList.add('titleLightTheme');
    }
});

