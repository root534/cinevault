import dotenv from 'dotenv';

dotenv.config();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_TOKEN;
const TMDB_LANGUAGE = process.env.TMDB_LANGUAGE || 'it-IT';

async function tmdbFetch(endpoint, params = {}) {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

    url.searchParams.set('language', TMDB_LANGUAGE);

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, value);
        }
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    });

    if (!response.ok) {
        const error = new Error(`TMDB error: ${response.status}`);

        error.status = response.status === 404 ? 404 : 502;

        throw error;
    }

    return await response.json();
}

// Service per ottenere una pagina di film popolari da TMDB
export async function getPopularMovies(page = 1) {
    return tmdbFetch('/movie/popular', {
        page
    });
}
export async function searchMovies(query, page = 1) {
    return tmdbFetch('/search/movie', {
        query,
        page
    });
}

export async function getMovieDetails(id) {
    console.log('[TMDB SERVICE] getMovieDetails');

    return tmdbFetch(`/movie/${id}`);
}

export async function discoverMovies(filters = {}) {
    return tmdbFetch('/discover/movie', filters);
}