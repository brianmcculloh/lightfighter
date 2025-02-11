const ALL_CARDS = [

    {type: 'plasma_cell', name: 'Plasma Cell', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},

    {type: 'dark_matter', name: 'Dark Matter', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},

    {type: 'quantum_shard', name: 'Quantum Shard', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},

    {type: 'gravity_wave', name: 'Gravity Wave', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},

    {type: 'nano_swarm', name: 'Nano Swarm', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false, drawn: false, epic: false, legendary: false, mythical: false},

];

const COLOR_DAMAGE_SCALE = {red: 10, orange: 11, yellow: 12, green: 13, blue: 14, indigo: 15, violet: 16, white: 17, ultraviolet: 18, black: 19};

const WARM_COLORS = ['red', 'orange', 'yellow', 'green'];
const COOL_COLORS = ['blue', 'indigo', 'violet', 'white'];

const RAINBOW_ORDER = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'ultraviolet', 'black'];

const CARD_TYPES = ['plasma_cell', 'dark_matter', 'quantum_shard', 'gravity_wave', 'nano_swarm'];

const SPECIAL_ATTRIBUTES = ['foil', 'holo', 'sleeve', 'gold_leaf', 'texture'];

const ARCHETYPES = {
    red: 'Pierce', 
    orange: 'Credits', 
    yellow: 'XP', 
    green: 'Upgrade Card',
    blue: 'Power', 
    indigo: 'Upgrade Combo', 
    violet: 'Special', 
    white: 'Retrigger/Multi', 
    ultraviolet: 'Meta', 
    black: 'Spread', 
    plasma_cell: 'Foil', 
    dark_matter: 'Holo', 
    quantum_shard: 'Sleeve', 
    gravity_wave: 'Gold Leaf', 
    nano_swarm: 'Texture'
};

const SPECIAL_CARDS = [
    { name: 'foil', weight: 90, description: "Choose a card to foil" },
    { name: 'holo', weight: 90, description: "Choose a card to hologram" },
    { name: 'sleeve', weight: 70, description: "Choose a card to sleeve" },
    { name: 'gold_leaf', weight: 40, description: "Choose a card to gold leaf" },
    { name: 'upgrade', weight: 20, description: "Upgrade all combos one level" },
    { name: 'remove', weight: 15, description: "Choose a card to remove from your arsenal" },
    { name: 'attack', weight: 10, description: "+1 Attack" },
    { name: 'stow', weight: 10, description: "+1 Stow" },
    { name: 'texture', weight: 10, description: "Choose a card to texture" },
];

const COMET_CARDS = [
    { name: 'plasma_cell', weight: 30 },
    { name: 'dark_matter', weight: 30 },
    { name: 'quantum_shard', weight: 30 },
    { name: 'gravity_wave', weight: 30 },
    { name: 'nano_swarm', weight: 30 },
    { name: 'red', weight: 60 },
    { name: 'orange', weight: 60 },
    { name: 'yellow', weight: 60 },
    { name: 'green', weight: 60 },
    { name: 'blue', weight: 60 },
    { name: 'indigo', weight: 60 },
    { name: 'violet', weight: 60 },
    { name: 'white', weight: 60 },
    { name: 'ultraviolet', weight: 60 },
    { name: 'black', weight: 60 },
];

const PACK_TYPES = [
    { name: "Galactic Pack", weight: 60, cost: 5, description: "Choose <span class='choose'>1</span> of <span class='pool'>10</span> randomly selected cards from your arsenal to upgrade." },
    { name: "Nebula Pack", weight: 60, cost: 5, description: "Choose <span class='choose'>1</span> of <span class='pool'>10</span> randomly selected combos to upgrade." },
    { name: "Stardust Pack", weight: 60, cost: 5, description: "Choose 1 of <span class='pool'>3</span> randomly selected injectors." },
    { name: "Supernova Pack", weight: 60, cost: 10, description: "Choose 1 of <span class='pool'>3</span> randomly selected rare boosters." },
    { name: "Armament Pack", weight: 50, cost: 5, cardType: null, description: "For a randomly selected type, choose <span class='choose'>1</span> to add to your arsenal." },
    { name: "Chromatic Pack", weight: 50, cost: 5, cardColor: null, description: "For a randomly selected color, choose <span class='choose'>1</span> to add to your arsenal." },
    { name: "Special Pack", weight: 15, cost: 11, description: "Choose 1 of <span class='pool'>3</span> randomly selected special cards." },
    { name: "Comet Pack", weight: 15, cost: 12, description: "Choose 1 of <span class='pool'>3</span> randomly selected comet cards." },
    { name: "Cosmos Pack", weight: 10, cost: 15, description: "Choose 1 of <span class='pool'>10</span> randomly selected cards from your arsenal to duplicate." },
];

