// Page elements
const themeToggle = document.querySelector('#themeToggle');
const body = document.querySelector('body');
const header = document.querySelector('header');
const logoImg = document.querySelector('.logo img');
const title = document.querySelector('h1');
const logo = document.querySelector('.logo');
const btnPrev = document.querySelector('.prev');
const btnNext = document.querySelector('.next');
const numberPage = document.querySelector('.numberPage');
const main = document.querySelector('main');
const moviesContainer = document.querySelector('.containerMovies');
const form = document.querySelector('form');
const inputMovieName = document.querySelector('#movieName');

// Url parameters
const API_KEY = '00a7e4e48d512ff2fd6a51f14146d5a7';
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const INIT_URL = buildQueryURL();

// Custom parameters
let movieName;
let currentPage = 1;

// Logo event listener
logo.addEventListener('click', () => {
    showMovies(INIT_URL);
});

// Beginning of the theme change logic
function removeTheme(theme) {
    body.classList.remove(`body${theme}Theme`);
    header.classList.remove(`header${theme}Theme`);
    title.classList.remove(`title${theme}Theme`);
}

function addTheme(theme) {
    body.classList.add(`body${theme}Theme`);
    header.classList.add(`header${theme}Theme`);
    logoImg.setAttribute('src', `./src/images/logo-${theme.toLowerCase()}-theme.png`)
    title.classList.add(`title${theme}Theme`);

    const detailsCard = document.querySelector('.detailsMovieCard');
    if(detailsCard) {
        detailsCard.classList.toggle('detailsMovieCardDark', theme === 'Dark');
    }    
}

themeToggle.addEventListener('change', () => {    
    const theme = themeToggle.checked ? 'Dark' : 'Light';
    removeTheme(theme === 'Dark' ? 'Light' : 'Dark');
    addTheme(theme);
});
// End of the theme change logic

