import {   getPopularMovies,
            searchMovies,
            discoverMovies 
        } from './utils/tmdb.js';

async function testPagination() {

     const pagesToTest = [499, 500, 501];

    console.log('\n--- POPULAR ---');

    for (const page of pagesToTest) {

        try {
            const data = await getPopularMovies(page);

            console.log(
                `Pagina ${page}: OK - risultati ${data.results.length}`
            );

        } catch (error) {

            console.log(
                `Pagina ${page}: ERRORE`
            );

            console.log(error.message);

            break;
        }
    }
     console.log('\n--- SEARCH ---');

    for (const page of pagesToTest) {

        try {
            const data = await searchMovies('batman', page);

            console.log(
                `Pagina ${page}: OK - ${data.results.length} film`
            );

        } catch (error) {
            console.log(
                `Pagina ${page}: ERRORE - ${error.message}`
            );
        }
    }

    console.log('\n--- DISCOVER ---');

    for (const page of pagesToTest) {

        try {
            const data = await discoverMovies({
                primary_release_year: 2020,
                'vote_average.gte': 7,
                page
            });

            console.log(
                `Pagina ${page}: OK - ${data.results.length} film`
            );

        } catch (error) {
            console.log(
                `Pagina ${page}: ERRORE - ${error.message}`
            );
        }
    }

}

testPagination();