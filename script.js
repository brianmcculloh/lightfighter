/*********************************************
 * 
 * PHASE I: GAME ENGINE PHASE
 * 
 * NEXT: show all hands and what their current levels are
 * TODO: if you run out of cards the game should end
 * 
 * 
 * CARD EFFECTS
 * --foil: adds to power when played
 * --holo: multiplies power when played
 * --sleeve: multiplies power when held
 * --gold leaf: plus credits when played as part of a hand
 * --texture: level up when played as part of a hand
 * 
 * 
 * HOW SCORING WORKS:
 * 1. Foil and Holo are added/multiplied to Power
 * 2. Each played card's color value * level is added to Damage
 * 3. Hand is determined, and hand base damage * hand level is added to Damage
 * 4. Sleeve power multiplies Power
 * 5. Boosters are calculated and applied to Damage and Power
 * 6. Final score is calculated by multiplying Damage by Power
 * 
 * 
 * 
 * 
*********************************************/

import { setGameSeed, randDecimal, randString, randIntFromInterval, randFromRange, chance, randFromArray, randArrayIndex, numberToRoman, sortDeck, prettyName, weightedRandFromArray } from './utils.js';

import Game from './game.js';
let game = Game();
window.game = game;

import ALL_ENEMIES from './enemies.js';

import { ALL_CARDS, COLOR_DAMAGE_SCALE, WARM_COLORS, COOL_COLORS, RAINBOW_ORDER, CARD_TYPES, SPECIAL_CARDS } from './cards.js';
let deck = [];

import ALL_BOOSTERS from './boosters.js';

document.addEventListener('DOMContentLoaded', function() {
	/*
    // Add 'loaded' class to all elements with the 'game-loading-progress' class
    document.querySelectorAll('.game-loading-progress').forEach(element => {
        element.classList.add('loaded');
    });

    // After 1 second, add 'hidden' class to the element with the 'game-loading' id
    setTimeout(function() {
        document.getElementById('game-loading').classList.add('hidden');
    }, 1000);

    // After 2 seconds, remove 'loaded' class from all elements with the 'game-loading-progress' class
    setTimeout(function() {
        document.querySelectorAll('.game-loading-progress').forEach(element => {
            element.classList.remove('loaded');
        });
    }, 2000);
	*/

    // Call the init function
    init();
});


function init() {

	let gameseed = document.getElementById('custom-seed').value;
	if(gameseed == '') {
		gameseed = (Math.random() + 1).toString(36).substring(2);
	}
	game.seed = gameseed;
	setGameSeed(gameseed);

	createDeck();

    createBoosters();

	refreshDom();

	showOverworld();

	tippy('.enemy-ship, .attack, .discard', {
		content: "I'm a tooltip!",
		// Other options here
	});
	
}

function createDeck() {
    deck = [];

    ALL_CARDS.forEach(card => {
        addCard(card.type, card.color);
    });
}

function createBoosters() {
    const boosterContainer = document.getElementById('boosters');
    for (let i = 0; i < game.boosterSlots; i++) {
        // Append boosters
        const boosterDiv = document.createElement('div');
        boosterDiv.className = 'booster-slot';
        boosterContainer.appendChild(boosterDiv);
    }
}

function refreshDom() {
    document.querySelector('.lives .total').textContent = game.lives;
    document.querySelector('.attack .remaining').textContent = game.attacksRemaining;
    document.querySelectorAll('.attack .total').forEach(element => {
		element.textContent = game.attacksTotal;
	});
    document.querySelector('.discard .remaining').textContent = game.discardsRemaining;
    document.querySelectorAll('.discard .total').forEach(element => {
		element.textContent = game.discardsTotal;
	});
	document.querySelector('#enemy .health .current').textContent = game.currentEnemy.current;
	document.getElementById('credits').textContent = `Credits: $${game.credits}`;
	updateButtonAvailability();
	updatePreviews();
}

function addCard(type, color) {
    let addCard = ALL_CARDS.filter(obj => obj.type == type && obj.color == color);
    let copiedCard = JSON.parse(JSON.stringify(addCard))[0];
    
    copiedCard.guid = randString();

    deck.push(copiedCard);
}

function showOverworld(increaseFloor = true) {
    document.getElementById('overworld').classList.add('shown');
    let enemy = ALL_ENEMIES.filter(obj => obj.system == game.system);
    if(increaseFloor) game.floor++;
    document.querySelector('#overworld h1').textContent = enemy[game.floor - 1].name;
}

document.getElementById('start-combat').addEventListener('click', function() {
    startCombat();
});


function startCombat() {
    document.getElementById('overworld').classList.remove('shown');
	game.attacksRemaining = game.attacksTotal;
	game.discardsRemaining = game.discardsTotal;
    game.cumulativeDamage = 0;
    document.querySelector('.cumulative-damage span').textContent = 0;
	resetDeck();
	loadEnemy();
	drawCards();
	refreshDom();
}

