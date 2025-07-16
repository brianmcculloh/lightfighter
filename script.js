/*********************************************
 * 
 * PHASE I: GAME ENGINE
 * 
 * FUTURE: do something cool with critical hits
 * FUTURE: how are we currently leveraging compareEffects on boosters?
 * 
 * 
 * PHASE II: BALANCE & PLAYTESTING
 * 
 * TODO: use AI to add runes to packs, which double the pack effects
 * TODO: system heart that doubles effects of runes
 * TODO: Playtest for balance and scaling - check if enemies or boosters need adjusted
 *          -- number of playtests on current iteration: 1
 * 
 * NEXT: splash and intro
 * NEXT: settings screen
 * NEXT: enhance overworld with messaging/lore
 * 
 * 
 * 
 * 
 * PHASE III: GRAPHICS, SOUNDS, AND ASSETS
 * 
 * 
 * 
 * 
 * CARD EFFECTS
 * --foil: multiplies (game.foilPower + card.level) to power when drawn (x1.1)
 * --holo: multiplies (game.holoPower + card.level) to power when played (x1.1)
 * --sleeve: multiplies (game.sleevePower + card.level) to power when held (x1.1)    
 * --gold leaf: adds (game.goldCredits + card.level) to credits when played as part of a combo (+1)
 * --texture: level up (game.textureLevels) when played as part of a combo
 * 
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
*********************************************/

import { saveGameState, loadGameState, saveStats, loadStats } from './db.js';

import { setAnimationSpeed, setGameSeed, randDecimal, randString, randFromArray, randArrayIndex, formatTenth, isDebuffActive, sortArsenal, prettyName, weightedSelect, togglePointerEvents, capitalize, formatLargeNumber, updateXPBar, fireAtEnemy, applyBoosterOverlap, applyCardOverlap, applyGunSlotOverlap, applySystemHeartOverlap, enableHoverZIndexBehavior, customDialog, message, flourish } from './utils.js';

import { Decimal } from 'decimal.js';

import game from './game.js';
import stats from './stats.js';

import ALL_ENEMIES from './enemies.js';

import { COLOR_DAMAGE_SCALE, WARM_COLORS, COOL_COLORS, RAINBOW_ORDER, CARD_TYPES, RANKS, ARCHETYPES, SPECIAL_CARDS, COMET_CARDS, PACK_TYPES, DEBUFFS } from './cards.js';

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

    populateCodex();

	refreshDom();

    loadInventory();

    setAnimationSpeed();

    manualLoad();
	
}

