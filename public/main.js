import {
    getCollection,
    addToCollection,
    removeFromCollection,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getWatched,
    addToWatched,
    removeFromWatched,
    getRatings,
    setRating,
    removeRating
} from './services/storageService.js';


const moviesContainer = document.getElementById('movies-container');
const movieDetail = document.getElementById('movie-detail');

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');

const moviesSection = document.getElementById('movies-section');
const pagination = document.getElementById('pagination');
const moviesTitle =
    document.querySelector('#movies-section h2');

// Elementi per la gestione dei filtri
const filterToggle =
    document.querySelector('#filter-toggle');

const movieFilters =
    document.querySelector('#movie-filters');

const filterButton =
    document.querySelector('#filter-button');

// Elementi per la gestione della collezione
const collectionButton =
    document.getElementById('collection-button');

const collectionSection =
    document.getElementById('collection-section');

const collectionContainer =
    document.getElementById('collection-container');

const backToMoviesFromCollection =
    document.getElementById(
        'back-to-movies-from-collection'
    );


// ============================================================
// STATO DELL'APPLICAZIONE
// ============================================================

let searchTimeout;

let currentSearchQuery = '';

let currentPage = 1;
let totalPages = 1;

let currentFilters = {
    year: '',
    minRating: ''
};


// ============================================================
// UTILITY UI
// ============================================================

function closeSearchSuggestions() {
    searchResults.innerHTML = '';
}

function closeFilterPanel() {
    movieFilters.classList.remove('open');
    filterToggle.setAttribute('aria-expanded', 'false');
}


// ============================================================
// NAVIGAZIONE
// ============================================================

// Torna dalla collezione alla lista dei film
backToMoviesFromCollection.addEventListener(
    'click',
    showMovies
);

// Mostra la collezione
collectionButton.addEventListener(
    'click',
    showCollection
);


// ============================================================
// FILTRI
// ============================================================

// Mostra / nasconde il pannello dei filtri
filterToggle.addEventListener(
    'click',
    () => {

        const isOpen =
            movieFilters.classList.toggle('open');

        filterToggle.setAttribute(
            'aria-expanded',
            isOpen
        );
    }
);


// Applica i filtri
filterButton.addEventListener(
    'click',
    () => {

        const year =
            document.getElementById(
                'filter-year'
            ).value;

        const minRating =
            document.getElementById(
                'filter-rating'
            ).value;

        currentFilters.year = year;
        currentFilters.minRating = minRating;

        // Quando applichiamo un filtro,
        // usciamo dalla modalità ricerca
        currentSearchQuery = '';

        searchInput.value = '';
        searchResults.innerHTML = '';

        currentPage = 1;

        closeFilterPanel();
        closeSearchSuggestions();

        moviesTitle.textContent =
            'Film filtrati';

        showMovies();

        loadMoviesPage();
    }
);


// ============================================================
// API - FILM POPOLARI
// ============================================================

async function getPopularMovies(page = 1) {

    const response = await fetch(
        `/api/movies/popular?page=${page}`
    );

    if (!response.ok) {

        throw new Error(
            'Errore nel caricamento dei film'
        );
    }

    return await response.json();
}


// ============================================================
// API - RICERCA
// ============================================================

async function searchMovies(
    query,
    page = 1
) {

    const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {

        throw new Error(
            'Errore nella ricerca dei film'
        );
    }

    return await response.json();
}


// ============================================================
// API - FILTRI
// ============================================================

async function discoverMovies(
    year,
    minRating,
    page = 1
) {

    const params = new URLSearchParams();

    // Il filtro anno è opzionale
    if (year) {

        params.set(
            'year',
            year
        );
    }

    // Il filtro rating è opzionale
    if (minRating) {

        params.set(
            'minRating',
            minRating
        );
    }

    params.set(
        'page',
        page
    );

    const response = await fetch(
        `/api/movies/discover?${params.toString()}`
    );

    if (!response.ok) {

        throw new Error(
            'Errore nel caricamento dei film filtrati'
        );
    }

    return await response.json();
}


