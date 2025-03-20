/*********************************************
 * 
 * PHASE I: GAME ENGINE PHASE
 * 
 * TODO: do something cool with critical hits
 * TODO: how are we currently leveraging compareEffects on boosters?
 * TODO: when cards are upgraded via upgrade_stowed, the damage amounts above the cards disappear
 * 
 * 
 * ENEMY SPECIAL IDEAS:
 * cannot attack until at least one combo is stowed
 * cannot use time shifts
 * one random booster is disabled at beginning of combat
 * cannot use injectors
 * minus 1 attack 
 * minus 1 stow
 * cannot play a certain color of cards
 * cannot play a certain type of cards
 * no spectrum bonus
 * 
 * 
 * 
 * CARD EFFECTS
 * --foil: multiplies (game.foilPower + card.level) to power when drawn (x1.4)
 * --holo: multiplies (game.holoPower + card.level) to power when played (x1.4)
 * --sleeve: multiplies (game.sleevePower + card.level) to power when held (x1.4)    
 * --gold leaf: adds (game.goldCredits + card.level) to credits when played as part of a combo (+1)
 * --texture: level up (game.textureLevels) when played as part of a combo
 * 
 * Epic = holo/foil/texture/gold_leaf/sleeve
 * Legendary = Epic >= level 50
 * Mythical = Legendary >= level 100
 * 
 * 
 * HOW SCORING WORKS:
 * 1. Foil and Holo are multiplied to Power
 * 2. Each played card's color value * level is added to Damage
 * 3. combo is determined, and combo base damage * combo level is added to Damage
 * 4. Sleeve power multiplies Power
 * 5. Boosters are calculated and applied to Damage and Power
 * 6. Final score is calculated by multiplying Damage by Power
 * 
 * 
 * 
 * 
*********************************************/

import { saveGameState, loadGameState, saveStats, loadStats } from './db.js';

import { setAnimationSpeed, setGameSeed, randDecimal, randString, randFromArray, randArrayIndex, numberToRoman, sortArsenal, prettyName, weightedSelect, togglePointerEvents, capitalize, formatLargeNumber, updateXPBar, fireAtEnemy, applyBoosterOverlap, applyCardOverlap, applyGunSlotOverlap, applySystemHeartOverlap, enableHoverZIndexBehavior, customDialog, message, flourish } from './utils.js';

import { Decimal } from 'decimal.js';

import game from './game.js';
import stats from './stats.js';

import ALL_ENEMIES from './enemies.js';

import { COLOR_DAMAGE_SCALE, WARM_COLORS, COOL_COLORS, RAINBOW_ORDER, CARD_TYPES, SPECIAL_ATTRIBUTES, ARCHETYPES, SPECIAL_CARDS, COMET_CARDS, PACK_TYPES, SYSTEMHEARTS, INJECTORS } from './cards.js';

document.addEventListener('DOMContentLoaded', async() => {

    await splash();

});

export async function splash() {

    // load the game
    const savedGame = await loadGameState();
    if (savedGame) {
        document.getElementById('continue-game').classList.add('shown');
    }

    // load the stats
    const savedStats = await loadStats();
    if (savedStats) {
        Object.assign(stats.data, savedStats);
    }
    
}

export async function init() {

	setGameSeed();

    createRainbowGauge();

	createArsenal();

    createBoosters();

    createInjectors();

    updateGuns();

    populateShopSystemHearts();

	refreshDom();

    loadInventory();

    setAnimationSpeed();

    manualLoad();
	
}

function manualLoad() {
    // Manual adding of boosters and system hearts for dev purposes
    let boosters = [
        //'upgrade_stowed_cards',
    ];
    let hearts = [
        //'attack',
    ];
    let injectors = [
        //'add_damage_2000',
    ];

    if (Array.isArray(boosters) && boosters.length > 0) {
        boosters.forEach(boosterId => {
            const booster = game.boosters.find(b => b.id === boosterId);
            if (booster) {
                addBoosterToSlots(booster);
            } else {
                console.error('Booster not found:', boosterId);
            }
        });
    } else {
        //console.log('No boosters to load.');
    }

    // Check if hearts array exists and is not empty
    if (Array.isArray(hearts) && hearts.length > 0) {
        hearts.forEach(heartId => {
            const systemHeart = game.systemHearts.find(h => h.id === heartId);
            if (systemHeart) {
                applySystemHeart(systemHeart);
            } else {
                console.error('System Heart not found:', heartId);
            }
        });
    } else {
        //console.log('No system hearts to load.');
    }

    // Check if injectors array exists and is not empty
    if (Array.isArray(injectors) && injectors.length > 0) {
        injectors.forEach(injectorId => {
            const injector = game.injectors.find(h => h.id === injectorId);
            if (injector) {
                addInjectorToSlots(injector);
            } else {
                console.error('Injector not found:', injectorId);
            }
        });
    } else {
        //console.log('No injectors to load.');
    }
}

function loadInventory() {
    // Load boosters from the game object directly
    const allBoosters = [
        ...game.slots.bridgeCards,
        ...game.slots.engineeringCards,
        ...game.slots.armoryCards
    ];

    if (allBoosters.length > 0) {
        allBoosters.forEach(booster => {
            if (booster.guid) {
                addBoosterToDOM(booster);  // Only visually load booster
            } else {
                console.error('Booster missing GUID:', booster);
            }
        });
    } else {
        //console.log('No boosters to load.');
    }

    // Load injectors from the game object directly
    if (game.slots.injectorCards.length > 0) {
        game.slots.injectorCards.forEach(injector => {
            if (injector.guid) {
                addInjectorToDOM(injector);  // Only visually load injector
            } else {
                console.error('Injector missing GUID:', injector);
            }
        });
    } else {
        //console.log('No injectors to load.');
    }

    // Load system hearts from the game object directly
    if (game.data.systemHearts.length > 0) {
        game.data.systemHearts.forEach(systemHeart => {
            addSystemHeartToDOM(systemHeart);  // Only visually load heart
        });
    } else {
        //console.log('No system hearts to load.');
    }
}

function createRainbowGauge() {
    const gaugeContainer = document.getElementById('rainbow-gauge');

    // Check if the gauge colors already exist to prevent duplicate creation
    if (gaugeContainer.querySelector('.gauge-color')) {
        console.log('Rainbow gauge already exists. Skipping creation.');
        return;
    }

    // Create the rainbow gauge colors
    RAINBOW_ORDER.forEach(color => {
        const colorSquare = document.createElement('div');
        colorSquare.classList.add('gauge-color');
        colorSquare.id = `color-${color}`;  // To easily access and modify later
        gaugeContainer.appendChild(colorSquare);
    });

    // Add the power indicator
    if (!gaugeContainer.querySelector('.gauge-power')) {
        const gaugePower = document.createElement('div');
        gaugePower.classList.add('gauge-power');
        gaugeContainer.appendChild(gaugePower);
    }
}

function createArsenal() {
    // If the arsenal already exists and is not empty, don't overwrite it
    if (game.arsenal && game.arsenal.length > 0) {
        return;
    }

    game.arsenal = [];

    game.cards.forEach(card => {
        addCard(card.type, card.color);
    });
}

function createBoosters() {
    // Check if booster slots already exist
    const bridgeContainer = document.getElementById('bridge-slots');
    if (bridgeContainer.querySelector('.booster-slot')) {
        console.log('Boosters already created. Skipping booster creation.');
        return;
    }

    // Create Bridge Boosters
    for (let i = 0; i < game.slots.bridgeSlots; i++) {
        const bridgeDiv = document.createElement('div');
        bridgeDiv.className = 'booster-slot';
        bridgeDiv.setAttribute('data-group', 'bridge');
        const boosterType = document.createElement('span');
        boosterType.textContent = 'Bridge';
        bridgeDiv.appendChild(boosterType);
        bridgeContainer.appendChild(bridgeDiv);
    }

    // Create Engineering Boosters
    const engineeringContainer = document.getElementById('engineering-slots');
    if (!engineeringContainer.querySelector('.booster-slot')) {
        for (let i = 0; i < game.slots.engineeringSlots; i++) {
            const engineeringDiv = document.createElement('div');
            engineeringDiv.className = 'booster-slot';
            engineeringDiv.setAttribute('data-group', 'engineering');
            const boosterType = document.createElement('span');
            boosterType.textContent = 'Engineering';
            engineeringDiv.appendChild(boosterType);
            engineeringContainer.appendChild(engineeringDiv);
        }
    }

    // Create Armory Boosters
    const armoryContainer = document.getElementById('armory-slots');
    if (!armoryContainer.querySelector('.booster-slot')) {
        for (let i = 0; i < game.slots.armorySlots; i++) {
            const armoryDiv = document.createElement('div');
            armoryDiv.className = 'booster-slot';
            armoryDiv.setAttribute('data-group', 'armory');
            const boosterType = document.createElement('span');
            boosterType.textContent = 'Armory';
            armoryDiv.appendChild(boosterType);
            armoryContainer.appendChild(armoryDiv);
        }
    }
}

function createInjectors() {
    // Check if injector slots already exist
    const injectorContainer = document.getElementById('injector-slots');
    if (injectorContainer.querySelector('.injector-slot')) {
        console.log('Injectors already created. Skipping injector creation.');
        return;
    }

    // Create Injector slots
    for (let i = 0; i < game.slots.injectorSlots; i++) {
        const injectorDiv = document.createElement('div');
        injectorDiv.className = 'injector-slot';
        const injectorType = document.createElement('span');
        injectorType.textContent = 'Injector Slot';
        injectorDiv.appendChild(injectorType);
        injectorContainer.appendChild(injectorDiv);
    }
}

function updateGuns() {
    const gunContainer = document.getElementById('guns');
    gunContainer.innerHTML = '';
    for (let i = 0; i < game.slots.gunSlots; i++) {
        const gunDiv = document.createElement('div');
        gunDiv.className = 'gun-slot';
        gunContainer.appendChild(gunDiv);
    }
}

export function refreshDom() {
    document.querySelector('.attack .remaining').textContent = game.data.attacksRemaining;
    document.querySelectorAll('.attack .total').forEach(element => {
		element.textContent = game.data.attacksTotal;
	});
    document.querySelector('.stow .remaining').textContent = game.data.stowsRemaining;
    document.querySelectorAll('.stow .total').forEach(element => {
		element.textContent = game.data.stowsTotal;
	});
	document.querySelector('#enemy-info .health .current').textContent = formatLargeNumber(game.temp.currentEnemy?.current) || '';
    document.getElementById('spread').textContent = game.data.spread;

    document.querySelector('.stats .lives .total').textContent = game.data.lives;
    document.querySelector('.stats .credits span').textContent = game.data.credits;
    document.querySelector('.stats .foil .total').textContent = (game.data.foilPower * game.data.specialMultiplier);
    document.querySelector('.stats .holo .total').textContent = (game.data.holoPower * game.data.specialMultiplier);
    document.querySelector('.stats .sleeve .total').textContent = (game.data.sleevePower * game.data.specialMultiplier);
    document.querySelector('.stats .gold-leaf .total').textContent = (game.data.goldCredits * game.data.specialMultiplier * game.data.creditsMultiplier);
    document.querySelector('.stats .texture .total').textContent = (game.data.textureLevels * game.data.specialMultiplier);

	updateButtonAvailability();
	updatePreviews();
    checkLevel();

    // handle overlapping elements
    applyBoosterOverlap();
    applyCardOverlap();
    applyGunSlotOverlap();
    applySystemHeartOverlap();
    enableHoverZIndexBehavior('#cards .card.overlapped');
    enableHoverZIndexBehavior('#boosters .booster-slot.overlapped');
    enableHoverZIndexBehavior('#guns .gun-slot .card.overlapped');
    enableHoverZIndexBehavior('#system-hearts .system-heart.overlapped');
}

function addCard(type, color) {
    let addCard = game.cards.filter(obj => obj.type == type && obj.color == color);
    let copiedCard = JSON.parse(JSON.stringify(addCard))[0];
    
    copiedCard.guid = randString();

    game.arsenal.push(copiedCard);
}

/**
 * Finds boosters by attribute, or returns all boosters if no parameters are provided.
 * @param {string|null} attribute - The attribute to search for (e.g., 'type', 'improveEvent'), or null to get all boosters.
 * @param {any} value - The value(s) of the attribute to match. Can be a single value or an array of values.
 * @param {string|null} excludeGuid - GUID of the booster to exclude from the results, or null to include all boosters.
 * @returns {Array} An array of boosters matching the criteria or all boosters if no criteria given.
 */
function findBoosters(attribute = null, value = null, excludeGuid = null) {
    // Combine all booster arrays into a single array
    const allBoosters = [
        ...game.slots.bridgeCards,
        ...game.slots.engineeringCards,
        ...game.slots.armoryCards
    ];

    // If no attribute or value is provided and no specific booster to exclude
    if (attribute === null || value === null) {
        return excludeGuid
            ? allBoosters.filter(booster => booster.guid !== excludeGuid)
            : allBoosters;
    }

    // Filter boosters based on the attribute and value/values, and exclude a specific booster if excludeGuid is provided
    const matchingBoosters = allBoosters.filter(booster => {
        // 1) Check if value is an Array or a single value
        const matchesAttributeAndValue = Array.isArray(value)
            ? value.includes(booster[attribute])
            : booster[attribute] === value;

        // 2) Also check excludeGuid
        if (excludeGuid) {
            return matchesAttributeAndValue && booster.guid !== excludeGuid;
        } else {
            return matchesAttributeAndValue;
        }
    });

    return matchingBoosters;
}

export function showOverworld(increaseFloor = true) {

    saveGameState(game);
    
    togglePointerEvents(true); // Enable pointer events
    document.getElementById('overworld').classList.add('shown');
    
    if (increaseFloor) {
        if (game.temp.currentEnemy.class === 5) {
            game.data.system += 1;
            game.data.class = 0;
            populateShopSystemHearts();
        }
        game.data.class++;
    }

    // Filter enemies by the current system and class
    let enemies = ALL_ENEMIES.filter(obj => obj.system == game.data.system && obj.class == game.data.class);

    // Shuffle the enemies array to randomize the order
    enemies.sort(() => 0.5 - randDecimal());
    
    // Determine the number of enemies to display
    const numberOfEnemies = (game.temp.currentEnemy.class === 4) ? 3 : 1; // 4 actually denotes class 5 because it's still the previous class
    let selectedEnemies = enemies.slice(0, numberOfEnemies);

    // Assuming you have a container to append the enemy buttons
    const enemiesContainer = document.getElementById('enemies');
    enemiesContainer.innerHTML = ''; // Clear previous enemies
    
    selectedEnemies.forEach(enemy => {
        // Create a wrapper div for the enemy name and attack button
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'enemy-wrapper';
    
        // Create and add the enemy name element
        const enemyNameDiv = document.createElement('div');
        enemyNameDiv.className = 'enemy-name';
        enemyNameDiv.textContent = enemy.name;
        wrapperDiv.appendChild(enemyNameDiv);
    
        // Display shield
        const shieldDiv = document.createElement('div');
        shieldDiv.className = 'enemy-shield';
        shieldDiv.innerHTML = `Shield: <span>${enemy.shield === false ? 'None' : Array.isArray(enemy.shield) ? enemy.shield.join(', ') : enemy.shield}</span>`;
        wrapperDiv.appendChild(shieldDiv);
    
        // Display vulnerability
        const vulnerabilityDiv = document.createElement('div');
        vulnerabilityDiv.className = 'enemy-vulnerability';
        vulnerabilityDiv.innerHTML = `Vulnerability: <span>${enemy.vulnerability === false ? 'None' : Array.isArray(enemy.vulnerability) ? enemy.vulnerability.join(', ') : enemy.vulnerability}</span>`;
        wrapperDiv.appendChild(vulnerabilityDiv);
    
        // Create and add the attack button
        const attackButtonDiv = document.createElement('div');
        attackButtonDiv.className = 'start-combat button';
        attackButtonDiv.setAttribute('data-id', enemy.id);
        attackButtonDiv.textContent = 'BATTLE';
        wrapperDiv.appendChild(attackButtonDiv);
    
        // Append the wrapper to the enemies container
        enemiesContainer.appendChild(wrapperDiv);
    
        // Add event listener for the attack button
        attackButtonDiv.addEventListener('click', function() {
            startCombat(enemy.id);
        });
    });
    
    // Update the overworld header, if needed. Adjust this part based on your specific requirements
    document.querySelector('#overworld .system-header').textContent = `System ${game.data.system}, Class ${game.data.class}`;

}

export async function startCombat(enemyid) {
    game.temp.currentContext = 'combat';
    document.getElementById('overworld').classList.remove('shown');
	game.data.attacksRemaining = game.data.attacksTotal;
	game.data.stowsRemaining = game.data.stowsTotal;
    game.temp.cumulativeDamage = 0;
    document.querySelector('.cumulative-damage span').textContent = 0;
    document.querySelector('.number.pierce').textContent = 1;
	resetArsenal();
	loadEnemy(enemyid);
    refreshDom();
	await drawCards();
}

function resetArsenal() {
    // Combine cards from combo, gun slots, and stow pile back into the game.arsenal
    game.arsenal.push(...game.temp.handCards, ...game.temp.gunCards, ...game.temp.stowCards);

    // Clear the arrays since the cards are now back in the game.arsenal
    game.temp.handCards = [];
    game.temp.gunCards = [];
    game.temp.stowCards = [];

	document.querySelector('#cards').innerHTML = '';

    game.arsenal.forEach(card => {
        card.drawn = false;
	});

    // Shuffle the game.arsenal to prepare for the next combat
    shuffleArsenal(game.arsenal);
}

function shuffleArsenal(arsenal) {
    for (let i = arsenal.length - 1; i > 0; i--) {
        const j = Math.floor(randDecimal() * (i + 1));
        [arsenal[i], arsenal[j]] = [arsenal[j], arsenal[i]]; // Swap elements
    }
}

function createCard(item, type = '', prefix = '') {
    let element = document.createElement('div');
    element.className = `card ${type}`;
    element.setAttribute('data-guid', prefix + item.guid);
    element.setAttribute('data-id', item.id || item.type);
    
    // Check if item is a booster
    if (type === 'booster') {
        item.cost = Math.round(game.data.boosterCost * game.data.boosterCostMultiplier[item.rarity]);
        appendBoosterInfo(element, item);
    } else if (type === 'injector') {
        item.cost = Math.round(game.data.injectorCost * game.data.injectorCostMultiplier[item.rarity]);
        appendBoosterInfo(element, item);
    } else {
        appendCardInfo(element, item);
    }

    return element;
}

function refreshCard(item) {
    let elements = document.querySelectorAll(`[data-guid="${item.guid}"]`); // Get all matching elements
    elements.forEach(element => {
        element.innerHTML = '';  // Clear the inner HTML
        // Check if the card is epic
        item.epic = item.foil && item.holo && item.sleeve && item.texture && item.gold_leaf;
        // Check if the card is legendary
        item.legendary = item.epic && item.level >= 50;
        // Check if the card is mythical
        item.mythical = item.legendary && item.level >= 100;
        // Apply changes to each element
        appendCardInfo(element, item);
    });
}

function appendCardInfo(element, item) {
    const properties = ['type', 'name', 'color', 'level', 'foil', 'holo', 'sleeve', 'gold_leaf', 'texture', 'epic', 'legendary', 'mythical'];

    properties.forEach(prop => {
        let span = document.createElement('span');
        span.classList.add(prop);
		if(prop === 'name') {
			span.textContent = item[prop];
        } else if(prop === 'type') {
            span.classList.add(item[prop], 'card-type');
            span.textContent = item[prop].charAt(0);
		} else if(prop === 'level') {
            if(item[prop] > 1) span.textContent = `Level ${item[prop]}`;
		} else if(prop !== 'color') {
			if(item[prop]) {
				span.textContent = `${prettyName(prop)}`
			}
		}
        element.setAttribute(`data-${prop}`, item[prop]);
        element.appendChild(span);
    });

    let amountsWrapper = document.createElement('div');
    amountsWrapper.classList.add('amounts-wrapper');
    element.appendChild(amountsWrapper);

    const amounts = ['damage', 'power', 'pierce', 'spread', 'credits', 'xp'];

    amounts.forEach(prop => {
        let span = document.createElement('span');
        span.classList.add(prop);
        element.setAttribute(`data-${prop}`, item[prop]);
        amountsWrapper.appendChild(span);
    });

    // Add description to tooltip
    const colorArchetype = ARCHETYPES[item['color']] || '';
    const typeArchetype = ARCHETYPES[item['type']] || '';

    const tooltipContent = `${capitalize(item['color'])} (${colorArchetype} archetype) ${prettyName(item['type'])} (${typeArchetype} archetype)`.replace(/ *\( \)/g, ''); // Remove empty archetypes

    element.setAttribute('data-tippy-content', tooltipContent);

    // Assuming boosterElement is your booster DOM element
    const tooltip = tippy(element, {allowHTML: true});
    // Store the instance for later reference
    element._tippyInstance = tooltip;
}

function appendBoosterInfo(element, item) {
    // handle as a booster
    let cost = item.cost || 5;
    element.setAttribute('data-cost', cost);
    element.setAttribute('data-type', item.type);

    let itemName = document.createElement('span');
    itemName.classList.add('name');
    itemName.textContent = prettyName(item.id);
    element.appendChild(itemName);

    let itemCost = document.createElement('span');
    itemCost.classList.add('cost');
    itemCost.textContent = `${cost} Credits`;
    element.appendChild(itemCost);

    let itemType = document.createElement('span');
    itemType.classList.add('type');
    itemType.textContent = item.type;
    element.appendChild(itemType);

    let itemFired = document.createElement('span');
    itemFired.classList.add('fired');
    itemFired.innerHTML = `Fired <span class="fired-count">${item.timesFired ? item.timesFired : 0}</span> times`;
    element.appendChild(itemFired);

    let amountsWrapper = document.createElement('div');
    amountsWrapper.classList.add('amounts-wrapper');
    element.appendChild(amountsWrapper);

    const amounts = ['damage', 'power', 'pierce', 'spread', 'credits', 'xp'];

    amounts.forEach(prop => {
        let span = document.createElement('span');
        span.classList.add(prop);
        span.setAttribute('data-amount', 0);
        element.setAttribute(`data-${prop}`, item[prop]);
        amountsWrapper.appendChild(span);
    });

    let rarity = item.rarity !== undefined ? item.rarity : 'common';
    /*let itemRarity = document.createElement('span');
    itemRarity.classList.add('rarity');
    itemRarity.textContent = '(' + rarity + ')';
    element.appendChild(itemRarity);*/
    element.setAttribute('data-rarity', rarity);

    // ----------------------------
    // ADD "DISCOVERED" OR "UNDISCOVERED"
    // ----------------------------
    let discoveredSpan = document.createElement('span');
    discoveredSpan.classList.add('discovered-status');
    
    // Check if item.id is in the stats.data.discovered.boosters array
    if (stats.data.discovered.boosters.includes(item.id)) {
        discoveredSpan.textContent = 'Discovered';
    } else {
        discoveredSpan.textContent = 'Undiscovered';
    }
    element.appendChild(discoveredSpan);

    // Add description to tooltip
    element.setAttribute('data-tippy-content', item.description);
    // Initialize tippy tooltip
    const tooltip = tippy(element, {allowHTML: true});
    element._tippyInstance = tooltip;
}

