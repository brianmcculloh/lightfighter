// Open or create IndexedDB database
export async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('gameDatabase', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Create "state" object store if it doesn't exist
            if (!db.objectStoreNames.contains('state')) {
                db.createObjectStore('state', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Database failed to open', event.target.error);
            reject(event.target.error);
        };
    });
}

function sanitizeGameState(game) {
    const replacer = (key, value) => {
        // Skip functions and undefined properties
        if (typeof value === 'function' || typeof value === 'undefined') {
            return undefined;
        }
        // Convert Decimal objects (or similar) to strings/numbers
        if (value && value.constructor && value.constructor.name === 'Decimal') {
            return value.toString();  // Or value.toNumber() if you prefer
        }
        return value;
    };

    // Deep clone and sanitize the game object
    return JSON.parse(JSON.stringify(game, replacer));
}

// -------------------------------
// GAME STATE (EPHEMERAL) METHODS
// -------------------------------

// Save game state under key "gameState"
export async function saveGameState(game) {
    const db = await openDB();
    const transaction = db.transaction('state', 'readwrite');
    const store = transaction.objectStore('state');

    const gameState = {
        id: 'gameState',
        data: sanitizeGameState(game), // Use sanitized version
    };

    store.put(gameState);
    // console.log('Game saved to IndexedDB.');
}

// Load game state from key "gameState"
export async function loadGameState() {
    const db = await openDB();
    const transaction = db.transaction('state', 'readonly');
    const store = transaction.objectStore('state');
    const request = store.get('gameState');

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            if (event.target.result) {
                let savedGame = event.target.result.data;
                // If needed, restore Decimal or other types here
                resolve(savedGame);
            } else {
                resolve(null);  // No saved game found
            }
        };
        request.onerror = (event) => {
            console.error('Failed to load game state', event.target.error);
            reject(event.target.error);
        };
    });
}

// Clear ephemeral game state (e.g. user starts a new run)
export async function clearGameState() {
    const db = await openDB();
    const transaction = db.transaction('state', 'readwrite');
    const store = transaction.objectStore('state');

    store.delete('gameState');
    // console.log('Game state cleared from IndexedDB.');
}

// -------------------------------
// STATS (PERSISTENT) METHODS
// -------------------------------

// Save stats under key "stats"
export async function saveStats(statsData) {
    const db = await openDB();
    const transaction = db.transaction('state', 'readwrite');
    const store = transaction.objectStore('state');
  
    // Now we store only the raw statsData
    const statsRecord = {
      id: 'stats',
      data: statsData
    };
  
    store.put(statsRecord);
  }  

// Load stats from key "stats"
export async function loadStats() {
    const db = await openDB();
    const transaction = db.transaction('state', 'readonly');
    const store = transaction.objectStore('state');
    const request = store.get('stats');

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            if (event.target.result) {
                // Return the stored stats
                resolve(event.target.result.data);
            } else {
                // No stats found, so resolve with null or a default object
                resolve(null);
            }
        };
        request.onerror = (event) => {
            console.error('Failed to load stats', event.target.error);
            reject(event.target.error);
        };
    });
}

// Clear stats (only if user explicitly wants to reset everything)
export async function clearStats() {
    const db = await openDB();
    const transaction = db.transaction('state', 'readwrite');
    const store = transaction.objectStore('state');

    store.delete('stats');
    // console.log('Stats cleared from IndexedDB.');
}