// ============================================================
// API - DETTAGLIO FILM
// ============================================================

async function getMovieDetails(id) {

    const response = await fetch(
        `/api/movies/${id}`
    );

    if (!response.ok) {

        throw new Error(
            'Errore nel caricamento del dettaglio'
        );
    }

    return await response.json();
}


// ============================================================
// CARICAMENTO FILM
// ============================================================

async function loadMoviesPage() {

    try {

        let data;

        // 1. Ricerca
        if (currentSearchQuery) {

            data = await searchMovies(
                currentSearchQuery,
                currentPage
            );

        // 2. Filtri
        } else if (
            currentFilters.year ||
            currentFilters.minRating
        ) {

            data = await discoverMovies(
                currentFilters.year,
                currentFilters.minRating,
                currentPage
            );

        // 3. Film popolari
        } else {

            data = await getPopularMovies(
                currentPage
            );
        }

        currentPage = data.page;
        totalPages = data.totalPages;

        console.log(
            'Pagina:',
            currentPage
        );

        console.log(
            'Totale pagine:',
            totalPages
        );

        renderMovies(
            data.results
        );

        renderPagination();

        return data;

    } catch (error) {

        console.error(error);

        pagination.style.display = 'none';

        moviesContainer.innerHTML = `
            <div class="no-results">
                Errore nel caricamento dei film.
            </div>
        `;
    }
}


// ============================================================
// RENDER FILM
// ============================================================

function renderMovies(movies) {

    moviesContainer.innerHTML = '';

    movies.forEach(
        movie => {

            moviesContainer.appendChild(
                renderMovieCard(movie)
            );
        }
    );
}


// ============================================================
// CARD FILM
// ============================================================

function renderMovieCard(movie) {

    const card =
        document.createElement('article');

    card.classList.add(
        'movie-card'
    );

    const posterUrl = movie.poster
        ? `https://image.tmdb.org/t/p/w500${movie.poster}`
        : null;

    const isFavorite =
        getFavorites().includes(movie.id);

    const inWatchlist =
        getWatchlist().includes(movie.id);

    const isWatched =
        getWatched().includes(movie.id);

    card.innerHTML = `
        <div class="poster-container">

            ${
                posterUrl
                    ? `
                        <img
                            src="${posterUrl}"
                            alt="${movie.title}"
                        >
                    `
                    : `
                        <div>
                            Poster non disponibile
                        </div>
                    `
            }

        </div>

        <div class="movie-info">

            <h3>${movie.title}</h3>

            <p>
                Data: ${movie.releaseDate || 'N/D'}
            </p>

            <p>
                ⭐ ${movie.rating ?? 'N/D'}
            </p>

            <button
                type="button"
                data-id="${movie.id}"
            >
                Dettagli
            </button>

            <div class="movie-actions">

                <button
                    type="button"
                    class="favorite-button"
                    title="Preferito"
                >
                    ${isFavorite ? '★' : '☆'}
                </button>

                <button
                    type="button"
                    class="watchlist-button"
                    title="Watchlist"
                >
                    ${inWatchlist ? '✓' : '＋'}
                </button>

                <button
                    type="button"
                    class="watched-button"
                    title="Segna come visto"
                >
                    ${isWatched ? '✓' : '○'}
                </button>

            </div>

        </div>
    `;

    const favoriteButton =
        card.querySelector(
            '.favorite-button'
        );

    const watchlistButton =
        card.querySelector(
            '.watchlist-button'
        );

    const watchedButton =
        card.querySelector(
            '.watched-button'
        );


    // ========================================================
    // PREFERITO
    // ========================================================

    favoriteButton.addEventListener(
        'click',
        event => {

            event.stopPropagation();

            if (
                getFavorites().includes(movie.id)
            ) {

                removeFromFavorites(
                    movie.id
                );

                favoriteButton.textContent =
                    '☆';

            } else {

                addToFavorites(
                    movie.id
                );

                favoriteButton.textContent =
                    '★';
            }
        }
    );


    // ========================================================
    // WATCHLIST
    // ========================================================

    watchlistButton.addEventListener(
        'click',
        event => {

            event.stopPropagation();

            if (
                getWatchlist().includes(movie.id)
            ) {

                removeFromWatchlist(
                    movie.id
                );

                watchlistButton.textContent =
                    '＋';

            } else {

                addToWatchlist(
                    movie.id
                );

                watchlistButton.textContent =
                    '✓';
            }
        }
    );


    // ========================================================
    // FILM VISTO
    // ========================================================

    watchedButton.addEventListener(
        'click',
        event => {

            event.stopPropagation();

            if (
                getWatched().includes(movie.id)
            ) {

                removeFromWatched(
                    movie.id
                );

                watchedButton.textContent =
                    '○';

            } else {

                addToWatched(
                    movie.id
                );

                watchedButton.textContent =
                    '✓';
            }
        }
    );

    return card;
}