async function drawCards() {

    togglePointerEvents(false); // Disable pointer events

    game.temp.currentContext = 'drawn';

    let currentHandSize = game.temp.handCards.length;
    let cardsToDraw = Math.min(game.data.handSize - currentHandSize, game.arsenal.length);
    const gaugeColors = document.querySelectorAll('.gauge-color');
    gaugeColors.forEach(colorElement => {
        colorElement.classList.remove('active');
    });
    document.querySelector('.gauge-power').textContent = '';

    if(game.arsenal.length === 0 && currentHandSize === 0) {
        endCombat('loss');
        return;
    }

    for (let i = 0; i < cardsToDraw; i++) {
        let cardIndex = randArrayIndex(game.arsenal);
        let card = game.arsenal.splice(cardIndex, 1)[0];
        card.drawn = true;
        game.temp.handCards.push(card);
    }

    // Sort the handCards array after adding new cards
    //console.log("Before sort:", game.temp.handCards.map(card => `${card.color} ${card.type}`));
    sortArsenal(game.temp.handCards, RAINBOW_ORDER, CARD_TYPES);
    //console.log("After sort:", game.temp.handCards.map(card => `${card.color} ${card.type}`));

    // Append sorted cards to the DOM
    await appendCardsWithDelay();

    await applyBoosters();

    if (game.arsenal.length < game.data.handSize - currentHandSize) {
        console.log("Not enough cards in the arsenal to draw up to the full combo size.");
    }

    game.temp.currentContext = 'combat';

    togglePointerEvents(true); // Enable pointer events
}

// Define an async function to perform the operations with await
async function appendCardsWithDelay() {
    let cardsDiv = document.getElementById('cards');
    // Clear current cards in the DOM before re-adding them in sorted order
    cardsDiv.innerHTML = '';
    // Append sorted cards to the DOM
    for (const card of game.temp.handCards) {
        let cardElement = createCard(card);
        cardsDiv.appendChild(cardElement);

        // Check for foil
        let foil = getFoil(card);
        if (foil > 1) {
            let currentPower = game.temp.power;
            let modifiedPower = foil * currentPower;
            document.querySelector('.number.power').classList.add("active");
            document.querySelector('.number.power').textContent = formatLargeNumber(modifiedPower);
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
            document.querySelector('.number.power').classList.remove("active");
            game.temp.power = modifiedPower;
            game.temp.persistentPower = modifiedPower;
            updateCardPower(card, 'hand');
        }

        // Add click event listener to equip/unequip card
        cardElement.addEventListener('click', function() {
            equipCard(card, cardElement);
        });
    }
}

function equipCard(card, cardElement) {
    let isEquipped = game.temp.gunCards.includes(card);
    let gunSlots = document.querySelectorAll('.gun-slot');

    // Utility function to remove inline styles applied by `applyCardOverlap`
    const resetCardStyles = (cardElement) => {
        cardElement.style.position = '';
        cardElement.style.left = '';
        cardElement.style.zIndex = '';
    };

    if (!isEquipped) {
        let emptySlot = Array.from(gunSlots).find(slot => !slot.hasChildNodes());

        if (emptySlot && game.temp.gunCards.length < game.slots.gunSlots) {
            game.temp.handCards = game.temp.handCards.filter(c => c.guid !== card.guid);
            game.temp.gunCards.push(card);
            resetCardStyles(cardElement); // Reset inline styles before moving
            emptySlot.appendChild(cardElement); // Move the card element to the empty gun slot

            // Light up the color in the rainbow gauge
            document.getElementById(`color-${card.color}`).classList.add('active');
        }
    } else {
        game.temp.gunCards = game.temp.gunCards.filter(c => c.guid !== card.guid);
        game.temp.handCards.push(card);
        resetCardStyles(cardElement); // Reset inline styles before moving
        document.getElementById('cards').appendChild(cardElement); // Move the card element back to the combo container

        // Check if no other equipped card has this color
        if (!game.temp.gunCards.some(c => c.color === card.color)) {
            document.getElementById(`color-${card.color}`).classList.remove('active');
        }
    }
    refreshDom();
}

function spectrumPower() {
    const activeColors = [];
    let power = 0;

    // Find active colors in the rainbow gauge
    RAINBOW_ORDER.forEach(color => {
        if (document.getElementById(`color-${color}`).classList.contains('active')) {
            activeColors.push(color);
        }
    });

    // If there are less than 2 active colors, no power should be added
    if (activeColors.length < 2) {
        return power;
    }

    // Check if active colors are contiguous
    let areContiguous = true;
    
    for (let i = 1; i < activeColors.length; i++) {
        const previousColorIndex = RAINBOW_ORDER.indexOf(activeColors[i - 1]);
        const currentColorIndex = RAINBOW_ORDER.indexOf(activeColors[i]);

        if (currentColorIndex !== previousColorIndex + 1) {
            areContiguous = false;
            break;
        }
    }

    // If colors are contiguous, calculate and add power
    if (areContiguous) {
        activeColors.forEach(color => {
            power += (COLOR_DAMAGE_SCALE[color] - 9);
        });
    }

    return power;
}

function loadEnemy(enemyid) {
    let enemy = ALL_ENEMIES.filter(obj => obj.id == enemyid)[0];
    game.temp.currentEnemy = enemy;
    enemy.current = enemy.max;

    // Clear previous enemy ship
    const enemyShipContainer = document.querySelector('.enemy-ship');
    enemyShipContainer.innerHTML = ''; // Remove existing children (if any)

    // Append new enemy ship
    const enemyShipDiv = document.createElement('div');
    enemyShipDiv.className = 'enemy-health-bar fade-in';
    enemyShipContainer.appendChild(enemyShipDiv);

    // Append new enemy health preview
    const enemyHealthDiv = document.createElement('div');
    enemyHealthDiv.className = 'enemy-health-preview fade-in';
    enemyShipContainer.appendChild(enemyHealthDiv);

    // Enemy name
    const enemyName = document.querySelector('#enemy-info .name');
    enemyName.textContent = enemy.name;
    enemyName.classList.add('fade-in');

    // Enemy health current
    const enemyHealthCurrent = document.querySelector('#enemy-info .health .current');
    enemyHealthCurrent.textContent = formatLargeNumber(enemy.current);
    enemyHealthCurrent.classList.add('fade-in');

    // Enemy health max
    const enemyHealthMax = document.querySelector('#enemy-info .health .max');
    enemyHealthMax.textContent = formatLargeNumber(enemy.max);
    enemyHealthMax.classList.add('fade-in');

    // Shield and Vulnerability
    const shieldElement = document.querySelector('#enemy-info .enemy-shield span');
    const vulnerabilityElement = document.querySelector('#enemy-info .enemy-vulnerability span');
    
    // Display "none" if shield is false, otherwise display the shield value(s)
    if (enemy.shield === false) {
        shieldElement.textContent = 'None';
    } else {
        shieldElement.textContent = Array.isArray(enemy.shield) ? enemy.shield.join(', ') : enemy.shield;
    }

    // Display "none" if vulnerability is false, otherwise display the vulnerability value(s)
    if (enemy.vulnerability === false) {
        vulnerabilityElement.textContent = 'None';
    } else {
        vulnerabilityElement.textContent = Array.isArray(enemy.vulnerability) ? enemy.vulnerability.join(', ') : enemy.vulnerability;
    }
}

function updateButtonAvailability() {
    const stowButton = document.getElementById('stow-button');
    const attackButton = document.getElementById('attack-button');

    if (game.temp.gunCards.length > 0) {
        // If there are equipped cards, ensure buttons are clickable
        if(game.data.stowsRemaining > 0) stowButton.classList.remove('unavailable');
        if(game.data.attacksRemaining > 0) attackButton.classList.remove('unavailable');
    } else {
        // If there are no equipped cards, disable buttons
        stowButton.classList.add('unavailable');
        attackButton.classList.add('unavailable');
    }
}

export async function stowEquippedCards() {

    console.clear();

    game.temp.currentContext = 'stowed';

    game.data.stowsRemaining -= 1;

    if (game.data.stowsRemaining <= 0) {
        document.querySelector('.stow').classList.add('unavailable');
    }

    // reset temporary values
    game.temp.damage = 0;
    game.temp.power = 0;
    game.temp.persistentDamage = 0;
    game.temp.persistentPower = 0;
    game.temp.dynamicPower = 0;
    game.temp.persistentPierce = 0;
    game.temp.persistentSpread = 0;

    refreshDom();

    await applyBoosters();

    // Remove all cards from gun slots
    document.querySelectorAll('.gun-slot').forEach(slot => slot.innerHTML = '');

    // reset drawn values
	game.temp.gunCards.forEach(card => {
        // Move the card to the stow pile
		game.temp.stowCards.push(card);
        card.drawn = false;
	});
    game.temp.handCards.forEach(card => {
        card.drawn = false;
	});

    // Clear the array of equipped cards since they have been stowed
    game.temp.gunCards = [];

    clearAmounts();

    await drawCards();

    refreshDom();

}

export async function playEquippedCards() {

    game.temp.currentContext = 'played';

    togglePointerEvents(false); // Disable pointer events
	let updatedPower = 1;
	// Loop through scoring cards for texture
    for (const card of game.temp.scoringCards) {
        // Upgrade card if textured
        let cardElement = document.querySelector(`#guns .card[data-guid="${card.guid}"]`);
        if (card.texture) {
            cardElement.classList.add("active");
            let level = getTexture(card);
            if(level > 0) {
                updateCardLevel(card, level, cardElement);
            }
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
            cardElement.classList.remove("active");
        }
    }
    // Loop through scoring cards for gold_leaf
    for (const card of game.temp.scoringCards) {
        // Earn credits if gold_leaf
        let cardElement = document.querySelector(`#guns .card[data-guid="${card.guid}"]`);
        if (card.gold_leaf) {
            document.querySelector('.stats .credits span').classList.add("active");
            cardElement.classList.add("active");
            const creditsSpan = cardElement.querySelector('.credits');
            const credits = getGoldLeaf(card);
            creditsSpan.textContent = "+" + credits;
            game.data.credits += credits;
            document.querySelector('.stats .credits span').textContent = game.data.credits;
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
            document.querySelector('.stats .credits span').classList.remove("active");
            cardElement.classList.remove("active");
        }
    }

	await processSleeveCards();

    // Increase combo played counter
    let comboType = document.querySelector('.combo-name span').getAttribute('data-type');
    if (comboType && comboType !== "none") {
        // Increment the 'played' attribute for the corresponding combo type
        if (game.comboTypeLevels[comboType]) {
            game.comboTypeLevels[comboType].played += 1;
        }
    }

	// Apply booster effects
    await applyBoosters();

    // Check for any self improves
    await improveBoosters('attack');

    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));

	// Move gun cards to stow pile
	for (const card of game.temp.gunCards) {
        // Move the card to the stow pile
        game.temp.stowCards.push(card);
    
        // Remove the card from the DOM
        const element = document.querySelector(`.gun-slot [data-guid="${card.guid}"]`);
        element.classList.add('active');
        if (element) {
            fireAtEnemy(element);
            element.classList.add('active');

            // Delay between each card removal
            await new Promise(resolve => setTimeout(resolve, game.config.stowDelay));

            element.remove();
        }
        card.drawn = false;

    }

    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));

    // Apply damage to the enemy
    await doDamage();

    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));

    // reset temporary values
    game.temp.damage = 0;
    game.temp.power = 0;
    game.temp.persistentDamage = 0;
    game.temp.persistentPower = 0;
    game.temp.dynamicPower = 0;
    game.temp.persistentPierce = 0;
    game.temp.persistentSpread = 0;

    // Reset gunCards array since all cards are played
    game.temp.gunCards = [];
	game.temp.scoringCards = [];

	game.data.attacksRemaining -= 1;

    refreshDom();

    if (game.temp.currentEnemy.current <= 0) {
        game.temp.currentEnemy.current = 0;
        endCombat('win');
        return;
	} else if(game.data.attacksRemaining <= 0) {

        // this is counted as a death even if the game's not over
        // update death stats accordingly
        const systemClassKey = `${game.data.system}.${game.data.class}`;
        const currentCount = stats.data.deaths[systemClassKey] ?? 0;
        stats.data.deaths[systemClassKey] = currentCount + 1;
        saveStats(stats.data);

        if(game.data.lives < 1) {
            endCombat('loss');
		    return;
        } else {
            game.data.lives -= 1;
            showOverworld(false);
            return
        }
		
	}

    clearAmounts();

	await drawCards();

    togglePointerEvents(true); // Enable pointer events
}

function clearAmounts() {
    // Select all amounts-wrapper elements
    const amountsWrappers = document.querySelectorAll('.amounts-wrapper');

    // Loop through each amounts-wrapper
    amountsWrappers.forEach(wrapper => {
        // Select all child spans within the wrapper
        const spans = wrapper.querySelectorAll('span');

        // Clear the textContent of each span
        spans.forEach(span => {
            span.textContent = '';
            span.setAttribute('data-amount', 0);
        });
    });
}

async function processSleeveCards() {
    // Loop through hand cards sequentially
    for (const card of game.temp.handCards) {
        let cardElement = document.querySelector(`#cards .card[data-guid="${card.guid}"]`);
        // Check for Sleeve
        if(card.sleeve) {
            updateCardPower(card, 'sleeve');
            let cardPower = getSleeve(card);
            cardElement.classList.add("active");
            let power = parseFloat(document.querySelector('.number.power').textContent.replace(/,/g, ''));
            power = parseFloat(power.toFixed(2));
            let updatedPower = Math.round(cardPower * power);

            document.querySelector('.number.power').classList.add("active");
            document.querySelector('.number.power').textContent = formatLargeNumber(updatedPower); // Update the power displayed
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
            document.querySelector('.number.power').classList.remove("active");
            cardElement.classList.remove("active");

            let damage = parseFloat(document.querySelector('.number.damage').textContent.replace(/,/g, ''));
            damage = parseFloat(damage.toFixed(0));
            document.querySelector('.total-damage').textContent = formatLargeNumber(Math.round(damage * updatedPower));
        }

        // Mark the card as processed or "undrawn"
        card.drawn = false;
    }
}

// Function to determine if a booster should fire
function shouldBoosterFire(booster) {
    if (booster.disabled) {
        return false;
    }

    // If booster has no context attribute, default to 'played'
    const boosterContext = booster.context || 'played';

    if (boosterContext === 'any') {
        return checkProcChance(booster);
    }

    if (boosterContext !== game.temp.currentContext) {
        return false;
    }

    return checkProcChance(booster);
}

// Helper function to check proc chance
function checkProcChance(booster) {
    return booster.procChance === undefined || randDecimal() <= (booster.procChance * game.data.chanceMultiplier);
}

async function applyBoosters() {
    // Clear any previous mapping
    game.temp.multiplierMapping = {};

    // Array of booster groups that we want to check
    const boosterGroups = [game.slots.bridgeCards, game.slots.engineeringCards, game.slots.armoryCards];

    // Process each group for chained multiplier boosters based on having a multiplier attribute.
    boosterGroups.forEach(group => {
        let i = 0;
        while (i < group.length) {
            // If the current booster has a multiplier attribute, start a chain.
            if (group[i].multiplier !== undefined && group[i].multiplier !== null) {
                let chainMultiplier = group[i].multiplier;
                let j = i + 1;
                // Chain consecutive boosters that have a multiplier attribute.
                while (j < group.length && group[j].multiplier !== undefined && group[j].multiplier !== null) {
                    chainMultiplier *= group[j].multiplier;
                    // Optionally, mark the multiplier booster itself with the cumulative chain value.
                    game.temp.multiplierMapping[group[j].guid] = chainMultiplier;
                    const el = document.querySelector(`[data-guid="${group[j].guid}"]`);
                    if (el) el.classList.add("doubled");
                    j++;
                }
                // If there's a booster immediately after the chain that does NOT have a multiplier,
                // mark it with the current chain multiplier.
                if (j < group.length && (group[j].multiplier === undefined || group[j].multiplier === null)) {
                    game.temp.multiplierMapping[group[j].guid] = chainMultiplier;
                    const targetEl = document.querySelector(`[data-guid="${group[j].guid}"]`);
                    if (targetEl) targetEl.classList.add("doubled");
                }
                // Reset the chain: only the immediate booster following a chain is affected.
                i = j + 1;
            } else {
                i++;
            }
        }
    });

    // Build the initial queue of boosters to process
    let initialQueue = [];
    const boosters = findBoosters();
    for (const booster of boosters) {
        if (shouldBoosterFire(booster)) {
            buildInitialQueue(initialQueue, booster);
        }
    }

    // Process the queue of direct effect boosters
    let finalQueue = await filterDirectBoosters(initialQueue);
    finalQueue.reverse();

    // Handle the double_retriggers and other multipliers (unchanged)
    const multiplyBoosters = findBoosters('boosterAction', [
        'double_retriggers', 
        'double_damage_values', 
        'double_power_values', 
        'double_pierce_values', 
        'double_spread_values', 
        'double_additive',
        'double_multiplicative'
    ]);
    if (multiplyBoosters.length > 0) {
        for (const multiplyBooster of multiplyBoosters) {
            document.querySelector(`[data-guid="${multiplyBooster.guid}"]`).classList.add("multiply");
        }
    }

    // Process the queue
    await processQueue(finalQueue);

    // Clean up: remove the multiply class after processing
    if (multiplyBoosters.length > 0) {
        for (const multiplyBooster of multiplyBoosters) {
            document.querySelector(`[data-guid="${multiplyBooster.guid}"]`).classList.remove("multiply");
        }
    }

    // Remove the "doubled" class from all boosters in multiplierMapping and clear the mapping
    for (const guid in game.temp.multiplierMapping) {
        const el = document.querySelector(`[data-guid="${guid}"]`);
        if (el) {
            el.classList.remove("doubled");
        }
    }
    game.temp.multiplierMapping = {};
}

function buildInitialQueue(queue, booster) {
    // Only add boosters that should fire to the queue
    if (shouldBoosterFire(booster)) {
        queue.push({ booster, triggeredBy: null });
    }
}

function detectCircularDependency(booster1, booster2) {
    // Check if booster1 and booster2 retrigger each other
    const booster1TriggersBooster2 = checkRetriggerCondition(booster2, booster1);
    const booster2TriggersBooster1 = checkRetriggerCondition(booster1, booster2);

    return booster1TriggersBooster2 && booster2TriggersBooster1;
}

async function filterDirectBoosters(initialQueue) {
    const finalQueue = [];
    let circularFlags = new Set();

    if (game.config.debug) {
        console.log("Starting filterDirectBoosters...");
        console.log("Initial Queue:", initialQueue);
    }

    // Check how many double_retriggers boosters are active
    const multiplyBoosters = findBoostersWithAction('double_retriggers');
    const doubleRetriggersCount = multiplyBoosters.length;

    let currentTopLevelBooster = null;

    for (const { booster, triggeredBy } of initialQueue) {
        if (game.config.debug) console.log(`\nProcessing Booster: ${booster.id}`);
        let retriggerChain = triggeredBy ? [triggeredBy] : [];

        let retriggerTimes = booster.retriggerTimes || 1;

        // Apply the multiplier based on the number of active double_retrigger boosters
        if (doubleRetriggersCount > 0 && booster.retriggerCondition && Object.keys(booster.retriggerCondition).length > 0) {
            retriggerTimes *= Math.pow(2, doubleRetriggersCount); // Double retrigger times for each active double_retrigger booster
            if (game.config.debug) console.log(`   - Retrigger times for ${booster.id} multiplied by ${Math.pow(2, doubleRetriggersCount)} due to ${doubleRetriggersCount} double_retrigger boosters.`);
        }

        // Check if we're processing a new top-level booster
        if (booster !== currentTopLevelBooster) {
            currentTopLevelBooster = booster;
            circularFlags = new Set(); // Reset circular flags for this new set of firings
        }

        if (!booster.retriggerCondition) {
            // Direct booster
            for (let i = 0; i < retriggerTimes; i++) {
                if (game.config.debug) console.log(` - ${booster.id} is a direct booster, adding to finalQueue (${i + 1}).`);
                finalQueue.unshift({ booster, triggeredBy: retriggerChain }); // Always provide an array
            }
        } else if (booster.retriggerCondition && booster.retriggerCondition.type === 'random') {
            // Handle the retrigger_random booster with context awareness
            const activeBoosters = findBoosters(); // Fetch all active boosters

            // If the current context is 'played', include boosters with 'played' context or no context at all
            const contextBoosters = game.temp.currentContext === 'played'
                ? activeBoosters.filter(b => b.context === 'played' || !b.context)
                : activeBoosters.filter(b => b.context === game.temp.currentContext); // Filter by current game context otherwise

            if (contextBoosters.length > 0) {
                const randomBooster = randFromArray(contextBoosters, 1); // Select a random booster from the filtered set

                if (game.config.debug) console.log(` - ${booster.id} randomly retriggers ${randomBooster[0].id} (${game.temp.currentContext} context).`);

                for (let i = 0; i < retriggerTimes; i++) {
                    if (game.config.debug) console.log(`   - Retriggering ${randomBooster[0].id} (${i + 1}).`);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("trigger");
                    buildInitialQueue(finalQueue, randomBooster[0]); // Retrigger the random booster
                    await new Promise(resolve => setTimeout(resolve, game.config.triggerDelay));
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.remove("trigger");
                }
            } else {
                if (game.config.debug) console.log(` - No boosters found for context: ${game.temp.currentContext}.`);
            }
            
        } else if (booster.retriggerCondition && Object.keys(booster.retriggerCondition).length > 0) {
            // Regular retrigger booster
            if (game.config.debug) console.log(` - ${booster.id} is a retrigger booster, checking for retriggered boosters...`);
            
            const retriggeredBoosters = findBoosters(null, null, booster.guid);
            if (game.config.debug) console.log(` - Found ${retriggeredBoosters.length} boosters retriggered by ${booster.id}.`);

            filterFurtherRetriggers(retriggeredBoosters, booster, retriggerChain, retriggerTimes, finalQueue, circularFlags, doubleRetriggersCount);
        }
    }

    return finalQueue;
}

function filterFurtherRetriggers(retriggeredBoosters, currentBooster, retriggerChain, retriggerTimes, finalQueue, circularFlags, doubleRetriggersCount) {
    for (const retriggeredBooster of retriggeredBoosters) {
        if (game.config.debug) console.log(`   - Checking retriggered booster: ${retriggeredBooster.id}`);

        if (detectCircularDependency(currentBooster, retriggeredBooster)) {
            const circularKey = `${currentBooster.guid}-${retriggeredBooster.guid}`;
            if (circularFlags.has(circularKey)) {
                if (game.config.debug) console.log(`   - Circular dependency detected between ${currentBooster.id} and ${retriggeredBooster.id}, skipping further retriggers.`);
                continue;
            }
            circularFlags.add(circularKey);
        }

        if (checkRetriggerCondition(retriggeredBooster, currentBooster) && shouldBoosterFire(retriggeredBooster)) {
            if (game.config.debug) console.log(`   - Retriggered Booster: ${retriggeredBooster.id} passed retrigger condition and shouldBoosterFire() check`);

            const updatedRetriggerChain = [...retriggerChain, currentBooster];

            let timesToAdd = retriggerTimes;

            // If the retriggered booster is also a retriggering booster, and double_retriggers is active
            if (doubleRetriggersCount > 0 && retriggeredBooster.retriggerCondition && Object.keys(retriggeredBooster.retriggerCondition).length > 0) {
                timesToAdd *= Math.pow(2, doubleRetriggersCount);
                if (game.config.debug) console.log(`   - Retrigger times for ${retriggeredBooster.id} multiplied by ${Math.pow(2, doubleRetriggersCount)} due to ${doubleRetriggersCount} double_retrigger boosters.`);
            }

            if (!retriggeredBooster.retriggerCondition) {
                // Direct booster after retriggering
                for (let i = 0; i < timesToAdd; i++) {
                    if (game.config.debug) console.log(`   - ${retriggeredBooster.id} is a direct booster, adding to finalQueue (${i + 1}).`);
                    finalQueue.push({ booster: retriggeredBooster, triggeredBy: [...updatedRetriggerChain] });
                }
            } else if (retriggeredBooster.retriggerCondition && Object.keys(retriggeredBooster.retriggerCondition).length > 0) {
                if (game.config.debug) console.log(`   - ${retriggeredBooster.id} is also a retrigger booster, continuing chain...`);

                const furtherTriggeredBoosters = findBoosters(null, null, retriggeredBooster.guid);
                if (game.config.debug) console.log(`     - Found ${furtherTriggeredBoosters.length} boosters retriggered by ${retriggeredBooster.id}.`);

                filterFurtherRetriggers(furtherTriggeredBoosters, retriggeredBooster, updatedRetriggerChain, timesToAdd, finalQueue, circularFlags, doubleRetriggersCount);
            }
        } else {
            if (game.config.debug) console.log(`   - ${retriggeredBooster.id} did not pass retrigger condition or shouldBoosterFire() check.`);
        }
    }
}

