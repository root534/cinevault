const FAVORITES_KEY = 'cinevault_favorites';
const WATCHLIST_KEY = 'cinevault_watchlist';
const WATCHED_KEY = 'cinevault_watched';
const RATINGS_KEY = 'cinevault_ratings';

// ---------- GENERIC ----------

function getArray(key) {
    const data = localStorage.getItem(key);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

function saveArray(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}

// ---------- FAVORITES ----------

export function getFavorites() {
    return getArray(FAVORITES_KEY);
}

export function addToFavorites(movieId) {
    const favorites = getFavorites();

    if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        saveArray(FAVORITES_KEY, favorites);
    }

    return favorites;
}

export function removeFromFavorites(movieId) {
    const favorites = getFavorites();

    const updatedFavorites = favorites.filter(
        id => id !== movieId
    );

    saveArray(FAVORITES_KEY, updatedFavorites);

    return updatedFavorites;
}

// ---------- WATCHLIST ----------

export function getWatchlist() {
    return getArray(WATCHLIST_KEY);
}

export function addToWatchlist(movieId) {
    const watchlist = getWatchlist();

    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        saveArray(WATCHLIST_KEY, watchlist);
    }

    return watchlist;
}

export function removeFromWatchlist(movieId) {
    const watchlist = getWatchlist();

    const updatedWatchlist = watchlist.filter(
        id => id !== movieId
    );

    saveArray(WATCHLIST_KEY, updatedWatchlist);

    return updatedWatchlist;
}

// ---------- WATCHED ----------

export function getWatched() {
    return getArray(WATCHED_KEY);
}

export function addToWatched(movieId) {
    const watched = getWatched();

    if (!watched.includes(movieId)) {
        watched.push(movieId);
        saveArray(WATCHED_KEY, watched);
    }

    return watched;
}

export function removeFromWatched(movieId) {
    const watched = getWatched();

    const updatedWatched = watched.filter(
        id => id !== movieId
    );

    saveArray(WATCHED_KEY, updatedWatched);

    return updatedWatched;
}

// ---------- RATINGS ----------

export function getRatings() {
    const data = localStorage.getItem(RATINGS_KEY);

    if (!data) {
        return {};
    }

    return JSON.parse(data);
}

export function setRating(movieId, rating) {
    const ratings = getRatings();

    ratings[movieId] = rating;

    localStorage.setItem(
        RATINGS_KEY,
        JSON.stringify(ratings)
    );

    return ratings;
}

export function removeRating(movieId) {
    const ratings = getRatings();

    delete ratings[movieId];

    localStorage.setItem(
        RATINGS_KEY,
        JSON.stringify(ratings)
    );

    return ratings;
}

// ---------- VECCHIA COLLEZIONE ----------

const COLLECTION_KEY = 'cinevault_collection';

export function getCollection() {
    return getArray(COLLECTION_KEY);
}

export function addToCollection(movie) {
    const collection = getCollection();

    if (!collection.some(item => item.id === movie.id)) {
        collection.push(movie);
        saveArray(COLLECTION_KEY, collection);
    }

    return collection;
}

export function removeFromCollection(movieId) {
    const collection = getCollection();

    const updatedCollection = collection.filter(
        movie => movie.id !== movieId
    );

    saveArray(COLLECTION_KEY, updatedCollection);

    return updatedCollection;
}