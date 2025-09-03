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

// request settings
const API_KEY = '00a7e4e48d512ff2fd6a51f14146d5a7';
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w500/';
let currentPage = 1;

const moviesContainer = document.querySelector('.containerMovies');

async function getMovies(page) {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&page=${page}`);
    
    return response.json();
}

async function showMovies(page = 1) {
    try {
        const data = await getMovies(currentPage);

        data.results.forEach(filme => {

            const movieCard = document.createElement('div');
            movieCard.classList.add('cardMovie');

            const moviePoster = document.createElement('img');
            moviePoster.setAttribute('src', `${BASE_IMG_URL}${filme.poster_path}`);
            moviePoster.setAttribute('alt', 'Capa do filme');

            const overlayMovieCard = document.createElement('div');
            overlayMovieCard.classList.add('overlay');

            const movieTitle = document.createElement('h2');
            movieTitle.textContent = filme.title;

            const btnDetais = document.createElement('button');
            btnDetais.textContent = 'Detalhes';

            overlayMovieCard.append(movieTitle, btnDetais);

            movieCard.append(moviePoster, overlayMovieCard);

            moviesContainer.appendChild(movieCard);
        })

    }catch(error) {
        console.error('Tipo de erro: ', error);
    }
}

showMovies();

const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const numberPage = document.querySelector('.numberPage');

btnPrev.addEventListener('click', () => {
    [...moviesContainer.children].forEach(filme => filme.remove());
    showMovies(--currentPage);

    numberPage.textContent = currentPage;

    if(currentPage === 1) btnPrev.disabled = true;
});

btnNext.addEventListener('click', () => {
    if(btnPrev.disabled) btnPrev.disabled = false;

    [...moviesContainer.children].forEach(filme => filme.remove());
    showMovies(++currentPage);

    numberPage.textContent = currentPage;
});