// ============================================================
// PAGINAZIONE
// ============================================================

function renderPagination() {

    pagination.innerHTML = '';

    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }

    pagination.style.display = 'flex';

    pagination.innerHTML = `
        <button
            type="button"
            id="first-page"
            ${currentPage === 1 ? 'disabled' : ''}
        >
            « Prima
        </button>

        <button
            type="button"
            id="previous-page"
            ${currentPage === 1 ? 'disabled' : ''}
        >
            ‹ Precedente
        </button>

        <span>
            Pagina ${currentPage} di ${totalPages}
        </span>

        <button
            type="button"
            id="next-page"
            ${currentPage === totalPages ? 'disabled' : ''}
        >
            Successiva ›
        </button>

        <button
            type="button"
            id="last-page"
            ${currentPage === totalPages ? 'disabled' : ''}
        >
            Ultima »
        </button>
    `;
}


// Gestione click sulla paginazione
pagination.addEventListener(
    'click',
    event => {

        if (
            !event.target.matches('button')
        ) {
            return;
        }

        const buttonId =
            event.target.id;

        if (
            buttonId === 'first-page'
        ) {

            currentPage = 1;
        }

        if (
            buttonId === 'previous-page'
        ) {

            currentPage--;
        }

        if (
            buttonId === 'next-page'
        ) {

            currentPage++;
        }

        if (
            buttonId === 'last-page'
        ) {

            currentPage = totalPages;
        }

        showMovies();

        loadMoviesPage();
    }
);


// ============================================================
// CLICK SULLE CARD
// ============================================================

moviesContainer.addEventListener(
    'click',
    event => {

        openMovieDetail(
            event,
            false
        );
    }
);

collectionContainer.addEventListener(
    'click',
    event => {

        openMovieDetail(
            event,
            true
        );
    }
);


// ============================================================
// RICERCA - PULSANTE
// ============================================================

searchButton.addEventListener(
    'click',
    async () => {

        const query =
            searchInput.value.trim();

        // Se il campo è vuoto
        // non eseguiamo la ricerca
        if (!query) {
            return;
        }

        console.log(
            'RICERCA PREMUTA:',
            query
        );

        currentSearchQuery =
            query;

        // La ricerca annulla
        // eventuali filtri precedenti
        currentFilters.year = '';
        currentFilters.minRating = '';

        currentPage = 1;

        moviesTitle.textContent =
            'Film';

        searchResults.innerHTML =
            '';

        showMovies();

        await loadMoviesPage();
    }
);


// ============================================================
// RICERCA - INPUT
// ============================================================

