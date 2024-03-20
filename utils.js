// utils.js

// Seeding functionality
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function mulberry32(a) {
    return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

let seed = cyrb128('bananas');
let rand = mulberry32(seed[0]);

function setGameSeed(gameseed) {
    seed = cyrb128(gameseed);
    rand = mulberry32(seed[0]);
}

function randDecimal() {
    return rand();
}

function randString() {
    return (rand() + 1).toString(36).substring(2);
}

function randIntFromInterval(min, max) {
    return Math.floor(rand() * (max - min + 1) + min);
}

function randFromRange(min, max) {
    return Math.round(rand() * (max - min) + min);
}

function chance(percent) {
    return rand() <= (percent / 100);
}

function randArrayIndex(arr) {
    return Math.floor(rand() * arr.length);
}

function randFromArray(arr, count) {
    let shuffled = arr.sort(() => 0.5 - rand());
    return shuffled.slice(0, count);
}

function sortDeck(combinedDeck, RAINBOW_ORDER, CARD_TYPES) {
    return combinedDeck.sort((a, b) => {
        // First, compare colors based on their index in RAINBOW_ORDER
        const colorIndexA = RAINBOW_ORDER.indexOf(a.color);
        const colorIndexB = RAINBOW_ORDER.indexOf(b.color);

        if (colorIndexA !== colorIndexB) {
            return colorIndexA - colorIndexB;
        } else {
            // If colors are the same, sort by type order as defined in CARD_TYPES
            const typeIndexA = CARD_TYPES.indexOf(a.type);
            const typeIndexB = CARD_TYPES.indexOf(b.type);
            return typeIndexA - typeIndexB;
        }
    });
}


function numberToRoman(num) {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

    let roman = "";
    for (let i = 0; i < values.length; i++) {
        while (num >= values[i]) {
            num -= values[i];
            roman += symbols[i];
        }
    }
    return roman;
}

function prettyName(att) {
    return att.split('_')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                   .join(' ');
}

function weightedRandFromArray(items, count) {
    // Create an array that repeats each item based on its weight
    let weightedArray = [];
    items.forEach(item => {
        for (let i = 0; i < item.weight; i++) {
            weightedArray.push(item);
        }
    });

    // Shuffle the weighted array
    let shuffled = weightedArray.sort(() => 0.5 - rand());

    // Select 'count' unique items from the shuffled array
    let selected = [];
    while (selected.length < count && shuffled.length > 0) {
        let item = shuffled.splice(Math.floor(rand() * shuffled.length), 1)[0];
        if (!selected.some(selectedItem => selectedItem.name === item.name)) {
            selected.push(item);
        }
    }

    return selected;
}



export {
    setGameSeed,
    randDecimal,
    randString,
    randIntFromInterval,
    randFromRange,
    chance,
    randArrayIndex,
    sortDeck,
    numberToRoman,
    randFromArray,
    prettyName,
    weightedRandFromArray,
};