async function processQueue(queue) {
    if (game.config.debug) {
        console.log("Starting processQueue...");
        console.log("Queue:", queue);
    }

    // Store original delays to reset after processing
    const originalDelays = {
        cardDelay: game.config.cardDelay,
        boosterDelay: game.config.boosterDelay,
        improveDelay: game.config.improveDelay,
        triggerDelay: game.config.triggerDelay,
        multiplyDelay: game.config.multiplyDelay,
    };

    for (const { booster, triggeredBy } of queue) {
        if (game.config.debug) console.log(`\nProcessing Booster: ${booster.id}`);

        // Highlight boosters in the triggeredBy chain if they exist in the DOM
        if (triggeredBy && triggeredBy.length > 0) {
            if (game.config.debug) console.log(` - Triggered By Chain: ${triggeredBy.map(b => b.id).join(' -> ')}`);
            triggeredBy.forEach(parentBooster => {
                const parentEl = document.querySelector(`[data-guid="${parentBooster.guid}"]`);
                if (parentEl) parentEl.classList.add("trigger");
            });
        } else {
            if (game.config.debug) console.log(" - No Triggered By Chain, this is a direct booster.");
        }

        // Highlight the booster if its element exists
        let boosterEl = document.querySelector(`[data-guid="${booster.guid}"]`);
        if (boosterEl) {
            boosterEl.classList.add("active");
        }

        // Process the booster power
        await processBoosterPower(booster);

        // Increase count of booster.timesFired (defaulting to 0 if undefined)
        booster.timesFired = (booster.timesFired || 0) + 1;

        // If the booster element exists, update the "fired" span and remove the "active" class
        if (boosterEl) {
            const firedCountSpan = boosterEl.querySelector('.fired .fired-count');
            if (firedCountSpan) {
                firedCountSpan.textContent = booster.timesFired;
            }
            boosterEl.classList.remove("active");
        }        

        if (triggeredBy && triggeredBy.length > 0) {
            triggeredBy.forEach(parentBooster => {
                const parentEl = document.querySelector(`[data-guid="${parentBooster.guid}"]`);
                if (parentEl) parentEl.classList.remove("trigger");
            });
        }

        // Delay between processing boosters with decreasing time
        await new Promise(resolve => setTimeout(resolve, game.config.triggerDelay));

        // Decrease delays for next iteration
        game.config.cardDelay = Math.max(game.config.animationMinimum, game.config.cardDelay * game.config.animationDecrementFactor);
        game.config.boosterDelay = Math.max(game.config.animationMinimum, game.config.boosterDelay * game.config.animationDecrementFactor);
        game.config.improveDelay = Math.max(game.config.animationMinimum, game.config.improveDelay * game.config.animationDecrementFactor);
        game.config.triggerDelay = Math.max(game.config.animationMinimum, game.config.triggerDelay * game.config.animationDecrementFactor);
        game.config.multiplyDelay = Math.max(game.config.animationMinimum, game.config.multiplyDelay * game.config.animationDecrementFactor);
    }

    // Reset delays to original values
    game.config.cardDelay = originalDelays.cardDelay;
    game.config.boosterDelay = originalDelays.boosterDelay;
    game.config.improveDelay = originalDelays.improveDelay;
    game.config.triggerDelay = originalDelays.triggerDelay;
    game.config.multiplyDelay = originalDelays.multiplyDelay;

    if (game.config.debug) console.log("Completed processQueue.");
}

function checkRetriggerCondition(booster, triggerBooster) {
    // Retrieve the triggering booster's retrigger condition
    let condition = triggerBooster.retriggerCondition;
    if (!condition) return false;

    // Iterate over all keys in the condition object
    for (const key in condition) {
        const value = condition[key];

        // Check if the condition specifies 'exists'
        if (value === 'exists') {
            // Return true if the property exists on the triggering booster
            if (booster[key] !== undefined) {
                return true;
            }
        } else if (Array.isArray(value)) {
            // handle array values, where any value in the array can satisfy the condition
            if (Array.isArray(booster[key])) {
                // Both are arrays, check intersection
                if (value.some(item => booster[key].includes(item))) {
                    return true;
                }
            } else if (value.includes(booster[key])) {
                // The triggering booster's property is not an array, simple inclusion check
                return true;
            }
        } else {
            // handle direct equality or other conditions
            if (booster[key] === value) {
                return true;
            }
        }
    }

    // If no conditions are met, return false
    return false;
}

async function processBoosterPower(booster) {
    if(booster.conditional === false) {
        await processBooster(booster);
    } else {
        let to = booster.to !== undefined ? booster.to : 'gunCards';
        for (const card of game.temp[to]) {
            let isCardAffected = isCardAffectedByBooster(booster, card);
            if (isCardAffected && (booster.cardChance === undefined || randDecimal() <= (booster.cardChance * game.data.chanceMultiplier))) {
                let cardElement = document.querySelector(`#guns .card[data-guid="${card.guid}"]`);
                if(booster.to === 'handCards') {
                    cardElement = document.querySelector(`#cards .card[data-guid="${card.guid}"]`);
                }
                if (cardElement) {
                    await processBooster(booster, cardElement);
                }
            }
        }
    }
}

async function processBooster(booster, cardElement = false) {
    // don't allow injectors to process when not in combat mode
    if (booster.type === 'injector' && game.temp.currentContext !== 'combat') return;
    // Wait a bit to visually show the card being affected
    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
    let procBooster = false;
    // if value is a number, round to 2 decimals. if it doesn't exist, set it to 0. if it's a string, use the string value.
    let boosterDamage = typeof booster.damage === 'number'
        ? Math.round(booster.damage * 100) / 100
        : (typeof booster.damage === 'string' ? booster.damage : 0);
    let boosterPower = typeof booster.power === 'number'
        ? Math.round(booster.power * 100) / 100
        : (typeof booster.power === 'string' ? booster.power : 0);
    let boosterPierce = typeof booster.pierce === 'number'
        ? Math.round(booster.pierce * 100) / 100
        : (typeof booster.pierce === 'string' ? booster.pierce : 0);
    let boosterSpread = typeof booster.spread === 'number'
        ? Math.round(booster.spread * 100) / 100
        : (typeof booster.spread === 'string' ? booster.spread : 0);
    let boosterCredits = typeof booster.credits === 'number'
        ? Math.round(booster.credits * 100) / 100
        : (typeof booster.credits === 'string' ? booster.credits : 0);
    let boosterXP = typeof booster.xp === 'number'
        ? Math.round(booster.xp * 100) / 100
        : (typeof booster.xp === 'string' ? booster.xp : 0);

    // deal with special values for boosterDamage
    if (typeof boosterDamage === 'string') {
        switch (boosterDamage) {
            case 'highest_level_card':
                // Find the card with the highest level
                const highestLevel = game.temp.gunCards.reduce((max, card) => {
                    return card.level > max ? card.level : max;
                }, 0);
                boosterDamage = highestLevel;
                break;
        }
    }
    // deal with special values for boosterPower
    if (typeof boosterPower === 'string') {
        switch (boosterPower) {
            case 'highest_wavelength':
                let highestCard = game.temp.gunCards.reduce((highest, card) => {
                    return COLOR_DAMAGE_SCALE[card.color] > COLOR_DAMAGE_SCALE[highest.color] ? card : highest;
                });
                boosterPower = COLOR_DAMAGE_SCALE[highestCard.color];
                break;
            case 'combo_frequency':
                let comboType = document.querySelector('.combo-name span').getAttribute('data-type');
                if (comboType && game.comboTypeLevels[comboType]) {
                    boosterPower = game.comboTypeLevels[comboType].played;
                }
                break;
            case 'total_blue_levels':
                const totalBlueLevel = game.temp.gunCards
                    .filter(card => card.color === 'blue') // Filter for blue cards only
                    .reduce((total, card) => total + card.level, 0); // Sum up the levels starting from 0
                boosterPower = totalBlueLevel;
                break;
            case 'system_class':
                boosterPower = game.data.system + game.data.class;
                break;
            case 'combined_card_level':
                // Sum the levels of all played cards
                const combinedLevel = game.temp.gunCards.reduce((total, card) => total + card.level, 0);
                boosterPower = combinedLevel;
                break;
            case 'damage':
                let currentDamage = parseFloat(document.querySelector('.number.damage').textContent.replace(/,/g, ''));
                currentDamage = parseFloat(currentDamage.toFixed(0));
                boosterPower = currentDamage;
                break;
            case 'highest_level_card':
                // Find the card with the highest level
                const highestLevelForPower = game.temp.gunCards.reduce((max, card) => {
                    return card.level > max ? card.level : max;
                }, 0);
                boosterPower = highestLevelForPower;
                break;
            case 'total_empty_slots': {
                const emptyBridge = game.slots.bridgeSlots - game.slots.bridgeCards.length;
                const emptyEngineering = game.slots.engineeringSlots - game.slots.engineeringCards.length;
                const emptyArmory = game.slots.armorySlots - game.slots.armoryCards.length;
                const totalEmpty = emptyBridge + emptyEngineering + emptyArmory + 1;
                boosterPower = totalEmpty;
                break;
            }
        }
    }
    // deal with special values for boosterPierce
    if (typeof boosterPierce === 'string') {
        switch (boosterPierce) {
            case 'draw_cards':
                boosterPierce = game.arsenal.length * .1;
                break;
            case 'stow_cards':
                boosterPierce = game.temp.stowCards.length * .2;
                break;
            case 'player_level':
                boosterPierce = game.data.level;
                break;
            case 'highest_level_card':
                const highestLevelForPierce = game.temp.gunCards.reduce((max, card) => {
                    return card.level > max ? card.level : max;
                }, 0);
                boosterPierce = highestLevelForPierce;
                break;
            case 'total_empty_slots': {
                const emptyBridge = game.slots.bridgeSlots - game.slots.bridgeCards.length;
                const emptyEngineering = game.slots.engineeringSlots - game.slots.engineeringCards.length;
                const emptyArmory = game.slots.armorySlots - game.slots.armoryCards.length;
                const totalEmpty = emptyBridge + emptyEngineering + emptyArmory + 1;
                boosterPierce = totalEmpty;
                break;
            }
        }
    }
    // deal with special values for boosterSpread
    if (typeof boosterSpread === 'string') {
        switch (boosterSpread) {
            case 'highest_level_card':
                const highestLevelForSpread = game.temp.gunCards.reduce((max, card) => {
                    return card.level > max ? card.level : max;
                }, 0);
                boosterSpread = highestLevelForSpread;
                break;
        }
    }

    // For additive boosters: if any booster with 'double_additive' is active and this booster is additive.
    if (findBoosters('boosterAction', 'double_additive').length > 0 && booster.boosterAction !== 'double_additive') {
        if (!booster.multiplicative) { // Only apply to additive boosters
            boosterDamage *= 2;
            boosterPower *= 2;
            boosterPierce *= 2;
            boosterSpread *= 2;
        }
    }

    // For multiplicative boosters: if any booster with 'double_multiplicative' is active and this booster is multiplicative.
    if (findBoosters('boosterAction', 'double_multiplicative').length > 0 && booster.boosterAction !== 'double_multiplicative') {
        if (booster.multiplicative) { // Only apply to multiplicative boosters
            boosterDamage *= 2;
            boosterPower *= 2;
            boosterPierce *= 2;
            boosterSpread *= 2;
        }
    }

    // If any booster with the respective boosterAction is active (and the current booster isn't itself that type), double the value.
    if (findBoosters('boosterAction', 'double_damage_values').length > 0 && booster.boosterAction !== 'double_damage_values') {
        boosterDamage *= 2;
    }
    if (findBoosters('boosterAction', 'double_power_values').length > 0 && booster.boosterAction !== 'double_power_values') {
        boosterPower *= 2;
    }
    if (findBoosters('boosterAction', 'double_pierce_values').length > 0 && booster.boosterAction !== 'double_pierce_values') {
        boosterPierce *= 2;
    }
    if (findBoosters('boosterAction', 'double_spread_values').length > 0 && booster.boosterAction !== 'double_spread_values') {
        boosterSpread *= 2;
    }

    // Check if this booster has a multiplier from a chained multiplier booster
    let chainMultiplier = 1;
    if (game.temp.multiplierMapping && game.temp.multiplierMapping[booster.guid]) {
        chainMultiplier = game.temp.multiplierMapping[booster.guid];
    }
    
    // Apply the chain multiplier to the booster’s attributes
    boosterDamage *= chainMultiplier;
    boosterPower *= chainMultiplier;
    boosterPierce *= chainMultiplier;
    boosterSpread *= chainMultiplier;
    boosterCredits *= chainMultiplier;
    boosterXP *= chainMultiplier;

    let damage = parseFloat(document.querySelector('.number.damage').textContent.replace(/,/g, ''));
    damage = parseFloat(damage.toFixed(0));
    let power = parseFloat(document.querySelector('.number.power').textContent.replace(/,/g, ''));
    power = parseFloat(power.toFixed(2));
    let pierce = parseFloat(document.querySelector('.number.pierce').textContent.replace(/,/g, ''));
    pierce = parseFloat(pierce.toFixed(2));
    let spread = parseFloat(document.querySelector('.number.spread').textContent.replace(/,/g, ''));
    spread = parseFloat(spread.toFixed(2));
    let credits = parseFloat(document.querySelector('.stats .credits span').textContent.replace(/,/g, ''));
    credits = parseFloat(credits.toFixed(2));
    let xp = parseFloat(document.querySelector('.stats .xp span').textContent.replace(/,/g, ''));
    xp = parseFloat(xp.toFixed(2));

    let multiplicative = booster.multiplicative !== undefined ? booster.multiplicative : false;
    let prefix = multiplicative ? "x" : "+";
    let damageIncrease = multiplicative ? Math.round(damage * boosterDamage) : Math.round(damage + boosterDamage);
    let powerIncrease = multiplicative ? Math.round((power * boosterPower) * 100) / 100 : Math.round((power + boosterPower) * 100) / 100;
    let pierceIncrease = multiplicative ? Math.round((pierce * boosterPierce) * 100) / 100 : Math.round((pierce + boosterPierce) * 100) / 100;
    let spreadIncrease = multiplicative ? Math.round((spread * boosterSpread) * 100) / 100 : Math.round((spread + boosterSpread) * 100) / 100;
    let creditsIncrease = multiplicative ? Math.round((credits * boosterCredits) * 100) / 100 : Math.round((credits + boosterCredits) * 100) / 100;
    let xpIncrease = multiplicative ? Math.round((xp * boosterXP) * 100) / 100 : Math.round((xp + boosterXP) * 100) / 100;

    let boosterElement = document.querySelector(`[data-guid="${booster.guid}"]`);

    // Damage is increasing
    if (damageIncrease > damage) {
        procBooster = true;
        let amount = formatLargeNumber(damageIncrease);
        document.querySelector('.number.damage').classList.add("active");
        document.querySelector('.number.damage').textContent = amount; // Update the damage displayed
        let previousAmount = parseInt(boosterElement.querySelector('.damage').getAttribute('data-amount').replace(/,/g, ''), 10);
        let newAmount = multiplicative ? Math.round((boosterDamage * previousAmount) * 100) / 100 : Math.round((boosterDamage + previousAmount) * 100) / 100;
        boosterElement.querySelector('.damage').textContent = prefix + newAmount;
        boosterElement.querySelector('.damage').setAttribute('data-amount', formatLargeNumber(newAmount));
    }
    // Power is increasing
    if (powerIncrease > power) {
        procBooster = true;
        let amount = formatLargeNumber(powerIncrease);
        document.querySelector('.number.power').classList.add("active");
        document.querySelector('.number.power').textContent = amount; // Update the power displayed
        let previousAmount = parseInt(boosterElement.querySelector('.power').getAttribute('data-amount').replace(/,/g, ''), 10);
        let newAmount = multiplicative ? Math.round((boosterPower * previousAmount) * 100) / 100 : Math.round((boosterPower + previousAmount) * 100) / 100;
        boosterElement.querySelector('.power').textContent = prefix + newAmount;
        boosterElement.querySelector('.power').setAttribute('data-amount', formatLargeNumber(newAmount));
    }
    // Pierce is increasing
    if (pierceIncrease > pierce) {
        procBooster = true;
        let amount = formatLargeNumber(pierceIncrease);
        document.querySelector('.number.pierce').classList.add("active");
        document.querySelector('.number.pierce').textContent = amount; // Update the pierce displayed
        let previousAmount = parseInt(boosterElement.querySelector('.pierce').getAttribute('data-amount').replace(/,/g, ''), 10);
        let newAmount = multiplicative ? Math.round((boosterPierce * previousAmount) * 100) / 100 : Math.round((boosterPierce + previousAmount) * 100) / 100;
        boosterElement.querySelector('.pierce').textContent = prefix + newAmount;
        boosterElement.querySelector('.pierce').setAttribute('data-amount', formatLargeNumber(newAmount));
    }
    // Spread is increasing
    if (spreadIncrease > spread) {
        procBooster = true;
        let amount = formatLargeNumber(spreadIncrease);
        document.querySelector('.number.spread').classList.add("active");
        document.querySelector('.number.spread').textContent = amount; // Update the spread displayed
        game.data.spread = spreadIncrease;
        let previousAmount = parseInt(boosterElement.querySelector('.spread').getAttribute('data-amount').replace(/,/g, ''), 10);
        let newAmount = multiplicative ? Math.round((boosterSpread * previousAmount) * 100) / 100 : Math.round((boosterSpread + previousAmount) * 100) / 100;
        boosterElement.querySelector('.spread').textContent = prefix + newAmount;
        boosterElement.querySelector('.spread').setAttribute('data-amount', formatLargeNumber(newAmount));
    }
    // Credits are increasing
    if (creditsIncrease > credits) {
        procBooster = true;
        let amount = formatLargeNumber(creditsIncrease);
        document.querySelector('.stats .credits span').classList.add("active");
        document.querySelector('.stats .credits span').textContent = amount; // Update the credits displayed
        game.data.credits = creditsIncrease;
        let previousAmount = parseInt(boosterElement.querySelector('.credits').getAttribute('data-amount').replace(/,/g, ''), 10);
        let newAmount = multiplicative ? Math.round((boosterCredits * previousAmount) * 100) / 100 : Math.round((boosterCredits + previousAmount) * 100) / 100;
        boosterElement.querySelector('.credits').textContent = prefix + newAmount;
        boosterElement.querySelector('.credits').setAttribute('data-amount', formatLargeNumber(newAmount));
    }
    // XP is increasing
    if (xpIncrease > xp) {
        procBooster = true;
        let amount = formatLargeNumber(xpIncrease);
        document.querySelector('.stats .xp span').classList.add("active");
        document.querySelector('.stats .xp span').textContent = amount; // Update the XP displayed
        game.data.xp = xpIncrease;
        let previousAmount = parseInt(boosterElement.querySelector('.xp').getAttribute('data-amount').replace(/,/g, ''), 10);
        let newAmount = multiplicative ? Math.round((boosterXP * previousAmount) * 100) / 100 : Math.round((boosterXP + previousAmount) * 100) / 100;
        boosterElement.querySelector('.xp').textContent = prefix + newAmount;
        boosterElement.querySelector('.xp').setAttribute('data-amount', formatLargeNumber(newAmount));
        checkLevel();
    }

    if (procBooster) {
        boosterElement.classList.add("active");
        if (cardElement) {
            cardElement.classList.add("active");
            fireAtEnemy(cardElement);
        }
    }

    await boosterAction(booster, cardElement);
    await improveBooster(booster);

    // Fetch new values from the DOM
    damage = parseFloat(document.querySelector('.number.damage').textContent.replace(/,/g, ''));
    damage = parseFloat(damage.toFixed(0));
    power = parseFloat(document.querySelector('.number.power').textContent.replace(/,/g, ''));
    power = parseFloat(power.toFixed(2));
    pierce = parseFloat(document.querySelector('.number.pierce').textContent.replace(/,/g, ''));
    pierce = parseFloat(pierce.toFixed(2));
    spread = parseFloat(document.querySelector('.number.spread').textContent.replace(/,/g, ''));
    spread = parseFloat(spread.toFixed(2));

    // store in game.temp
    game.temp.damage = damage;
    game.temp.power = power;
    game.temp.pierce = pierce;
    game.temp.spread = spread;
    game.temp.persistentDamage = damage;
    game.temp.persistentPower = power;
    game.temp.dynamicPower = 0;
    game.temp.persistentPierce = pierce;
    game.temp.persistentSpread = spread;

    // Calculate total damage
    let totalDamage = new Decimal(damage).times(power).times(pierce).times(spread).round().toNumber();

    // Update the total damage
    document.querySelector('.total-damage').textContent = formatLargeNumber(Math.round(totalDamage));
    updateEnemyHealthPreview(totalDamage);

    // Wait a bit to visually show the card being affected
    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
    if (procBooster) {
        boosterElement.classList.remove("active");
        if (cardElement) {
            cardElement.classList.remove("active");
        }
    }
    document.querySelector('.number.damage').classList.remove("active");
    document.querySelector('.number.power').classList.remove("active");
    document.querySelector('.number.pierce').classList.remove("active");
    document.querySelector('.number.spread').classList.remove("active");
    document.querySelector('.stats .credits span').classList.remove("active");
    document.querySelector('.stats .xp span').classList.remove("active");

    if (booster.type === 'injector') {
        let slot = boosterElement.parentNode;
        let update = false;
        destroyBooster(booster.guid, 'injector', slot, update);
    }
}