searchInput.addEventListener(
    'input',
    () => {

        const query =
            searchInput.value.trim();

        clearTimeout(
            searchTimeout
        );

        if (!query) {

            currentSearchQuery =
                '';

            searchResults.innerHTML =
                '';

            moviesTitle.textContent =
                'Film popolari';

            currentPage = 1;

            showMovies();

            loadMoviesPage();

            return;
        }

        currentSearchQuery =
            query;

        currentFilters.year = '';
        currentFilters.minRating = '';

        currentPage = 1;

        moviesTitle.textContent =
            'Film';

        searchTimeout =
            setTimeout(
                async () => {

                    try {

                        showMovies();

                        const data =
                            await loadMoviesPage();

                        searchResults.innerHTML =
                            '';

                        if (
                            !data ||
                            data.results.length === 0
                        ) {

                            moviesContainer.innerHTML = `
                                <div class="no-results">
                                    Nessun risultato trovato
                                </div>
                            `;

                            return;
                        }

                        data.results
                            .slice(0, 5)
                            .forEach(
                                movie => {

                                    const item =
                                        document.createElement(
                                            'button'
                                        );

                                    item.type =
                                        'button';

                                    item.dataset.id =
                                        movie.id;

                                    item.textContent =
                                        movie.title;

                                    searchResults
                                        .appendChild(
                                            item
                                        );
                                }
                            );

                    } catch (error) {

                        console.error(error);
                    }

                },
                300
            );
    }
);


// ============================================================
// RICERCA - TASTIERA
// ============================================================

searchInput.addEventListener(
    'keydown',
    event => {

        const items =
            searchResults.querySelectorAll(
                'button'
            );

        if (!items.length) {
            return;
        }

        if (
            event.key === 'ArrowDown'
        ) {

            event.preventDefault();

            items[0].focus();
        }
    }
);


searchResults.addEventListener(
    'keydown',
    event => {

        const items =
            searchResults.querySelectorAll(
                'button'
            );

        const currentIndex =
            [...items].indexOf(
                document.activeElement
            );

        if (currentIndex === -1) {
            return;
        }

        if (
            event.key === 'ArrowDown'
        ) {

            event.preventDefault();

            const nextIndex =
                currentIndex < items.length - 1
                    ? currentIndex + 1
                    : 0;

            items[nextIndex].focus();
        }

        if (
            event.key === 'ArrowUp'
        ) {

            event.preventDefault();

            const previousIndex =
                currentIndex > 0
                    ? currentIndex - 1
                    : items.length - 1;

            items[previousIndex].focus();
        }
    }
);


// ============================================================
// RICERCA - CLICK SUGGERIMENTO
// ============================================================

searchResults.addEventListener(
    'click',
    async event => {

        if (
            !event.target.matches(
                'button[data-id]'
            )
        ) {
            return;
        }

        const id =
            event.target.dataset.id;

        try {

            const movie =
                await getMovieDetails(id);

            showMovieDetail(
                movie,
                false
            );

            closeSearchSuggestions();
            searchInput.value = '';

        } catch (error) {

            console.error(error);
        }
    }
);


// ============================================================
// DETTAGLIO FILM
// ============================================================

