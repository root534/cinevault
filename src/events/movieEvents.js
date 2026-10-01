import { EventEmitter } from 'node:events';

export const movieEvents = new EventEmitter();

movieEvents.on('movieSearched', ({ query }) => {
    console.log(`[EVENT] movieSearched: ${query}`);
});

movieEvents.on('movieViewed', ({ id }) => {
    console.log(`[EVENT] movieViewed: ${id}`);
}); 