async function boosterAction(booster, cardElement = false) {
    let boosterAction = booster.boosterAction !== undefined ? booster.boosterAction : false;
    if (!boosterAction) return false;
    
    // Check for actionChance. If none, default to 1.
    let actionChance = (booster.actionChance !== undefined) ? booster.actionChance : 1;
    // Generate a random number between 0 and 1. If it's greater than actionChance, skip processing.
    if (randDecimal() > actionChance) {
        return false;
    }

    switch(boosterAction) {
        case 'upgrade_high_combo':
            if(cardElement) cardElement.classList.add("active"); // Visually mark the card as being affected by the booster
            document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
            upgradeHighestLevelCombo();
        break;
        case 'upgrade_random_combo':
            if(cardElement) cardElement.classList.add("active");
            document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
            upgradeRandomCombo();
        break;
        case 'upgrade_played_combo':
            let comboType = document.querySelector('.combo-name span').getAttribute('data-type');
            if (comboType && game.comboTypeLevels[comboType]) {
                if(cardElement) cardElement.classList.add("active");
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                updateComboLevel(comboType, 1);
                console.log(`Upgraded ${comboType} to level ${game.comboTypeLevels[comboType].level}`);
            } else {
                console.log("No combo was played or combo type is unknown.");
            }
        break;
        case 'upgrade_stowed_combo':
            let stowedComboType = document.querySelector('.combo-name span').getAttribute('data-type');
            if (stowedComboType && game.comboTypeLevels[stowedComboType]) {
                if(cardElement) cardElement.classList.add("active");
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                updateComboLevel(stowedComboType, 1);
                console.log(`Upgraded ${stowedComboType} to level ${game.comboTypeLevels[stowedComboType].level}`);
            } else {
                console.log("No combo was stowed or combo type is unknown.");
            }
        break;
        case 'upgrade_random_played_card':
            const randomIndex = Math.floor(randDecimal() * game.temp.gunCards.length);
            const randomCard = game.temp.gunCards[randomIndex];
            const randomCardElement = document.querySelector(`#guns .card[data-guid="${randomCard.guid}"]`);
            if (randomCardElement) {
                updateCardLevel(randomCard, 1, randomCardElement);
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                randomCardElement.classList.add("upgraded");
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                randomCardElement.classList.remove("upgraded");
            } else {
                console.log('Could not find card element with data-guid: ', randomCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.gunCards);
            }
        break;
        case 'upgrade_random_drawn_card':
            const randomHandIndex = Math.floor(randDecimal() * game.temp.handCards.length);
            const randomHandCard = game.temp.handCards[randomHandIndex];
            const randomHandCardElement = document.querySelector(`#cards .card[data-guid="${randomHandCard.guid}"]`);
            if (randomHandCardElement) {
                updateCardLevel(randomHandCard, 1, randomHandCardElement);
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                randomHandCardElement.classList.add("upgraded");
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                randomHandCardElement.classList.remove("upgraded");
            } else {
                console.log('Could not find card element with data-guid: ', randomHandCard.guid, 'Tried to pull from game.temp.handCards: ', game.temp.handCards);
            }
        break;
        case 'random_hand_special_card':
            const handSpecialAttributes = Object.entries(game.data.specialWeights).map(([name, weight]) => ({
                name,
                weight
            }));
            const [handSelectedAttribute] = weightedSelect(handSpecialAttributes, 1);
            const eligibleHandCards = game.temp.handCards.filter(card => !card[handSelectedAttribute.name]);
            if (eligibleHandCards.length === 0) {
                console.log(`No eligible cards to apply the attribute: ${handSelectedAttribute.name}`);
                break;
            }
            const handSpecialCardIndex = Math.floor(randDecimal() * eligibleHandCards.length);
            const handSpecialCard = eligibleHandCards[handSpecialCardIndex];
            const handSpecialCardElement = document.querySelector(`#cards .card[data-guid="${handSpecialCard.guid}"]`);
            if (handSpecialCardElement) {
                handSpecialCard[handSelectedAttribute.name] = true;
                refreshCard(handSpecialCard);
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                handSpecialCardElement.classList.add("special");
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
                handSpecialCardElement.classList.remove("special");
            } else {
                console.log('Could not find card element with data-guid: ', handSpecialCard.guid, 'Tried to pull from game.temp.handCards: ', game.temp.handCards);
            }
        break;
        case 'played_special_card':
            const playedSpecialAttributes = Object.entries(game.data.specialWeights).map(([name, weight]) => ({
                name,
                weight
            }));
            const [playedSelectedAttribute] = weightedSelect(playedSpecialAttributes, 1);
            const eligiblePlayedCards = game.temp.scoringCards.filter(card => !card[playedSelectedAttribute.name]);
            if (eligiblePlayedCards.length === 0) {
                console.log(`No eligible cards to apply the attribute: ${playedSelectedAttribute.name}`);
                break;
            }
            const playedSpecialCardIndex = Math.floor(randDecimal() * eligiblePlayedCards.length);
            const playedSpecialCard = eligiblePlayedCards[playedSpecialCardIndex];
            const playedSpecialCardElement = document.querySelector(`#guns .card[data-guid="${playedSpecialCard.guid}"]`);
            if (playedSpecialCardElement) {
                playedSpecialCard[playedSelectedAttribute.name] = true;
                refreshCard(playedSpecialCard);
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                playedSpecialCardElement.classList.add("special");
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
                playedSpecialCardElement.classList.remove("special");
            } else {
                console.log('Could not find card element with data-guid: ', playedSpecialCard.guid, 'Tried to pull from game.temp.scoringCards: ', game.temp.scoringCards);
            }
        break;
        case 'random_special_meta_increase':
            const gameDataProperties = Object.entries(game.data.specialWeights).map(([name, weight]) => ({
                name,
                weight
            }));            
            const [selectedProperty] = weightedSelect(gameDataProperties, 1);
            const randomGameDataProperty = selectedProperty.name;
            game.data[randomGameDataProperty] += 1;
            const propertyToClassMap = {
                foilPower: 'foil',
                holoPower: 'holo',
                sleevePower: 'sleeve',
                goldCredits: 'gold-leaf',
                textureLevels: 'texture'
            };
            const statClass = propertyToClassMap[randomGameDataProperty];
            const statElement = document.querySelector(`.stats .${statClass} .total`);
            statElement.textContent = (game.data[randomGameDataProperty] * game.data.specialMultiplier);
            statElement.classList.add("active");
            if (cardElement) cardElement.classList.add("active");
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
            statElement.classList.remove("active");
            document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
        break;
        case 'upgrade_scoring_cards':
            for (const scoringCard of game.temp.scoringCards) {
                const scoringCardElement = document.querySelector(`#guns .card[data-guid="${scoringCard.guid}"]`);
                if (scoringCardElement) {
                    updateCardLevel(scoringCard, 1, scoringCardElement);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    scoringCardElement.classList.add("upgraded");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
                    scoringCardElement.classList.remove("upgraded");
                } else {
                    console.log('Could not find card element with data-guid: ', scoringCard.guid, 'Tried to pull from game.temp.scoringCards: ', game.temp.scoringCards);
                }
            }
        break;
        case 'upgrade_green_cards':
            for (const card of game.temp.gunCards) {
                if (card.color === 'green') {
                    const greenCardElement = document.querySelector(`#guns .card[data-guid="${card.guid}"]`);
                    if (greenCardElement) {
                        updateCardLevel(card, 1, greenCardElement);
                        document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                        greenCardElement.classList.add("upgraded");
                        await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
                        greenCardElement.classList.remove("upgraded");
                    } else {
                        console.log('Could not find card element with data-guid: ', card.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.gunCards);
                    }
                }
            }
        break;
        case 'stow_wavelengths':
            for (const card of game.temp.gunCards) {
                if (card.color !== 'black') {
                    const cardElement = document.querySelector(`#guns .card[data-guid="${card.guid}"]`);
                    const boosterElement = document.querySelector(`[data-guid="${booster.guid}"]`);
                    if (boosterElement) boosterElement.classList.add("active");
                    let currentColorIndex = RAINBOW_ORDER.indexOf(card.color);
                    let nextColorIndex = currentColorIndex + 1;
                    if (nextColorIndex < RAINBOW_ORDER.length) {
                        card.color = RAINBOW_ORDER[nextColorIndex];
                        if (cardElement) {
                            cardElement.classList.add("active");
                            cardElement.setAttribute('data-color', card.color);
                        }
                        await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                        if (cardElement) cardElement.classList.remove("active");
                    }
                    if (boosterElement) boosterElement.classList.remove("active");
                }
            }
        break;
        case 'stowed_special_card':
            const specialAttributes = Object.entries(game.data.specialWeights).map(([name, weight]) => ({
                name,
                weight
            }));
            const [selectedAttribute] = weightedSelect(specialAttributes, 1);
            const eligibleCards = game.temp.gunCards.filter(card => !card[selectedAttribute.name]);
            if (eligibleCards.length === 0) {
                console.log(`No eligible cards to apply the attribute: ${selectedAttribute.name}`);
                break;
            }
            const stowedSpecialCardIndex = Math.floor(randDecimal() * eligibleCards.length);
            const stowedSpecialCard = eligibleCards[stowedSpecialCardIndex];
            const stowedSpecialCardElement = document.querySelector(`#guns .card[data-guid="${stowedSpecialCard.guid}"]`);
            if (stowedSpecialCardElement) {
                stowedSpecialCard[selectedAttribute.name] = true;
                refreshCard(stowedSpecialCard);
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                stowedSpecialCardElement.classList.add("special");
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
                stowedSpecialCardElement.classList.remove("special");
            } else {
                console.log('Could not find card element with data-guid: ', stowedSpecialCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.gunCards);
            }
        break;
        case 'stowed_upgrade_card':
            const stowedRandomIndex = Math.floor(randDecimal() * game.temp.gunCards.length);
            const stowedRandomCard = game.temp.gunCards[stowedRandomIndex];
            const stowedRandomCardElement = document.querySelector(`#guns .card[data-guid="${stowedRandomCard.guid}"]`);
            if (stowedRandomCardElement) {
                updateCardLevel(stowedRandomCard, 1, stowedRandomCardElement);
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                stowedRandomCardElement.classList.add("upgraded");
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                stowedRandomCardElement.classList.remove("upgraded");
            } else {
                console.log('Could not find card element with data-guid: ', stowedRandomCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.gunCards);
            }
        break;
        case 'upgrade_stowed_cards':
            for (const stowedCard of game.temp.gunCards) {
                const stowedCardElement = document.querySelector(`#guns .card[data-guid="${stowedCard.guid}"]`);
                if (stowedCardElement) {
                    updateCardLevel(stowedCard, 1, stowedCardElement);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    stowedCardElement.classList.add("upgraded");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
                    stowedCardElement.classList.remove("upgraded");
                } else {
                    console.log('Could not find card element with data-guid: ', stowedCard.guid, 'Tried to pull from game.temp.scoringCards: ', game.temp.gunCards);
                }
            }
        break;
        case 'random_played_foil':
            const nonFoilCards = game.temp.handCards.filter(card => !card.foil);
            if (nonFoilCards.length > 0) {
                const specialIndex = Math.floor(randDecimal() * nonFoilCards.length);
                const specialCard = nonFoilCards[specialIndex];
                const specialCardElement = document.querySelector(`#cards .card[data-guid="${specialCard.guid}"]`);
                if (specialCardElement) {
                    specialCard.foil = true;
                    refreshCard(specialCard);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    specialCardElement.classList.add("special");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                    specialCardElement.classList.remove("special");
                } else {
                    console.log('Could not find card element with data-guid: ', specialCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.gunCards);
                }
            } else {
                console.log('No non-foil cards available to apply foil.');
            }
        break;
        case 'random_played_holo':
            const nonHoloCards = game.temp.handCards.filter(card => !card.holo);
            if (nonHoloCards.length > 0) {
                const specialIndex = Math.floor(randDecimal() * nonHoloCards.length);
                const specialCard = nonHoloCards[specialIndex];
                const specialCardElement = document.querySelector(`#cards .card[data-guid="${specialCard.guid}"]`);
                if (specialCardElement) {
                    specialCard.holo = true;
                    refreshCard(specialCard);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    specialCardElement.classList.add("special");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                    specialCardElement.classList.remove("special");
                } else {
                    console.log('Could not find card element with data-guid: ', specialCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.handCards);
                }
            } else {
                console.log('No non-holo cards available to apply foil.');
            }
        break;
        case 'random_played_sleeve':
            const nonSleeveCards = game.temp.handCards.filter(card => !card.sleeve);
            if (nonSleeveCards.length > 0) {
                const specialIndex = Math.floor(randDecimal() * nonSleeveCards.length);
                const specialCard = nonSleeveCards[specialIndex];
                const specialCardElement = document.querySelector(`#cards .card[data-guid="${specialCard.guid}"]`);
                if (specialCardElement) {
                    specialCard.sleeve = true;
                    refreshCard(specialCard);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    specialCardElement.classList.add("special");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                    specialCardElement.classList.remove("special");
                } else {
                    console.log('Could not find card element with data-guid: ', specialCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.handCards);
                }
            } else {
                console.log('No non-sleeve cards available to apply foil.');
            }
        break;
        case 'random_played_gold_leaf':
            const nonGoldLeafCards = game.temp.handCards.filter(card => !card.gold_leaf);
            if (nonGoldLeafCards.length > 0) {
                const specialIndex = Math.floor(randDecimal() * nonGoldLeafCards.length);
                const specialCard = nonGoldLeafCards[specialIndex];
                const specialCardElement = document.querySelector(`#cards .card[data-guid="${specialCard.guid}"]`);
                if (specialCardElement) {
                    specialCard.gold_leaf = true;
                    refreshCard(specialCard);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    specialCardElement.classList.add("special");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                    specialCardElement.classList.remove("special");
                } else {
                    console.log('Could not find card element with data-guid: ', specialCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.handCards);
                }
            } else {
                console.log('No non-gold leaf cards available to apply foil.');
            }
        break;
        case 'random_played_texture':
            const nonTextureCards = game.temp.handCards.filter(card => !card.texture);
            if (nonTextureCards.length > 0) {
                const specialIndex = Math.floor(randDecimal() * nonTextureCards.length);
                const specialCard = nonTextureCards[specialIndex];
                const specialCardElement = document.querySelector(`#cards .card[data-guid="${specialCard.guid}"]`);
                if (specialCardElement) {
                    specialCard.texture = true;
                    refreshCard(specialCard);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    specialCardElement.classList.add("special");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                    specialCardElement.classList.remove("special");
                } else {
                    console.log('Could not find card element with data-guid: ', specialCard.guid, 'Tried to pull from game.temp.gunCards: ', game.temp.handCards);
                }
            } else {
                console.log('No non-texture cards available to apply foil.');
            }
        break;
        case 'destroy_self': {
            const boosterElement = document.querySelector(`[data-guid="${booster.guid}"]`);
            if (boosterElement) {
                boosterElement.classList.add("destroying");
                processConvertSacrifice(booster);
                await new Promise(resolve => setTimeout(resolve, game.config.destroyDelay));
                const boosterSlot = boosterElement.parentNode;
                destroyBooster(booster.guid, booster.type, boosterSlot, true);
            } else {
                console.error("Booster element not found for destroy_self:", booster.guid);
            }
        }
        break;
        case 'destroy_common': {
            let commonBoosters = findBoosters('rarity', 'common');
            commonBoosters = commonBoosters.filter(b => b.guid !== booster.guid);
            if (commonBoosters.length === 0) {
                console.log("No eligible common booster found to destroy.");
                break;
            }
            const randomIndex = Math.floor(Math.random() * commonBoosters.length);
            const selectedCommon = commonBoosters[randomIndex];
            const commonEl = document.querySelector(`[data-guid="${selectedCommon.guid}"]`);
            if (commonEl) {
                commonEl.classList.add("destroying");
                processConvertSacrifice(booster);
                await new Promise(resolve => setTimeout(resolve, game.config.destroyDelay));
                const boosterSlot = commonEl.parentNode;
                destroyBooster(selectedCommon.guid, selectedCommon.type, boosterSlot, true);
            } else {
                console.error("Common booster element not found for destroy_random_common:", selectedCommon.guid);
            }
            break;
        }
    }
}

/**
 * Processes any active "convert_sacrifice" boosters.
 * For each such booster, this function:
 *   - Adds an "active" class to its DOM element,
 *   - Increases game.data.spread by the number of times the current booster has fired,
 *   - Updates the spread display in the DOM,
 *   - And then removes the "active" class from the convert_sacrifice boosters.
 *
 * @param {object} booster - The booster being sacrificed (its timesFired property is used).
 */
function processConvertSacrifice(booster) {
    // Find all boosters with the "convert_sacrifice" action
    const sacrificeBoosters = findBoosters('boosterAction', 'convert_sacrifice');
    if (sacrificeBoosters && sacrificeBoosters.length > 0) {
        // Add "active" class to each convert_sacrifice booster element
        sacrificeBoosters.forEach(sacBooster => {
            const el = document.querySelector(`[data-guid="${sacBooster.guid}"]`);
            if (el) {
                el.classList.add("active");
            }
        });
        
        // Calculate how much to add to the spread (defaulting to 0 if undefined)
        const additionalSpread = booster.timesFired || 0;
        // Update game data (rounding to 2 decimals)
        game.data.spread = Math.round((game.data.spread + additionalSpread) * 100) / 100;
        
        // Update the DOM element that displays spread
        const spreadEl = document.querySelector('.number.spread');
        if (spreadEl) {
            spreadEl.classList.add("active");
            spreadEl.textContent = formatLargeNumber(game.data.spread);
        }
        
        // Remove "active" class from all convert_sacrifice booster elements
        sacrificeBoosters.forEach(sacBooster => {
            const el = document.querySelector(`[data-guid="${sacBooster.guid}"]`);
            if (el) {
                el.classList.remove("active");
            }
        });
    }
}

async function improveBooster(booster, special = false) {
    let selfImprove = booster.selfImprove !== undefined ? booster.selfImprove : false;
    let chance = booster.improveChance !== undefined ? (booster.improveChance * game.data.chanceMultiplier) : 1;
    let chancePlay = (randDecimal() <= chance);
    if (!selfImprove || !chancePlay) return false;

    let improveEvent = booster.improveEvent !== undefined ? booster.improveEvent : false;
    let improveAmount = booster.improveAmount !== undefined ? booster.improveAmount : 0; // Keep as string or number initially
    let shouldImprove = (!improveEvent && !special) || special ? true : false;

    if (shouldImprove) {
        // Wait a bit to visually show the booster being affected
        await new Promise(resolve => setTimeout(resolve, game.config.improveDelay)); 
        let boosterElement = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
        if (boosterElement) boosterElement.classList.add("improving"); // Visually mark the booster as improving

        const calculateImproveAmount = (currentValue, amount) => {
            if (typeof amount === 'string') {
                switch (amount) {
                    case 'double':
                        return currentValue; // Double the current value, so the amount to add is the same as the current value
                    default:
                        console.warn(`Unknown improveAmount string: ${amount}`);
                        return 0; // Default to no improvement for unknown strings
                }
            }
            return amount; // If it's a number, return it directly
        };

        if (Array.isArray(selfImprove) && Array.isArray(improveAmount)) {
            // handle arrays: improve each specified booster attribute by the corresponding amount and update the description
            selfImprove.forEach((improveProperty, index) => {
                if (index < improveAmount.length) {
                    const currentValue = parseFloat(booster[improveProperty]) || 0;
                    const calculatedAmount = calculateImproveAmount(currentValue, improveAmount[index]);
                    booster[improveProperty] = currentValue + calculatedAmount;

                    // Cap percentage-based properties at 100%
                    if (improveProperty.toLowerCase().includes('chance') && booster[improveProperty] > 1) {
                        booster[improveProperty] = 1; // Cap at 100% or 1.0
                    }

                    let displayValue = booster[improveProperty];
                    if (improveProperty.toLowerCase().includes('chance')) { // Check if the property involves chance
                        displayValue = Math.round(displayValue * 100); // Convert to percentage and round to integer
                    } else {
                        displayValue = parseFloat(displayValue.toFixed(2));
                    }

                    // Update the corresponding span in the description
                    const regex = new RegExp(`(<span class="description-${improveProperty}">)(.*?)(</span>)`);
                    booster.description = booster.description.replace(regex, `$1${displayValue}$3`);
                }
            });
        } else if (!Array.isArray(selfImprove) && !Array.isArray(improveAmount)) {
            const currentValue = parseFloat(booster[selfImprove]) || 0;
            const calculatedAmount = calculateImproveAmount(currentValue, improveAmount);
            booster[selfImprove] = currentValue + calculatedAmount;

            // Cap percentage-based property at 100%
            if (selfImprove.toLowerCase().includes('chance') && booster[selfImprove] > 1) {
                booster[selfImprove] = 1; // Cap at 100% or 1.0
            }

            let displayValue = booster[selfImprove];
            if (selfImprove.toLowerCase().includes('chance')) { // Check if the property involves chance
                displayValue = Math.round(displayValue * 100); // Convert to percentage and round to integer
            } else {
                displayValue = parseFloat(displayValue.toFixed(2));
            }

            // Update the corresponding span in the description
            const regex = new RegExp(`(<span class="description-${selfImprove}">)(.*?)(</span>)`);
            booster.description = booster.description.replace(regex, `$1${displayValue}$3`);
        }

        await new Promise(resolve => setTimeout(resolve, game.config.improveDelay)); 
        if (boosterElement) boosterElement.classList.remove("improving");
        boosterTooltip(booster);
    }
}