let SYSTEMHEARTS = [
    {id: 'attack', name: '+1 Attack', description: 'Increase the number of times you can attack per combat by one.'},
    {id: 'attack', name: '+1 Attack', description: 'Increase the number of times you can attack per combat by one.'},
    {id: 'stow', name: '+1 Stow', description: 'Increase the number of times you can stow per combat by one.'},
    {id: 'stow', name: '+1 Stow', description: 'Increase the number of times you can stow per combat by one.'},
    {id: 'injector', name: '+1 Injector Slot', description: 'Increase the number of injectors you can have by one.'},
    {id: 'injector', name: '+1 Injector Slot', description: 'Increase the number of injectors you can have by one.'},
    {id: 'time_warp', name: '+2 Time Warps', description: 'Receive two additional Time Warps.'},
    {id: 'time_warp', name: '+2 Time Warps', description: 'Receive two additional Time Warps.'},
    {id: 'hand_size', name: '+1 Hand Size', description: 'Increase the number of cards you draw each hand by one.'},
    {id: 'hand_size', name: '+1 Hand Size', description: 'Increase the number of cards you draw each hand by one.'},
    {id: 'shop', name: 'Enhanced Hangar', description: 'Hangars contain two extra Boosters and one extra pack for sale.'},
    {id: 'shop', name: 'Enhanced Hanger', description: 'Hangars contain two extra Boosters and one extra pack for sale.'},
    {id: 'credits', name: '+25% Credits Earned', description: 'Whenever you gain credits, gain 25% more.'},
    {id: 'credits', name: '+25% Credits Earned', description: 'Whenever you gain credits, gain 25% more.'},
    {id: 'xp', name: '+25% XP Earned', description: 'Whenever you gain XP, gain 25% more.'},
    {id: 'xp', name: '+25% XP Earned', description: 'Whenever you gain XP, gain 25% more.'},
    {id: 'removals', name: '+1 Card Removal', description: 'Whenever you remove cards from your arsenal, you can remove one additional card.'},
    {id: 'removals', name: '+1 Card Removal', description: 'Whenever you remove cards from your arsenal, you can remove one additional card.'},
    {id: 'restocks', name: 'Discount Restocks', description: 'The cost of hangar restocks no longer increases.'},
    {id: 'chances', name: 'Double Chances', description: 'All booster chances are doubled.'},
    {id: 'specials', name: 'Double Specials', description: 'Foil, Holo, Sleeve, Gold Leaf, and Texture card effects are doubled.'},
    {id: 'improves', name: 'Double Improves', description: 'Booster improve amounts are doubled.'},
    {id: 'rares', name: 'Increased Rares', description: 'Chance of seeing rare boosters or experiencing rare events is increased.'},
    {id: 'packs', name: 'Pack Size', description: 'Chance of seeing big and giant pack sizes is increased.'},
    {id: 'duplicates', name: 'Duplicate Boosters', description: 'You can now have multiple copies of the same booster activated.'},
    {id: 'max_wavelengths', name: 'Max Wavelength Damage', description: 'All cards now have the same base damage as black cards (19).'},
    {id: 'booster_sellbacks', name: 'Booster Sellbacks', description: 'Whenever you destroy a booster, receive a full refund.'},
];