function manualLoad() {
    // Manual adding of boosters and system hearts for dev purposes
    let boosters = [
        //'system_class'
    ];
    let hearts = [
        //'double_boss_rewards',
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
    if (!gaugeContainer.querySelector('.gauge-power-wrapper')) {
        const gaugePowerWrapper = document.createElement('div');
        gaugePowerWrapper.classList.add('gauge-power-wrapper');
    
        const gaugePower = document.createElement('div');
        gaugePower.classList.add('gauge-power');
    
        const span = document.createElement('span');
        span.classList.add('gauge-label');
        span.textContent = 'pwr';
    
        gaugePowerWrapper.appendChild(gaugePower);
        gaugePowerWrapper.appendChild(span);
    
        gaugeContainer.appendChild(gaugePowerWrapper);
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

function populateCodex() {
    const codex = document.getElementById('codex');
    codex.innerHTML = ''; // clear any existing content
  
    // — Ranks —
    const h2Ranks = document.createElement('h2');
    h2Ranks.textContent = 'Ranks';
    codex.appendChild(h2Ranks);
  
    const ulRanks = document.createElement('ul');
    RANKS.forEach((rankObj, idx) => {
      const li = document.createElement('li');
      li.textContent = `${idx}: ${rankObj.name} (${rankObj.description})`;
      ulRanks.appendChild(li);
    });
    codex.appendChild(ulRanks);
  
    // — System Hearts (unique by id) —
    const h2Hearts = document.createElement('h2');
    h2Hearts.textContent = 'System Hearts';
    codex.appendChild(h2Hearts);
  
    const ulHearts = document.createElement('ul');
    const seenIds = new Set();
    game.systemHearts.forEach(heart => {
      if (!seenIds.has(heart.id)) {
        seenIds.add(heart.id);
        const li = document.createElement('li');
        li.textContent = `${heart.name} (${heart.description})`;
        ulHearts.appendChild(li);
      }
    });
    codex.appendChild(ulHearts);
  
    // — Packs (strip out any <span> tags) —
    const h2Packs = document.createElement('h2');
    h2Packs.textContent = 'Packs';
    codex.appendChild(h2Packs);
  
    const ulPacks = document.createElement('ul');
    PACK_TYPES.forEach(pack => {
      // replace any <span…>inner</span> with just "inner"
      const cleanDesc = pack.description.replace(/<span[^>]*>(.*?)<\/span>/g, '$1');
      const li = document.createElement('li');
      li.textContent = `${pack.name}: ${cleanDesc}`;
      ulPacks.appendChild(li);
    });
    codex.appendChild(ulPacks);

    // — Special Cards (only those with a function) —
    const h2Special = document.createElement('h2');
    h2Special.textContent = 'Special Cards';
    codex.appendChild(h2Special);

    const ulSpecial = document.createElement('ul');
    SPECIAL_CARDS.forEach(card => {
    if (card.function) {
        const li = document.createElement('li');
        li.textContent = `${card.name}: ${card.function}`;
        ulSpecial.appendChild(li);
    }
    });
    codex.appendChild(ulSpecial);

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
    document.querySelector('.stats .foilPower .total').textContent = (game.data.foilPower * game.data.specialMultiplier);
    document.querySelector('.stats .holoPower .total').textContent = (game.data.holoPower * game.data.specialMultiplier);
    document.querySelector('.stats .sleevePower .total').textContent = (game.data.sleevePower * game.data.specialMultiplier);
    document.querySelector('.stats .goldCredits .total').textContent = (game.data.goldCredits * game.data.specialMultiplier * game.data.creditsMultiplier);
    document.querySelector('.stats .textureLevels .total').textContent = (game.data.textureLevels * game.data.specialMultiplier);

    document.querySelector('.current-system span').textContent = game.data.system;
    document.querySelector('.current-class span').textContent = game.data.class;
    document.querySelector('.current-rank span').textContent = `${stats.data.rank} (${RANKS[stats.data.rank].name})`;

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
 * @param {boolean} [includeDisabled=true] - Whether to include boosters that are disabled (booster.disabled === true).
 * @returns {Array} An array of boosters matching the criteria.
 */
function findBoosters(
    attribute = null,
    value = null,
    excludeGuid = null,
    includeDisabled = true
  ) {
    // Combine all booster arrays into a single array
    const allBoosters = [
      ...game.slots.bridgeCards,
      ...game.slots.engineeringCards,
      ...game.slots.armoryCards
    ];
  
    let results = allBoosters;
  
    // 1) If attribute & value provided, filter by them
    if (attribute !== null && value !== null) {
      results = results.filter(booster => {
        const matches = Array.isArray(value)
          ? value.includes(booster[attribute])
          : booster[attribute] === value;
        return matches;
      });
    }
  
    // 2) Exclude a specific GUID if requested
    if (excludeGuid) {
      results = results.filter(booster => booster.guid !== excludeGuid);
    }
  
    // 3) Filter out disabled boosters if requested
    if (!includeDisabled) {
      results = results.filter(booster => !booster.disabled);
    }
  
    return results;
}  

export function showOverworld(increaseFloor = true) {
    togglePointerEvents(true);
    document.getElementById('overworld').classList.add('shown');
    document.querySelector('#shop .mercenary').classList.remove('unavailable');

    if (increaseFloor) {
        if (game.temp.currentEnemy.class === 5) {
            game.data.system += 1;
            game.data.class = 0;
            game.temp.systemHeartAvailable = true;
            game.temp.currentSystemHeart = {};
        }
        game.data.class++;
    }
    saveGameState(game);
    if(game.temp.systemHeartAvailable) {
        populateShopSystemHearts();
    }

    // 1) pick & shuffle
    let enemies = ALL_ENEMIES
      .filter(e => e.system === game.data.system && e.class === game.data.class)
      .sort(() => 0.5 - randDecimal());

    const count = (game.temp.currentEnemy.class >= 4) ? 3 : 1;
    const selectedEnemies = enemies.slice(0, count);

    // 2) init our temp stores
    game.temp.currentShield        = {};
    game.temp.currentVulnerability = {};
    game.temp.currentDebuff       = {};

    // 3) for each enemy, decide shield/vuln/debuff
    selectedEnemies.forEach(enemy => {
        // helper to normalize into array
        const norm = val => Array.isArray(val) ? val : (val ? [val] : []);

        // shield
        const shields = norm(enemy.shield);
        if (enemy.random?.includes('shield') && shields.length) {
            const i = Math.floor(randDecimal() * shields.length);
            game.temp.currentShield[enemy.id] = shields[i];
        } else {
            game.temp.currentShield[enemy.id] = shields.length
              ? (shields.length === 1 ? shields[0] : shields)
              : [];
        }

        // vulnerability
        const vulns = norm(enemy.vulnerability);
        if (enemy.random?.includes('vulnerability') && vulns.length) {
            const i = Math.floor(randDecimal() * vulns.length);
            game.temp.currentVulnerability[enemy.id] = vulns[i];
        } else {
            game.temp.currentVulnerability[enemy.id] = vulns.length
              ? (vulns.length === 1 ? vulns[0] : vulns)
              : [];
        }

        // debuff
        const debuffs = norm(enemy.debuff);
        if (enemy.random?.includes('debuff') && debuffs.length) {
            const i = Math.floor(randDecimal() * debuffs.length);
            game.temp.currentDebuff[enemy.id] = debuffs[i];
        } else {
            game.temp.currentDebuff[enemy.id] = debuffs.length
              ? (debuffs.length === 1 ? debuffs[0] : debuffs)
              : [];
        }
    });

    // 4) render
    const container = document.getElementById('enemies');
    container.innerHTML = '';

    selectedEnemies.forEach(enemy => {
        const wrap = document.createElement('div');
        wrap.className = 'enemy-wrapper';

        // NAME
        const nameDiv = document.createElement('div');
        nameDiv.className = 'enemy-name';
        nameDiv.textContent = enemy.name;
        wrap.appendChild(nameDiv);

        // SHIELD
        const sh = game.temp.currentShield[enemy.id];
        const shieldText = (!sh || (Array.isArray(sh) && sh.length === 0))
          ? 'None'
          : Array.isArray(sh)
            ? prettyName(sh.join(', '))
            : prettyName(sh);
        const shieldDiv = document.createElement('div');
        shieldDiv.className = 'enemy-shield';
        shieldDiv.innerHTML = `Shield: <span>${shieldText}</span>`;
        wrap.appendChild(shieldDiv);

        // VULNERABILITY
        const vu = game.temp.currentVulnerability[enemy.id];
        const vulnText = (!vu || (Array.isArray(vu) && vu.length === 0))
          ? 'None'
          : Array.isArray(vu)
            ? prettyName(vu.join(', '))
            : prettyName(vu);
        const vulnDiv = document.createElement('div');
        vulnDiv.className = 'enemy-vulnerability';
        vulnDiv.innerHTML = `Vulnerability: <span>${vulnText}</span>`;
        wrap.appendChild(vulnDiv);

        // DEBUFF
        const db = game.temp.currentDebuff[enemy.id];
        const debuffText = (!db || (Array.isArray(db) && db.length === 0))
          ? 'None'
          : Array.isArray(db)
            ? prettyName(db.join(', '))
            : prettyName(db);
        const debuffDiv = document.createElement('div');
        debuffDiv.className = 'enemy-debuff';
        debuffDiv.innerHTML = `Debuff: <span>${debuffText}</span>`;
        wrap.appendChild(debuffDiv);

        // BATTLE BUTTON
        const btn = document.createElement('div');
        btn.className = 'start-combat button';
        btn.setAttribute('data-id', enemy.id);
        btn.textContent = 'BATTLE';
        btn.addEventListener('click', () => startCombat(enemy.id));
        wrap.appendChild(btn);

        container.appendChild(wrap);
    });

    // 5) header
    document.querySelector('#overworld .system-header')
      .textContent = `System ${game.data.system}, Class ${game.data.class}`;
}

export async function startCombat(enemyid) {
    game.temp.currentContext = 'combat';
    document.getElementById('overworld').classList.remove('shown');
    game.data.attacksRemaining = game.data.attacksTotal;
    game.data.stowsRemaining = game.data.stowsTotal;
    game.temp.cumulativeDamage = 0;
    document.querySelector('.cumulative-damage span').textContent = 0;
    document.querySelector('.number.pierce').textContent = 1;
    loadEnemy(enemyid);
    resetArsenal();

    await processDebuffs();

    refreshDom();
    clearAmounts();

    await drawCards();
}

async function processDebuffs() {

    if (isDebuffActive("minus_1_attack")) {
        game.data.attacksRemaining -= 1;
    }
    if (isDebuffActive("minus_1_stow")) {
        game.data.stowsRemaining -= 1;
    }
    if (isDebuffActive("disable_bridge_booster")) {
        let group = game.slots.bridgeCards;
        if (group.length > 0) {
            let randomIndex = Math.floor(Math.random() * group.length);
            group[randomIndex].disabled = true;
            let domEl = document.querySelector(`.booster-slot [data-guid="${group[randomIndex].guid}"]`);
            if (domEl) domEl.classList.add("disabled");
        }
    }
    if (isDebuffActive("disable_engineering_booster")) {
        let group = game.slots.engineeringCards;
        if (group.length > 0) {
            let randomIndex = Math.floor(Math.random() * group.length);
            group[randomIndex].disabled = true;
            let domEl = document.querySelector(`.booster-slot [data-guid="${group[randomIndex].guid}"]`);
            if (domEl) domEl.classList.add("disabled");
        }
    }
    if (isDebuffActive("disable_armory_booster")) {
        let group = game.slots.armoryCards;
        if (group.length > 0) {
            let randomIndex = Math.floor(Math.random() * group.length);
            group[randomIndex].disabled = true;
            let domEl = document.querySelector(`.booster-slot [data-guid="${group[randomIndex].guid}"]`);
            if (domEl) domEl.classList.add("disabled");
        }
    }
    if (isDebuffActive("disable_random_booster")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        
        if (allBoosters.length > 0) {
            const randomIndex = Math.floor(Math.random() * allBoosters.length);
            const selectedBooster = allBoosters[randomIndex];
            
            selectedBooster.disabled = true;
            
            const domEl = document.querySelector(`.booster-slot [data-guid="${selectedBooster.guid}"]`);
            if (domEl) {
                domEl.classList.add("disabled");
            }
        }
    }    
    if (isDebuffActive("injectors_disabled")) {
        const injectorCards = document.querySelectorAll('.injector.card');
        injectorCards.forEach(card => {
            card.classList.add("disabled");
            // Disable pointer events so they are unclickable.
            card.style.pointerEvents = 'none';
        });
    }
    if (isDebuffActive("disable_boosters_until_0_stows") || isDebuffActive("disable_boosters_until_1_attack")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            booster.disabled = true;
            const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
            if (domEl) {
                domEl.classList.add("disabled");
            }
        });
    }
    if (isDebuffActive("disable_multiplicative_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.multiplicative === true) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }
    if (isDebuffActive("disable_additive_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (
                (booster.multiplicative === false || booster.multiplicative === undefined) &&
                (booster.damage || booster.power || booster.pierce || booster.spread || booster.credits || booster.xp)
            ) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }    
    if (isDebuffActive("disable_self_improving_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.selfImprove) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }
    if (isDebuffActive("disable_common_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.rarity === 'common') {
                booster.disabled = true;
                const domEl = document.querySelector(`[data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }
    if (isDebuffActive("disable_uncommon_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.rarity === 'uncommon') {
                booster.disabled = true;
                const domEl = document.querySelector(`[data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }
    if (isDebuffActive("disable_rare_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.rarity === 'rare') {
                booster.disabled = true;
                const domEl = document.querySelector(`[data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }
    if (isDebuffActive("disable_legendary_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.rarity === 'legendary') {
                booster.disabled = true;
                const domEl = document.querySelector(`[data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }
    if (isDebuffActive("disable_retriggering_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.retriggerCondition) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }    
    if (isDebuffActive("disable_damage_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.damage) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }   
    if (isDebuffActive("disable_power_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.power) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    } 
    if (isDebuffActive("disable_pierce_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.pierce) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }    
    if (isDebuffActive("disable_spread_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.spread) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }  
    if (isDebuffActive("disable_credits_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.credits) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }  
    if (isDebuffActive("disable_xp_boosters")) {
        const allBoosters = [
            ...game.slots.bridgeCards,
            ...game.slots.engineeringCards,
            ...game.slots.armoryCards
        ];
        allBoosters.forEach(booster => {
            if (booster.xp) {
                booster.disabled = true;
                const domEl = document.querySelector(`.booster-slot [data-guid="${booster.guid}"]`);
                if (domEl) {
                    domEl.classList.add("disabled");
                }
            }
        });
    }  
    
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
        // Build the debuff names for this card
        const colorDebuff = "disable_" + card.color.toLowerCase() + "_cards";
        const typeDebuff = "disable_" + card.type.toLowerCase() + "_cards";
        
        // If either debuff is active, disable the card.
        if (isDebuffActive(colorDebuff) || isDebuffActive(typeDebuff)) {
            card.disabled = true;
        } else {
            card.disabled = false;
        }
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

    // Create the container for all amounts
    let amountsWrapper = document.createElement('div');
    amountsWrapper.classList.add('amounts-wrapper');
    element.appendChild(amountsWrapper);

    // Define the amount properties and their corresponding labels
    const amounts = ['damage', 'power', 'pierce', 'spread', 'credits', 'xp'];
    const labels = {
        damage: 'dmg',
        power: 'pwr',
        pierce: 'prc',
        spread: 'spr',
        credits: 'crd',
        xp: 'xp'
    };

    amounts.forEach(prop => {
        // Create a wrapper for each amount-label pair
        const amountWrapper = document.createElement('div');
        amountWrapper.classList.add('amount-wrapper');
        
        // Parse the raw numeric value (or default to 0)
        const rawValue = parseFloat(item[prop]) || 0;
        // If zero, show nothing; otherwise format to the tenth
        const displayValue = rawValue === 0
          ? ''
          : formatTenth(rawValue);
        
        // Create the span for the numeric amount value
        const spanValue = document.createElement('span');
        spanValue.classList.add(prop);
        spanValue.setAttribute('data-amount', rawValue);
        spanValue.textContent = displayValue;
        
        // Create the span for the label
        const spanLabel = document.createElement('span');
        spanLabel.classList.add('amount-label');
        spanLabel.textContent = labels[prop];
        
        // Append the value and label spans to the wrapper
        amountWrapper.appendChild(spanValue);
        amountWrapper.appendChild(spanLabel);
        
        // Append the wrapper to the main amounts container
        amountsWrapper.appendChild(amountWrapper);
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
    const labels = {
        damage: 'dmg',
        power: 'pwr',
        pierce: 'prc',
        spread: 'spr',
        credits: 'crd',
        xp: 'xp'
    };

    amounts.forEach(prop => {
        // Create a wrapper for each amount and its label
        const amountWrapper = document.createElement('div');
        amountWrapper.classList.add('amount-wrapper');
    
        // Parse the raw numeric value (or default to 0)
        const rawValue = parseFloat(item[prop]) || 0;
        // If zero, show nothing; otherwise format to the tenth
        const displayValue = rawValue === 0
          ? ''
          : formatTenth(rawValue);
    
        // Create the span for the amount value
        const valueSpan = document.createElement('span');
        valueSpan.classList.add(prop);
        valueSpan.setAttribute('data-amount', rawValue);
        valueSpan.textContent = displayValue;
    
        // Retain setting the data attribute on the main element if needed
        element.setAttribute(`data-${prop}`, rawValue);
    
        // Create the span for the label
        const labelSpan = document.createElement('span');
        labelSpan.classList.add('amount-label');
        labelSpan.textContent = labels[prop];
    
        // Append the value span and label span to the wrapper
        amountWrapper.appendChild(valueSpan);
        amountWrapper.appendChild(labelSpan);
    
        // Append the amount wrapper to the amounts container
        amountsWrapper.appendChild(amountWrapper);
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
    document.querySelector('.gauge-power').textContent = '+0';

    if(game.arsenal.length === 0 && currentHandSize === 0) {
        await endCombat('loss');
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

        // Check if card is disabled
        if(card.disabled) {
            cardElement.classList.add('disabled');
        } else {
            cardElement.classList.remove('disabled');
        }
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

    if (isDebuffActive("no_spectrum_bonus")) return power;

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
            power += COLOR_DAMAGE_SCALE[color];
        });
    }

    return power;
}

function loadEnemy(enemyid) {
    // 1) Find & store current enemy
    const enemy = ALL_ENEMIES.find(e => e.id === enemyid);
    game.temp.currentEnemy = enemy;
    enemy.current = enemy.max;

    // 2) Reset & rebuild the ship UI
    const shipContainer = document.querySelector('.enemy-ship');
    shipContainer.innerHTML = '';
    const shipBar = document.createElement('div');
    shipBar.className = 'enemy-health-bar fade-in';
    shipContainer.appendChild(shipBar);
    const healthPreview = document.createElement('div');
    healthPreview.className = 'enemy-health-preview fade-in';
    shipContainer.appendChild(healthPreview);

    // 3) Name & health text
    const nameEl = document.querySelector('#enemy-info .name');
    nameEl.textContent = enemy.name;
    nameEl.classList.add('fade-in');

    const currEl = document.querySelector('#enemy-info .health .current');
    currEl.textContent = formatLargeNumber(enemy.current);
    currEl.classList.add('fade-in');

    const maxEl = document.querySelector('#enemy-info .health .max');
    maxEl.textContent = formatLargeNumber(enemy.max);
    maxEl.classList.add('fade-in');

    // 4) Pull from game.temp.* instead of enemy.*
    const sh   = game.temp.currentShield[enemyid];
    const vu   = game.temp.currentVulnerability[enemyid];
    const db   = game.temp.currentDebuff[enemyid];

    const shieldText = (!sh || (Array.isArray(sh) && sh.length === 0))
      ? 'None'
      : Array.isArray(sh)
        ? prettyName(sh.join(', '))
        : prettyName(sh);

    const vulnText = (!vu || (Array.isArray(vu) && vu.length === 0))
      ? 'None'
      : Array.isArray(vu)
        ? prettyName(vu.join(', '))
        : prettyName(vu);

    const debuffText = (!db || (Array.isArray(db) && db.length === 0))
      ? 'None'
      : Array.isArray(db)
        ? prettyName(db.join(', '))
        : prettyName(db);

    // 5) Update the DOM spans
    document.querySelector('#enemy-info .enemy-shield span').textContent = shieldText;
    document.querySelector('#enemy-info .enemy-vulnerability span').textContent = vulnText;
    document.querySelector('#enemy-info .enemy-debuff span').textContent = debuffText;
}

function updateButtonAvailability() {
    const stowButton = document.getElementById('stow-button');
    const attackButton = document.getElementById('attack-button');

    if (game.temp.gunCards.length > 0) {
        // Update stow button based on available stows
        if (game.data.stowsRemaining > 0) {
            stowButton.classList.remove('unavailable');
        } else {
            stowButton.classList.add('unavailable');
        }

        // If any gun card is disabled, force attack button to be unavailable
        if (game.temp.gunCards.some(card => card.disabled)) {
            attackButton.classList.add('unavailable');
        } else {
            // Otherwise, update the attack button based on remaining attacks and debuff conditions
            if (game.data.attacksRemaining > 0) {
                attackButton.classList.remove('unavailable');
            } else {
                attackButton.classList.add('unavailable');
            }

            if (isDebuffActive("attacks_require_stowed_combo") && game.temp.combosStowed === 0) {
                attackButton.classList.add('unavailable');
            }
        }
    } else {
        // If there are no equipped cards, disable both buttons
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

    let stowedComboType = document.querySelector('.combo-name span').getAttribute('data-type');
    if (stowedComboType && game.comboTypeLevels[stowedComboType]) {
        game.temp.combosStowed += 1;
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

    // re-enable all boosters if debuff is active
    if (isDebuffActive("disable_boosters_until_0_stows") && game.data.stowsRemaining <= 0) {
        reenableBoosters();
    }

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
        await endCombat('win');
        return;
	} else if(game.data.attacksRemaining <= 0) {

        // this is counted as a death even if the game's not over
        // update death stats accordingly
        const systemClassKey = `${game.data.system}.${game.data.class}`;
        const currentCount = stats.data.deaths[systemClassKey] ?? 0;
        stats.data.deaths[systemClassKey] = currentCount + 1;
        saveStats(stats.data);
        
        await endCombat('loss');
		return;
		
	}

    // re-enable all boosters if debuff active
    if (isDebuffActive("disable_boosters_until_1_attack") && game.data.attacksRemaining === 1) {
        reenableBoosters();
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
        // Select only the value spans (excluding the label spans)
        const valueSpans = wrapper.querySelectorAll('span:not(.amount-label)');

        // Clear the textContent of each value span and reset its data-amount attribute
        valueSpans.forEach(span => {
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

    // Handle the double_retriggers and other multipliers if they aren't disabled
    const multiplyBoosters = findBoosters('boosterAction', [
        'double_retriggers',  
        'double_damage_values', 
        'double_power_values', 
        'double_pierce_values', 
        'double_spread_values', 
        'double_additive',
        'double_multiplicative'
    ], null, false);
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
    const multiplyBoosters = findBoostersWithAction('double_retriggers', false);
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

        // Check if the booster element exists in the DOM
        let boosterEl = document.querySelector(`[data-guid="${booster.guid}"]`);
        if (!boosterEl) {
            if (game.config.debug) console.log(`Skipping booster ${booster.id} because its element does not exist (it may have been destroyed).`);
            continue;  // Skip processing for this booster
        }

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
        boosterEl.classList.add("active");

        // Process the booster power
        await processBoosterPower(booster);

        // Increase count of booster.timesFired (defaulting to 0 if undefined)
        booster.timesFired = (booster.timesFired || 0) + 1;

        // If the booster element exists, update the "fired" span and remove the "active" class
        const firedCountSpan = boosterEl.querySelector('.fired .fired-count');
        if (firedCountSpan) {
            firedCountSpan.textContent = booster.timesFired;
        }
        boosterEl.classList.remove("active");      

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
                    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
                    return level > max ? level : max;
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
                    .reduce((total, card) => total + (isDebuffActive('card_levels_nerfed') ? 1 : card.level), 0); // Sum up the levels starting from 0
                boosterPower = totalBlueLevel;
                break;
            case 'system_class':
                boosterPower = game.data.system + game.data.class;
                break;
            case 'combined_card_level':
                // Sum the levels of all played cards
                const combinedLevel = game.temp.gunCards.reduce((total, card) => total + (isDebuffActive('card_levels_nerfed') ? 1 : card.level), 0);
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
                    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
                    return level > max ? level : max;
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
                    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
                    return level > max ? level : max;
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
                    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
                    return level > max ? level : max;
                }, 0);
                boosterSpread = highestLevelForSpread;
                break;
        }
    }

    // For additive boosters: if any booster with 'double_additive' is active and this booster is additive.
    if (findBoosters('boosterAction', 'double_additive', null, false).length > 0 && booster.boosterAction !== 'double_additive') {
        if (!booster.multiplicative) { // Only apply to additive boosters
            boosterDamage *= 2;
            boosterPower *= 2;
            boosterPierce *= 2;
            boosterSpread *= 2;
        }
    }

    // For multiplicative boosters: if any booster with 'double_multiplicative' is active and this booster is multiplicative.
    if (findBoosters('boosterAction', 'double_multiplicative', null, false).length > 0 && booster.boosterAction !== 'double_multiplicative') {
        if (booster.multiplicative) { // Only apply to multiplicative boosters
            boosterDamage *= 2;
            boosterPower *= 2;
            boosterPierce *= 2;
            boosterSpread *= 2;
        }
    }

    // If any booster with the respective boosterAction is active (and the current booster isn't itself that type), double the value.
    if (findBoosters('boosterAction', 'double_damage_values', null, false).length > 0 && booster.boosterAction !== 'double_damage_values') {
        boosterDamage *= 2;
    }
    if (findBoosters('boosterAction', 'double_power_values', null, false).length > 0 && booster.boosterAction !== 'double_power_values') {
        boosterPower *= 2;
    }
    if (findBoosters('boosterAction', 'double_pierce_values', null, false).length > 0 && booster.boosterAction !== 'double_pierce_values') {
        boosterPierce *= 2;
    }
    if (findBoosters('boosterAction', 'double_spread_values', null, false).length > 0 && booster.boosterAction !== 'double_spread_values') {
        boosterSpread *= 2;
    }

    // Check if this booster has a multiplier from a chained multiplier booster
    let chainMultiplier = 1;
    if (game.temp.multiplierMapping && game.temp.multiplierMapping[booster.guid]) {
        chainMultiplier = game.temp.multiplierMapping[booster.guid];
    }
    
    // Apply the chain multiplier to the booster's attributes
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
    
        // Big display
        const bigDamage = document.querySelector('.number.damage');
        bigDamage.classList.add("active");
        bigDamage.textContent = formatLargeNumber(damageIncrease);
    
        // Small display
        const dmgEl = boosterElement.querySelector('.damage');
        let prev = parseFloat(dmgEl.getAttribute('data-amount').replace(/,/g, ''));
        prev = prev === 0 && multiplicative ? 1 : prev;
    
        const rawDmg = multiplicative
        ? boosterDamage * prev
        : boosterDamage + prev;
    
        const roundedDmg = Math.round(rawDmg * 10) / 10;
        const dispDmg    = formatTenth(rawDmg);
    
        dmgEl.textContent = prefix + dispDmg;
        dmgEl.setAttribute('data-amount', formatLargeNumber(roundedDmg));
    }
    
    // Power is increasing
    if (powerIncrease > power) {
        procBooster = true;
    
        const bigPower = document.querySelector('.number.power');
        bigPower.classList.add("active");
        bigPower.textContent = formatLargeNumber(powerIncrease);
    
        const pwrEl = boosterElement.querySelector('.power');
        let prev = parseFloat(pwrEl.getAttribute('data-amount').replace(/,/g, ''));
        prev = prev === 0 && multiplicative ? 1 : prev;
    
        const rawPwr = multiplicative
        ? boosterPower * prev
        : boosterPower + prev;
    
        const roundedPwr = Math.round(rawPwr * 10) / 10;
        const dispPwr    = formatTenth(rawPwr);
    
        pwrEl.textContent = prefix + dispPwr;
        pwrEl.setAttribute('data-amount', formatLargeNumber(roundedPwr));
    }
    
    // Pierce is increasing
    if (pierceIncrease > pierce) {
        procBooster = true;
    
        const bigPierce = document.querySelector('.number.pierce');
        bigPierce.classList.add("active");
        bigPierce.textContent = formatLargeNumber(pierceIncrease);
    
        const prcEl = boosterElement.querySelector('.pierce');
        let prev = parseFloat(prcEl.getAttribute('data-amount').replace(/,/g, ''));
        prev = prev === 0 && multiplicative ? 1 : prev;
    
        const rawPrc = multiplicative
        ? boosterPierce * prev
        : boosterPierce + prev;
    
        const roundedPrc = Math.round(rawPrc * 10) / 10;
        const dispPrc    = formatTenth(rawPrc);
    
        prcEl.textContent = prefix + dispPrc;
        prcEl.setAttribute('data-amount', formatLargeNumber(roundedPrc));
    }
    
    // Spread is increasing
    if (spreadIncrease > spread) {
        procBooster = true;
    
        const bigSpread = document.querySelector('.number.spread');
        bigSpread.classList.add("active");
        bigSpread.textContent = formatLargeNumber(spreadIncrease);
    
        game.data.spread = spreadIncrease;
    
        const spdEl = boosterElement.querySelector('.spread');
        let prev = parseFloat(spdEl.getAttribute('data-amount').replace(/,/g, ''));
        prev = prev === 0 && multiplicative ? 1 : prev;
    
        const rawSpd = multiplicative
        ? boosterSpread * prev
        : boosterSpread + prev;
    
        const roundedSpd = Math.round(rawSpd * 10) / 10;
        const dispSpd    = formatTenth(rawSpd);
    
        spdEl.textContent = prefix + dispSpd;
        spdEl.setAttribute('data-amount', formatLargeNumber(roundedSpd));
    }
    
    // Credits are increasing
    if (creditsIncrease > credits) {
        procBooster = true;
    
        const bigCred = document.querySelector('.stats .credits span');
        bigCred.classList.add("active");
        bigCred.textContent = formatLargeNumber(creditsIncrease);
    
        game.data.credits = creditsIncrease;
    
        const crdEl = boosterElement.querySelector('.credits');
        let prev = parseFloat(crdEl.getAttribute('data-amount').replace(/,/g, ''));
        prev = prev === 0 && multiplicative ? 1 : prev;
    
        const rawCrd = multiplicative
        ? boosterCredits * prev
        : boosterCredits + prev;
    
        const roundedCrd = Math.round(rawCrd * 10) / 10;
        const dispCrd    = formatTenth(rawCrd);
    
        crdEl.textContent = prefix + dispCrd;
        crdEl.setAttribute('data-amount', formatLargeNumber(roundedCrd));
    }
    
    // XP is increasing
    if (xpIncrease > xp) {
        procBooster = true;
    
        const bigXp = document.querySelector('.stats .xp span');
        bigXp.classList.add("active");
        bigXp.textContent = formatLargeNumber(xpIncrease);
    
        game.data.xp = xpIncrease;
    
        const xpEl = boosterElement.querySelector('.xp');
        let prev = parseFloat(xpEl.getAttribute('data-amount').replace(/,/g, ''));
        prev = prev === 0 && multiplicative ? 1 : prev;
    
        const rawXp = multiplicative
        ? boosterXP * prev
        : boosterXP + prev;
    
        const roundedXp = Math.round(rawXp * 10) / 10;
        const dispXp    = formatTenth(rawXp);
    
        xpEl.textContent = prefix + dispXp;
        xpEl.setAttribute('data-amount', formatLargeNumber(roundedXp));
    
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
    const levelIncrement = (booster.levels !== undefined ? booster.levels : 1);
    
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
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
            if (cardElement) cardElement.classList.remove("active");
        break;
        case 'upgrade_random_combo':
            if(cardElement) cardElement.classList.add("active");
            document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
            upgradeRandomCombo();
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
            if (cardElement) cardElement.classList.remove("active");
        break;
        case 'upgrade_played_combo':
            let comboType = document.querySelector('.combo-name span').getAttribute('data-type');
            if (comboType && game.comboTypeLevels[comboType]) {
                if(cardElement) cardElement.classList.add("active");
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                updateComboLevel(comboType, levelIncrement);
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                if (cardElement) cardElement.classList.remove("active");
            } else {
                console.log("No combo was played or combo type is unknown.");
            }
        break;
        case 'upgrade_stowed_combo':
            let stowedComboType = document.querySelector('.combo-name span').getAttribute('data-type');
            if (stowedComboType && game.comboTypeLevels[stowedComboType]) {
                if(cardElement) cardElement.classList.add("active");
                document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                updateComboLevel(stowedComboType, levelIncrement);
                await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
                if (cardElement) cardElement.classList.remove("active");
            } else {
                console.log("No combo was stowed or combo type is unknown.");
            }
        break;
        case 'upgrade_random_played_card':
            const randomIndex = Math.floor(randDecimal() * game.temp.gunCards.length);
            const randomCard = game.temp.gunCards[randomIndex];
            const randomCardElement = document.querySelector(`#guns .card[data-guid="${randomCard.guid}"]`);
            if (randomCardElement) {
                updateCardLevel(randomCard, levelIncrement, randomCardElement);
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
                updateCardLevel(randomHandCard, levelIncrement, randomHandCardElement);
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
            const propertyToClassMap = {
                foil: 'foilPower',
                holo: 'holoPower',
                sleeve: 'sleevePower',
                gold_credits: 'goldCredits',
                texture: 'textureLevels'
            };
            const statClass = propertyToClassMap[randomGameDataProperty];
            const statElement = document.querySelector(`.stats .${statClass} .total`);
            game.data[propertyToClassMap[randomGameDataProperty]] += 1;
            statElement.textContent = (game.data[propertyToClassMap[randomGameDataProperty]] * game.data.specialMultiplier);
            statElement.classList.add("active");
            if (cardElement) cardElement.classList.add("active");
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
            statElement.classList.remove("active");
            document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
            await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
            if (cardElement) cardElement.classList.remove("active");
        break;
        case 'upgrade_played_cards':
            for (const gunCard of game.temp.gunCards) {
                const gunCardElement = document.querySelector(`#guns .card[data-guid="${gunCard.guid}"]`);
                if (gunCardElement) {
                    updateCardLevel(gunCard, levelIncrement, gunCardElement);
                    document.querySelector(`[data-guid="${booster.guid}"]`).classList.add("active");
                    gunCardElement.classList.add("upgraded");
                    await new Promise(resolve => setTimeout(resolve, game.config.cardDelay));
                    gunCardElement.classList.remove("upgraded");
                } else {
                    console.log('Could not find card element with data-guid: ', gunCard.guid, 'Tried to pull from game.temp.scoringCards: ', game.temp.gunCards);
                }
            }
        break;
        case 'upgrade_scoring_cards':
            for (const scoringCard of game.temp.scoringCards) {
                const scoringCardElement = document.querySelector(`#guns .card[data-guid="${scoringCard.guid}"]`);
                if (scoringCardElement) {
                    updateCardLevel(scoringCard, levelIncrement, scoringCardElement);
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
                        updateCardLevel(card, levelIncrement, greenCardElement);
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
                updateCardLevel(stowedRandomCard, levelIncrement, stowedRandomCardElement);
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
                    updateCardLevel(stowedCard, levelIncrement, stowedCardElement);
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
        let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
        if (booster.cardLevel !== undefined) {
            switch (booster.compareLevel) {
                case 'greater':
                    conditions.push(level > booster.cardLevel);
                    break;
                case 'less':
                    conditions.push(level < booster.cardLevel);
                    break;
                default: // Assumes 'equal' if compare is not specified
                    conditions.push(level === booster.cardLevel);
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
 * @param {boolean} [includeDisabled=true] - Whether to include boosters that are disabled (booster.disabled === true).
 * @returns {Array|boolean} An array of boosters with the specified action or false if none found.
 */
function findBoostersWithAction(action, includeDisabled = true) {
    // Combine all booster arrays into one list
    const allBoosters = [
        ...game.slots.bridgeCards,
        ...game.slots.engineeringCards,
        ...game.slots.armoryCards
    ];

    // Filter by action
    let results = allBoosters.filter(booster => booster.boosterAction === action);

    // Optionally exclude disabled boosters
    if (!includeDisabled) {
        results = results.filter(booster => !booster.disabled);
    }

    // Return array if any, or false if none
    return results.length > 0 ? results : false;
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
    // Pull the vulnerability from the temp store instead of enemy.vulnerability
    const raw = game.temp.currentVulnerability?.[enemy.id];
    const vulnerabilities = raw
        ? (Array.isArray(raw) ? raw : [raw])
        : [];

    return vulnerabilities.some(vulnerability => {
        return card.color === vulnerability ||
               card.type  === vulnerability ||
               (vulnerability === 'warm' && WARM_COLORS.includes(card.color)) ||
               (vulnerability === 'cool' && COOL_COLORS.includes(card.color));
    });
}

function isShielded(card, enemy) {
    // Pull the shield from the temp store instead of enemy.shield
    const raw = game.temp.currentShield?.[enemy.id];
    const shields = raw
        ? (Array.isArray(raw) ? raw : [raw])
        : [];

    return shields.some(shield => {
        return card.color === shield ||
               card.type  === shield ||
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

    if(!isDebuffActive('combos_ignored')) {
        // Determine combo type based on the collected data and conditions
        if (isFullSpectrum && allSameType) {
            possiblecombos.push({ type: "fullSpectrumArmament", baseDamage: game.comboTypeLevels["fullSpectrumArmament"].baseDamage });
        } 
        if (maxColorTypeCount === 5 && allSameType) {
            possiblecombos.push({ type: "fullChromaticArmament", baseDamage: game.comboTypeLevels["fullChromaticArmament"].baseDamage });
        }
        /*if (maxColorTypeCount === 2 && totalCards >= 2) {
            possiblecombos.push({ type: "biChromaticArmament", baseDamage: game.comboTypeLevels["biChromaticArmament"].baseDamage });
        }*/
        if (maxColorTypeCount === 3 && totalCards >= 3) {
            possiblecombos.push({ type: "triChromaticArmament", baseDamage: game.comboTypeLevels["triChromaticArmament"].baseDamage });
        }
        if (maxColorTypeCount === 4 && totalCards >= 4) {
            possiblecombos.push({ type: "quadChromaticArmament", baseDamage: game.comboTypeLevels["quadChromaticArmament"].baseDamage });
        } 
        /*if (maxColorCount === 2 && totalCards >= 2) {
            possiblecombos.push({ type: "biChromatic", baseDamage: game.comboTypeLevels["biChromatic"].baseDamage });
        }*/
        if (maxColorCount === 3 && totalCards >= 3) {
            possiblecombos.push({ type: "triChromatic", baseDamage: game.comboTypeLevels["triChromatic"].baseDamage });
        } 
        if (maxColorCount === 4 && totalCards >= 4) {
            possiblecombos.push({ type: "quadChromatic", baseDamage: game.comboTypeLevels["quadChromatic"].baseDamage });
        } 
        if (maxColorCount === 5 && allSameColor) {
            possiblecombos.push({ type: "fullChromatic", baseDamage: game.comboTypeLevels["fullChromatic"].baseDamage });
        } 
        /*if (maxTypeCount === 2 && totalCards >= 2) {
            possiblecombos.push({ type: "biArmament", baseDamage: game.comboTypeLevels["biArmament"].baseDamage });
        }*/
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
    }

	// Loop over possiblecombos to calculate the damage for each combo, and select the highest scoring one
    let highestScoringCombo = possiblecombos.reduce((highest, combo) => {
        let adjustedBaseDamage = combo.baseDamage;
        let handlevel = game.comboTypeLevels[combo.type].level;

        // Pull shield and vulnerability from game.temp stores
        const rawShields = game.temp.currentShield[game.temp.currentEnemy.id];
        const shields = rawShields
            ? (Array.isArray(rawShields) ? rawShields : [rawShields])
            : [];
        const shieldsLower = shields.map(s => s.toLowerCase());

        const rawVulns = game.temp.currentVulnerability[game.temp.currentEnemy.id];
        const vulnerabilities = rawVulns
            ? (Array.isArray(rawVulns) ? rawVulns : [rawVulns])
            : [];
        const vulnerabilitiesLower = vulnerabilities.map(v => v.toLowerCase());

        const comboTypeLower = combo.type.toLowerCase();

        // Check for shield or vulnerability against the combo type
        const isComboShielded    = shieldsLower.some(shield => comboTypeLower.includes(shield));
        const isComboVulnerable  = vulnerabilitiesLower.some(vul => comboTypeLower.includes(vul));

        // Adjust for shield (sets combo level to 1)
        if (isComboShielded) {
            handlevel = 1;
        }

        // Adjust for vulnerability (double base damage)
        if (isComboVulnerable) {
            adjustedBaseDamage *= 2;
        }

        const totalDamage = adjustedBaseDamage * handlevel;
        return totalDamage > highest.totalDamage
            ? { type: combo.type, totalDamage }
            : highest;
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
        game.temp.persistentPower = 0; // Base persistent power from boosters or drawn cards
    }
    if (!game.temp.persistentPierce || game.temp.persistentPierce === 0) {
        game.temp.persistentPierce = 1;
    }
    if (!game.temp.persistentSpread || game.temp.persistentSpread === 0) {
        game.temp.persistentSpread = 1;
    }

    // Initialize dynamic power to be recalculated based on equipped cards
    game.temp.dynamicPower = 1; // Start from a base value

    // Count cards by color and type
    let colorCounts = {};
    let typeCounts = {};
    let colorTypeCounts = {};
    let maxColorTypeCount = 0; // Max count of cards sharing both color and type

    game.temp.gunCards.forEach(card => {
        // If the "minimum_wavelengths" debuff is active, use the minimum value;
        // otherwise, use max value if game.data.maxWavelengths is true, or use the card's own color value.
        const baseDamage = isDebuffActive("minimum_wavelengths")
            ? Math.min(...Object.values(COLOR_DAMAGE_SCALE))
            : (game.data.maxWavelengths 
                ? Math.max(...Object.values(COLOR_DAMAGE_SCALE)) 
                : COLOR_DAMAGE_SCALE[card.color]);
        
        const level = isShielded(card, game.temp.currentEnemy) || isDebuffActive('card_levels_nerfed') ? 1 : card.level; // Shielded cards are considered level 1
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
        // Check if booster is active that causes card levels to affect power
        if(findBoosters('boosterAction', 'card_levels_multiply_power').length > 0) {
            game.temp.dynamicPower *= isShielded(card, game.temp.currentEnemy) || isDebuffActive('card_levels_nerfed') ? 1 : card.level;;
        }

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

    // Check if booster is active that causes combo levels to affect power
    if(findBoosters('boosterAction', 'combo_levels_multiply_power').length > 0) {
        game.temp.dynamicPower += bonusDamage;
    }

    // Combine persistentPower (booster effects) and dynamicPower (from cards and spectrum power)
    let totalPower = Math.round(game.temp.persistentPower + game.temp.dynamicPower);

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
    document.querySelector('.gauge-power').textContent = `+${formatLargeNumber(spectrumBonusPowerDisplay)}`;

    // Update the temporary game state with the recalculated values
    game.temp.damage = totalDamage;
    game.temp.power = totalPower;

    updateEnemyHealthPreview(finalDamage);
}

function getHolo(card) {
    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
    return (card.holo && !isShielded(card, game.temp.currentEnemy)) ? ((game.data.holoPower * game.data.specialMultiplier) + (level - 1)) : 1;
}
function getFoil(card) {
    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
    return (card.foil && !isShielded(card, game.temp.currentEnemy)) ? ((game.data.foilPower * game.data.specialMultiplier) + (level - 1)) : 1;
}
function getSleeve(card) {
    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
    return (card.sleeve && !isShielded(card, game.temp.currentEnemy)) ? ((game.data.sleevePower * game.data.specialMultiplier) + (level - 1)) : 1;
}
function getGoldLeaf(card) {
    let level = isDebuffActive('card_levels_nerfed') ? 1 : card.level;
    return (card.gold_leaf && !isShielded(card, game.temp.currentEnemy)) ? Math.round(((game.data.goldCredits * game.data.creditsMultiplier) + (level - 1)) * game.data.specialMultiplier) : 0;
}
function getTexture(card) {
    return (card.texture && !isShielded(card, game.temp.currentEnemy)) ? Math.round(game.data.textureLevels * game.data.specialMultiplier) : 0;
}
function updateCardDamage(card, cardDamage) {
    // Update the damage span in the card element
    const cardElement = document.querySelector(
      `#guns .card[data-guid="${card.guid}"]`
    );
    if (cardElement) {
        const damageSpan = cardElement.querySelector('.damage');
        // use formatTenth to drop ".0" when it's whole, or show one decimal otherwise
        const damageDisplay = '+' + formatTenth(cardDamage);
        damageSpan.textContent = damageDisplay;
    }
}
function updateCardPower(card, context = 'hand') {
    let foil    = getFoil(card);
    let holo    = getHolo(card);
    let sleeve  = getSleeve(card);
    let levels  = findBoosters('boosterAction', 'card_levels_multiply_power').length > 0
      ? card.level
      : 1;

    // pick the right card element
    let cardElementEquipped = document.querySelector(
      `#guns .card[data-guid="${card.guid}"]`
    );
    if (context === 'hand') {
        cardElementEquipped = document.querySelector(
          `#cards .card[data-guid="${card.guid}"]`
        );
    }

    if (cardElementEquipped) {
        // default for "hand" or fallback
        let powerDisplay = foil > 1
          ? 'x' + formatTenth(foil)
          : '';

        if (context === 'guns') {
            if (holo > 1) {
                powerDisplay = 'x' + formatTenth((holo * foil) + levels);
            } else if (foil > 1) {
                powerDisplay = 'x' + formatTenth(foil + levels);
            } else if (levels > 1) {
                powerDisplay = 'x' + formatTenth(levels);
            } else {
                powerDisplay = '';
            }
        } 
        else if (context === 'sleeve') {
            if (sleeve > 1) {
                powerDisplay = 'x' + formatTenth(sleeve * foil);
            } else if (foil > 1) {
                powerDisplay = 'x' + formatTenth(foil);
            } else {
                powerDisplay = '';
            }
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


export async function endCombat(result) {

    game.temp.currentContext = 'overworld';
    game.temp.combosStowed = 0;

    document.querySelectorAll('.gauge-color').forEach(element => {
        element.classList.remove('active');
    });

    clearAmounts();

    refreshDom();

    togglePointerEvents(true); // Enable pointer events

    if (result == 'win') {
        // Check for any self improves
        improveBoosters('win');
        // Determine if this was a boss fight (class === 5)
        let isBoss = game.temp.currentEnemy && game.temp.currentEnemy.class === 5;
        // Check for system heart that doubles boss rewards
        let hasDoubleBossHeart = Array.isArray(game.data.systemHearts) && game.data.systemHearts.some(h => h.id === 'double_boss_rewards');

        // Calculate base rewards
        let credits = Math.round((((game.data.attacksRemaining + game.data.stowsRemaining) * 2) + 5) * game.data.creditsMultiplier);
        let xp = Math.round(((game.data.class * 10) + (game.data.system * 10)) * game.data.xpMultiplier);

        // Double rewards if boss, double again if system heart is present
        if (isBoss) {
            credits *= 2;
            xp *= 2;
            if (hasDoubleBossHeart) {
                credits *= 2;
                xp *= 2;
            }
        }

        document.querySelector('.collect-credits span').textContent = formatLargeNumber(credits);
        document.querySelector('.gain-xp span').textContent = formatLargeNumber(xp);
        document.querySelector('#end-combat').classList.add('shown');
        resetArsenal();

        // Generate something like "2.3" or "3.10", etc.
        let combinedStr = game.data.system + '.' + game.data.class;
        let currentSystemClass = parseFloat(combinedStr);  

        let highestSystemClass = stats.data.highest_system_class;
        if (currentSystemClass > highestSystemClass) {
            stats.data.highest_system_class = currentSystemClass;
            saveStats(stats.data);
            if (stats.data.total_runs > 1) {
                flourish("New high system level!");
            }

            // check for rank increase
            // this happens before we increase the floor, so system 8.5 should be considered 9.1
            if (game.data.system >= 8 && game.data.class === 5) {
                const newRank = game.data.system - 7;
                if (newRank > stats.data.rank) {
                    stats.data.rank = newRank;
                    saveStats(stats.data);
                    // grab the name & description from your RANKS object array
                    const { name, description } = RANKS[newRank];
                    flourish(`New rank achieved: ${name} (${description})`);
                }
            }
        }
    } else {
        if(game.data.lives > 0 && !isDebuffActive('time_shifts_disabled')) {
            game.data.lives -= 1;
            showOverworld(false);
        } else {
            document.querySelector('#end-game').classList.add('shown');
            // reset the win streak if this wasn't considered a win (it's arbitrary at this point)
            if (game.data.system < 10) {
                stats.data.highest_win_streak = 0;
            }
        }
    }
    
    await reenableBoosters();
    await reenableInjectors();
    
}

async function reenableBoosters() {
    const boosterGroups = [
        game.slots.bridgeCards,
        game.slots.engineeringCards,
        game.slots.armoryCards
    ];
    boosterGroups.forEach(group => {
        group.forEach(booster => {
            booster.disabled = false;
            const boosterEl = document.querySelector(`[data-guid="${booster.guid}"]`);
            if (boosterEl) {
                boosterEl.classList.remove("disabled");
            }
        });
    });
}
async function reenableInjectors() {
    // Re-enable injector cards that were disabled by debuffs.
    const injectorCards = document.querySelectorAll('.injector.card');
    injectorCards.forEach(card => {
        card.classList.remove("disabled");
        card.style.pointerEvents = 'auto'; // Or remove the inline style if preferred
    });
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
        game.temp.slotsAvailable++;
        saveGameState(game);
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
    clearAmounts();
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
        if(key === 'rank') row.textContent += ` (${RANKS[value].name})`;
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

export function populateShopSystemHearts() {
    if (game.systemHearts.length === 0) {
        console.log("No system hearts available for this system.");
        return;
    }

    const playerRank = stats.data.rank;

    // 1) filter out any heart locked by rank
    const availableHearts = game.systemHearts.filter(heart =>
        heart.rank == null || heart.rank <= playerRank
    );

    if (availableHearts.length === 0) {
        console.log("No system hearts are unlocked at your rank.");
        return;
    }

    // 2) use temp.currentSystemHeart if it exists, otherwise randomly select one
    let systemHeart = game.temp.currentSystemHeart;

    // Check if it's an empty object
    if (
        !systemHeart || 
        (Object.keys(systemHeart).length === 0 && systemHeart.constructor === Object)
    ) {
        const randomIndex = Math.floor(randDecimal() * availableHearts.length);
        systemHeart = availableHearts[randomIndex];
        game.temp.currentSystemHeart = systemHeart; // Store the selected heart
    }

    // 3) render exactly as before
    const shopSlot = document.querySelector('#shop .system-heart-slot');
    shopSlot.innerHTML = '';

    const cardElement = document.createElement('div');
    cardElement.className = 'card system-heart';
    cardElement.textContent = systemHeart.name;
    cardElement.dataset.id   = systemHeart.id;
    cardElement.dataset.cost = game.data.systemHeartCost;

    const costSpan = document.createElement('span');
    costSpan.textContent = game.data.systemHeartCost + ' Credits';
    cardElement.appendChild(costSpan);

    const labelSpan = document.createElement('span');
    labelSpan.textContent = 'SYSTEM HEART';
    cardElement.appendChild(labelSpan);

    const discoveredSpan = document.createElement('span');
    discoveredSpan.classList.add('discovered-status');
    discoveredSpan.textContent = stats.data.discovered.system_hearts.includes(systemHeart.id)
        ? 'Discovered'
        : 'Undiscovered';
    cardElement.appendChild(discoveredSpan);

    cardElement.setAttribute('data-tippy-content', systemHeart.description);
    const tip = tippy(cardElement, { allowHTML: true });
    cardElement._tippyInstance = tip;

    shopSlot.appendChild(cardElement);

    // purchase handler
    cardElement.addEventListener('click', function() {
        const cost = parseInt(this.dataset.cost.replace(/,/g, ''), 10);
        if (game.data.credits >= cost) {
            game.data.credits -= cost;
            applySystemHeart(systemHeart);
            game.systemHearts = game.systemHearts.filter(h => h.id !== systemHeart.id);
            shopSlot.innerHTML = '';
            game.temp.systemHeartAvailable = false;
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
        case 'double_boss_rewards':
            game.data.doubleBossRewards = true;
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
    const currentPackCount = packsContainer.children.length;
    let packsToAdd = Math.max(game.slots.shopPackSlots - currentPackCount, 0);

    const playerRank = stats.data.rank;

    // 1) filter PACK_TYPES by availability based on rank
    const availablePacks = PACK_TYPES.filter(pack => {
        if (pack.name === "Supernova Pack" && playerRank <= 0) return false;
        if (pack.name === "Stardust Pack"  && playerRank <= 1) return false;
        return true; // all others allowed
    });

    // 2) do weighted select from those
    const weightedPool = availablePacks.map(pack => ({
        ...pack,
        weight: pack.weight ?? 1
    }));
    let selectedPacks = weightedSelect(weightedPool, packsToAdd);

    // 3) render each pack just like before
    selectedPacks.forEach(pack => {
        let size = determinePackSize(game.data.packSizeChances);
        let cost = pack.cost + (size === 'big' ? 2 : size === 'giant' ? 4 : 0);

        // special per‑pack tweaks
        if (pack.name === "Armament Pack") pack.cardType  = randFromArray(CARD_TYPES, 1);
        if (pack.name === "Chromatic Pack") pack.cardColor = randFromArray(RAINBOW_ORDER, 1);

        // --- RUNE LOGIC ---
        // DEV: 50% chance for Rune (set to 0.05 for production)
        const runeChance = 0.5; // TODO: Set to 0.05 for production
        const hasRune = randDecimal() < runeChance;
        pack.hasRune = hasRune; // Optionally store for future logic
        // --- END RUNE LOGIC ---

        const el = document.createElement('div');
        el.className = 'pack ' + size;
        el.dataset.packType = pack.name.replace(/\s+/g, '').toLowerCase();
        el.dataset.packSize = size;
        el.dataset.cost = cost;
        if (pack.cardType)  el.dataset.cardType  = pack.cardType;
        if (pack.cardColor) el.dataset.cardColor = pack.cardColor;
        if (hasRune) el.dataset.rune = 'true';

        // display name
        const nameSpan = document.createElement('span');
        nameSpan.textContent = capitalize(size) + ' ';
        if (pack.cardType) {
            nameSpan.textContent += 'Armament ' + prettyName(pack.cardType[0]);
        } else if (pack.cardColor) {
            nameSpan.textContent += 'Chromatic ' + capitalize(pack.cardColor[0]);
        } else {
            nameSpan.textContent += pack.name;
        }
        el.appendChild(nameSpan);

        // cost span
        const costSpan = document.createElement('span');
        costSpan.textContent = cost + ' Credits';
        el.appendChild(costSpan);

        // pool/choose logic
        let poolAmount, chooseAmount;
        switch (pack.name) {
            case "Galactic Pack":
                poolAmount = size === 'standard' ? 10 : size === 'big' ? 15 : 20;
                chooseAmount = size === 'standard' ? 1 : size === 'big' ? 2 : 4;
                break;
            case "Nebula Pack":
                poolAmount = size === 'standard' ? 9 : size === 'big' ? 11 : 14;
                chooseAmount = size === 'standard' ? 1 : size === 'big' ? 2 : 4;
                break;
            case "Stardust Pack":
            case "Supernova Pack":
            case "Special Pack":
            case "Comet Pack":
                poolAmount   = size === 'standard' ? 3 : size === 'big' ? 4 : 5;
                chooseAmount = 1;
                break;
            case "Armament Pack":
            case "Chromatic Pack":
                chooseAmount = size === 'standard' ? 1 : size === 'big' ? 2 : 3;
                poolAmount   = chooseAmount;
                break;
            case "Cosmos Pack":
                poolAmount   = size === 'standard' ? 15 : size === 'big' ? 25 : 35;
                chooseAmount = 1;
                break;
            default:
                poolAmount = chooseAmount = 1;
        }

        // adjust tooltip description
        const desc = pack.description
            .replace(/<span class='choose'>\d+<\/span>/, `<span class='choose'>${chooseAmount}<\/span>`)
            .replace(/<span class='pool'>\d+<\/span>/,   `<span class='pool'>${poolAmount}<\/span>`);
        el.setAttribute('data-tippy-content', desc);
        const tip = tippy(el, { allowHTML: true });
        el._tippyInstance = tip;

        // --- RUNE VISUAL ---
        if (hasRune) {
            const runeDiv = document.createElement('div');
            runeDiv.className = 'rune-keyword';
            runeDiv.textContent = 'Rune';
            el.appendChild(runeDiv);
        }
        // --- END RUNE VISUAL ---

        // click handler
        el.addEventListener('click', () => {
            const price = parseInt(el.dataset.cost.replace(/,/g, ''), 10);
            if (game.data.credits >= price) {
                game.data.creditsOwed = price;
                openPack(el, poolAmount, chooseAmount);
                refreshDom();
            } else {
                message("You cannot afford this pack.");
            }
        });

        packsContainer.appendChild(el);
    });
}

function populateShopLevelUp() {
    const shopLevelUp = document.querySelector('#shop .level-up');
    // Clear any existing slot‐level‐up cards
    shopLevelUp.innerHTML = '';

    const count = game.temp.slotsAvailable;
    if (count > 0) {
        // Create one card per available slot
        for (let i = 0; i < count; i++) {
            const cardElement = document.createElement('div');
            cardElement.className = 'card slot-level-up';
            cardElement.textContent = 'Slot Pack';

            cardElement.addEventListener('click', function() {
                populateSlotCards();
                this.remove();                  // remove just this card
                game.temp.slotsAvailable--;     // decrement the slot count
            });

            shopLevelUp.appendChild(cardElement);
        }
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
    const btn = document.querySelector('#shop .mercenary');

    if (game.data.credits < game.data.mercenary) {
        return message("You cannot afford to visit the mercenary.");
    }

    // Charge cost
    game.data.credits -= game.data.mercenary;

    // 5% chance they turn you down
    if (randDecimal() <= 0.05) {
        btn.classList.add('unavailable');
        message("The mercenary has turned you down.");
        refreshDom();
        return;
    }

    // Otherwise you get XP
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
        clearAmounts();
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
                const el   = createCard(booster, 'booster');
            
                el.addEventListener('click', () => {
                    // 1) Make sure there's a free slot
                    const availableSlot = getAvailableSlot(booster.type);
                    if (!availableSlot) {
                        message(`No available ${booster.type} slots.`);
                        return;  // bail out before closing modal
                    }
            
                    // 2) All good → add it and refresh UI
                    addBoosterToSlots(booster);
                    refreshDom();
            
                    // 3) Close the selection modal
                    const modal = document.getElementById('selection-modal');
                    if (modal) modal.classList.remove('shown');
                });
            
                itemsContainer.appendChild(el);
            });            
            
            break;

        case 'stardustpack':
                // Create a weighted array of rare injectors based on their weights
                selectionCancel.classList.remove('shown');
                let weightedInjectors = [];
                game.injectors.forEach(injector => {
                    if (injector.rarity === "rare") {
                        for (let i = 0; i < injector.weight; i++) {
                            weightedInjectors.push(injector);
                        }
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
    const boostersContainer    = document.querySelector('#shop .boosters');
    const currentBoosterCount  = boostersContainer.children.length;
    const boostersToAdd        = Math.max(game.slots.shopBoosterSlots - currentBoosterCount, 0);
    const playerRank           = stats.data.rank;
    const rarityWeights        = game.data.boosterRarity; 
    const defaultBaseWeight    = 50;

    // 1) filter out owned + lock by rank/rarity
    const availableBoosters = game.boosters.filter(b => {
        if (!game.data.duplicateBoosters && b.owned) return false;
        switch (b.rarity) {
            case 'common':
            case 'uncommon':
                return true;
            case 'rare':
                return playerRank > 0;
            case 'legendary':
                return playerRank > 2;
            default:
                return false;
        }
    });

    // 2) apply rarity multiplier to each booster's weight
    const boostersWithEffectiveWeights = availableBoosters.map(b => {
        const baseW   = b.weight ?? defaultBaseWeight;
        const rarityW = rarityWeights[b.rarity] ?? 1;
        return { 
            ...b, 
            weight: baseW * rarityW 
        };
    });

    // 3) pick N by the new weights
    const selectedBoosters = weightedSelect(boostersWithEffectiveWeights, boostersToAdd);

    // 4) render them
    selectedBoosters.forEach(booster => {
        const el   = createCard(booster, 'booster');
        const cost = parseInt(el.getAttribute('data-cost').replace(/,/g, ''), 10);

        el.addEventListener('click', () => {
            if (game.data.credits >= cost) {
                addBoosterToSlots(booster);
                game.data.credits -= cost;
                refreshDom();
            } else {
                message("Not enough credits to purchase this booster.");
            }
        });

        boostersContainer.appendChild(el);
    });
}

function populateShopInjectors() {
    const injectorsContainer = document.querySelector('#shop .injectors');
    const currentInjectorCount = injectorsContainer.children.length;
    let injectorsToAdd = Math.max(game.slots.shopInjectorSlots - currentInjectorCount, 0);

    const playerRank = stats.data.rank;

    // first filter by rarity lock
    const availableInjectors = game.injectors.filter(injector => {
        switch (injector.rarity) {
            case 'common':
            case 'uncommon':
                return true;
            case 'rare':
                return playerRank > 1;
            case 'legendary':
                return playerRank > 3;
            default:
                return false;
        }
    });

    // build weighted list
    let weightedInjectors = [];
    availableInjectors.forEach(inj => {
        for (let i = 0; i < (inj.weight ?? 50); i++) {
            weightedInjectors.push(inj);
        }
    });

    // shuffle & take first unique
    let shuffled = weightedInjectors.sort(() => 0.5 - randDecimal());
    const selectedInjectors = [];
    const seen = new Set();
    for (let inj of shuffled) {
        if (selectedInjectors.length >= injectorsToAdd) break;
        if (!seen.has(inj.id)) {
            seen.add(inj.id);
            selectedInjectors.push(inj);
        }
    }

    // render
    selectedInjectors.forEach(injector => {
        const el = createCard(injector, 'injector');
        const cost = parseInt(el.getAttribute('data-cost').replace(/,/g, ''), 10);
        el.addEventListener('click', () => {
            if (game.data.credits >= cost) {
                addInjectorToSlots(injector);
                game.data.credits -= cost;
                refreshDom();
            } else {
                message('Not enough credits to purchase this injector.');
            }
        });
        injectorsContainer.appendChild(el);
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
    let containerSelector = '';
    switch (booster.type) {
        case 'bridge':
            boosterCardsArrayName = 'bridgeCards';
            containerSelector = '#bridge-slots';
            break;
        case 'engineering':
            boosterCardsArrayName = 'engineeringCards';
            containerSelector = '#engineering-slots';
            break;
        case 'armory':
            boosterCardsArrayName = 'armoryCards';
            containerSelector = '#armory-slots';
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

    // Determine the correct DOM container and get all slot elements
    const container = document.querySelector(containerSelector);
    if (container) {
        // Get all booster slot elements in their DOM order
        const slotElements = Array.from(container.querySelectorAll('.booster-slot'));
        // Find the first available slot (the one that is not yet boosted)
        const availableSlot = slotElements.find(slot => !slot.hasAttribute('data-boosted') || slot.getAttribute('data-boosted') !== "true");
        const slotIndex = slotElements.indexOf(availableSlot);
        if (slotIndex !== -1) {
            // Insert the booster at the corresponding index in the game.slots array
            game.slots[boosterCardsArrayName].splice(slotIndex, 0, copiedBooster);
        } else {
            // Fallback: if for some reason no slot is found, push it to the end
            game.slots[boosterCardsArrayName].push(copiedBooster);
        }
    } else {
        // Fallback: if the container is not found, push it to the end
        game.slots[boosterCardsArrayName].push(copiedBooster);
    }

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
        clearAmounts();
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

function getDebuffDescription(enemy) {
    return enemy.debuff.map(debuffId => DEBUFFS[debuffId] || "Unknown debuff");
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