function isCardAffectedByBooster(booster, card) {
    let conditions = []; // Array to hold the results of all condition checks
    let isAffected = false;
    let currentComboType = document.querySelector('.combo-name span').getAttribute('data-type');
    const comboTypeLower = currentComboType.toLowerCase();
    let currentComboLevel = (comboTypeLower === undefined || comboTypeLower === null || comboTypeLower === '') ? 1 : game.comboTypeLevels[currentComboType].level; 

    if(booster.customCondition !== undefined) {
        // Custom processing
        switch(booster.customCondition) {
            case 'one_played':
                if(game.temp.gunCards.length === 1) {
                    isAffected = true;
                }
            break;
            case 'two_played':
                if(game.temp.gunCards.length === 2) {
                    isAffected = true;
                }
            break;
            case 'three_played':
                if(game.temp.gunCards.length === 3) {
                    isAffected = true;
                }
            break;
            case 'four_played':
                if(game.temp.gunCards.length === 4) {
                    isAffected = true;
                }
            break;
            case 'five_played':
                if(game.temp.gunCards.length === 5) {
                    isAffected = true;
                }
            break;
            case 'single_red':
                if(game.temp.gunCards.length === 1 && game.temp.gunCards[0].color === 'red') {
                    isAffected = true;
                }
            break;
            case 'stowed_combo':
                if (currentComboType !== "") {
                    // Check if the card is part of the scoring combo being stowed
                    const isComboCard = game.temp.scoringCards.some(scoringCard => scoringCard.guid === card.guid);

                    if (isComboCard) {
                        isAffected = true;
                    }
                }
            break;
            case 'attack_no_combo':
                if (currentComboType === "") {
                    isAffected = true;
                }
            break;
            case 'first_attack':
                let attacksUsed = game.data.attacksTotal - game.data.attacksRemaining;
                if(attacksUsed === 0) {
                    isAffected = true;
                }
            break;
            case 'single_booster':
                let boosterGroup;

                // Determine the booster group
                switch(booster.type) {
                    case 'bridge':
                        boosterGroup = game.slots.bridgeCards;
                        break;
                    case 'engineering':
                        boosterGroup = game.slots.engineeringCards;
                        break;
                    case 'armory':
                        boosterGroup = game.slots.armoryCards;
                        break;
                }
            
                // Check if the booster is the only one in its group
                if (boosterGroup && boosterGroup.length === 1 && boosterGroup[0].guid === booster.guid) {
                    isAffected = true;
                }
            break;
        }
    } else {
        // Standard processing
        // handle cardType condition as an array
        if (Array.isArray(booster.cardType)) {
            conditions.push(booster.cardType.includes(card.type));
        } else if (booster.cardType) {
            conditions.push(booster.cardType === card.type);
        }

        // handle cardColor condition as an array
        if (Array.isArray(booster.cardColor)) {
            conditions.push(booster.cardColor.includes(card.color));
        } else if (booster.cardColor) {
            conditions.push(booster.cardColor === card.color);
        }

        // handle cardEffect condition (can be a single effect or an array of effects)
        if (Array.isArray(booster.cardEffect)) {
            // Push true if any of the specified card effects are true for the card
            const effectConditions = booster.cardEffect.map(effect => !!card[effect]);
            conditions.push(effectConditions.some(effectCondition => effectCondition === true));
        } else if (booster.cardEffect) {
            // Push true if the specified single card effect is true for the card
            conditions.push(!!card[booster.cardEffect]);
        }

        // handle cardStatus condition (can be a single status or an array of statuses)
        if (Array.isArray(booster.cardStatus)) {
            // Push true if any of the specified card effects are true for the card
            const statusConditions = booster.cardStatus.map(status => !!card[status]);
            conditions.push(statusConditions.some(statusCondition => statusCondition === true));
        } else if (booster.cardStatus) {
            // Push true if the specified single card status is true for the card
            conditions.push(!!card[booster.cardStatus]);
        }

        // The rest of the conditions for colorTemperature and cardEffect remain unchanged
        if (booster.colorTemperature) {
            const isWarm = WARM_COLORS.includes(card.color);
            const isCool = COOL_COLORS.includes(card.color);
            conditions.push((booster.colorTemperature === 'warm' && isWarm) || (booster.colorTemperature === 'cool' && isCool));
        }

        // handle comboType condition as an array
        if(booster.comboType) {
            let iscombo = false;
            // Check for general combo types ("armament" or "chromatic") and ensure it's a part of the current combo type
            if (booster.comboType.toLowerCase() === "armament" || booster.comboType.toLowerCase() === "chromatic") {
                iscombo = comboTypeLower.includes(booster.comboType.toLowerCase()) && game.temp.scoringCards.some(scoringCard => scoringCard.guid === card.guid);
            }
            // For specific combo types, ensure an exact match
            else {
                iscombo = comboTypeLower === booster.comboType.toLowerCase() && game.temp.scoringCards.some(scoringCard => scoringCard.guid === card.guid);
            }
            // Add to conditions if affected
            conditions.push(iscombo);
        }

        // handle cardLevel condition with comparison
        if (booster.cardLevel !== undefined) {
            switch (booster.compareLevel) {
                case 'greater':
                    conditions.push(card.level > booster.cardLevel);
                    break;
                case 'less':
                    conditions.push(card.level < booster.cardLevel);
                    break;
                default: // Assumes 'equal' if compare is not specified
                    conditions.push(card.level === booster.cardLevel);
            }
        }

        // handle comboLevel condition with comparison
        if (booster.comboLevel !== undefined) {
            // Check if card is part of the current combo and the combo's level is greater than booster.comboLevel
            const isComboCard = game.temp.scoringCards.some(scoringCard => scoringCard.guid === card.guid);
            if (isComboCard) {
                switch (booster.compareLevel) {
                    case 'greater':
                        conditions.push(currentComboLevel > booster.comboLevel);
                        break;
                    case 'less':
                        conditions.push(currentComboLevel < booster.comboLevel);
                        break;
                    default: // Assumes 'equal' if compare is not specified
                        conditions.push(currentComboLevel === booster.comboLevel);
                }
            }
        }

        // handle compare method
        isAffected = booster.compareEffects === 'and' ? conditions.every(condition => condition) : conditions.some(condition => condition);
    }

    // if the booster is a drawn booster and the card is not drawn, it cannot be affected
    if(booster.context === 'drawn' && card.drawn === false) {
        isAffected = false;
    }

    return isAffected;
}

/**
 * Finds boosters by boosterAction, or returns false if no boosters with the specified action are equipped.
 * @param {string} action - The boosterAction to search for.
 * @returns {Array|boolean} An array of boosters with the specified action or false if none found.
 */
function findBoostersWithAction(action) {
    const allBoosters = [...game.slots.bridgeCards, ...game.slots.engineeringCards, ...game.slots.armoryCards];
    const boostersWithAction = allBoosters.filter(booster => booster.boosterAction === action);

    return boostersWithAction.length > 0 ? boostersWithAction : false;
}

function isSpectrum() {
    // Get the unique colors of the cards in the combo
    const comboColors = game.temp.gunCards.map(card => card.color);

    // Create a sorted copy of comboColors based on their position in RAINBOW_ORDER
    const sortedcomboColors = [...comboColors].sort((a, b) => RAINBOW_ORDER.indexOf(a) - RAINBOW_ORDER.indexOf(b));

    // Iterate through the rainbow order to check for a continuous sequence that matches the sorted combo colors
    for (let i = 0; i <= RAINBOW_ORDER.length - sortedcomboColors.length; i++) {
        const rainbowSubSequence = RAINBOW_ORDER.slice(i, i + sortedcomboColors.length);
        // Check if the sorted combo colors match this subsequence of the rainbow
        if (JSON.stringify(sortedcomboColors) === JSON.stringify(rainbowSubSequence)) {
            return true;
        }
    }
    return false;
}


function isChargedArmament(typeCounts) {
    // Find two different types where one occurs 3 times and the other occurs 2 times
    let values = Object.values(typeCounts);
    return values.includes(3) && values.includes(2);
}

function isChargedChromatic(colorCounts) {
    // Find two different colors where one occurs 3 times and the other occurs 2 times
    let values = Object.values(colorCounts);
    return values.includes(3) && values.includes(2);
}

function isChargedChromaticArmament(cards) {
    // Object to track counts of color-type combinations
    const colorTypeCounts = {};

    // Populate colorTypeCounts with counts for each color-type combination in the combo
    cards.forEach(card => {
        const key = `${card.color}_${card.type}`;
        colorTypeCounts[key] = (colorTypeCounts[key] || 0) + 1;
    });

    // Find all unique combinations that have either 3 or 2 cards
    const combinations = Object.values(colorTypeCounts).filter(count => count === 3 || count === 2);

    // Check if there's exactly one combination with 3 cards and one combination with 2 cards
    const hasThreeOfOneCombo = combinations.includes(3);
    const hasTwoOfAnotherCombo = combinations.includes(2);
    const isValidCombination = combinations.length === 2 && hasThreeOfOneCombo && hasTwoOfAnotherCombo;

    return isValidCombination;
}

function isVulnerable(card, enemy) {
    const vulnerabilities = Array.isArray(enemy.vulnerability) ? enemy.vulnerability : [enemy.vulnerability];

    return vulnerabilities.some(vulnerability => {
        return card.color === vulnerability || 
               card.type === vulnerability ||
               (vulnerability === 'warm' && WARM_COLORS.includes(card.color)) ||
               (vulnerability === 'cool' && COOL_COLORS.includes(card.color));
    });
}

function isShielded(card, enemy) {
    const shields = Array.isArray(enemy.shield) ? enemy.shield : [enemy.shield];

    return shields.some(shield => {
        return card.color === shield || 
               card.type === shield ||
               (shield === 'warm' && WARM_COLORS.includes(card.color)) ||
               (shield === 'cool' && COOL_COLORS.includes(card.color));
    });
}

function scoringCombo(typeCounts, colorCounts, maxColorTypeCount) {
    // Check for spectrum condition
	const isFullSpectrum = game.temp.gunCards.length === 5 && isSpectrum();
	const allSameType = Object.keys(typeCounts).length === 1 ? true : false;
	const allSameColor = Object.keys(colorCounts).length === 1 ? true : false;
	const maxColorCount = Math.max(...Object.values(colorCounts));
	const maxTypeCount = Math.max(...Object.values(typeCounts));
	const totalCards = game.temp.gunCards.length;

	let possiblecombos = [];

    // Determine combo type based on the collected data and conditions
    if (isFullSpectrum && allSameType) {
        possiblecombos.push({ type: "fullSpectrumArmament", baseDamage: game.comboTypeLevels["fullSpectrumArmament"].baseDamage });
    } 
    if (maxColorTypeCount === 5 && allSameType) {
        possiblecombos.push({ type: "fullChromaticArmament", baseDamage: game.comboTypeLevels["fullChromaticArmament"].baseDamage });
    }
    if (maxColorTypeCount === 2 && totalCards >= 2) {
        possiblecombos.push({ type: "biChromaticArmament", baseDamage: game.comboTypeLevels["biChromaticArmament"].baseDamage });
    }
    if (maxColorTypeCount === 3 && totalCards >= 3) {
        possiblecombos.push({ type: "triChromaticArmament", baseDamage: game.comboTypeLevels["triChromaticArmament"].baseDamage });
    }
    if (maxColorTypeCount === 4 && totalCards >= 4) {
        possiblecombos.push({ type: "quadChromaticArmament", baseDamage: game.comboTypeLevels["quadChromaticArmament"].baseDamage });
    } 
    if (maxColorCount === 2 && totalCards >= 2) {
        possiblecombos.push({ type: "biChromatic", baseDamage: game.comboTypeLevels["biChromatic"].baseDamage });
    }
    if (maxColorCount === 3 && totalCards >= 3) {
        possiblecombos.push({ type: "triChromatic", baseDamage: game.comboTypeLevels["triChromatic"].baseDamage });
    } 
    if (maxColorCount === 4 && totalCards >= 4) {
        possiblecombos.push({ type: "quadChromatic", baseDamage: game.comboTypeLevels["quadChromatic"].baseDamage });
    } 
    if (maxColorCount === 5 && allSameColor) {
        possiblecombos.push({ type: "fullChromatic", baseDamage: game.comboTypeLevels["fullChromatic"].baseDamage });
    } 
    if (maxTypeCount === 2 && totalCards >= 2) {
        possiblecombos.push({ type: "biArmament", baseDamage: game.comboTypeLevels["biArmament"].baseDamage });
    }
    if (maxTypeCount === 3 && totalCards >= 3) {
        possiblecombos.push({ type: "triArmament", baseDamage: game.comboTypeLevels["triArmament"].baseDamage });
    } 
    if (maxTypeCount === 4 && totalCards >= 4) {
        possiblecombos.push({ type: "quadArmament", baseDamage: game.comboTypeLevels["quadArmament"].baseDamage });
    } 
    if (maxTypeCount === 5 && allSameType) {
        possiblecombos.push({ type: "fullArmament", baseDamage: game.comboTypeLevels["fullArmament"].baseDamage });
    } 
    if (isFullSpectrum) {
        possiblecombos.push({ type: "fullSpectrum", baseDamage: game.comboTypeLevels["fullSpectrum"].baseDamage });
    }
    if (isChargedArmament(typeCounts)) {
        possiblecombos.push({ type: "chargedArmament", baseDamage: game.comboTypeLevels["chargedArmament"].baseDamage });
    }
    if (isChargedChromatic(colorCounts)) {
        possiblecombos.push({ type: "chargedChromatic", baseDamage: game.comboTypeLevels["chargedChromatic"].baseDamage });
    }
    if (isChargedChromaticArmament(game.temp.gunCards)) {
        possiblecombos.push({ type: "chargedChromaticArmament", baseDamage: game.comboTypeLevels["chargedChromaticArmament"].baseDamage });
    }

	// Loop over possiblecombos to calculate the damage for each combo, and select the highest scoring one
	let highestScoringCombo = possiblecombos.reduce((highest, combo) => {
        let adjustedBaseDamage = combo.baseDamage;
        let handlevel = game.comboTypeLevels[combo.type].level;

        // Normalize shield and vulnerability to arrays for case-insensitive comparison
        const shields = [].concat(game.temp.currentEnemy.shield || []).map(s => s.toLowerCase());
        const vulnerabilities = [].concat(game.temp.currentEnemy.vulnerability || []).map(v => v.toLowerCase());

        const comboTypeLower = combo.type.toLowerCase();

        // Check for shield or vulnerability against the combo type (case-insensitive)
        const iscomboShielded = shields.some(shield => comboTypeLower.includes(shield));
        const iscomboVulnerable = vulnerabilities.some(vulnerability => comboTypeLower.includes(vulnerability));

        // Adjust for shield (debuff combo level or damage)
        if (iscomboShielded) {
            handlevel = 1; // Apply shield effect
        }

        // Adjust for vulnerability (increase damage or combo level)
        if (iscomboVulnerable) {
            adjustedBaseDamage *= 2; // Apply vulnerability effect
        }

        let totalDamage = adjustedBaseDamage * handlevel;
        return totalDamage > highest.totalDamage ? { type: combo.type, totalDamage } : highest;
	}, { type: "", totalDamage: 0 });

    // Now clear game.temp.scoringCards and only add cards contributing to the highest scoring combo
    game.temp.scoringCards = [];
    if (highestScoringCombo.type) {
        game.temp.gunCards.forEach(card => {
            if (highestScoringCombo.type.includes("Chromatic") && colorCounts[card.color] >= 2) {
                game.temp.scoringCards.push(card);
            } else if (highestScoringCombo.type.includes("Armament") && typeCounts[card.type] >= 2) {
                game.temp.scoringCards.push(card);
            } else if (highestScoringCombo.type.includes("Spectrum")) {
                game.temp.scoringCards.push(card); // Assuming all cards contribute to a spectrum combo
            }
        });
    }

    return highestScoringCombo;
}

function updatePreviews() {
    let colorValueSum = 0;

    // If the persistent values aren't defined yet, initialize them
    if (!game.temp.persistentDamage || game.temp.persistentDamage === 0) {
        game.temp.persistentDamage = 0;
    }
    if (!game.temp.persistentPower || game.temp.persistentPower === 0) {
        game.temp.persistentPower = 1; // Base persistent power from boosters or drawn cards
    }
    if (!game.temp.persistentPierce || game.temp.persistentPierce === 0) {
        game.temp.persistentPierce = 1;
    }
    if (!game.temp.persistentSpread || game.temp.persistentSpread === 0) {
        game.temp.persistentSpread = 1; // Base persistent power from boosters or drawn cards
    }

    // Initialize dynamic power to be recalculated based on equipped cards
    game.temp.dynamicPower = 1; // Start from a base value

    // Count cards by color and type
    let colorCounts = {};
    let typeCounts = {};
    let colorTypeCounts = {};
    let maxColorTypeCount = 0; // Max count of cards sharing both color and type

    // Track all equipped card GUIDs
    const equippedCardGUIDs = game.temp.gunCards.map(card => card.guid);

    // Calculate colorValueSum and dynamic power based on the cards equipped
    game.temp.gunCards.forEach(card => {
        const baseDamage = game.data.maxWavelengths ? Math.max(...Object.values(COLOR_DAMAGE_SCALE)) : COLOR_DAMAGE_SCALE[card.color];
        const level = isShielded(card, game.temp.currentEnemy) ? 1 : card.level; // Shielded cards are considered level 1
        const damageMultiplier = isVulnerable(card, game.temp.currentEnemy) ? 2 : 1; // Vulnerable cards have their damage doubled
        const cardDamage = Math.round((baseDamage * level) * damageMultiplier);

        updateCardDamage(card, cardDamage);

        colorValueSum += cardDamage;

        // Track counts for combos
        colorCounts[card.color] = (colorCounts[card.color] || 0) + 1;
        typeCounts[card.type] = (typeCounts[card.type] || 0) + 1;
        let key = `${card.color}-${card.type}`;
        colorTypeCounts[key] = (colorTypeCounts[key] || 0) + 1;
        maxColorTypeCount = Math.max(maxColorTypeCount, colorTypeCounts[key]);
    });

    // Loop through a second time to multiply dynamic power based on holo cards
    game.temp.gunCards.forEach(card => {
        let holo = getHolo(card);
        game.temp.dynamicPower *= holo;
        updateCardPower(card, 'guns');
    });

    // Loop through hand cards and reset damage and power amounts
    game.temp.handCards.forEach(card => {
        // Find the card element in the DOM using its GUID
        const cardElement = document.querySelector(`#cards .card[data-guid="${card.guid}"]`);
        if (cardElement) {
            const damageSpan = cardElement.querySelector('.damage');
            if (damageSpan) damageSpan.textContent = ''; // Clear the damage span
            updateCardPower(card, 'hand');
        }
    });

    // Get the highest scoring combo
    let highestScoringCombo = scoringCombo(typeCounts, colorCounts, maxColorTypeCount);

    // Now, set the official combo to the highest scoring one and use that value as the bonusDamage amount
    let comboType = highestScoringCombo.type;
    let bonusDamage = highestScoringCombo.totalDamage;
    let bonusDamageDisplay = bonusDamage > 0 ? "+" + bonusDamage : '';

    // Include spectrum power from contiguous colors
    let spectrumBonusPower = spectrumPower(); // Recalculate spectrum power from scratch
    let spectrumBonusPowerDisplay = spectrumBonusPower > 0 ? "+" + formatLargeNumber(spectrumBonusPower) : '';

    // Add spectrum power to the dynamic power
    game.temp.dynamicPower += spectrumBonusPower;

    if (game.temp.currentContext === 'stowed' || game.temp.currentContext === 'overworld') {
        game.temp.dynamicPower = 1;
    }

    // Combine persistentPower (booster effects) and dynamicPower (from cards and spectrum power)
    let totalPower = Math.round(game.temp.persistentPower * game.temp.dynamicPower);

    //let comboTypeLevel = comboType ? ' ' + numberToRoman(game.comboTypeLevels[comboType].level) : '';
    let comboTypeLevel = comboType ? ' ' + game.comboTypeLevels[comboType].level : '';
    let comboTypePlayed = comboType ? game.comboTypeLevels[comboType].played : '';
    let totalDamage = Math.round(colorValueSum + bonusDamage + game.temp.persistentDamage);

    let totalPierce = game.temp.persistentPierce;
    let totalSpread = game.temp.persistentSpread;

    let finalDamage = totalDamage * totalPower * totalPierce * totalSpread;

    // Update DOM with new values
    document.querySelector('.number.damage').textContent = formatLargeNumber(totalDamage);
    document.querySelector('.number.power').textContent = formatLargeNumber(totalPower);
    document.querySelector('.combo-name span').setAttribute('data-type', comboType);
    document.querySelector('.combo-name span').textContent = comboType ? capitalize(comboType.replace(/([A-Z])/g, ' $1').trim()) + comboTypeLevel : "None";
    document.querySelector('.combo-name .combo-damage').textContent = formatLargeNumber(bonusDamageDisplay);
    document.querySelector('.combo-name .combo-played').textContent = comboType ? "(Played " + comboTypePlayed + " times)" : '';
    document.querySelector('.total-damage').textContent = formatLargeNumber(Math.round(finalDamage));
    document.querySelector('.gauge-power').textContent = formatLargeNumber(spectrumBonusPowerDisplay);

    // Update the temporary game state with the recalculated values
    game.temp.damage = totalDamage;
    game.temp.power = totalPower;

    updateEnemyHealthPreview(finalDamage);
}

function getHolo(card) {
    return card.holo ? ((game.data.holoPower * game.data.specialMultiplier) + (card.level - 1)) : 1;
}
function getFoil(card) {
    return card.foil ? ((game.data.foilPower * game.data.specialMultiplier) + (card.level - 1)) : 1;
}
function getSleeve(card) {
    return card.sleeve ? ((game.data.sleevePower * game.data.specialMultiplier) + (card.level - 1)) : 1;
}
function getGoldLeaf(card) {
    return card.gold_leaf ? Math.round(((game.data.goldCredits * game.data.creditsMultiplier) + (card.level - 1)) * game.data.specialMultiplier) : 0;
}
function getTexture(card) {
    return card.texture ? Math.round(game.data.textureLevels * game.data.specialMultiplier) : 0;
}
function updateCardDamage(card, cardDamage) {
    // Update the damage span in the card element
    const cardElement = document.querySelector(`#guns .card[data-guid="${card.guid}"]`);
    if (cardElement) {
        const damageSpan = cardElement.querySelector('.damage');
        const damageDisplay = "+" + cardDamage;
        damageSpan.textContent = damageDisplay;
    }
}
function updateCardPower(card, context = 'hand') {
    let foil = getFoil(card);
    let holo = getHolo(card);
    let sleeve = getSleeve(card);
    // Update the power span in the card element
    // if card is equipped (in #guns) foil and holo are both aded
    let cardElementEquipped = document.querySelector(`#guns .card[data-guid="${card.guid}"]`);
    if(context == 'hand') {
        cardElementEquipped = document.querySelector(`#cards .card[data-guid="${card.guid}"]`);
    }
    if (cardElementEquipped) {
        let powerDisplay = foil > 1 ? "x" + foil : '';
        if(context=='guns') {
            powerDisplay = holo > 1 ? "x" + (holo * foil) : foil > 1 ? "x" + foil : '';
        } else if(context=='sleeve') {
            powerDisplay = sleeve > 1 ? "x" + (sleeve * foil) : foil > 1 ? "x" + foil : '';
        }
        const powerSpan = cardElementEquipped.querySelector('.power');
        powerSpan.textContent = powerDisplay;
    }
}

function updateEnemyHealthPreview(dmg) {
    // Update the enemy health preview
    let enemyHealthPreview = document.querySelector('.enemy-ship .enemy-health-preview');
    if (enemyHealthPreview) {
        let currentEnemyHealth = game.temp.currentEnemy.current;
        let maxEnemyHealth = game.temp.currentEnemy.max;
        let newHealth = Math.max(currentEnemyHealth - dmg, 0);
        let healthPercentage = (newHealth / maxEnemyHealth) * 100;
        enemyHealthPreview.style.width = healthPercentage + '%';
    }
}

async function doDamage() {
    // Fetch values from the DOM
    let damage = parseFloat(document.querySelector('.number.damage').textContent.replace(/,/g, ''));
    damage = parseFloat(damage.toFixed(0));
    let power = parseFloat(document.querySelector('.number.power').textContent.replace(/,/g, ''));
    power = parseFloat(power.toFixed(2));
    let pierce = parseFloat(document.querySelector('.number.pierce').textContent.replace(/,/g, ''));
    pierce = parseFloat(pierce.toFixed(2));
    let spread = parseFloat(document.querySelector('.number.spread').textContent.replace(/,/g, ''));
    spread = parseFloat(spread.toFixed(2));

    // Calculate total damage
    let totalDamage = Math.round(damage * power * pierce * spread);
    document.querySelector('.cumulative-damage span').textContent = formatLargeNumber(parseInt(document.querySelector('.cumulative-damage span').textContent.replace(/,/g, ''), 10) + totalDamage);

    // Check for crit mechanics
    let crit = false;
    let attacksUsed = game.data.attacksTotal - game.data.attacksRemaining;
    let stowsUsed = game.data.stowsTotal - game.data.stowsRemaining;
    if(totalDamage > (game.temp.currentEnemy.max * 2)) {
        if(attacksUsed === 0 && stowsUsed === 0) {
            crit = 'perfect_ultra_kill';
        } else {
            crit = 'ultra_kill';
        }
    } else if(totalDamage > (game.temp.currentEnemy.max * 1.5)) {
        if(attacksUsed === 0 && stowsUsed === 0) {
            crit = 'perfect_giga_kill';
        } else {
            crit = 'giga_kill';
        }
    } else if(totalDamage > game.temp.currentEnemy.max) {
        if(attacksUsed === 0 && stowsUsed === 0) {
            crit = 'mega_ultra_kill';
        } else {
            crit = 'mega_kill';
        }
    }

    if(crit) {
        document.querySelector('.crit').textContent = prettyName(crit);
        // Check for one-shot improve conditions
        await improveBoosters('crit');
    }

    // Hit the enemy
    game.temp.currentEnemy.current -= totalDamage;
    
    // Ensure current health doesn't drop below 0
    if (game.temp.currentEnemy.current < 0) {
        game.temp.currentEnemy.current = 0;
    }

    // Calculate remaining health percentage
    let healthPercentage = (game.temp.currentEnemy.current / game.temp.currentEnemy.max) * 100;

    // Update the width of the health bar
    let enemyHealthBar = document.querySelector('.enemy-ship .enemy-health-bar');
    if (enemyHealthBar) {
        enemyHealthBar.style.width = healthPercentage + '%';
    }

    // check for stats updates
    let highestDamage = stats.data.highest_damage;
    if(damage > highestDamage) {
        stats.data.highest_damage = damage;
        saveStats(stats.data);
        if(stats.data.total_runs > 1) {
            flourish("New high damage score!");
        }
    }
    let highestPower = stats.data.highest_power;
    if(power > highestPower) {
        stats.data.highest_power = power;
        saveStats(stats.data);
        if(stats.data.total_runs > 1) {
            flourish("New high power score!");
        }
    }
    let highestPierce = stats.data.highest_pierce;
    if(pierce > highestPierce) {
        stats.data.highest_pierce = pierce;
        saveStats(stats.data);
        if(stats.data.total_runs > 1) {
            flourish("New high pierce score!");
        }
    }
    let highestSpread = stats.data.highest_spread;
    if(spread > highestSpread) {
        stats.data.highest_spread = spread;
        saveStats(stats.data);
        if(stats.data.total_runs > 1) {
            flourish("New high spread score!");
        }
    }
    let highestTotalDamage = stats.data.highest_total_damage;
    if(totalDamage > highestTotalDamage) {
        stats.data.highest_total_damage = totalDamage;
        saveStats(stats.data);
        if(stats.data.total_runs > 1) {
            flourish("New high total damage score!");
        }
    }
}