function renderMovieDetail(
    movie,
    fromCollection = false
) {

    const collection =
        getCollection();

    // Recupera l'eventuale
    // valutazione personale
    const ratings =
        getRatings();

    const personalRating =
        ratings[movie.id] ?? '';

    const alreadyInCollection =
        collection.some(
            item => item.id === movie.id
        );

    movieDetail.innerHTML = `

        <button
            type="button"
            id="back-to-detail"
        >
            ${
                fromCollection
                    ? '← Torna alla collezione'
                    : '← Torna ai film'
            }
        </button>

        <article class="movie-detail">

            <div class="poster-container">

                ${
                    movie.poster
                        ? `
                            <img
                                src="https://image.tmdb.org/t/p/w500${movie.poster}"
                                alt="${movie.title}"
                            >
                        `
                        : `
                            <div>
                                Poster non disponibile
                            </div>
                        `
                }

            </div>

            <div class="movie-detail-info">

                <h2>${movie.title}</h2>

                <p>
                    <strong>Titolo originale:</strong>
                    ${movie.originalTitle || 'N/D'}
                </p>

                <p>
                    <strong>Trama:</strong>
                    ${movie.overview || 'N/D'}
                </p>

                <p>
                    <strong>Data di uscita:</strong>
                    ${movie.releaseDate || 'N/D'}
                </p>

                <p>
                    <strong>Valutazione TMDB:</strong>
                    ⭐ ${movie.rating ?? 'N/D'}
                </p>

                <p>
                    <strong>Voti:</strong>
                    ${movie.voteCount ?? 'N/D'}
                </p>

                <!-- Valutazione personale -->

                <div class="personal-rating">

                    <label
                        for="personal-rating-input"
                    >
                        <strong>
                            La mia valutazione:
                        </strong>
                    </label>

                    <input
                        type="number"
                        id="personal-rating-input"
                        min="1"
                        max="10"
                        step="1"
                        value="${personalRating}"
                        placeholder="1-10"
                    >
                    <button
                        type="button"
                        id="save-personal-rating"
                        ${personalRating === ''
                            ? ''
                            : 'disabled'}
                    >
                        Salva
                    </button>
                    <button
                        type="button"
                        id="remove-personal-rating"
                        ${personalRating === ''
                            ? 'disabled'
                            : ''}
                    >
                        Rimuovi
                    </button>

                </div>

                <p>
                    <strong>Lingua originale:</strong>
                    ${movie.originalLanguage || 'N/D'}
                </p>

                <p>
                    <strong>Popolarità:</strong>
                    ${movie.popularity ?? 'N/D'}
                </p>

                <p>
                    <strong>Generi:</strong>
                    ${
                        movie.genres?.length
                            ? movie.genres
                                .map(
                                    genre => genre.name
                                )
                                .join(', ')
                            : 'N/D'
                    }
                </p>

                <button
                    type="button"
                    id="add-to-collection"
                    ${alreadyInCollection
                        ? 'disabled'
                        : ''}
                >
                    ${
                        alreadyInCollection
                            ? '✓ Nella collezione'
                            : '+ Aggiungi alla collezione'
                    }
                </button>

            </div>

        </article>
    `;


    // ========================================================
    // ELEMENTI DEL DETTAGLIO
    // ========================================================

    const backButton =
        document.getElementById(
            'back-to-detail'
        );

    const addButton =
        document.getElementById(
            'add-to-collection'
        );

    const ratingInput =
        document.getElementById(
            'personal-rating-input'
        );

    const saveRatingButton =
        document.getElementById(
            'save-personal-rating'
        );

    const removeRatingButton =
        document.getElementById(
            'remove-personal-rating'
        );


    // ========================================================
    // TORNA INDIETRO
    // ========================================================

    backButton.addEventListener(
        'click',
        () => {

            if (fromCollection) {

                showCollection();

            } else {

                showMovies();
            }
        }
    );


    // ========================================================
    // AGGIUNGI ALLA COLLEZIONE
    // ========================================================

    addButton.addEventListener(
        'click',
        () => {

            addToCollection(
                movie
            );

            addButton.textContent =
                '✓ Nella collezione';

            addButton.disabled =
                true;
        }
    );


    // ========================================================
    // SALVA VALUTAZIONE PERSONALE
    // ========================================================

    saveRatingButton.addEventListener(
        'click',
        () => {

            const rating =
                Number(
                    ratingInput.value
                );

            if (
                !Number.isInteger(rating) ||
                rating < 1 ||
                rating > 10
            ) {

                alert(
                    'Inserisci un voto da 1 a 10.'
                );

                return;
            }

            setRating(
                movie.id,
                rating
            );
            saveRatingButton.disabled = true;
            removeRatingButton.disabled = false;
        }
    );


    // ========================================================
    // RIMUOVI VALUTAZIONE PERSONALE
    // ========================================================

    removeRatingButton.addEventListener(
        'click',
        () => {

            removeRating(
                movie.id
            );

            ratingInput.value =
                '';
            
            saveRatingButton.disabled = false;
            removeRatingButton.disabled = true;
        }
    );
}