let INJECTORS = [

    // COMMON
    {id: 'add_damage_2000', type: 'injector', rarity: 'common', damage: 2000, weight: 90, description: '+2000 damage'},
    {id: 'add_damage_4000', type: 'injector', rarity: 'common', damage: 4000, weight: 85, description: '+4000 damage'},
    {id: 'add_damage_6000', type: 'injector', rarity: 'common', damage: 6000, weight: 80, description: '+6000 damage'},
    {id: 'add_damage_8000', type: 'injector', rarity: 'common', damage: 8000, weight: 75, description: '+8000 damage'},
    {id: 'add_power_2000', type: 'injector', rarity: 'common', power: 2000, weight: 90, description: '+1000 power'},
    {id: 'add_power_4000', type: 'injector', rarity: 'common', power: 4000, weight: 85, description: '+2000 power'},
    {id: 'add_power_6000', type: 'injector', rarity: 'common', power: 6000, weight: 80, description: '+3000 power'},
    {id: 'add_power_8000', type: 'injector', rarity: 'common', power: 8000, weight: 75, description: '+4000 power'},
    {id: 'multiply_damage_2', type: 'injector', rarity: 'common', damage: 2, weight: 90, multiplicative: true, description: 'x2 damage'},
    {id: 'multiply_damage_4', type: 'injector', rarity: 'common', damage: 4, weight: 85, multiplicative: true, description: 'x4 damage'},
    {id: 'multiply_damage_6', type: 'injector', rarity: 'common', damage: 6, weight: 80, multiplicative: true, description: 'x6 damage'},
    {id: 'multiply_damage_8', type: 'injector', rarity: 'common', damage: 8, weight: 75, multiplicative: true, description: 'x8 damage'},
    {id: 'multiply_power_2', type: 'injector', rarity: 'common', power: 2, weight: 90, multiplicative: true, description: 'x2 power'},
    {id: 'multiply_power_4', type: 'injector', rarity: 'common', power: 4, weight: 85, multiplicative: true, description: 'x4 power'},
    {id: 'multiply_power_6', type: 'injector', rarity: 'common', power: 6, weight: 80, multiplicative: true, description: 'x6 power'},
    {id: 'multiply_power_8', type: 'injector', rarity: 'common', power: 8, weight: 75, multiplicative: true, description: 'x8 power'},

    // UNCOMMON
    {id: 'multiply_power_25', type: 'injector', rarity: 'common', power: 25, weight: 50, multiplicative: true, description: 'x25 power'},
    {id: 'multiply_power_35', type: 'injector', rarity: 'common', power: 35, weight: 45, multiplicative: true, description: 'x35 power'},
    {id: 'multiply_power_45', type: 'injector', rarity: 'common', power: 45, weight: 40, multiplicative: true, description: 'x45 power'},
    {id: 'multiply_power_55', type: 'injector', rarity: 'common', power: 55, weight: 35, multiplicative: true, description: 'x55 power'},
    {id: 'add_pierce_100', type: 'injector', rarity: 'uncommon', pierce: 100, weight: 50, description: '+100 pierce'},
    {id: 'add_pierce_200', type: 'injector', rarity: 'uncommon', pierce: 200, weight: 45, description: '+200 pierce'},
    {id: 'add_pierce_300', type: 'injector', rarity: 'uncommon', pierce: 300, weight: 40, description: '+300 pierce'},
    {id: 'add_pierce_400', type: 'injector', rarity: 'uncommon', pierce: 400, weight: 35, description: '+400 pierce'},
    {id: 'add_damage_power_5000', type: 'injector', rarity: 'uncommon', damage: 5000, power: 5000, weight: 30, description: '+5000 damage and power'},
    {id: 'add_damage_power_6000', type: 'injector', rarity: 'uncommon', damage: 6000, power: 6000, weight: 30, description: '+6000 damage and power'},
    {id: 'add_damage_power_7000', type: 'injector', rarity: 'uncommon', damage: 7000, power: 7000, weight: 30, description: '+7000 damage and power'},
    {id: 'add_damage_power_8000', type: 'injector', rarity: 'uncommon', damage: 8000, power: 8000, weight: 30, description: '+8000 damage and power'},

    // RARE
    {id: 'multiply_pierce_30', type: 'injector', rarity: 'rare', pierce: 30, weight: 25, multiplicative: true, description: 'x30 pierce'},
    {id: 'multiply_pierce_40', type: 'injector', rarity: 'rare', pierce: 40, weight: 25, multiplicative: true, description: 'x40 pierce'},
    {id: 'multiply_pierce_50', type: 'injector', rarity: 'rare', pierce: 50, weight: 25, multiplicative: true, description: 'x50 pierce'},
    {id: 'add_spread_1.5', type: 'injector', rarity: 'rare', spread: 1.5, weight: 10, description: '+1.5 spread'},
    {id: 'add_spread_2', type: 'injector', rarity: 'rare', spread: 2, weight: 10, description: '+2 spread'},
    {id: 'add_spread_2.5', type: 'injector', rarity: 'rare', spread: 2.5, weight: 10, description: '+2.5 spread'},
    {id: 'multiply_pierce_300', type: 'injector', rarity: 'rare', pierce: 300, weight: 9, multiplicative: true, description: 'x300 pierce'},
    {id: 'multiply_pierce_400', type: 'injector', rarity: 'rare', pierce: 400, weight: 9, multiplicative: true, description: 'x400 pierce'},
    {id: 'multiply_pierce_500', type: 'injector', rarity: 'rare', pierce: 500, weight: 9, multiplicative: true, description: 'x500 pierce'},
    {id: 'add_spread_15', type: 'injector', rarity: 'rare', spread: 15, weight: 4, description: '+15 spread'},
    {id: 'add_spread_20', type: 'injector', rarity: 'rare', spread: 20, weight: 3, description: '+20 spread'},
    {id: 'add_spread_25', type: 'injector', rarity: 'rare', spread: 25, weight: 2, description: '+25 spread'},
    {id: 'multiply_spread_1.5', type: 'injector', rarity: 'rare', spread: 1.5, weight: 5, multiplicative: true, description: 'x1.5 spread'},
    {id: 'multiply_spread_2', type: 'injector', rarity: 'rare', spread: 2, weight: 4, multiplicative: true, description: 'x2 spread'},
    {id: 'multiply_spread_2.5', type: 'injector', rarity: 'rare', spread: 2.5, weight: 3, multiplicative: true, description: 'x2.5 spread'},
    {id: 'multiply_damage_power_500', type: 'injector', rarity: 'uncommon', damage: 500, power: 500, weight: 3, multiplicative: true, description: 'x500 damage and power'},
    {id: 'multiply_damage_power_600', type: 'injector', rarity: 'uncommon', damage: 600, power: 600, weight: 3, multiplicative: true, description: 'x600 damage and power'},
    {id: 'multiply_damage_power_700', type: 'injector', rarity: 'uncommon', damage: 700, power: 700, weight: 3, multiplicative: true, description: 'x700 damage and power'},
    {id: 'multiply_damage_power_800', type: 'injector', rarity: 'uncommon', damage: 800, power: 800, weight: 3, multiplicative: true, description: 'x800 damage and power'},

    // LEGENDARY
    {id: 'multiply_damage_1000000', type: 'injector', rarity: 'legendary', damage: 1000000, weight: 1, multiplicative: true, description: 'x1000000 damage'},
    {id: 'multiply_power_100000', type: 'injector', rarity: 'legendary', power: 100000, weight: 1, multiplicative: true, description: 'x100000 power'},
    {id: 'multiply_pierce_10000', type: 'injector', rarity: 'legendary', pierce: 10000, weight: 1, multiplicative: true, description: 'x10000 pierce'},
    {id: 'add_spread_100', type: 'injector', rarity: 'legendary', spread: 100, weight: 1, description: '+100 spread'},
    {id: 'multiply_spread_25', type: 'injector', rarity: 'legendary', spread: 25, weight: 1, multiplicative: true, description: 'x25 spread'},
    {id: 'add_all', type: 'injector', rarity: 'legendary', damage: 10000, power: 1000, pierce: 100, spread: 10, weight: 1, description: '+10000 damage, +1000 power, +100 pierce, +10 spread'},
    {id: 'multiply_all', type: 'injector', rarity: 'legendary', damage: 1000, power: 100, pierce: 10, spread: 1.5, weight: 1, multiplicative: true, description: 'x1000 damage, x100 power, x10 pierce, x1.5 spread'},
];

export { ALL_CARDS, COLOR_DAMAGE_SCALE, WARM_COLORS, COOL_COLORS, RAINBOW_ORDER, CARD_TYPES, SPECIAL_ATTRIBUTES, ARCHETYPES, SPECIAL_CARDS, COMET_CARDS, PACK_TYPES, SYSTEMHEARTS, INJECTORS };