async function improveBoosters(event) {
    const boosters = findBoosters('improveEvent', event);
    for (const booster of boosters) {
        let disabled = booster.disabled !== undefined ? booster.disabled : false;
        let condition = booster.improveCondition !== undefined ? booster.improveCondition : false;
        let improve = false;
        if(!disabled) {
            if(condition) {
                switch(condition) {
                    case 'one_card':
                        if(game.temp.gunCards.length === 1) {
                            improve = true;
                        }
                    break;
                    case 'three_stows':
                        if(game.data.stowsRemaining == 3) {
                            improve = true;
                        }
                    break;
                }
            } else {
                improve = true;
            }
            if(improve) {
                await improveBooster(booster, true);
            }
        }
    }
}


function endCombat(result) {

    game.temp.currentContext = 'overworld';

    document.querySelectorAll('.gauge-color').forEach(element => {
		element.classList.remove('active');
	});

    clearAmounts();

    refreshDom();

    togglePointerEvents(true); // Disable pointer events
    if(result=='win') {
        // Check for any self improves
        improveBoosters('win');
        let credits = Math.round((((game.data.attacksRemaining + game.data.stowsRemaining) * 2) + 5) * game.data.creditsMultiplier);
        document.querySelector('.collect-credits span').textContent = formatLargeNumber(credits);
        let xp = Math.round(((game.data.class * 10) + (game.data.system * 10)) * game.data.xpMultiplier);
        document.querySelector('.gain-xp span').textContent = formatLargeNumber(xp);
        document.querySelector('#end-combat').classList.add('shown');
        resetArsenal();

        // Generate something like "2.3" or "3.10", etc.
        let combinedStr = game.data.system + '.' + game.data.class;

        // Convert that string to a decimal number
        let currentSystemClass = parseFloat(combinedStr);  

        let highestSystemClass = stats.data.highest_system_class;
        if (currentSystemClass > highestSystemClass) {
            stats.data.highest_system_class = currentSystemClass;
            saveStats(stats.data);
            if (stats.data.total_runs > 1) {
                flourish("New high system level!");
            }
        }
    } else {
        document.querySelector('#end-game').classList.add('shown');
        // reset the win streak if this wasn't considered a win (it's arbitrary at this point)
        if(game.data.system < 10) {
            stats.data.highest_win_streak = 0;
        }
    }
	
}

export async function checkLevel() {

    document.querySelector('.stats .level span').textContent = game.data.level;
    updateXPBar();

    const baseThreshold = game.data.xpThreshold;
    const scalingFactor = game.data.scalingFactor;

    // Calculate the new level based on XP with a quadratic increment
    let totalXP = 0;
    let newLevel = 1;

    while (game.data.xp >= totalXP + baseThreshold + Math.floor(scalingFactor * Math.pow(newLevel, 1.5))) {
        totalXP += baseThreshold + Math.floor(scalingFactor * Math.pow(newLevel, 1.5));
        newLevel++;
    }

    // Check if the player's level has increased
    if (newLevel > game.data.level) {
        // Level up the player to the new level
        document.querySelector('.stats .level span').classList.add('active');
        document.querySelector('.stats .level span').textContent = game.data.level;
        game.data.level = newLevel;
        await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
        document.querySelector('.stats .level span').classList.remove('active');
        game.temp.shopLevelUp = true;
        populateShopLevelUp();
        updateXPBar();

        // check for stats update
        let highestPlayerLevel = stats.data.highest_player_level;
        if(newLevel > highestPlayerLevel) {
            stats.data.highest_player_level = newLevel;
            saveStats(stats.data);
            if(stats.data.total_runs > 1) {
                flourish("New high player level!");
            }
        }
    }
}

export function shop() {

    game.temp.currentContext = 'hangar';
    document.querySelector('.crit').textContent = '';

    const boostersContainer = document.querySelector('#shop .boosters');
    boostersContainer.innerHTML = ''; // Clear existing content for fresh population
    const packsContainer = document.querySelector('#shop .packs');
    packsContainer.innerHTML = ''; // Clear existing packs for fresh population
    const injectorsContainer = document.querySelector('#shop .injectors');
    injectorsContainer.innerHTML = ''; // Clear existing injectors for fresh population
    refreshDom();
	document.querySelector('#shop').classList.add('shown');
    document.querySelectorAll('#boosters .destroy, #injectors .destroy').forEach(element => {
        element.classList.add('shown');
    });    
	populateShopBoosters();
    populateShopInjectors();
	populateShopPacks();
    populateShopLevelUp();
    populateShopMercenary();
    populateShopRestock();
}

export function populateArsenalModal() {
    let organizedArsenal = organizeArsenal();
    let itemsContainer = document.querySelector('#arsenal-modal .items');
    itemsContainer.innerHTML = ''; // Clear existing content

    organizedArsenal.forEach(card => { 
        let cardElement = createCard(card, '', 'modal-'); // Assuming createCard() returns a card element
        // Check if the card has been drawn
        if (cardHasBeenDrawn(card)) {
            cardElement.classList.add('drawn'); // Add a class to visually indicate the card has been drawn
        }
        itemsContainer.appendChild(cardElement);
    });

    document.querySelector('#arsenal-modal').classList.add('shown'); // Show the modal
}

function cardHasBeenDrawn(card) {
    // Combine all cards that have been drawn into a single array
    const drawnCards = [...game.temp.handCards, ...game.temp.gunCards, ...game.temp.stowCards];
    // Check if the current card is in the array of drawn cards by comparing a unique identifier, like 'guid'
    return drawnCards.some(drawnCard => drawnCard.guid === card.guid);
}

export function populateCombosModal() {
    let itemsContainer = document.querySelector('#combos-modal .items');
    itemsContainer.innerHTML = ''; // Clear existing content

    // Iterate through each combo type in comboTypeLevels
    for (const [comboType, details] of Object.entries(game.comboTypeLevels)) {
        // Create a new div element for each combo type
        let comboElement = document.createElement('div');
        comboElement.className = 'combo-type-item';

        // Format the combo type name to be more readable, replacing camelCase with spaces and capitalizing
        let formattedComboTypeName = comboType.replace(/([A-Z])/g, ' $1').trim(); // Add space before uppercase letters
        formattedComboTypeName = capitalize(formattedComboTypeName); // Capitalize the first letter

        // Set the text content to show combo type name, level, and base damage
        //comboElement.textContent = `${formattedComboTypeName}: Level ${numberToRoman(details.level)} (Base Damage ${details.baseDamage}) - Played ${details.played} times`;
        comboElement.textContent = `${formattedComboTypeName}: Level ${details.level} (Base Damage ${details.baseDamage}) - Played ${details.played} times`;

        // Append the combo type element to the items container
        itemsContainer.appendChild(comboElement);
    }

    document.querySelector('#combos-modal').classList.add('shown'); // Show the modal
}

export function populateStatsModal() {
    const statsContainer = document.querySelector('#stats-modal .stats');
    statsContainer.innerHTML = ''; // Clear existing content
  
    // Loop over each property in stats.data
    for (const [key, value] of Object.entries(stats.data)) {
      // If it's the "discovered" property, we handle it differently
      if (key === 'discovered') {
        // value is the discovered object, e.g. { boosters: [], system_hearts: [], injectors: [] }
        for (const [type, itemsArr] of Object.entries(value)) {
          const count = itemsArr.length; // number of discovered items
          const row = document.createElement('div');
          // e.g. "Boosters Discovered: 13"
          row.textContent = `${prettyName(type)} Discovered: ${count}`;
          statsContainer.appendChild(row);
        }
      } else if(key === 'deaths') {
        if (Object.keys(value).length > 0) {
            for (const [systemClassKey, deathCount] of Object.entries(value)) {
                const row = document.createElement('div');
                // Optionally split the key for a user-friendly display
                const [systemNum, classNum] = systemClassKey.split('.');
                row.textContent = `System ${systemNum}, Class ${classNum} Deaths: ${deathCount}`;
                statsContainer.appendChild(row);
            }
        }
      } else {
        // Normal stat: just show "key: value"
        const row = document.createElement('div');
        row.textContent = `${prettyName(key)}: ${value}`;
        statsContainer.appendChild(row);
      }
    }
  
    // Finally, reveal the modal
    document.querySelector('#stats-modal').classList.add('shown');
}

function organizeArsenal() {
	let combinedArsenal = [...game.arsenal, ...game.temp.handCards, ...game.temp.stowCards, ...game.temp.gunCards];
    let organizedArsenal = sortArsenal(combinedArsenal, RAINBOW_ORDER, CARD_TYPES);
	return organizedArsenal;
}

function populateShopSystemHearts() {
    if (game.systemHearts.length === 0) {
        console.log("No system hearts available for this system.");
        return;
    }

    // Randomly select a system heart
    const randomIndex = Math.floor(randDecimal() * game.systemHearts.length);
    const systemHeart = game.systemHearts[randomIndex];

    // Append the system heart to the shop
    const shopSystemHeart = document.querySelector('#shop .system-heart-slot');
    shopSystemHeart.innerHTML = ''; // Clear previous system heart

    const cardElement = document.createElement('div');
    cardElement.className = 'card system-heart';
    cardElement.textContent = systemHeart.name;
    cardElement.dataset.id = systemHeart.id;
    cardElement.dataset.cost = game.data.systemHeartCost;

    // Cost span
    let cardCost = document.createElement('span');
    cardCost.textContent = game.data.systemHeartCost + ' Credits';
    cardElement.appendChild(cardCost);

    // Label span
    let cardLabel = document.createElement('span');
    cardLabel.textContent = 'SYSTEM HEART';
    cardElement.appendChild(cardLabel);

    // ----------------------------
    // ADD "DISCOVERED" OR "UNDISCOVERED"
    // ----------------------------
    const discoveredSpan = document.createElement('span');
    discoveredSpan.classList.add('discovered-status');
    if (stats.data.discovered.system_hearts.includes(systemHeart.id)) {
        discoveredSpan.textContent = 'Discovered';
    } else {
        discoveredSpan.textContent = 'Undiscovered';
    }
    cardElement.appendChild(discoveredSpan);

    // Tooltip
    cardElement.setAttribute('data-tippy-content', systemHeart.description);
    const tooltip = tippy(cardElement, { allowHTML: true });
    cardElement._tippyInstance = tooltip;

    shopSystemHeart.appendChild(cardElement);

    // Event listener for purchasing the system heart
    cardElement.addEventListener('click', function() {
        let cost = parseInt(this.dataset.cost.replace(/,/g, ''), 10);
        if (game.data.credits >= cost) {
            game.data.credits -= cost; // Subtract cost from player's credits
            applySystemHeart(systemHeart);
            // Remove it from available system hearts
            game.systemHearts = game.systemHearts.filter(card => card.id !== systemHeart.id);
            // Clear from shop
            shopSystemHeart.innerHTML = '';
        } else {
            message("You cannot afford this system heart.");
        }
    });
}

// Add system heart to the game object (logic only)
function addSystemHeartToGame(systemHeart) {
    game.data.systemHearts.push(systemHeart);

    // Process effects of system heart
    switch(systemHeart.id) {
        case 'attack':
            game.data.attacksTotal += 1;
            break;
        case 'stow':
            game.data.stowsTotal += 1;
            break;
        case 'injector':
            game.slots.injectorSlots += 1;
            const injectorContainer = document.getElementById('injector-slots');
            const injectorDiv = document.createElement('div');
            injectorDiv.className = 'injector-slot';
            const injectorType = document.createElement('span');
            injectorType.textContent = 'Injector Slot';
            injectorDiv.appendChild(injectorType);
            injectorContainer.appendChild(injectorDiv);
            break;
        case 'time_warp':
            game.data.lives += 2;
            break;
        case 'hand_size':
            game.data.handSize += 1;
            break;
        case 'shop':
            game.slots.shopBoosterSlots += 2;
            game.slots.shopPackSlots += 1;
            game.slots.shopInjectorSlots += 1;
            break;
        case 'credits':
            game.data.creditsMultiplier += 0.25;
            break;
        case 'xp':
            game.data.xpMultiplier += 0.25;
            break;
        case 'enemies':
            game.data.enemyPool += 1;
            break;
        case 'removals':
            game.data.removals += 1;
            break;
        case 'restocks':
            game.data.restockFixed = true;
            break;
        case 'chances':
            game.data.chanceMultiplier = 2;
            break;
        case 'specials':
            game.data.specialMultiplier = 2;
            break;
        case 'improves':
            game.data.improveMultiplier = 2;
            break;
        case 'rares':
            game.data.boosterRarity.rare *= 2;
            game.data.boosterRarity.legendary *= 2;
            game.data.specialWeights.gold_credits *= 2;
            game.data.specialWeights.texture *= 2;
            break;
        case 'packs':
            game.data.packSizeChances = {
                standard: .5,
                big: .25,
                giant: .25
            }
        break;
        case 'duplicates':
            game.data.duplicateBoosters = true;
            break;
        case 'max_wavelengths':
            game.data.maxWavelengths = true;
            break;
        case 'booster_sellbacks':
            game.data.boosterSellbacks = true;
            break;
    }
}

// Add system heart to the DOM (visuals only)
function addSystemHeartToDOM(systemHeart) {
    const systemHeartsContainer = document.getElementById('system-hearts');
    
    const heartElement = document.createElement('div');
    heartElement.className = 'system-heart card';
    heartElement.textContent = systemHeart.name;
    heartElement.setAttribute('data-id', systemHeart.id);
    heartElement.setAttribute('data-tippy-content', systemHeart.description);
    const tooltip = tippy(heartElement, {allowHTML: true,});
    heartElement._tippyInstance = tooltip;
    systemHeartsContainer.appendChild(heartElement);

    applySystemHeartOverlap();
    enableHoverZIndexBehavior('#system-hearts .system-heart.overlapped');
}

// Combined function (adds heart to both game and DOM)
function applySystemHeart(systemHeart) {
    addSystemHeartToGame(systemHeart);
    addSystemHeartToDOM(systemHeart);
    // discover it
    discoverItem("system_hearts", systemHeart);
    refreshDom();
}

function determinePackSize(packSizeChances) {
    const random = randDecimal();
    let cumulativeChance = 0;

    for (const [size, chance] of Object.entries(packSizeChances)) {
        cumulativeChance += chance;
        if (random < cumulativeChance) {
            return size;
        }
    }

    return 'standard'; // Default to 'standard' in case the random value doesn't match
}

function populateShopPacks() {
    const packsContainer = document.querySelector('#shop .packs');

    // Get the number of packs currently displayed in the shop
    const currentPackCount = packsContainer.children.length;

    // Calculate how many new packs to add
    let packsToAdd = game.slots.shopPackSlots - currentPackCount;

    // Ensure that we do not attempt to add negative or zero packs
    packsToAdd = Math.max(packsToAdd, 0);

    // Select packs based on weighted random selection
    let selectedPacks = weightedSelect(PACK_TYPES.map(pack => ({
        ...pack,
        weight: pack.weight // Ensure we use the pack's weight property
    })), packsToAdd);

    selectedPacks.forEach(pack => {
        let size = determinePackSize(game.data.packSizeChances);
        let cost = pack.cost;
        cost += size === 'big' ? 2 : size === 'giant' ? 4 : 0;

        // Randomly assign cardType or cardColor if it's an Armament Pack or Chromatic Pack
        if (pack.name === "Armament Pack") {
            pack.cardType = randFromArray(CARD_TYPES, 1);
        }
        if (pack.name === "Chromatic Pack") {
            pack.cardColor = randFromArray(RAINBOW_ORDER, 1);
        }

        let packElement = document.createElement('div');
        packElement.className = 'pack ' + size;
        packElement.dataset.packType = pack.name.replace(/\s+/g, '').toLowerCase();
        packElement.dataset.packSize = size;
        packElement.dataset.cost = cost;
        if (pack.cardType) packElement.dataset.cardType = pack.cardType; // Store type if it's an Armament Pack
        if (pack.cardColor) packElement.dataset.cardColor = pack.cardColor; // Store color if it's a Chromatic Pack

        let packName = document.createElement('span');
        packName.textContent = capitalize(size) + ' ';
        packName.textContent += pack.cardType ? 'Armament ' + prettyName(pack.cardType[0]) : pack.cardColor ? 'Chromatic ' + capitalize(pack.cardColor[0]) : pack.name;
        packElement.setAttribute('data-cost', cost);
        packElement.appendChild(packName);

        let packCost = document.createElement('span');
        packCost.textContent = cost + ' Credits';
        packElement.appendChild(packCost);

        // Calculate the pool and choose amounts based on the pack type and size
        let poolAmount, chooseAmount;
        switch (pack.name) {
            case "Galactic Pack":
                poolAmount = size === 'standard' ? 10 : size === 'big' ? 15 : 20;
                chooseAmount = size === 'standard' ? 1 : size === 'big' ? 2 : 4;
                break;
            case "Nebula Pack":
                poolAmount = size === 'standard' ? 10 : size === 'big' ? 14 : 17;
                chooseAmount = size === 'standard' ? 1 : size === 'big' ? 2 : 4;
                break;
            case "Stardust Pack":
            case "Supernova Pack":
            case "Special Pack":
            case "Comet Pack":
                poolAmount = size === 'standard' ? 3 : size === 'big' ? 4 : 5;
                chooseAmount = 1;
                break;
            case "Armament Pack":
            case "Chromatic Pack":
                chooseAmount = size === 'standard' ? 1 : size === 'big' ? 2 : 3;
                poolAmount = size === 'standard' ? 1 : size === 'big' ? 2 : 3;
                break;
            case "Cosmos Pack":
                poolAmount = size === 'standard' ? 15 : size === 'big' ? 25 : 35;
                chooseAmount = 1;
                break;
            default:
                poolAmount = 1;
                chooseAmount = 1; // Default amount if not specified
        }

        // Adjust the "choose" and "pool" spans in the description based on the amounts
        let adjustedDescription = pack.description
            .replace(/<span class='choose'>\d+<\/span>/g, `<span class='choose'>${chooseAmount}</span>`)
            .replace(/<span class='pool'>\d+<\/span>/g, `<span class='pool'>${poolAmount}</span>`);

        // Add description to tooltip
        packElement.setAttribute('data-tippy-content', adjustedDescription);
        const tooltip = tippy(packElement, { allowHTML: true });
        packElement._tippyInstance = tooltip;

        packElement.addEventListener('click', function () {
            let cost = parseInt(this.dataset.cost.replace(/,/g, ''), 10);
            if (game.data.credits >= cost) {
                game.data.creditsOwed = cost; // Subtract cost from player's credits
                openPack(this, poolAmount, chooseAmount); // Pass the pool and choose amounts to the openPack function
                refreshDom();
            } else {
                message("You cannot afford this pack.");
            }
        });

        packsContainer.appendChild(packElement);
    });
}

function populateShopLevelUp() {
    if (game.temp.shopLevelUp) {
        game.temp.shopLevelUp = false;

        // Append the shop level up to the DOM
        const shopLevelUp = document.querySelector('#shop .level-up');
        const cardElement = document.createElement('div');
        cardElement.className = 'card slot-level-up';
        cardElement.textContent = 'Slot Pack';
        shopLevelUp.appendChild(cardElement);

        // Event listener for gaining the level up
        cardElement.addEventListener('click', function() {
            populateSlotCards();
            this.remove(); // Remove only the clicked slot-level-up element
        });
    }
    return false;
}

function populateShopMercenary() {
    // Append the shop mercenary to the DOM
    const mercenary = document.querySelector('#shop .mercenary span.credits');
    mercenary.textContent = game.data.mercenary;
}

function populateShopRestock() {
    // Append the shop restock to the DOM
    //document.querySelector('#shop .restock').classList.remove('shown');
    const restock = document.querySelector('#shop .restock span.credits');
    restock.textContent = game.data.restock;
}

export function visitMercenary() {
    if (game.data.credits >= game.data.mercenary) {
        game.data.credits -= game.data.mercenary;

        // Base XP increase is now between 0 and 20
        let xpIncrease = Math.floor(randDecimal() * 21);

        // 5% chance for +200 XP
        if (randDecimal() <= 0.05) {
            xpIncrease += 200;
        } 
        // 10% chance for +100 XP (but not both)
        else if (randDecimal() <= 0.10) {
            xpIncrease += 100;
        }

        game.data.xp += xpIncrease;
        checkLevel();
        refreshDom();
        updateXPBar();
    } else {
        message("You cannot afford to visit the mercenary.");
    }
}

export function restockShop() {
    if (game.data.credits >= game.data.restock) {
        game.data.credits -= game.data.restock;
        if (!game.data.restockFixed) game.data.restock += 1;

        // Clear existing boosters and packs before restocking
        clearShopBoosters();
        clearShopPacks();

        // Populate with new boosters and packs
        populateShopBoosters();
        populateShopInjectors();
        populateShopPacks();
        populateShopRestock();
        refreshDom();
    } else {
        message("You cannot afford to restock the shop.");
    }
}

// Clear all boosters from the shop
function clearShopBoosters() {
    const boostersContainer = document.querySelector('#shop .boosters');
    if (boostersContainer) {
        boostersContainer.innerHTML = ''; // Clear all booster slots
    }
}

// Clear all packs from the shop
function clearShopPacks() {
    const packsContainer = document.querySelector('#shop .packs');
    if (packsContainer) {
        packsContainer.innerHTML = ''; // Clear all pack slots
    }
}