function resetDeck() {
    // Combine cards from hand, gun slots, and discard pile back into the deck
    deck.push(...game.handCards, ...game.gunCards, ...game.discardCards);

    // Clear the arrays since the cards are now back in the deck
    game.handCards = [];
    game.gunCards = [];
    game.discardCards = [];

	document.querySelector('#cards').innerHTML = '';

    // Shuffle the deck to prepare for the next combat
    shuffleDeck(deck);
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(randDecimal() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
}

function createCard(card) {
	let cardElement = document.createElement('div');
	cardElement.className = 'card';
	cardElement.setAttribute('data-guid', card.guid);

	// Appending card information
	appendCardInfo(cardElement, card);
	return cardElement;
}

function drawCards() {
    let currentHandSize = game.handCards.length;
    let cardsToDraw = Math.min(game.handSize - currentHandSize, deck.length);
    let cardsDiv = document.getElementById('cards');

    // No longer resetting the entire hand and DOM elements at the start.

    for (let i = 0; i < cardsToDraw; i++) {
        let cardIndex = randArrayIndex(deck); // Assuming randArrayIndex(deck) is defined elsewhere
        let card = deck.splice(cardIndex, 1)[0];
        game.handCards.push(card);

        let cardElement = createCard(card);

        // Append the card element to the cards div
        cardsDiv.appendChild(cardElement);

        // Add click event listener to equip/unequip card
        cardElement.addEventListener('click', function() {
            equipCard(card, cardElement);
        });
    }

    if (deck.length < game.handSize - currentHandSize) {
        console.log("Not enough cards in the deck to draw up to the full hand size.");
    }
}

function appendCardInfo(cardElement, card) {
    const properties = ['type', 'name', 'color', 'level', 'foil', 'holo', 'sleeve', 'gold_leaf', 'texture'];

    properties.forEach(prop => {
        let span = document.createElement('span');
        span.classList.add(prop);
		if(prop === 'name') {
			span.textContent = card[prop];
        } else if(prop === 'type') {
            span.classList.add(card[prop], 'card-type');
		} else if(prop === 'level') {
            if(card[prop] > 1) span.textContent = `Level ${card[prop]}`;
		} else if(prop !== 'color') {
			if(card[prop]) {
				span.textContent = `${prettyName(prop)}`
			}
		}
        cardElement.setAttribute(`data-${prop}`, card[prop]);
        cardElement.appendChild(span);
    });
}

function equipCard(card, cardElement) {
    // Determine whether the card is in hand or equipped
    let isEquipped = game.gunCards.includes(card);
    let gunSlots = document.querySelectorAll('.gun-slot');

    if (!isEquipped) {
        // Find the first empty gun slot
        let emptySlot = Array.from(gunSlots).find(slot => !slot.hasChildNodes());
        
        if (emptySlot && game.gunCards.length < game.gunSlots) {
            // Equip card into the first empty slot if available
            game.handCards = game.handCards.filter(c => c.guid !== card.guid);
            game.gunCards.push(card);
            emptySlot.appendChild(cardElement); // Move the card element to the empty gun slot
        }
    } else {
        // Unequip card
        game.gunCards = game.gunCards.filter(c => c.guid !== card.guid);
        game.handCards.push(card);

        // Assuming you have a dedicated area for hand cards
        document.getElementById('cards').appendChild(cardElement); // Move the card element back to the hand container

        // Optional: Clear the now-empty slot if you wish to remove any specific markers or classes
        // This might not be needed if you're simply moving the card element, but can be useful if you have additional logic or styling for empty/full slots
    }
	refreshDom();
}

function loadEnemy() {
    let enemy = ALL_ENEMIES[game.floor - 1];
    game.currentEnemy = enemy;
    enemy.current = enemy.max;

    // Clear previous enemy ship
    const enemyShipContainer = document.querySelector('.enemy-ship');
    enemyShipContainer.innerHTML = ''; // Remove existing children (if any)

    // Append new enemy ship
    const enemyShipDiv = document.createElement('div');
    enemyShipDiv.className = 'ship fade-in';
    enemyShipContainer.appendChild(enemyShipDiv);

    // Enemy name
    const enemyName = document.querySelector('#enemy .name');
    enemyName.textContent = enemy.name;
    enemyName.classList.add('fade-in');

    // Enemy health current
    const enemyHealthCurrent = document.querySelector('#enemy .health .current');
    enemyHealthCurrent.textContent = enemy.current;
    enemyHealthCurrent.classList.add('fade-in');

    // Enemy health max
    const enemyHealthMax = document.querySelector('#enemy .health .max');
    enemyHealthMax.textContent = enemy.max;
    enemyHealthMax.classList.add('fade-in');
}

function updateButtonAvailability() {
    const discardButton = document.getElementById('discard-button');
    const attackButton = document.getElementById('attack-button');

    if (game.gunCards.length > 0) {
        // If there are equipped cards, ensure buttons are clickable
        if(game.discardsRemaining > 0) discardButton.classList.remove('unavailable');
        if(game.attacksRemaining > 0) attackButton.classList.remove('unavailable');
    } else {
        // If there are no equipped cards, disable buttons
        discardButton.classList.add('unavailable');
        attackButton.classList.add('unavailable');
    }
}

document.getElementById('discard-button').addEventListener('click', function() {
    // Check if there are no cards equipped and if the button is unavailable
    if (!this.classList.contains('unavailable') && game.gunCards.length > 0) {
        discardEquippedCards();
    }
});

function discardEquippedCards() {
    console.clear();
    // Loop through each equipped gun card
    game.gunCards.forEach(card => {
        // Move the card to the discard pile
        game.discardCards.push(card);
    });

    // Remove all cards from gun slots
    document.querySelectorAll('.gun-slot').forEach(slot => slot.innerHTML = '');

    // Clear the array of equipped cards since they have been discarded
    game.gunCards = [];

	game.discardsRemaining -= 1;

	if(game.discardsRemaining <= 0) {
		document.querySelector('.discard').classList.add('unavailable');
	}

    // Refill the hand to the designated hand size
    drawCards();

	refreshDom();

}

document.getElementById('attack-button').addEventListener('click', function() {
    // Check if there are no cards equipped before proceeding
    if (game.gunCards.length > 0) {
        playEquippedCards();
    }
});

async function playEquippedCards() {
	let updatedPower = 1;
	// Loop through scoring cards
	game.scoringCards.forEach(card => {
		// Upgrade card if textured
		card.level += card.texture ? 1 : 0; 
		// Earn credits if gold_leaf
		game.credits += card.gold_leaf ? game.goldCredits : 0;
    });

	// Loop through hand cards
    game.handCards.forEach(async card => {
		// Check for Sleeve
		let cardPower = card.sleeve ? game.sleevePower : 1;
		let power = parseInt(document.querySelector('.number.power').textContent, 10);
		updatedPower = Math.round(cardPower * power);
		document.querySelector('.number.power').classList.add("active");	
		document.querySelector('.number.power').textContent = updatedPower; // Update the power displayed
		let damage = parseInt(document.querySelector('.number.damage').textContent, 10);
		document.querySelector('.total-damage span').textContent = Math.round(damage * updatedPower);
		await new Promise(resolve => setTimeout(resolve, 500));
		document.querySelector('.number.power').classList.remove("active");
    });

	// Apply booster effects
    await applyBoostersAndUpdatePower();

	// Apply damage to the enemy
    await applyDamageToEnemy();

	// Move gun cards to discard pile
	game.gunCards.forEach(card => {
		// Move the card to the discard pile
		game.discardCards.push(card);
		// Find the card element in the DOM and remove it
		document.querySelector(`.gun-slot [data-guid="${card.guid}"]`).remove();
	});

    // Reset gunCards array since all cards are played
    game.gunCards = [];
	game.scoringCards = [];

	game.attacksRemaining -= 1;

    if (game.currentEnemy.current <= 0) {
        game.currentEnemy.current = 0;
        endCombat('win');
        return;
	} else if(game.attacksRemaining <= 0) {
        if(game.lives < 1) {
            endCombat('loss');
		    return;
        } else {
            game.lives -= 1;
            showOverworld(false);
            return
        }
		
	}

	drawCards();

    refreshDom();
}

async function applyBoostersAndUpdatePower() {
    // Loop through boosters asynchronously
    for (const boosterInfo of game.boosterCards) {
        let booster = ALL_BOOSTERS.find(b => b.id === boosterInfo.id);
        if (booster) {
            // Visually mark the booster as active
            document.querySelector(`#${booster.id}`).classList.add("active");
            await processBoosterPower(booster); // Adjust getBoosterPower to be async and handle visuals
			// Wait a bit before processing the next booster
            await new Promise(resolve => setTimeout(resolve, 500)); 
            document.querySelector(`#${booster.id}`).classList.remove("active"); // Remove the active class from booster
        }
    }
}

async function processBoosterPower(booster) {
    let to = booster.to !== undefined ? booster.to : 'gunCards';
    let powerIncrease = booster.power !== undefined ? booster.power : 0;
    for (const card of game[to]) {
        let power = parseInt(document.querySelector('.number.power').textContent, 10);
        const cardElement = document.querySelector(`.card[data-guid="${card.guid}"]`);
        if (cardElement) {
            let isAffected = false;
            if (booster.cardType && booster.cardType === card.type) isAffected = true;

			//TODO: this should be able to determine chromatic color instead of just looking at booster.cardColor (which doesn't exit)
			//-- also need to do the same for the other hand types
            if (booster.cardColor && booster.cardColor === card.color) isAffected = true;

			if (booster.colorTemperature && booster.colorTemperature === 'warm') isAffected = WARM_COLORS.includes(card.color);
			if (booster.colorTemperature && booster.colorTemperature === 'cool') isAffected = COOL_COLORS.includes(card.color);
            if (booster.handType && document.querySelector('.hand-name span').getAttribute('data-type').toLowerCase().includes(booster.handType.toLowerCase())) isAffected = true;
            if (booster.cardEffect && card[booster.cardEffect]) isAffected = true;

            if (isAffected) {
                cardElement.classList.add("active"); // Visually mark the card as being affected by the booster
				powerIncrease = booster.multiplicative ? Math.round(power * booster.power) : Math.round(power + booster.power);
				document.querySelector('.number.power').classList.add("active");
				document.querySelector('.number.power').textContent = powerIncrease; // Update the power displayed
				let damage = parseInt(document.querySelector('.number.damage').textContent, 10);
				document.querySelector('.total-damage span').textContent = Math.round(damage * powerIncrease);
				// Wait a bit to visually show the card being affected
                await new Promise(resolve => setTimeout(resolve, 500)); 
                cardElement.classList.remove("active");
				document.querySelector('.number.power').classList.remove("active");
            }
        }
    }
}

function isSpectrum() {
	// Get the unique colors of the cards in the hand
	const handColors = game.gunCards.map(card => card.color);

	// Iterate through the rainbow order to check for a continuous sequence that matches the hand colors
	for (let i = 0; i <= RAINBOW_ORDER.length - handColors.length; i++) {
		const rainbowSubSequence = RAINBOW_ORDER.slice(i, i + handColors.length);
		// Check if the sorted hand colors match this subsequence of the rainbow
		// This step requires sorting handColors to match the order of the rainbowSubSequence for comparison
		if (JSON.stringify(handColors.sort((a, b) => RAINBOW_ORDER.indexOf(a) - RAINBOW_ORDER.indexOf(b))) === JSON.stringify(rainbowSubSequence)) {
			return true;
		}
	}
	return false;
}

function updatePreviews() {
    let colorValueSum = 0;
    let bonusPower = 1;

    // Count cards by color and type
    let colorCounts = {};
	let typeCounts = {};
	let colorTypeCounts = {};
	let maxColorTypeCount = 0; // Max count of cards sharing both color and type
    game.gunCards.forEach(card => {
        colorValueSum += (COLOR_DAMAGE_SCALE[card.color] * card.level);
        colorCounts[card.color] = (colorCounts[card.color] || 0) + 1;
    	typeCounts[card.type] = (typeCounts[card.type] || 0) + 1;
		let key = `${card.color}-${card.type}`;
		colorTypeCounts[key] = (colorTypeCounts[key] || 0) + 1;
		maxColorTypeCount = Math.max(maxColorTypeCount, colorTypeCounts[key]);
		bonusPower += card.foil ? game.foilPower : 0;
    });
	// Loop through a second time to multiply power. Needs to happen after all additives get calculated
	game.gunCards.forEach(card => {
		bonusPower *= card.holo ? game.holoPower : 1;
	});

	// Check for spectrum condition
	const isFullSpectrum = game.gunCards.length === 5 && isSpectrum();
	const uniqueTypes = Object.keys(typeCounts).length;
	const uniqueColors = Object.keys(colorCounts).length;
	const maxColorCount = Math.max(...Object.values(colorCounts));
	const maxTypeCount = Math.max(...Object.values(typeCounts));
	const totalCards = game.gunCards.length;

	// Flags for specific hand type conditions
	const allSameType = uniqueTypes === 1;
	const allSameColor = uniqueColors === 1;

	let possibleHands = [];

	// Determine hand type based on the collected data and conditions
	if (isFullSpectrum && allSameType) {
		possibleHands.push({ type: "fullSpectrumArmament", baseDamage: game.handTypeLevels["fullSpectrumArmament"].baseDamage });
	} 
	if (maxColorTypeCount === 3 && totalCards >= 3) {
		possibleHands.push({ type: "triChromaticArmament", baseDamage: game.handTypeLevels["triChromaticArmament"].baseDamage });
	}
	if (maxColorTypeCount === 4 && totalCards >= 4) {
		possibleHands.push({ type: "quadChromaticArmament", baseDamage: game.handTypeLevels["quadChromaticArmament"].baseDamage });
	} 
	if (maxColorTypeCount === 5 && allSameType && isFullSpectrum) {
		possibleHands.push({ type: "fullChromaticArmament", baseDamage: game.handTypeLevels["fullChromaticArmament"].baseDamage });
	} 
	if (maxColorCount === 3 && totalCards >= 3) {
		possibleHands.push({ type: "triChromatic", baseDamage: game.handTypeLevels["triChromatic"].baseDamage });
	} 
	if (maxColorCount === 4 && totalCards >= 4) {
		possibleHands.push({ type: "quadChromatic", baseDamage: game.handTypeLevels["quadChromatic"].baseDamage });
	} 
	if (maxColorCount === 5 && allSameColor) {
		possibleHands.push({ type: "fullChromatic", baseDamage: game.handTypeLevels["fullChromatic"].baseDamage });
	} 
	if (maxTypeCount === 3 && totalCards >= 3) {
		possibleHands.push({ type: "triArmament", baseDamage: game.handTypeLevels["triArmament"].baseDamage });
	} 
	if (maxTypeCount === 4 && totalCards >= 4) {
		possibleHands.push({ type: "quadArmament", baseDamage: game.handTypeLevels["quadArmament"].baseDamage });
	} 
	if (maxTypeCount === 5 && allSameType) {
		possibleHands.push({ type: "fullArmament", baseDamage: game.handTypeLevels["fullArmament"].baseDamage });
	} 
	if (isFullSpectrum) {
		possibleHands.push({ type: "spectrum", baseDamage: game.handTypeLevels["spectrum"].baseDamage });
	}

	// Loop over possibleHands to calculate the damage for each hand, and select the highest scoring one
	let highestScoringHand = possibleHands.reduce((highest, hand) => {
		// Apply card level multipliers differently for spectrum hands
		if (hand.type === "spectrum" || hand.type === "fullSpectrumArmament") {
			// For spectrum hands, all cards contribute to the hand, so we include all levels
			game.gunCards.forEach(card => {
                const isCardAlreadyInScoringCards = game.scoringCards.some(scoringCard => scoringCard.guid === card.guid);
                // If the card is not already in game.scoringCards, add it
                if (!isCardAlreadyInScoringCards) {
                    game.scoringCards.push(card);
                }
			});
		} else {
			// For chromatic and armament hands, only cards of the dominant color/type contribute
			game.gunCards.forEach(card => {
                const isCardAlreadyInScoringCards = game.scoringCards.some(scoringCard => scoringCard.guid === card.guid);
                // If the card is not already in game.scoringCards, add it
                if (!isCardAlreadyInScoringCards) {
                    if (hand.type.includes("Chromatic") && colorCounts[card.color] >= 3) {
                        game.scoringCards.push(card);
                    } else if (hand.type.includes("Armament") && typeCounts[card.type] >= 3) {
                        game.scoringCards.push(card);
                    }
                }
			});
		}
	
		let totalDamage = hand.baseDamage * game.handTypeLevels[hand.type].level;
		return totalDamage > highest.totalDamage ? { type: hand.type, totalDamage } : highest;
	}, { type: "", totalDamage: 0 });

	// Now, set the official hand to the highest scoring one and use that value as the bonusDamage amount
    let handType = highestScoringHand.type;
    let bonusDamage = highestScoringHand.totalDamage;

    let totalPower = bonusPower > 1 ? Math.round(bonusPower) : 1;
	let handTypeLevel = handType ? ' ' + numberToRoman(game.handTypeLevels[handType].level) : '';
	let totalDamage = Math.round(colorValueSum + bonusDamage);

    document.querySelector('.number.damage').textContent = totalDamage;
    document.querySelector('.number.power').textContent = totalPower;
	document.querySelector('.hand-name span').setAttribute('data-type', handType);
    document.querySelector('.hand-name span').textContent = handType ? handType.replace(/([A-Z])/g, ' $1').trim() + handTypeLevel : "None";
	document.querySelector('.total-damage span').textContent = totalDamage * totalPower;
}

async function applyDamageToEnemy() {
	// Fetch values from the DOM
    let damage = parseInt(document.querySelector('.number.damage').textContent, 10);
    let power = parseInt(document.querySelector('.number.power').textContent, 10);

    // Calculate total damage
    let totalDamage = damage * power;
    document.querySelector('.cumulative-damage span').textContent = parseInt(document.querySelector('.cumulative-damage span').textContent, 10) + totalDamage;

	// Hit the enemy
    game.currentEnemy.current -= totalDamage;

}

function endCombat(result) {
    if(result=='win') {
        shop();
    } else {
        document.querySelector('#end-game').classList.add('shown');
    }
	
}

function shop() {
	game.credits += game.attacksRemaining + game.discardsRemaining + 5;
	document.querySelector('#shop').classList.add('shown');
	populateShopBoosters();
	populateShopPacks();
}

document.querySelector('#shop .done').addEventListener('click', function() {
    document.querySelector('#shop').classList.remove('shown');
	showOverworld();
});

document.querySelector('#selection-modal .done').addEventListener('click', function() {
    document.querySelector('#selection-modal').classList.remove('shown');
});

document.querySelector('#deck-modal .done').addEventListener('click', function() {
    document.querySelector('#deck-modal').classList.remove('shown');
});

document.querySelector('#view-deck').addEventListener('click', populateDeckModal);

function populateDeckModal() {
	let organizedDeck = organizeDeck();
    let itemsContainer = document.querySelector('#deck-modal .items');
    itemsContainer.innerHTML = ''; // Clear existing content

    organizedDeck.forEach(card => {
        let cardElement = createCard(card);
        itemsContainer.appendChild(cardElement);
    });

    document.querySelector('#deck-modal').classList.add('shown'); // Show the modal
}

function organizeDeck() {
	let combinedDeck = [...deck, ...game.handCards, ...game.discardCards, ...game.gunCards];
    let organizedDeck = sortDeck(combinedDeck, RAINBOW_ORDER, CARD_TYPES);
	return organizedDeck;
}

function populateShopPacks() {
    const packsContainer = document.querySelector('#shop .packs');
    packsContainer.innerHTML = ''; // Clear existing packs for fresh population

    const packTypes = [
		{ name: "Card Upgrade Pack", cost: 5 },
        { name: "Hand Upgrade Pack", cost: 5 },
		{ name: "Booster Card Pack", cost: 6 },
		{ name: "Armament Pack", cost: 5, cardType: randFromArray(CARD_TYPES, 1) },
		{ name: "Chromatic Pack", cost: 5, cardColor: randFromArray(RAINBOW_ORDER, 1) },
		{ name: "Special Pack", cost: 7 },
    ];

    let shuffledPacks = packTypes.sort(() => 0.5 - randDecimal());
    let selectedPacks = shuffledPacks.slice(0, game.shopPackSlots);

    selectedPacks.forEach(pack => {
		let random = randDecimal();
		let size = (random < 0.7) ? 'standard' : (random < 0.9) ? 'big' : 'giant';
		pack.cost += size == 'big' ? 2 : size == 'giant' ? 4 : 0;

        let packElement = document.createElement('div');
        packElement.className = 'pack ' + size;
        packElement.dataset.packType = pack.name.replace(/\s+/g, '').toLowerCase();
		packElement.dataset.packSize = size;
        packElement.dataset.cost = pack.cost;
		if (pack.cardType) packElement.dataset.cardType = pack.cardType; // Store type if it's an Armament Pack
        if (pack.cardColor) packElement.dataset.cardColor = pack.cardColor; // Store color if it's a Chromatic Pack

        let packName = document.createElement('span');
        packName.textContent = size + ' ';
		packName.textContent += pack.cardType ? 'Armament ' + prettyName(pack.cardType[0]) : pack.cardColor ? 'Chromatic ' + pack.cardColor[0] : pack.name;
		packElement.setAttribute('data-cost', pack.cost);
        packElement.appendChild(packName);

		let packCost = document.createElement('span');
        packCost.textContent = '$' + pack.cost;
        packElement.appendChild(packCost);

        packElement.addEventListener('click', function() {
			let cost = parseInt(this.dataset.cost, 10);
			if (game.credits >= cost) {
				game.credits -= cost; // Subtract cost from player's credits
				openPack(this.dataset); // Function to handle opening each pack
				this.remove(); // Remove the pack element after it's clicked
				refreshDom();
			} else {
                alert("You cannot afford this pack."); // Provide feedback (consider a more user-friendly approach)
            }
        });

        packsContainer.appendChild(packElement);
    });
}

function openPack(pack) {
	let selectionModal = document.querySelector('#selection-modal');
    let itemsContainer = selectionModal.querySelector('.items');
	itemsContainer.innerHTML = ''; // Clear previous items
	let amount = 0;
	let selectionsMade = 0;
	resetDeck();
    switch(pack.packType) {
        case 'cardupgradepack':
			amount = pack.packSize == 'standard' ? 10 : pack.packSize == 'big' ? 15 : 20;
            // Randomly select x cards from the deck
            let selectedCards = randFromArray(deck, amount);

            // Display these cards
            selectedCards.forEach(card => {
                let cardElement = createCard(card);
                cardElement.addEventListener('click', function() {
                    card.level += 1; // Increase level by 1
                    selectionModal.classList.remove('shown'); // Hide the modal	
                });
                itemsContainer.appendChild(cardElement);
            });
            break;
        case 'handupgradepack':
			amount = pack.packSize == 'standard' ? 3 : pack.packSize == 'big' ? 5 : 7;
            // Randomly select x hand types
            let handTypes = Object.keys(game.handTypeLevels);
            let selectedHandTypes = randFromArray(handTypes, amount);

            // Display these hand types
            selectedHandTypes.forEach(handType => {
				let handTypeLevel = handType ? ' ' + numberToRoman(game.handTypeLevels[handType].level) : '';
                let handElement = document.createElement('div');
                handElement.className = 'hand-type card';
                handElement.textContent = handType.replace(/([A-Z])/g, ' $1').trim() + handTypeLevel;
                handElement.addEventListener('click', function() {
                    game.handTypeLevels[handType].level += 1; // Increase level by 1
                    selectionModal.classList.remove('shown'); // Hide the modal immediately after selection
                    // Optionally, update the UI to reflect the new hand type level
                });
                itemsContainer.appendChild(handElement);
            });
            break;
        case 'boostercardpack':
            amount = pack.packSize == 'standard' ? 3 : pack.packSize == 'big' ? 4 : 5;
            let selectedBoosters = randFromArray(ALL_BOOSTERS, amount); 

            // Display these booster cards
            selectedBoosters.forEach(booster => {
                let cardElement = document.createElement('div');
                cardElement.className = 'booster-card card';
                cardElement.textContent = prettyName(booster.id);
                cardElement.addEventListener('click', function() {
                    let added = addBoosterToSlots(booster);
                    if(added) selectionModal.classList.remove('shown'); // Hide the modal
                });
                itemsContainer.appendChild(cardElement);
            });
            break;
        case 'armamentpack':
			amount = pack.packSize == 'standard' ? 1 : pack.packSize == 'big' ? 2 : 3;
            // Display 9 cards of the randomly selected type, one of each color
            RAINBOW_ORDER.forEach(color => {
				let card = ALL_CARDS.find(card => card.type === pack.cardType && card.color === color);
                let cardElement = createCard(card);
                cardElement.addEventListener('click', function() {
                    addCard(card.type, card.color);
                    cardElement.remove(); // Remove the card from the modal
					selectionsMade++;
					if (selectionsMade >= amount) {
						selectionModal.classList.remove('shown'); // Hide the modal after allowed selections
					}
                });
                itemsContainer.appendChild(cardElement);
            });
            break;
        case 'chromaticpack':
            amount = pack.packSize == 'standard' ? 1 : pack.packSize == 'big' ? 2 : 3;
            // Display 9 cards of the randomly selected type, one of each color
            CARD_TYPES.forEach(type => {
                let card = ALL_CARDS.find(card => card.type === type && card.color === pack.cardColor);
                let cardElement = createCard(card);
                cardElement.addEventListener('click', function() {
                    addCard(card.type, card.color);
                    cardElement.remove(); // Remove the card from the modal
					selectionsMade++;
					if (selectionsMade >= amount) {
						selectionModal.classList.remove('shown'); // Hide the modal after allowed selections
					}
                });
                itemsContainer.appendChild(cardElement);
            });
            break;
        case 'specialpack':
            amount = pack.packSize == 'standard' ? 3 : pack.packSize == 'big' ? 4 : 5;
			let selectedSpecials = weightedRandFromArray(SPECIAL_CARDS, amount);
            selectedSpecials.forEach(special => {
                let cardElement = document.createElement('div');
                cardElement.className = 'special-card card';
                cardElement.textContent = prettyName(special.name);
                cardElement.addEventListener('click', function() {
                    applySpecialEffect(special.name);
                });
                itemsContainer.appendChild(cardElement);
            });
            break;
        default:
            console.log("Unknown pack type");
    }
	selectionModal.classList.add('shown'); // Show the modal
}

function applySpecialEffect(effectName) {
    let selectionModal = document.querySelector('#selection-modal');
    let itemsContainer = selectionModal.querySelector('.items');
    itemsContainer.innerHTML = ''; // Clear previous items
	let sortedDeck = organizeDeck();

	switch(effectName) {
		case 'foil':
		case 'holo':
		case 'sleeve':
		case 'gold_leaf':
		case 'texture':
			const eligibleCards = sortedDeck.filter(card => !card[effectName]);
			eligibleCards.forEach(card => {
				let cardElement = createCard(card);
				itemsContainer.appendChild(cardElement);

				// Event listener for when a card is clicked
				cardElement.addEventListener('click', () => {
					card[effectName] = true; // Set the effect to true for the clicked card
					refreshDom();
					// Close the selection modal
					selectionModal.classList.remove('shown');
				});
			});

			// Show the selection modal
			if (eligibleCards.length > 0) {
				selectionModal.classList.add('shown');
			} else {
				alert(`All cards already have the ${effectName} effect.`);
			}
		break;
		case 'remove':
			let removalsCount = 0;
			let maxRemovals = 2;
			// Display the entire sorted deck for removal selection
			sortedDeck.forEach((card) => {
				let cardElement = createCard(card);
				itemsContainer.appendChild(cardElement);

				// Add click event listener to handle card removal
				cardElement.addEventListener('click', () => {
					if (removalsCount < maxRemovals) {
						// Find the index of the card in the original deck using its unique guid
						const cardIndexInDeck = deck.findIndex(c => c.guid === card.guid);
						if (cardIndexInDeck !== -1) {
							deck.splice(cardIndexInDeck, 1); // Remove the card from the original deck
							cardElement.remove(); // Remove the card element from the display
							removalsCount++;
							refreshDom(); // Refresh the DOM to reflect the removal

							// Close the modal if the user has reached the maximum number of removals
							if (removalsCount === maxRemovals) {
								selectionModal.classList.remove('shown');
							}
						}
					}
				});
			});
		break;
		case 'attack':
			game.attacksTotal += 1;
            selectionModal.classList.remove('shown');
            refreshDom();
		break;
		case 'discard':
			game.discardsTotal += 1;
            selectionModal.classList.remove('shown');
            refreshDom();
		break;
        case 'booster':
			game.boosterSlots += 1;
            selectionModal.classList.remove('shown');
            const boosterContainer = document.getElementById('boosters');
            const boosterDiv = document.createElement('div');
            boosterDiv.className = 'booster-slot';
            boosterContainer.appendChild(boosterDiv);
            refreshDom();
		break;
	}
	
}

function populateShopBoosters() {
    const boostersContainer = document.querySelector('#shop .boosters');
    boostersContainer.innerHTML = ''; // Clear existing content for fresh population

    const rarityWeights = {
        common: 0.7,
        uncommon: 0.2,
        rare: 0.1,
    };

    // Ensure every booster has a rarity level
    const boostersWithRarity = ALL_BOOSTERS.map(booster => ({
        ...booster,
        rarity: booster.rarity || 'common',
    }));

    let weightedBoosters = [];

    // Convert the rarity weights into an array of boosters, duplicating them based on their chances
    boostersWithRarity.forEach(booster => {
        const count = Math.floor(100 * rarityWeights[booster.rarity]); // Convert rarity chance to a count based on 100 selections
        for (let i = 0; i < count; i++) {
            weightedBoosters.push(booster);
        }
    });

    // Shuffle the weighted array
    let shuffledBoosters = weightedBoosters.sort(() => 0.5 - randDecimal());
    // Since boosters are duplicated based on their weights, picking the first N unique ones for the shop slots
    let selectedBoosters = [];
    let addedBoosterIds = new Set();

    for (let booster of shuffledBoosters) {
        if (selectedBoosters.length >= game.shopBoosterSlots) break;
        if (!addedBoosterIds.has(booster.id)) {
            selectedBoosters.push(booster);
            addedBoosterIds.add(booster.id);
        }
    }

    selectedBoosters.forEach(booster => {
        let boosterElement = document.createElement('div');
        boosterElement.className = 'card';
        boosterElement.setAttribute('data-cost', 5); // Assuming all boosters cost 5 credits for simplicity

        let boosterName = document.createElement('span');
        boosterName.textContent = prettyName(booster.id);
        boosterElement.appendChild(boosterName);

        let boosterCost = document.createElement('span');
        boosterCost.textContent = '$5';
        boosterElement.appendChild(boosterCost);

        boosterElement.addEventListener('click', function() {
            const boosterCost = parseInt(this.getAttribute('data-cost'), 10);

            // Prevent purchasing if booster slots are full
            if (game.boosterCards.length >= game.boosterSlots) {
                alert('No available booster slots.');
                return;
            }

            // Check if the player has enough credits to purchase the booster
            if (game.credits >= boosterCost) {
                // Subtract the cost of the booster from the player's credits
                game.credits -= boosterCost;

                // Add booster to slots
                addBoosterToSlots(booster);

                // Remove the booster from the shop UI
                boosterElement.remove();

                refreshDom();
            } else {
                alert('Not enough credits to purchase this booster.');
            }
        });

        boostersContainer.appendChild(boosterElement);
    });
}

function addBoosterToSlots(booster) {
    if (game.boosterCards.length < game.boosterSlots) {
        game.boosterCards.push(booster); // Add the booster to the activated boosters

        // Find the first available booster slot in the DOM
        let availableSlot = document.querySelector('.booster-slot:not([data-boosted])');
        if (availableSlot) {
            // Example of a more detailed representation of the booster in the slot
            availableSlot.innerHTML = `<span>${prettyName(booster.id)}</span>`; // Modify as needed for your design
            availableSlot.setAttribute('data-boosted', 'true'); // Mark the slot as filled
			availableSlot.setAttribute('id', booster.id);

            // Optionally, trigger any updates needed to reflect the new booster being active
            updatePreviews(); // If the booster affects previews, call update previews here

			return true;
        }
    } else {
        alert('No available booster slots.'); // Inform the user if no slots are available
    }
	return false;
}





