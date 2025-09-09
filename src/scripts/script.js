// theme slider
const themeToogle = document.querySelector('#themeToogle');

// header elements
const body = document.querySelector('body');
const header = document.querySelector('header');
const logoImg = document.querySelector('.logo img');
const title = document.querySelector('h1');
const logo = document.querySelector('.logo');

logo.addEventListener('click', () => {
    showMovies();
    setButtons();
    numberPage.textContent = 1;
    currentPage = 1;
});

const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const numberPage = document.querySelector('.numberPage');

themeToogle.addEventListener('change', () => {
    const detailsCard = document.querySelector('.detailsMovieCard');
    
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

        // setting theme of detailsCard
        if(detailsCard) {
            detailsCard.classList.add('detailsMovieCardDark');
        }
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

        // setting theme of detailsCard
        if(detailsCard) {
            detailsCard.classList.remove('detailsMovieCardDark');
        }
    }
});

// request settings
const API_KEY = '00a7e4e48d512ff2fd6a51f14146d5a7';
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w500/';
let currentPage = 1;
let queryURL;

const moviesContainer = document.querySelector('.containerMovies');

const inputMovieName = document.querySelector('#movieName');
let movieName;
const btnSearchMovie = document.querySelector('.btnSearch');

async function searchMovie() {
    try {
        movieName = inputMovieName.value.trim();
        queryURL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(movieName)}&page=1`;

        currentPage = 1;
        numberPage.textContent = currentPage;

        showMovies(queryURL);
    }catch(error) {
        console.error(error);
    }

    inputMovieName.value = '';
    setButtons();    
}

function setButtons() {
    btnPrev.disabled = true;
    btnPrev.classList.add('disabledBtn');

    btnNext.disabled = false;
    btnNext.classList.remove('disabledBtn');
}

const main = document.querySelector('main');

function showDetailsMovieScreen(movie) {
    const detailsMovieContainer = document.createElement('div');
    detailsMovieContainer.classList.add('detailsMovieContainer');

    const detailsMovieCard = document.createElement('div');
    detailsMovieCard.classList.add('detailsMovieCard');
    if(themeToogle.checked) detailsMovieCard.classList.add('detailsMovieCardDark')

    const detailsMovieCardHeader = document.createElement('div');
    detailsMovieCardHeader.classList.add('detailsCardHeader');
    const btnClose = document.createElement('button');
    btnClose.innerHTML = `<span class="material-symbols-outlined">close</span>`;

    btnClose.addEventListener('click', () => {
        detailsMovieContainer.remove();
    });

    detailsMovieCardHeader.appendChild(btnClose);

    const detailsCardCover = document.createElement('img');
    detailsCardCover.setAttribute('src', `${BASE_IMG_URL}${movie.poster_path}`);
    detailsCardCover.setAttribute('alt', 'Capa do filme');

    const detailsCardInfo = document.createElement('div');
    detailsCardInfo.classList.add('detailsCardInfo');
    
    const mainTitle = document.createElement('h2');
    mainTitle.textContent = `${movie.title ? movie.title : 'Indisponível'}`;
    const enTitle = document.createElement('p');
    enTitle.innerHTML = `<span>Título original:</span> ${movie.original_title ? movie.original_title : 'Indisponível'}`;
    const originalLang = document.createElement('p');
    originalLang.innerHTML = `<span>Idioma original:</span> ${movie.original_language ? movie.original_language.toUpperCase() : 'Indisponível'}`;
    const popularity = document.createElement('p');
    popularity.innerHTML = `<span>Popularidade:</span> ${movie.popularity ? movie.popularity : 'Indisponível'}`;
    const releaseDate = document.createElement('p');
    const date = movie.release_date.split('-');
    releaseDate.innerHTML = `<span>Data de lançamento:</span> ${date[0] ? date[2] + '/' + date[1] + '/' + date[0] : 'Indisponível'}`;
    const average = document.createElement('p');
    average.innerHTML = `<span>Média:</span> ${movie.vote_average ? movie.vote_average : 'Indisponível'}`;
    const overview = document.createElement('p');
    overview.innerHTML = `<span>Descrição:</span> ${movie.overview === '' ? 'Indisponível': movie.overview}`;

    detailsCardInfo.append(mainTitle, enTitle, originalLang, popularity, releaseDate, average, overview);

    detailsMovieCard.append(detailsMovieCardHeader, detailsCardCover, detailsCardInfo);
    detailsMovieContainer.appendChild(detailsMovieCard);
    main.appendChild(detailsMovieContainer);
}

btnSearchMovie.addEventListener('click', () => searchMovie());

async function showMovies(URL, page = 1) {
    try {
        const response = await fetch(URL || `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&page=${page}`);

        const data = await response.json();

        console.log(data);

        if(moviesContainer.children) {
            [...moviesContainer.children].forEach(filme => filme.remove());
        }

        if(!data.results.length) {
            const notFoundContainer = document.createElement('div');
            notFoundContainer.classList.add('notFoundContainer');
            
            const notFoundIcon = document.createElement('span');
            notFoundIcon.classList.add('material-symbols-outlined');
            notFoundIcon.textContent = 'movie_off';

            const notFoundText = document.createElement('p');
            notFoundText.textContent = 'Filme não encontrado.';

            notFoundContainer.append(notFoundIcon, notFoundText);
            moviesContainer.appendChild(notFoundContainer);
        }else {
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

                btnDetais.addEventListener('click', () => showDetailsMovieScreen(filme));

                overlayMovieCard.append(movieTitle, btnDetais);

                movieCard.append(moviePoster, overlayMovieCard);

                moviesContainer.appendChild(movieCard);
            })
        }

        if(data.page === data.total_pages) {
            btnNext.disabled = true;
            btnNext.classList.add('disabledBtn');
        }

    }catch(error) {
        console.error('Tipo de erro: ', error);
    }
}

showMovies();

btnPrev.addEventListener('click', () => {
    [...moviesContainer.children].forEach(filme => filme.remove());

    currentPage--;
    if(queryURL) {
        queryURL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(movieName)}&page=${currentPage}`;
    }
    showMovies(queryURL, currentPage);

    numberPage.textContent = currentPage;

    if(currentPage === 1) {
        btnPrev.disabled = true;
        btnPrev.classList.add('disabledBtn');
    }

    if(btnNext.disabled) {
        btnNext.disabled = false;
        btnNext.classList.remove('disabledBtn');
    }
});

btnNext.addEventListener('click', () => {
    if(btnPrev.disabled) {
        btnPrev.disabled = false;
        btnPrev.classList.remove('disabledBtn');
    }

    [...moviesContainer.children].forEach(filme => filme.remove());
    
    currentPage++;
    if(queryURL) {
        queryURL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(movieName)}&page=${currentPage}`;
    }
    showMovies(queryURL, currentPage);

    numberPage.textContent = currentPage;
});