function populateSlotCards() {
    let selectionModal = document.querySelector('#selection-modal');
    let selectionCancel = document.querySelector('#selection-modal .cancel');
    let itemsContainer = selectionModal.querySelector('.items');
	itemsContainer.innerHTML = ''; // Clear previous items

    let bridgeElement = document.createElement('div');
    bridgeElement.className = 'add-bridge-slot card';
    bridgeElement.textContent = '+1 Bridge Slot';
    bridgeElement.addEventListener('click', function() {
        game.slots.bridgeSlots += 1;
        selectionModal.classList.remove('shown'); // Hide the modal immediately after selection
        const bridgeContainer = document.getElementById('bridge-slots');
        const bridgeDiv = document.createElement('div');
        bridgeDiv.setAttribute('data-group', 'bridge');
        bridgeDiv.className = 'booster-slot';
        const boosterType = document.createElement('span');
        boosterType.textContent = 'Bridge';
        bridgeDiv.appendChild(boosterType);
        bridgeContainer.appendChild(bridgeDiv);
        refreshDom();
    });
    itemsContainer.appendChild(bridgeElement);

    let engineeringElement = document.createElement('div');
    engineeringElement.className = 'add-engineering-slot card';
    engineeringElement.textContent = '+1 Engieering Slot';
    engineeringElement.addEventListener('click', function() {
        game.slots.engineeringSlots += 1;
        selectionModal.classList.remove('shown'); // Hide the modal immediately after selection
        const engineeringContainer = document.getElementById('engineering-slots');
        const engineeringDiv = document.createElement('div');
        engineeringDiv.setAttribute('data-group', 'engineering');
        engineeringDiv.className = 'booster-slot';
        const boosterType = document.createElement('span');
        boosterType.textContent = 'Engineering';
        engineeringDiv.appendChild(boosterType);
        engineeringContainer.appendChild(engineeringDiv);
        refreshDom();
    });
    itemsContainer.appendChild(engineeringElement);

    let armoryElement = document.createElement('div');
    armoryElement.className = 'add-armory-slot card';
    armoryElement.textContent = '+1 Armory Slot';
    armoryElement.addEventListener('click', function() {
        game.slots.armorySlots += 1;
        selectionModal.classList.remove('shown'); // Hide the modal immediately after selection
        const armoryContainer = document.getElementById('armory-slots');
        const armoryDiv = document.createElement('div');
        armoryDiv.setAttribute('data-group', 'armory');
        armoryDiv.className = 'booster-slot';
        const boosterType = document.createElement('span');
        boosterType.textContent = 'Armory';
        armoryDiv.appendChild(boosterType);
        armoryContainer.appendChild(armoryDiv);
        refreshDom();
    });
    itemsContainer.appendChild(armoryElement);
    selectionModal.classList.add('shown'); // Show the modal
    selectionCancel.classList.add('shown');
}

function openPack(pack, poolAmount, chooseAmount) {
    let selectionModal = document.querySelector('#selection-modal');
    let selectionCancel = document.querySelector('#selection-modal .cancel');
    let itemsContainer = selectionModal.querySelector('.items');
    itemsContainer.innerHTML = ''; // Clear previous items
    let selectionsMade = 0;
    resetArsenal();

    // Special logic for specialpack and cometpack: Set chooseAmount to 2 to allow a second selection stage
    if (pack.dataset.packType === 'specialpack' || pack.dataset.packType === 'cometpack') {
        chooseAmount = 2;
    }

    // Increase chooseAmount for Armament Pack and Chromatic Pack when the pack is big or giant
    if (pack.dataset.packType === 'armamentpack' || pack.dataset.packType === 'chromaticpack') {
        if (pack.dataset.packSize === 'big') chooseAmount = 2;
        else if (pack.dataset.packSize === 'giant') chooseAmount = 3;
    } else {
        // if it's not a chromatic or armament pack, remove it from the dome immediately
        pack.remove();
    }

    // Helper function to handle selection and track selection count
    function handleSelection(cardElement, callback) {
        cardElement.addEventListener('click', function() {
            callback(); // Execute the specific logic for the selected item (card/combo/booster)

            selectionCancel.classList.remove('shown');
            pack.remove();

            // If we're allowed to close the modal after selection, track the selections
            selectionsMade++;
            cardElement.remove(); // Remove the card/combo element from the modal after it's clicked

            // as long as the player has made at least one selection, charge the full amount
            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;

            // If selections meet the chooseAmount, close the modal
            if (selectionsMade >= chooseAmount) {
                selectionModal.classList.remove('shown'); // Hide the modal after allowed selections
                selectionCancel.classList.add('shown');
                refreshDom();
            }
        });
    }

    switch(pack.dataset.packType) {
        case 'galacticpack':
            selectionCancel.classList.remove('shown');
            // Randomly select cards from the game.arsenal
            let selectedCards = randFromArray(game.arsenal, poolAmount);

            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;

            // Display these cards and allow multiple selections
            selectedCards.forEach(card => {
                let cardElement = createCard(card);
                handleSelection(cardElement, function() {
                    updateCardLevel(card, 1, cardElement);
                });
                itemsContainer.appendChild(cardElement);
            });
            break;

        case 'nebulapack':
            selectionCancel.classList.remove('shown');
            // Randomly select combo types
            let comboTypes = Object.keys(game.comboTypeLevels);
            let selectedComboTypes = randFromArray(comboTypes, poolAmount);

            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;

            // Display these combo types and allow multiple selections
            selectedComboTypes.forEach(comboType => {
                //let comboTypeLevel = comboType ? ' ' + numberToRoman(game.comboTypeLevels[comboType].level) : '';
                let comboTypeLevel = comboType ? ' ' + game.comboTypeLevels[comboType].level : '';
                let comboElement = document.createElement('div');
                comboElement.className = 'combo-type card';
                comboElement.textContent = comboType.replace(/([A-Z])/g, ' $1').trim() + comboTypeLevel;
                handleSelection(comboElement, function() {
                    updateComboLevel(comboType, 1)
                });
                itemsContainer.appendChild(comboElement);
            });
            break;

        case 'cosmospack':
            selectionCancel.classList.remove('shown');
            // Randomly select cards from the game.arsenal
            let cosmosCards = randFromArray(game.arsenal, poolAmount);

            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;
        
            // Display these cards and allow the user to select one to duplicate
            cosmosCards.forEach(card => {
                let cardElement = createCard(card);
        
                handleSelection(cardElement, function() {
                    // Create a deep copy of the selected card and assign a unique GUID
                    let duplicatedCard = JSON.parse(JSON.stringify(card));
                    duplicatedCard.guid = randString();
        
                    // Add the duplicated card to the game.arsenal
                    game.arsenal.push(duplicatedCard);
        
                    // Refresh the DOM to reflect the updated arsenal
                    refreshDom();
                });
        
                // Append the card element to the modal's items container
                itemsContainer.appendChild(cardElement);
            });
            break;

        case 'supernovapack':
            selectionCancel.classList.remove('shown');
            let rareBoosters = game.boosters.filter(booster => booster.rarity === 'rare');
            let selectedBoosters = weightedSelect(rareBoosters, poolAmount);
            selectionModal.classList.add('boosters');

            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;

            // Display these booster cards
            selectedBoosters.forEach(booster => {
                let cardElement = document.createElement('div');
                cardElement.className = 'booster-card card';
                cardElement.textContent = prettyName(booster.id);
                let rarityElement = document.createElement('span');
                rarityElement.textContent = '(' + booster.rarity + ')';
                cardElement.appendChild(rarityElement);
                handleSelection(cardElement, function() {
                    addBoosterToSlots(booster);
                });
                itemsContainer.appendChild(cardElement);
            });
            break;

        case 'stardustpack':
            // Create a weighted array of injectors based on their weights
            selectionCancel.classList.remove('shown');
            let weightedInjectors = [];
            game.injectors.forEach(injector => {
                for (let i = 0; i < injector.weight; i++) {
                    weightedInjectors.push(injector);
                }
            });

            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;
        
            // Shuffle the weighted injectors array
            weightedInjectors = weightedInjectors.sort(() => 0.5 - randDecimal());
        
            // Pick the first `poolAmount` unique injectors
            let selectedInjectors = [];
            let addedInjectorIds = new Set();
        
            for (let injector of weightedInjectors) {
                if (selectedInjectors.length >= poolAmount) break;
                if (!addedInjectorIds.has(injector.id)) {
                    selectedInjectors.push(injector);
                    addedInjectorIds.add(injector.id);
                }
            }
        
            selectionModal.classList.add('injectors');
        
            // Display the selected injectors
            selectedInjectors.forEach(injector => {
                let cardElement = document.createElement('div');
                cardElement.className = 'injector card';
                cardElement.textContent = prettyName(injector.id); // Format the injector name
                cardElement.setAttribute('data-tippy-content', injector.description); // Add tooltip with description
                let rarityElement = document.createElement('span');
                rarityElement.textContent = '(' + injector.rarity + ')';
                cardElement.appendChild(rarityElement);
                handleSelection(cardElement, function() {
                    addInjectorToSlots(injector);
                });
        
                itemsContainer.appendChild(cardElement);
            });
            break;            

        case 'armamentpack':
            // Display cards of the randomly selected type, one of each color
            selectionCancel.classList.add('shown');
            RAINBOW_ORDER.forEach(color => {
                let card = game.cards.find(card => card.type === pack.dataset.cardType && card.color === color);
                let cardElement = createCard(card);
                handleSelection(cardElement, function() {
                    addCard(card.type, card.color);
                });
                itemsContainer.appendChild(cardElement);
            });
            break;

        case 'chromaticpack':
            // Display cards of the randomly selected color, one of each type
            selectionCancel.classList.add('shown');
            CARD_TYPES.forEach(type => {
                let card = game.cards.find(card => card.type === type && card.color === pack.dataset.cardColor);
                let cardElement = createCard(card);
                handleSelection(cardElement, function() {
                    addCard(card.type, card.color);
                });
                itemsContainer.appendChild(cardElement);
            });
            break;

        case 'specialpack':
            selectionCancel.classList.remove('shown');
            let selectedSpecials = weightedSelect(SPECIAL_CARDS, poolAmount);

            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;

            selectedSpecials.forEach(special => {
                let cardElement = document.createElement('div');
                cardElement.className = 'special-card card';
                cardElement.textContent = prettyName(special.name);
        
                // Set tooltip using the description
                cardElement.setAttribute('data-tippy-content', special.description);
                // Create a new Tippy instance with the updated description
                const tooltip = tippy(cardElement, {allowHTML: true});
                // Store the new Tippy instance for later reference
                cardElement._tippyInstance = tooltip;
        
                // Handle selection and apply effect
                handleSelection(cardElement, function() {
                    applySpecialEffect(special.name);
                }, true); // Allow closing after selecting the final card
        
                itemsContainer.appendChild(cardElement);
            });
            break;
            
        case 'cometpack':
            selectionCancel.classList.remove('shown');
            let selectedComets = weightedSelect(COMET_CARDS, poolAmount);

            game.data.credits -= game.data.creditsOwed;
            game.data.creditsOwed = 0;

            selectedComets.forEach(comet => {
                let cardElement = document.createElement('div');
                cardElement.className = 'comet-card card';
                cardElement.textContent = prettyName(comet.name);
                handleSelection(cardElement, function() {
                    applyCometEffect(comet.name);
                }, true); // Allow closing after selecting the final card
                itemsContainer.appendChild(cardElement);
            });
            break;

        default:
            console.log("Unknown pack type");
    }

    selectionModal.classList.add('shown'); // Show the modal
}