// ============================================================
// MOSTRA DETTAGLIO
// ============================================================

function showMovieDetail(
    movie,
    fromCollection = false
) {

    moviesSection.style.display = 'none';
    collectionSection.style.display = 'none';
    movieDetail.style.display = 'block';
    pagination.style.display = 'none';

    closeSearchSuggestions();
    closeFilterPanel();

    renderMovieDetail(
        movie,
        fromCollection
    );
}


// ============================================================
// MOSTRA LISTA FILM
// ============================================================

function showMovies() {

    movieDetail.style.display = 'none';
    collectionSection.style.display = 'none';
    moviesSection.style.display = 'block';
    moviesContainer.style.display = 'grid';

    closeFilterPanel();

    pagination.style.display =
        totalPages > 1 ? 'flex' : 'none';
}


// ============================================================
// APERTURA DETTAGLIO
// ============================================================

async function openMovieDetail(
    event,
    fromCollection
) {

    if (
        !event.target.matches(
            'button[data-id]'
        )
    ) {
        return;
    }

    const id =
        event.target.dataset.id;

    try {

        const movie =
            await getMovieDetails(id);

        showMovieDetail(
            movie,
            fromCollection
        );

    } catch (error) {

        console.error(error);
    }
}


// ============================================================
// COLLEZIONE
// ============================================================

function showCollection() {

    moviesSection.style.display = 'none';
    movieDetail.style.display = 'none';
    collectionSection.style.display = 'block';
    pagination.style.display = 'none';

    closeSearchSuggestions();
    closeFilterPanel();

    const collection =
        getCollection();

    collectionContainer.innerHTML =
        '';

    if (collection.length === 0) {

        collectionContainer.innerHTML = `
            <div class="no-results">
                La tua collezione è vuota
            </div>
        `;

        return;
    }

    collection.forEach(
        movie => {

            const card =
                renderCollectionCard(
                    movie
                );

            collectionContainer.appendChild(
                card
            );
        }
    );
}


// ============================================================
// CARD DELLA COLLEZIONE
// ============================================================

function renderCollectionCard(movie) {

    const card =
        document.createElement('article');

    card.classList.add(
        'movie-card',
        'collection-card'
    );

    const posterUrl = movie.poster
        ? `https://image.tmdb.org/t/p/w500${movie.poster}`
        : null;

    card.innerHTML = `
        <div class="poster-container">

            ${
                posterUrl
                    ? `
                        <img
                            src="${posterUrl}"
                            alt="${movie.title}"
                        >
                    `
                    : `
                        <div>
                            Poster non disponibile
                        </div>
                    `
            }

        </div>

        <div class="movie-info">

            <h3>
                ${movie.title}
            </h3>

            <p>
                Data:
                ${movie.releaseDate || 'N/D'}
            </p>

            <p>
                ⭐ ${movie.rating ?? 'N/D'}
            </p>

            <p class="collection-overview">
                ${
                    movie.overview ||
                    'Descrizione non disponibile.'
                }
            </p>

            <div class="collection-actions">

                <button
                    type="button"
                    data-id="${movie.id}"
                >
                    Dettagli
                </button>

                <button
                    type="button"
                    class="remove-from-collection"
                >
                    🗑 Rimuovi dalla collezione
                </button>

            </div>

        </div>
    `;

    const removeButton =
        card.querySelector(
            '.remove-from-collection'
        );

    removeButton.addEventListener(
        'click',
        event => {

            // Evita che il click venga
            // interpretato come apertura
            // del dettaglio.
            event.stopPropagation();

            removeFromCollection(
                movie.id
            );

            showCollection();
        }
    );

    return card;
}


// ============================================================
// AVVIO APPLICAZIONE
// ============================================================

loadMoviesPage();