// Beginning of the search movie logic
function buildQueryURL(searchTerm = '', page = 1) {
    const isSearch = searchTerm.trim().length > 0;

    return isSearch ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(searchTerm)}&page=${page}` : `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=${page}`;
}

function showInputError() {
    const label = document.querySelector('.filter label');
    const msgError = document.querySelector('.containerFilter p');

    label.classList.add('balanceLabel');
    msgError.classList.remove('hideMsgErro');

    setTimeout(() => {
        label.classList.remove('balanceLabel');
        msgError.classList.add('hideMsgErro');
    }, 500);
}

async function searchMovie(evt) {
    evt.preventDefault();
    
    const formData = new FormData(form);

    const searchTerm = formData.get('movieName');

    if(!searchTerm) {
        showInputError();
        return
    }
    
    movieName = searchTerm;
    
    const searchURL = buildQueryURL(movieName);

    try {
        showMovies(searchURL);
    }catch(error) {
        console.error('Erro ao buscar filmes:', error);
    }

    inputMovieName.value = '';
    updatePagination(); 
}

form.addEventListener('submit', searchMovie);
// End of the seach movie logic

// Beginning of the details movie card logic
function createDetailsMovieContainer() {
    const detailsMovieContainer = document.createElement('div');
    detailsMovieContainer.classList.add('detailsMovieContainer');

    return detailsMovieContainer;
}

function createDetailsMovieCard(header, cover , details) {
    const detailsMovieCard = document.createElement('div');
    detailsMovieCard.classList.add('detailsMovieCard');

    if(themeToggle.checked) detailsMovieCard.classList.add('detailsMovieCardDark');

    detailsMovieCard.append(header, cover, details);

    return detailsMovieCard;
}

function createDetailsCardHeader(detailsMovieContainer) {
    const detailsMovieCardHeader = document.createElement('div');
    detailsMovieCardHeader.classList.add('detailsCardHeader');
    const btnClose = document.createElement('button');
    btnClose.innerHTML = `<span class="material-symbols-outlined">close</span>`;

    btnClose.addEventListener('click', () => {
        detailsMovieContainer.remove();
    });

    detailsMovieCardHeader.appendChild(btnClose);

    return detailsMovieCardHeader;
}

function createDetailsMovieCardCover(movie) {
    const detailsCardCover = document.createElement('img');
    detailsCardCover.setAttribute('src', `${BASE_IMG_URL}${movie.poster_path}`);
    detailsCardCover.setAttribute('alt', `Capa do filme ${movie.title}`);

    detailsCardCover.onerror = () => {
        detailsCardCover.src = './src/images/unavailable_cover.png';
        detailsCardCover.alt = `Capa indisponível`;
    }

    return detailsCardCover;
}

function createDetailsMovieCardInfo(movie) {
    const detailsCardInfo = document.createElement('div');
    detailsCardInfo.classList.add('detailsCardInfo');

    const safeValue = (value, fallback = 'Indisponível') => value || fallback;
    
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = `${safeValue(movie.title)}`;

    const enTitle = document.createElement('p');
    enTitle.innerHTML = `<span>Título original:</span> ${safeValue(movie.original_title)}`;

    const originalLang = document.createElement('p');
    originalLang.innerHTML = `<span>Idioma original:</span> ${safeValue(movie.original_language.toUpperCase())}`;

    const popularity = document.createElement('p');
    popularity.innerHTML = `<span>Popularidade:</span> ${safeValue(movie.popularity)}`;

    const releaseDate = document.createElement('p');
    if(movie.release_date) {
        const [ year, month, day ] = movie.release_date.split('-');

        releaseDate.innerHTML = `<span>Data de lançamento:</span> ${day + '/' + month + '/' + year}`;
    }else {
        releaseDate.innerHTML = '<span>Data de lançamento:</span> Indisponível';
    }

    const average = document.createElement('p');
    average.innerHTML = `<span>Média:</span> ${safeValue(movie.vote_average)}`;

    const overview = document.createElement('p');
    overview.innerHTML = `<span>Sinopse:</span> ${safeValue(movie.overview)}`;

    detailsCardInfo.append(movieTitle, enTitle, originalLang, popularity, releaseDate, average, overview);

    return detailsCardInfo;
}

function showDetailsMovieScreen(movie) {
    const detailsMovieContainer = createDetailsMovieContainer();
    
    const cardHeader = createDetailsCardHeader(detailsMovieContainer);
    const cardCover = createDetailsMovieCardCover(movie);
    const cardInfo = createDetailsMovieCardInfo(movie);

    const detailsMovieCard = createDetailsMovieCard(cardHeader, cardCover, cardInfo);
    detailsMovieContainer.appendChild(detailsMovieCard);
    main.appendChild(detailsMovieContainer);
}
// End of the details movie card logic

// Beginning of the show movie logic
function showNotFoundScreen() {
    const notFoundContainer = document.createElement('div');
    notFoundContainer.classList.add('notFoundContainer');
    
    const notFoundIcon = document.createElement('span');
    notFoundIcon.classList.add('material-symbols-outlined');
    notFoundIcon.textContent = 'movie_off';

    const notFoundText = document.createElement('p');
    notFoundText.textContent = 'Filme não encontrado.';

    notFoundContainer.append(notFoundIcon, notFoundText);
    moviesContainer.appendChild(notFoundContainer);
}

function clearMovies() {
    [...moviesContainer.children].forEach(movie => movie.remove());
}

const certificationsMap = {
    'L': {
        src: './src/images/certification_free.png',
        alt: 'Indicado para todas as idades'
    },
    '10': {
        src: './src/images/certification_10.png',
        alt: 'Indicado para maiores de 10 anos'
    },
    '12': {
        src: './src/images/certification_12.png',
        alt: 'Indicado para maiores de 12 anos'
    },
    '14': {
        src: './src/images/certification_14.png',
        alt: 'Indicado para maiores de 14 anos'
    },
    '16': {
        src: './src/images/certification_16.png',
        alt: 'Indicado para maiores de 16 anos'
    },
    '18': {
        src: './src/images/certification_18.png',
        alt: 'Indicado para maiores de 18 anos'    
    }
};

async function createCardCertification(movie) {
    const certificationImage = document.createElement('img');
    certificationImage.classList.add('ageGroup');
    const { ageGroup } = await getBrazilCertification(movie.id);

    const data = certificationsMap[ageGroup];

    if(data) {
        certificationImage.setAttribute('src', data.src);
        certificationImage.setAttribute('alt', data.alt);
    }else {
        certificationImage.setAttribute('src', './src/images/certification_unavailable.png');
        certificationImage.setAttribute('alt', 'Indicação de faixa etária indisponível');
        certificationImage.classList.add('unavailable');
    }

    return certificationImage;
}

function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('cardMovie');

    const moviePoster = document.createElement('img');
    moviePoster.setAttribute('src', `${BASE_IMG_URL}${movie.poster_path}`);
    moviePoster.setAttribute('alt', `Capa do filme ${movie.title}`);

    moviePoster.onerror = () => {
        moviePoster.src = './src/images/unavailable_cover.png';
        moviePoster.alt = 'Capa indisponível';
    }

    const overlayMovieCard = document.createElement('div');
    overlayMovieCard.classList.add('overlay');

    const movieTitle = document.createElement('h2');
    movieTitle.textContent = movie.title;

    const btnDetais = document.createElement('button');
    btnDetais.textContent = 'Detalhes';

    btnDetais.addEventListener('click', () => showDetailsMovieScreen(movie));

    overlayMovieCard.append(movieTitle, btnDetais);

    movieCard.append(moviePoster, overlayMovieCard);

    return movieCard;
}

async function addCertificationToCard(movie, movieCard) {
    const certification = await createCardCertification(movie);
    movieCard.appendChild(certification);
}

function updatePagination(data) {
    btnPrev.disabled = data.page === 1;
    btnPrev.classList.toggle('disabledBtn', data.page === 1);

    btnNext.disabled = data.page === data.total_pages;
    btnNext.classList.toggle('disabledBtn', data.page === data.total_pages);

    numberPage.textContent = data.page;
}

async function getBrazilCertification(movieId) {
    const url = `${BASE_URL}/movie/${movieId}/release_dates?api_key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const ageGroupInfo = data.results.find(info => info.iso_3166_1 === 'BR');

    if(!ageGroupInfo || !ageGroupInfo.release_dates.length) {
        return {
            ageGroup: 'Indisponível',
            descriptors: []
        };
    }

    const { certification, descriptors } = ageGroupInfo.release_dates[0];

    return {
        ageGroup: certification || 'Indisponível',
        descriptors: descriptors || []
    };
}

async function showMovies(URL) {
    try {
        const response = await fetch(URL);
        const data = await response.json();

        clearMovies();

        if(!data.results.length) {
            showNotFoundScreen();
            updatePagination(data);
            return
        }

        data.results.forEach(movie => {
            const movieCard = createMovieCard(movie);
            addCertificationToCard(movie, movieCard);
            moviesContainer.appendChild(movieCard);
        });

        updatePagination(data);

    }catch(error) {
        console.error('Erro ao carregar filmes: ', error);
    }
}

showMovies(INIT_URL);
// End of the show movie logic

// Beginning of the changing pages logic
btnPrev.addEventListener('click', async () => {
    clearMovies()

    currentPage--;
    const searchURL = buildQueryURL(movieName, currentPage);

    try {
        await showMovies(searchURL);
    } catch (error) {
        console.error('Erro ao carregar página anterior:', error);
    }
});

btnNext.addEventListener('click', async () => {
    clearMovies();

    currentPage++;
    const searchURL = buildQueryURL(movieName, currentPage);

    try {
        await showMovies(searchURL);
    } catch (error) {
        console.error('Erro ao carregar próxima página:', error);
    }
});
// End of the changing pages logic