function applyCometEffect(effectName) {
    let selectionModal = document.querySelector('#selection-modal');
    let selectionCancel = document.querySelector('#selection-modal .cancel');
    let itemsContainer = selectionModal.querySelector('.items');
    itemsContainer.innerHTML = ''; // Clear previous items

	// Randomly select x cards from the game.arsenal
    let selectedCards = randFromArray(game.arsenal, game.data.converts);
    // Display selected cards
    selectedCards.forEach(card => {
        let cardElement = createCard(card);
        itemsContainer.appendChild(cardElement);
    });

    // TODO: add a button in the container called CONVERT that, when clicked, will convert all of the shown cards to the comet effectName.
    // if the effectName is plasma_cell, dark_matter, quantum_shard, gravity_wave, or nano_swarm, change the card type and name.
    // otherwise, if the effectName is a color (red, orange, yellow, green, blue, indigo, violet, white, ultraviolet, or black) change the card color.

    // Create the convert button
    let convertButton = document.createElement('div');
    convertButton.classList.add('button', 'convert');
    convertButton.textContent = 'CONVERT';
    convertButton.addEventListener('click', function() {
        selectedCards.forEach(card => {
            // Check if effectName is a type or a color and convert accordingly
            if (['plasma_cell', 'dark_matter', 'quantum_shard', 'gravity_wave', 'nano_swarm'].includes(effectName)) {
                // Convert card type
                card.type = effectName;
                card.name = prettyName(effectName);
            } else if (['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'ultraviolet', 'black'].includes(effectName)) {
                // Convert card color
                card.color = effectName;
            }

            // Update the card in the game.arsenal array
            let index = game.arsenal.findIndex(c => c.guid === card.guid);
            if (index !== -1) {
                game.arsenal[index] = card;
            }

            // Reflect changes in the DOM
            let domCard = document.querySelector(`[data-guid="${card.guid}"]`);
            if (domCard) {
                let domCardType = domCard.querySelector('.type');
                domCardType.className = '';
                domCardType.classList.add('type', 'card-type', card.type);
                domCard.querySelector('.name').textContent = card.name;
                domCard.setAttribute('data-type', card.type);
                domCard.setAttribute('data-name', card.name);
                domCard.setAttribute('data-color', card.color);
            }
        });

        // Optionally, clear and repopulate modal to reflect changes visually
        itemsContainer.innerHTML = '';
        selectedCards.forEach(card => {
            let cardElement = createCard(card);
            itemsContainer.appendChild(cardElement);
        });

        // Remove the convert button after converting
        convertButton.remove();
    });

    // Append the convert button to the modal
    selectionModal.appendChild(convertButton);
    selectionCancel.classList.add('shown');

}

function applySpecialEffect(effectName) {
    let selectionModal = document.querySelector('#selection-modal');
    let selectionCancel = document.querySelector('#selection-modal .cancel');
    let itemsContainer = selectionModal.querySelector('.items');
    itemsContainer.innerHTML = ''; // Clear previous items
	let sortedArsenal = organizeArsenal();

	switch(effectName) {
		case 'foil':
		case 'holo':
		case 'sleeve':
		case 'gold_leaf':
		case 'texture':
			const eligibleCards = sortedArsenal.filter(card => !card[effectName]);
			eligibleCards.forEach(card => {
				let cardElement = createCard(card);
				itemsContainer.appendChild(cardElement);

				// Event listener for when a card is clicked
				cardElement.addEventListener('click', () => {
					card[effectName] = true; // Set the effect to true for the clicked card
                    // check if card becomes epic/legendary/mythical
                    refreshCard(card);
					refreshDom();
					// Close the selection modal
					selectionModal.classList.remove('shown');
				});
			});

			// Show the selection modal
			if (eligibleCards.length > 0) {
				selectionModal.classList.add('shown');
                selectionCancel.classList.add('shown');
			} else {
				message(`All cards already have the ${effectName} effect.`);
			}
		break;
		case 'remove':
			let removalsCount = 0;
			let maxRemovals = game.data.removals;
			// Display the entire sorted game.arsenal for removal selection
			sortedArsenal.forEach((card) => {
				let cardElement = createCard(card);
				itemsContainer.appendChild(cardElement);

				// Add click event listener to handle card removal
				cardElement.addEventListener('click', () => {
					if (removalsCount < maxRemovals) {
						// Find the index of the card in the original game.arsenal using its unique guid
						const cardIndexInArsenal = game.arsenal.findIndex(c => c.guid === card.guid);
						if (cardIndexInArsenal !== -1) {
							game.arsenal.splice(cardIndexInArsenal, 1); // Remove the card from the original game.arsenal
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
			game.data.attacksTotal += 1;
            selectionModal.classList.remove('shown');
            refreshDom();
		break;
		case 'stow':
			game.data.stowsTotal += 1;
            selectionModal.classList.remove('shown');
            refreshDom();
		break;
        case 'upgrade':
            Object.keys(game.comboTypeLevels).forEach(comboType => {
                updateComboLevel(comboType, 1)
            });
            selectionModal.classList.remove('shown');
            refreshDom();            
        break;
	}
}

function populateShopBoosters() {
    const boostersContainer = document.querySelector('#shop .boosters');

    // Get the number of boosters currently displayed in the shop
    const currentBoosterCount = boostersContainer.children.length;

    // Calculate how many new boosters to add
    let boostersToAdd = game.slots.shopBoosterSlots - currentBoosterCount;

    // Ensure that we do not attempt to add negative or zero boosters
    boostersToAdd = Math.max(boostersToAdd, 0);

    // Filter out owned boosters unless duplicates are allowed
    let availableBoosters = game.boosters.filter(booster => 
        game.data.duplicateBoosters || !booster.owned
    );

    // Map each booster to ensure a weight property exists (fallback to 50)
    const boostersWithWeights = availableBoosters.map(booster => ({
        ...booster,
        weight: booster.weight ?? 50  // Default to 50 if booster.weight is undefined
    }));
    
    // Use weightedSelect on boostersWithWeights
    let selectedBoosters = weightedSelect(boostersWithWeights, boostersToAdd);

    selectedBoosters.forEach(booster => {
        let boosterElement = createCard(booster, 'booster');
        const boosterCost = parseInt(boosterElement.getAttribute('data-cost').replace(/,/g, ''), 10);

        boosterElement.addEventListener('click', function () {
            // Check if the player has enough credits to purchase the booster
            if (game.data.credits >= boosterCost) {
                addBoosterToSlots(booster);
                game.data.credits -= boosterCost;
                refreshDom();
            } else {
                message("Not enough credits to purchase this booster.");
            }
        });

        boostersContainer.appendChild(boosterElement);
    });
}

function populateShopInjectors() {
    const injectorsContainer = document.querySelector('#shop .injectors');

    // Get the number of injectors currently displayed in the shop
    const currentInjectorCount = injectorsContainer.children.length;

    // Calculate how many new injectors to add
    let injectorsToAdd = game.slots.shopInjectorSlots - currentInjectorCount;

    // Ensure that we do not attempt to add negative or zero injectors
    injectorsToAdd = Math.max(injectorsToAdd, 0);

    // Create a weighted list of injectors based on their weight property
    let weightedInjectors = [];
    game.injectors.forEach(injector => {
        for (let i = 0; i < injector.weight; i++) {
            weightedInjectors.push(injector);
        }
    });

    // Shuffle the weighted array
    let shuffledInjectors = weightedInjectors.sort(() => 0.5 - randDecimal());

    // Pick the first N unique ones for the shop slots
    let selectedInjectors = [];
    let addedInjectorIds = new Set();

    for (let injector of shuffledInjectors) {
        if (selectedInjectors.length >= injectorsToAdd) break;
        if (!addedInjectorIds.has(injector.id)) {
            selectedInjectors.push(injector);
            addedInjectorIds.add(injector.id);
        }
    }

    // Add the selected injectors to the shop
    selectedInjectors.forEach(injector => {
        let injectorElement = createCard(injector, 'injector');
        const injectorCost = parseInt(injectorElement.getAttribute('data-cost').replace(/,/g, ''), 10);

        // Handle injector purchase
        injectorElement.addEventListener('click', function () {
            // Check if the player has enough credits to purchase the injector
            if (game.data.credits >= injectorCost) {
                addInjectorToSlots(injector);
                game.data.credits -= injectorCost;
                refreshDom();
                
            } else {
                message('Not enough credits to purchase this injector.');
            }
        });

        injectorsContainer.appendChild(injectorElement);
    });
}

// Helper function to check for available slots
function getAvailableSlot(type) {
    let slotSelector = '';
    switch (type) {
        case 'bridge':
            slotSelector = '#bridge-slots .booster-slot:not([data-boosted="true"])';
            break;
        case 'engineering':
            slotSelector = '#engineering-slots .booster-slot:not([data-boosted="true"])';
            break;
        case 'armory':
            slotSelector = '#armory-slots .booster-slot:not([data-boosted="true"])';
            break;
        case 'injector':
            slotSelector = '#injector-slots .injector-slot:not([data-injected="true"])';
            break;
    }
    return document.querySelector(slotSelector);
}

// Adds the booster to the game object logic (without DOM manipulation)
function addBoosterToGame(booster) {
    let boosterCardsArrayName = '';

    switch (booster.type) {
        case 'bridge':
            boosterCardsArrayName = 'bridgeCards';
            break;
        case 'engineering':
            boosterCardsArrayName = 'engineeringCards';
            break;
        case 'armory':
            boosterCardsArrayName = 'armoryCards';
            break;
    }

    // Create a deep copy of the booster to avoid mutating the original object
    let copiedBooster = JSON.parse(JSON.stringify(booster));

    // Generate and assign a unique GUID
    copiedBooster.guid = randString();

    // Mark the booster as owned in game.boosters array
    const boosterIndex = game.boosters.findIndex(b => b.id === booster.id);
    if (boosterIndex > -1) {
        game.boosters[boosterIndex].owned = true;
    }

    // Add the booster to the correct slot array in the game object
    game.slots[boosterCardsArrayName].push(copiedBooster);
    return copiedBooster;
}

// Adds the booster to the DOM (visuals only)
function addBoosterToDOM(booster) {
    let availableSlot = getAvailableSlot(booster.type);

    if (availableSlot) {
        // Create the booster card element
        let boosterCardElement = createCard(booster, 'booster');
        boosterCardElement.setAttribute('draggable', 'true');

        // Create and append the destroy button within the booster card element
        const destroyButton = document.createElement('div');
        destroyButton.className = 'destroy button shown';
        destroyButton.textContent = 'x';
        boosterCardElement.appendChild(destroyButton);

        // Append the booster card element to the available slot
        availableSlot.appendChild(boosterCardElement);
        availableSlot.setAttribute('data-boosted', 'true'); // Mark the slot as filled

        boosterTooltip(booster);
        updatePreviews();  // Reflect booster effect if needed
        attachEventListeners();
    } else {
        console.warn(`No available ${booster.type} slots.`);
        message(`No available ${booster.type} slots.`);
    }
}

// Combined function for adding booster to both game object and DOM (if needed)
function addBoosterToSlots(booster) {
    let availableSlot = getAvailableSlot(booster.type);

    if (availableSlot) {
        const copiedBooster = addBoosterToGame(booster);
        addBoosterToDOM(copiedBooster);
        // Remove the booster from the shop
        removeBoosterFromShop(booster);
        // discover it
        discoverItem("boosters", booster);
    } else {
        console.warn(`No available ${booster.type} slots.`);
        message(`No available ${booster.type} slots.`);
    }
}

// Removes the booster from the shop (both DOM and shop data structure)
function removeBoosterFromShop(booster) {
    // Remove the booster element from the shop DOM
    const shopBoosterElement = document.querySelector(`#shop .booster[data-id="${booster.id}"]`);
    if (shopBoosterElement) {
        shopBoosterElement.remove();
    }
}

// Adds the injector to the game object logic (without DOM manipulation)
function addInjectorToGame(injector) {
    // Create a deep copy of the injector to avoid mutating the original object
    let copiedInjector = JSON.parse(JSON.stringify(injector));

    // Generate and assign a unique GUID
    copiedInjector.guid = randString();

    // Add the injector to the slot array in the game object
    game.slots.injectorCards.push(copiedInjector);
    return copiedInjector;
}

function addInjectorToDOM(injector) {
    let availableSlot = getAvailableSlot('injector');

    if (availableSlot) {
        // Create the injector card element
        let injectorCardElement = createCard(injector, 'injector');
        injectorCardElement.setAttribute('draggable', 'true');

        // Add click handler for activation
        injectorCardElement.addEventListener('click', function () {
            processBooster(injector);
        });

        // Create and append the destroy button within the injector card element
        const destroyButton = document.createElement('div');
        destroyButton.className = 'destroy button shown';
        destroyButton.textContent = 'x';
        destroyButton.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent the click from activating the injector
        });
        injectorCardElement.appendChild(destroyButton);

        // Append the injector card element to the available slot
        availableSlot.appendChild(injectorCardElement);
        availableSlot.setAttribute('data-injected', 'true'); // Mark the slot as filled

        injectorTooltip(injector);
        attachEventListeners();
    } else {
        console.warn(`No available injector slots.`);
        message(`No available injector slots.`);
    }
}

// Combined function for adding injector to both game object and DOM (if needed)
function addInjectorToSlots(injector) {
    let availableSlot = getAvailableSlot('injector');

    if (availableSlot) {
        const copiedInjector = addInjectorToGame(injector);
        addInjectorToDOM(copiedInjector);
        // Remove the injector from the shop
        removeInjectorFromShop(injector);
        // discover it
        discoverItem("injectors", injector);
    } else {
        console.warn(`No available injector slots.`);
        message(`No available injector slots.`);
    }
}

// Removes the injector from the shop (both DOM and shop data structure)
function removeInjectorFromShop(injector) {
    // Remove the injector element from the shop DOM
    const shopInjectorElement = document.querySelector(`#shop .injector[data-id="${injector.id}"]`);
    if (shopInjectorElement) {
        shopInjectorElement.remove();
    }
}

function boosterTooltip(booster) {
    const boosterCardElement = document.querySelector(`.booster.card[data-guid="${booster.guid}"]`);
    // Check if a Tippy instance already exists
    if (boosterCardElement._tippy) {
        // Properly destroy the existing tooltip instance
        boosterCardElement._tippy.destroy();
    }

    // Add description to tooltip for the booster card
    boosterCardElement.setAttribute('data-tippy-content', booster.description);
    // Create a new Tippy instance with the updated description
    const tooltip = tippy(boosterCardElement, {allowHTML: true});
    // Store the new Tippy instance for later reference
    boosterCardElement._tippyInstance = tooltip;
}

function injectorTooltip(injector) {
    const injectorCardElement = document.querySelector(`.injector.card[data-guid="${injector.guid}"]`);
    // Check if a Tippy instance already exists
    if (injectorCardElement._tippy) {
        // Properly destroy the existing tooltip instance
        injectorCardElement._tippy.destroy();
    }

    // Add description to tooltip for the injector card
    injectorCardElement.setAttribute('data-tippy-content', injector.description);
    // Create a new Tippy instance with the updated description
    const tooltip = tippy(injectorCardElement, {allowHTML: true});
    // Store the new Tippy instance for later reference
    injectorCardElement._tippyInstance = tooltip;
}

function destroyBooster(boosterGuid, type, boosterSlot, update = true) {
    // Determine which booster array to modify based on the booster type
    let boosterArrayName;
    let typeLabel = ''; // To store the label based on booster type
    switch (type) {
        case 'bridge':
            boosterArrayName = 'bridgeCards';
            typeLabel = 'Bridge'; // Set the label for the bridge slot
            break;
        case 'engineering':
            boosterArrayName = 'engineeringCards';
            typeLabel = 'Engineering'; // Set the label for the engineering slot
            break;
        case 'armory':
            boosterArrayName = 'armoryCards';
            typeLabel = 'Armory'; // Set the label for the armory slot
            break;
        case 'injector':
            boosterArrayName = 'injectorCards';
            typeLabel = 'Injector Slot';
            break;
        default:
            console.error('Unknown type:', type);
            return;
    }

    // Find the index of the booster/injector to be removed using its GUID
    const index = game.slots[boosterArrayName].findIndex(booster => booster.guid === boosterGuid);

    // Remove the booster/injector if it was found
    if (index > -1) {
        const booster = game.slots[boosterArrayName][index];
        game.slots[boosterArrayName].splice(index, 1);

        // Find the DOM element for the booster to remove
        let boosterElement = document.querySelector(`.booster-slot [data-guid="${boosterGuid}"]`);
        boosterSlot.setAttribute('data-boosted', 'false'); // Mark the slot as available

        if(type ==='injector') {
            boosterSlot.setAttribute('data-injected', 'false');
            boosterElement = document.querySelector(`.injector-slot [data-guid="${boosterGuid}"]`);
        }

        // If the booster element was found, remove it from its parent slot
        if (boosterElement && boosterElement.parentNode) {
            let slot = boosterElement.parentNode;
            slot.innerHTML = ''; // Clear the slot's contents

            // Re-add the type label to the booster slot
            let typeLabelElement = document.createElement('span');
            typeLabelElement.className = 'slot-label';
            typeLabelElement.textContent = typeLabel;
            slot.appendChild(typeLabelElement);
        }

        // Check if booster sellbacks are enabled and refund credits
        if (game.data.boosterSellbacks && type !== 'injector') {
            // Calculate the original cost of the booster based on its rarity
            const boosterBaseCost = game.data.boosterCost;
            const rarityMultiplier = game.data.boosterCostMultiplier[booster.rarity] || 1; // Default to common multiplier
            const originalCost = Math.round(boosterBaseCost * rarityMultiplier * game.data.creditsMultiplier);

            game.data.credits += originalCost; // Refund the original cost to the player
            refreshDom(); // Update the display to show the new credit amount
        }
        if(update) updatePreviews(); // Refresh any displays or calculations that depend on the boosters
    } else {
        console.error('Booster or Injector not found:', boosterGuid);
    }
}

function upgradeHighestLevelCombo() {
    let highestLevel = 0;
    let comboTypeWithHighestLevel = '';

    // Loop through the comboTypeLevels to find the combo type with the highest level
    for (const comboType in game.comboTypeLevels) {
        if (game.comboTypeLevels[comboType].level > highestLevel) {
            highestLevel = game.comboTypeLevels[comboType].level;
            comboTypeWithHighestLevel = comboType;
        }
    }

    // Now increase the level of the highest level combo type by 1
    if (comboTypeWithHighestLevel) {
        updateComboLevel(comboTypeWithHighestLevel, 1);
    }
}

function upgradeRandomCombo() {
    // Get all combo types
    const comboTypes = Object.keys(game.comboTypeLevels);

    // Check if there are any combo types to upgrade
    if (comboTypes.length === 0) {
        return;
    }

    // Select a random combo type
    const randomIndex = Math.floor(randDecimal() * comboTypes.length);
    const randomComboType = comboTypes[randomIndex];

    // Increase the level of the randomly selected combo type by 1
    updateComboLevel(randomComboType, 1);
}



function updateCardLevel(card, level = 1, element) {
    card.level += level;
    refreshCard(card);

    let levelSpan = element.querySelector('.level');
    if (levelSpan) {
        levelSpan.textContent = `Level ${card.level}`;
    }

    // check for stats updates
    let highestCardLevel = stats.data.highest_card_level;
    if(card.level > highestCardLevel) {
        stats.data.highest_card_level = card.level;
        saveStats(stats.data);
        if(stats.data.total_runs > 1) {
            flourish("New high card level!");
        }
    }
}

function updateComboLevel(combo, level = 1) {
    game.comboTypeLevels[combo].level += level;

    // check for stats updates
    let highestComboLevel = stats.data.highest_combo_level;
    if(game.comboTypeLevels[combo].level > highestComboLevel) {
        stats.data.highest_combo_level = game.comboTypeLevels[combo].level;
        saveStats(stats.data);
        if(stats.data.total_runs > 1) {
            flourish("New high combo level!");
        }
    }
}

function discoverItem(type, item) {
    // Get the array where we store discovered items of this type
    const discoveredArray = stats.data.discovered[type];
    if (!discoveredArray) {
        console.error(`No discovered array found for type "${type}". Check spelling or stats setup.`);
        return;
    }

    // Check if this ID is already discovered
    const itemId = item.id;
    if (!discoveredArray.includes(itemId)) {
        discoveredArray.push(itemId);
        saveStats(stats.data); // Persist the updated stats
        flourish(`Discovered ${prettyName(itemId)}!`);
    }
}






// Drag and Drop stuff
let dragSrcEl = null;
function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    e.dataTransfer.setData('application/my-app', this.dataset.guid);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    let targetElement = e.target;

    // Traverse up the DOM tree to find the nearest booster slot if the target is not one already
    while (targetElement && !targetElement.classList.contains("booster-slot")) {
        targetElement = targetElement.parentNode;
    }

    // Find the closest booster-slot parent of the dragged source element
    let sourceSlot = dragSrcEl.closest('.booster-slot');

    // Now, targetElement and sourceSlot are the booster slots or null if not found
    if (!targetElement || !sourceSlot) {
        return; // Exit if no suitable target or source slot found
    }

    const targetGroup = targetElement.getAttribute('data-group');
    const sourceGroup = sourceSlot.getAttribute('data-group');

    // Only proceed if the source and target are in the same group and the elements are different
    if (targetGroup === sourceGroup && sourceSlot !== targetElement) {
        // Assuming booster cards are direct children of the slots and have a specific class (e.g., 'booster-card')
        let sourceBoosterCard = sourceSlot.querySelector('.booster-card');
        let targetBoosterCard = targetElement.querySelector('.booster-card');

        // Check and destroy old tooltips for the source booster card
        if (sourceBoosterCard && sourceBoosterCard._tippyInstance) {
            sourceBoosterCard._tippyInstance.destroy();
        }

        // Check and destroy old tooltips for the target booster card
        if (targetBoosterCard && targetBoosterCard._tippyInstance) {
            targetBoosterCard._tippyInstance.destroy();
        }

        // Swap the HTML of the dragged and target elements
        let tempHTML = targetElement.innerHTML;
        targetElement.innerHTML = sourceSlot.innerHTML;
        sourceSlot.innerHTML = tempHTML;

        attachEventListeners(); // Reattach event listeners
        updateBoosterArrays(); // Update the game object arrays

        // Reapply Tippy tooltips to the new elements
        document.querySelectorAll('.booster-slot .booster.card').forEach(booster => {
            if (booster.hasAttribute('data-tippy-content')) {
                // Assuming boosterElement is your booster DOM element
                const tooltip = tippy(booster, {allowHTML: true,});
                // Store the instance for later reference
                booster._tippyInstance = tooltip;
            }
        });
    }
}

function updateBoosterArrays() {
    const sections = ['bridge', 'engineering', 'armory'];

    sections.forEach(section => {
        // Get the ordered list of GUIDs from the DOM by selecting the .card.booster elements within .booster-slot
        const orderedGUIDs = Array.from(document.querySelectorAll(`#${section}-slots .booster-slot[data-boosted="true"] .card.booster`))
            .map(card => card.dataset.guid)
            .filter(guid => guid); // Ensure we only use valid GUIDs
        
        // Determine the correct game array to sort based on the section
        let gameArray;
        switch(section) {
            case 'bridge':
                gameArray = game.slots.bridgeCards;
                break;
            case 'engineering':
                gameArray = game.slots.engineeringCards;
                break;
            case 'armory':
                gameArray = game.slots.armoryCards;
                break;
        }
        
        if (!gameArray || orderedGUIDs.length === 0) return;

        // Sort the array based on the order of GUIDs
        gameArray.sort((a, b) => {
            let indexA = orderedGUIDs.indexOf(a.guid);
            let indexB = orderedGUIDs.indexOf(b.guid);
            return indexA - indexB;
        });

        // Reassign the sorted array back to the game object
        game.slots[`${section}Cards`] = gameArray;
    });
}

function handleDragEnd(e) {
    //console.log(game.slots.engineeringCards);
}

function attachEventListeners() {
    // Listeners for booster cards
    let booster = document.querySelectorAll('.booster-slot .booster.card');
    booster.forEach(function(booster) {
      booster.addEventListener('dragstart', handleDragStart, false);
      booster.addEventListener('dragover', handleDragOver, false);
      booster.addEventListener('drop', handleDrop, false);
      booster.addEventListener('dragend', handleDragEnd, false);
    });
  
    // Listeners for destroy buttons
    const destroyButtons = document.querySelectorAll('.destroy.button');
  
    destroyButtons.forEach(button => {
      // Remove any existing listeners to avoid duplicates
      button.removeEventListener('click', handleDestroyClick);
      button.addEventListener('click', handleDestroyClick);
    });
  }
  
  function handleDestroyClick(e) {
    e.stopPropagation();
  
    // --- CAPTURE NEEDED DATA UP FRONT ---
    const button = e.currentTarget;  
    const boosterSlot = button.closest('.booster-slot');
    const injectorSlot = button.closest('.injector-slot');
  
    // Determine the type
    const type = boosterSlot ? boosterSlot.dataset.group : 'injector';
    // Whichever slot is valid
    const slot = boosterSlot || injectorSlot;
  
    // In case we need the card's GUID
    const cardElem = button.closest('.card');
    let boosterGuid = null;
    if (cardElem) {
      boosterGuid = cardElem.dataset.guid;
    }
  
    // Now we have everything we need to do the destroy, stored safely.
    customDialog("Are you sure you want to destroy this item?")
      .then((confirmed) => {
        if (confirmed) {
          // Only if confirmed AND we still have valid data
          if (slot && boosterGuid) {
            destroyBooster(boosterGuid, type, slot);
          } else {
            console.error('Invalid slot or card element in handleDestroyClick.');
          }
        }
      });
  }

// Initial attachment of event listeners
attachEventListeners();




const ben = [
"Everything Everywhere All At Once",
"Inglourious Basterds",
"Parasite",
"The Empire Strikes Back",
"When Harry Met Sally",
"In the Mood for Love",
"Back to the Future",
"Uncut Gems",
"Dune",
"Dune: Part Two",
"The Nice Guys",
"The Holdovers",
"Whiplash",
"Drive",
"The Fugitive",
"Past Lives",
"Interstellar",
"The Last Black Man in San Francisco",
"1917",
"The Banshees of Inisherin",
"Oppenheimer",
"Inside Out",
"Midsommar",
"Raiders of the Lost Ark",
"Good Will Hunting",
"Rear Window",
"The Matrix",
"Seven Samurai",
"Apollo 13",
"Die Hard",
"Tenet",
"Before Sunset",
"Triangle of Sadness",
"Jaws",
"Raging Bull",
"Ex Machina",
"Phantom Thread",
"No Country for Old Men",
"Encanto",
"Dunkirk",
"Fight Club",
"Manchester By The Sea",
"John Wick",
"John Wick: Chapter 4",
"John Wick: Chapter 2",
"The Shining",
"The Lord of the Rings: The Return of the King",
"Her",
"The Graduate",
"Mad Max: Fury Road",
"The Thing",
"The Royal Tenenbaums",
"Leave the World Behind",
"Scarface",
"Fargo",
"Blade",
"The Godfather",
"Godzilla",
"Arrival",
"Poor Things",
"Rocky IV",
"Django Unchained",
"Jurassic Park",
"Ocean's Eleven",
"The Revenant",
"Get Out",
"O Brother Where Art Thou",
"Aftersun",
"The Father",
"Top Gun: Maverick",
"Police Story",
"Spirited Away",
"Barbie",
"Terminator 2",
"Forrest Gump",
"Before Sunrise",
"Back to the Future Part II",
"Home Alone 2",
"The Menu",
"The Green Knight",
"The Dark Knight",
"Kill Bill",
"Shaun of the Dead",
"Godland",
"Playtime",
"National Lampoon's Christmas Vacation",
"Soul",
"Fury",
"RRR",
"Mrs. Doubtfire",
"American Fiction",
"Eternal Sunshine of the Spotless Mind",
"You've Got Mail",
"JoJo Rabbit",
"Tropic Thunder",
"Big",
"La La Land",
"Road House (1989)",
"The Jerk",
"The Money Pit"
];

const brian = [
    "Groundhog Day",
"Manchester By The Sea",
"The Matrix",
"Braveheart",
"The Fugitive",
"Terminator 2",
"Drive",
"Back to the Future",
"Bone Tomahawk",
"Jurassic Park",
"Inglourious Basterds",
"Sicario",
"Starship Troopers",
"Raising Arizona",
"Indiana Jones and the Last Crusade",
"The Empire Strikes Back",
"The Banshees of Inisherin",
"Whiplash",
"Schindler's List",
"Wall-E",
"Speed",
"Raiders of the Lost Ark",
"Crimson Tide",
"Clueless",
"Titanic",
"Forrest Gump",
"Saving Private Ryan",
"Dazed & Confused",
"Sound of Metal",
"Mission: Impossible",
"Star Wars",
"True Lies",
"Rear Window",
"The Silence of the Lambs",
"Tombstone",
"Father of the Bride",
"Far and Away",
"Maverick",
"Home Alone",
"The Money Pit",
"The Truman Show",
"Goldeneye",
"Toy Story",
"The Shining",
"The Batman",
"Once Upon a Time in Hollywood",
"A Perfect Murder",
"Prisoners",
"The Sound of Music",
"The Departed",
"Seven",
"Apollo 13",
"Eastern Promises",
"Napoleon Dynamite",
"Eternal Sunshine of the Spotless Mind",
"Brian and Charles",
"Ex Machina",
"The Hateful Eight",
"12 Angry Men",
"The Jerk",
"The Wrestler",
"The Bourne Identity",
"This Is Spinal Tap",
"Starred Up",
"No Country for Old Men",
"Mission Impossible: Fallout",
"Edge of Tomorrow",
"Adaptation",
"What Lies Beneath",
"Snatch",
"Casino Royale",
"Breakdown",
"The Princess Bride",
"The Dark Knight",
"The Exorcist",
"Fargo",
"Uncut Gems",
"True Grit",
"The Mummy",
"Flight of the Navigator",
"Panic Room",
"The Place Beyond The Pines",
"Dr. Strangelove",
"Anora",
"The Worst Person in the World",
"Gladiator",
"Moon",
"A Shot in the Dark",
"Die Hard",
"Top Gun: Maverick",
"Labyrinth",
"Rebel Ridge",
"Goodfellas",
"Misery",
"The Shawshank Redemption",
"Come True",
"Presumed Innocent",
"Castaway",
"The Karate Kid",
"Friday"
];

const nick = [
"Die Hard",
"The Godfather",
"The Empire Strikes Back",
"Gladiator",
"The Good, The Bad and The Ugly",
"It's a Wonderful Life",
"The Godfather: Part II",
"Star Wars",
"Halloween",
"Seven Samurai",
"Drive",
"Alien",
"Unforgiven",
"Goldeneye",
"The Departed",
"Dumb and Dumber",
"The Fifth Element",
"The Terminator",
"The Sting",
"Pulp Fiction",
"Inglourious Basterds",
"The Thing",
"Night of the Living Dead",
"Scarface",
"Casablanca",
"The Rock",
"Terminator 2",
"Rear Window",
"Predator",
"Silence of the Lambs",
"Titanic",
"Django Unchained",
"28 Days Later",
"Lock Stock & Two Smoking Barrels",
"Return of the Jedi",
"Blazing Saddles",
"Snatch",
"Die Hard 3",
"Jaws",
"True Lies",
"The Count of Monte Cristo",
"Jurassic Park",
"Starship Troopers",
"The Talented Mr. Ripley",
"The Running Man",
"Austin Powers: International Man of Mystery",
"The Mummy",
"Princess Mononoke",
"Blade",
"Bad Boys",
"A Fistful of Dollars",
"Saving Private Ryan",
"Casino Royale",
"Mission: Impossible",
"Escape from New York",
"The Big Lebowski",
"Apocalypto",
"Mad Max: Fury Road",
"Braveheart",
"Die Hard 2",
"Seven",
"Bone Tomahawk",
"Casino",
"The Matrix",
"Return of the Living Dead",
"The Sound of Music",
"The Lord of the Rings: The Two Towers",
"No Country for Old Men",
"The Pianist",
"Minority Report",
"Aliens",
"The Warriors",
"12 Monkeys",
"E.T.",
"Psycho",
"Fight Club",
"Heat",
"Back to the Future",
"The Shawshank Redemption",
"From Dusk Til Dawn",
"City of God",
"There Will Be Blood",
"L.A. Confidential",
"Sweet Smell of Success",
"Ghostbusters",
"Manhunter",
"The Dark Knight",
"Edge of Tomorrow",
"Maverick",
"Fletch",
"Pirates of the Caribbean: Curse of the Black Pearl",
"Lawrence of Arabia",
"Independence Day",
"Tombstone",
"Reservoir Dogs",
"Rounders",
"Speed",
"Step Brothers",
"Layer Cake",
"Dredd"
];

const gris = [
"The Prestige",
"The Shawshank Redemption",
"Interstellar",
"There Will Be Blood",
"Escape from Alcatraz",
"12 Angry Men",
"Die Hard",
"Blade Runner 2049",
"Prisoners",
"Oppenheimer",
"Back to the Future",
"Spiderman Into the Spider-Verse",
"One Flew Over the Cuckoo's Nest",
"Dune",
"Dune: Part Two",
"Godzilla Minus One",
"Inglourious Basterds",
"Arrival",
"Zodiac",
"Fury",
"Apollo 13",
"Saving Private Ryan",
"Gladiator",
"The Fugitive",
"No Country for Old Men",
"Rain Man",
"Gremlins",
"Toy Story 2",
"Big",
"Jaws",
"Jurassic Park",
"The Burbs",
"The Lord of the Rings: The Fellowship of the Ring",
"Pulp Fiction",
"Dunkirk",
"Signs",
"Terminator 2",
"Catch Me If You Can",
"Toy Story",
"Saltburn",
"Teenage Mutant Ninja Turtles",
"Rounders",
"Moneyball",
"Forrest Gump",
"Django Unchained",
"Ex Machina",
"Fargo",
"Tommy Boy",
"Robocop",
"The Wolf of Wall Street",
"Indiana Jones and the Last Crusade",
"Titanic",
"Tenet",
"The Martian",
"Face Off",
"Braveheart",
"Good Will Hunting",
"The Terminator",
"The Patriot",
"Casino Royale",
"Raiders of the Lost Ark",
"Unbreakable",
"Wall-E",
"Back to the Future Part II",
"Pirates of the Caribbean: Dead Man's Chest",
"The Goonies",
"Up",
"The Social Network",
"The Holdovers",
"Heat",
"Zero Dark Thirty",
"Mission Impossible: Fallout",
"The Big Short",
"The Fifth Element",
"Die Hard with a Vengeance",
"1917",
"Jojo Rabbit",
"Beverly Hills Cop",
"Ferris Bueller's Day Off",
"The Matrix",
"The Shining",
"Mad Max: Fury Road",
"Alien",
"The Rock",
"True Lies",
"Logan",
"Planet of the Apes",
"Avengers Endgame",
"Spider-Man",
"Top Gun: Maverick",
"Predator",
"The Sandlot",
"Blade",
"Uncut Gems",
"Thor Ragnarok",
"Mrs. Doubtfire",
"The Batman",
"Hook",
"300",
"The Greatest Game Ever Played"
];

  
function combineAndWeightLists(list1, list2, list3, list4) {
  const movieScores = {};

  // Assign points for list1
  list1.forEach((movie, index) => {
    movieScores[movie] = (movieScores[movie] || 0) + (100 - index);
  });

  // Assign points for list2
  list2.forEach((movie, index) => {
    movieScores[movie] = (movieScores[movie] || 0) + (100 - index);
  });

  // Assign points for list3
  list3.forEach((movie, index) => {
    movieScores[movie] = (movieScores[movie] || 0) + (100 - index);
  });

  // Assign points for list4
  list4.forEach((movie, index) => {
    movieScores[movie] = (movieScores[movie] || 0) + (100 - index);
  });

  // Convert scores object to an array of [movie, score] pairs
  const combinedList = Object.entries(movieScores);

  // Sort by score in descending order
  combinedList.sort((a, b) => b[1] - a[1]);

  // If you want to limit the result to the top 100
  const top100 = combinedList.slice(0, 100).join('\n');

  console.log(top100);
  console.log(combinedList.join('\n'));
}

//combineAndWeightLists(ben, brian, nick, gris);