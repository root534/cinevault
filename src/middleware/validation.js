export function validateSearch(req, res, next) {
    const { query } = req.query;

    if (!query || query.trim() === '') {
        const error = new Error('Il parametro query è obbligatorio');
        error.status = 400;

        return next(error);
    }

    next();
}

export function validatePage(req, res, next) {
    const { page = 1 } = req.query;

    if (!Number.isInteger(Number(page)) || Number(page) <= 0) {
        const error = new Error(
            'Il parametro page deve essere un numero intero maggiore di 0'
        );
        error.status = 400;

        return next(error);
    }

    next();
}

export function validateId(req, res, next) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        const error = new Error(
            "L'id deve essere un numero intero maggiore di 0"
        );
        error.status = 400;

        return next(error);
    }

    next();
}

export function validateDiscover(req, res, next) {
    const { year, minRating } = req.query;

    if (!year || !Number.isInteger(Number(year))) {
        const error = new Error(
            'Il parametro year deve essere numerico'
        );
        error.status = 400;

        return next(error);
    }

    if (
        minRating === undefined ||
        Number.isNaN(Number(minRating)) ||
        Number(minRating) < 0 ||
        Number(minRating) > 10
    ) {
        const error = new Error(
            'Il parametro minRating deve essere compreso tra 0 e 10'
        );
        error.status = 400;

        return next(error);
    }

    next();
}