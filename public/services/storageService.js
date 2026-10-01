// Chiave utilizzata per salvare la collezione personale
const STORAGE_KEY = 'cinevault-collection';

// Funzione per ottenere la collezione dal localStorage
export function getCollection() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

// Funzione per ottenere un film specifico dalla collezione
export function getCollectionItem(movieId) {

    const collection = getCollection();

    return collection.find(
        item => item.id === movieId
    );
}

// Funzione per rimuovere un film dalla collezione
export function removeFromCollection(movieId) {

    const collection = getCollection();

    const updatedCollection = collection.filter(
        item => item.id !== movieId
    );

    saveCollection(updatedCollection);

    return updatedCollection;
}

// Funzione per salvare la collezione nel localStorage
export function saveCollection(collection) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(collection)
    );
}

// Funzione per aggiungere un film alla collezione
export function addToCollection(movie) {

    const collection = getCollection();

    const alreadyExists = collection.some(
        item => item.id === movie.id
    );

    if (alreadyExists) {
        return collection;
    }

    collection.push(movie);

    saveCollection(collection);

    return collection;
}

// Funzione per rimuovere la collezione dal localStorage
export function clearCollection() {

    localStorage.removeItem(STORAGE_KEY);
}