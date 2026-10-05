import {
    getPopularMovies as fetchPopularMovies,
    searchMovies as fetchSearchMovies,
    getMovieDetails as fetchMovieDetails,
    discoverMovies as fetchDiscoverMovies
} from '../utils/tmdb.js';

// Numero massimo di pagine supportate da TMDB
const MAX_TMDB_PAGES = 500;

function normalizeMovie(movie) {
    return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        popularity: movie.popularity,
        poster: movie.poster_path
    };
}

// Service per ottenere una pagina di film popolari
export async function getPopularMovies(page = 1) {
    const data = await fetchPopularMovies(page);

    return {
        page: data.page,
        totalPages: Math.min(data.total_pages, MAX_TMDB_PAGES),
        totalResults: data.total_results,
        results: data.results.map(normalizeMovie)
    };
}


export async function searchMovies(query, page = 1) {
    const data = await fetchSearchMovies(query, page);

    return {
        page: data.page,
        totalPages: Math.min(data.total_pages, MAX_TMDB_PAGES),
        totalResults: data.total_results,
        results: data.results.map(normalizeMovie)
    };
}

export async function getMovieDetails(id) {

    console.log('[BE SERVICE] getMovieDetails');
    
    const movie = await fetchMovieDetails(id);

    return {
        id: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        voteCount: movie.vote_count,
        genres: movie.genres,
        originalLanguage: movie.original_language,
        popularity: movie.popularity,
        poster: movie.poster_path
    };
}

export async function discoverMovies(year, minRating, page = 1) {
   
    console.log('[BE] discover values:', {
        year: year ? Number(year) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        page: Number(page)
    });

    const data = await fetchDiscoverMovies({
        primary_release_year: year,
        'vote_average.gte': minRating,
        page
    });

    return {
        page: data.page,
        totalPages: Math.min(data.total_pages, MAX_TMDB_PAGES),
        totalResults: data.total_results,
        results: data.results.map(normalizeMovie)
    };
}