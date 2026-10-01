import express from 'express';
import {
    popularMovies,
    searchMoviesController,
    movieDetails,
    discoverMoviesController
} from '../controllers/movieController.js';

import {
    validateSearch,
    validatePage,
    validateId,
    validateDiscover
} from '../middleware/validation.js';


const router = express.Router();

router.get('/popular', popularMovies);

router.get(
    '/search',
    validateSearch,
    validatePage,
    searchMoviesController
);

router.get(
    '/discover',
    validateDiscover,
    validatePage,
    discoverMoviesController
);

router.get(
    '/:id',
    validateId,
    movieDetails
);

export default router;