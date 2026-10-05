import {
    getPopularMovies,
    searchMovies,
    getMovieDetails,
    discoverMovies
} from '../services/movieService.js';

import { movieEvents } from '../events/movieEvents.js';


// Controller per ottenere una pagina di film popolari
export async function popularMovies(req, res, next) {
    try {
        const { page = 1 } = req.query;

        const movies = await getPopularMovies(Number(page));

        res.json(movies);
    } catch (error) {
        next(error);
    }
}

// Controller per ottenere una pagina di film popolari
export async function searchMoviesController(req, res, next) {
    try {
        const { query, page = 1 } = req.query;

        const movies = await searchMovies(query, Number(page));

        movieEvents.emit('movieSearched', {
            query
          });

        res.json(movies);
    } catch (error) {
        next(error);
    }
}

export async function movieDetails(req, res, next) {
    try {
        const { id } = req.params;

        console.log('[BE CONTROLLER] movieDetails');

        const movie = await getMovieDetails(Number(id));

           movieEvents.emit('movieViewed', {
            id: Number(id)
        });

        res.json(movie);
    } catch (error) {
        next(error);
    }
}

export async function discoverMoviesController(req, res, next) {
    try {
        const { year, minRating, page = 1 } = req.query;


        console.log('[BE] discover query:', {
                                            year,
                                            minRating,
                                            page
                                        });


                                        
        const movies = await discoverMovies(
                            year ? Number(year) : undefined,
                            minRating ? Number(minRating) : undefined,
                            Number(page)
                        );

        res.json(movies);
    } catch (error) {
        next(error);
    }
}


