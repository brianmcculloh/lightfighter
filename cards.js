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

const COLOR_DAMAGE_SCALE = {red: 1, orange: 2, yellow: 3, green: 4, blue: 5, indigo: 6, violet: 7, white: 8, ultraviolet: 9, black: 10};

const WARM_COLORS = ['red', 'orange', 'yellow', 'green'];
const COOL_COLORS = ['blue', 'indigo', 'violet', 'white'];

const RAINBOW_ORDER = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'ultraviolet', 'black'];

const CARD_TYPES = ['plasma_cell', 'dark_matter', 'quantum_shard', 'gravity_wave', 'nano_swarm'];

const SPECIAL_ATTRIBUTES = ['foil', 'holo', 'sleeve', 'gold_leaf', 'texture'];

const RANKS = [
    { 
        name: 'recruit', 
        description: 'No Special Unlocks' 
    },
    { 
        name: 'private', 
        description: 'Rare Boosters Unlocked' 
    },
    { 
        name: 'specialist', 
        description: 'Rare Injectors Unlocked' 
    },
    { 
        name: 'corporal', 
        description: 'Legendary Boosters Unlocked' 
    },
    { 
        name: 'sergeant', 
        description: 'Legendary Injectors Unlocked' 
    },
    { 
        name: 'lieutenant', 
        description: 'Advanced System Hearts Unlocked' 
    },
    { 
        name: 'captain', 
        description: 'unassigned rank' 
    },
    { 
        name: 'colonel', 
        description: 'unassigned rank' 
    },
    { 
        name: 'general', 
        description: 'unassigned rank' 
    },
    { 
        name: 'commander', 
        description: 'unassigned rank' 
    },
    { 
        name: 'champion', 
        description: 'unassigned rank' 
    },
    { 
        name: 'champion2', 
        description: 'unassigned rank' 
    },
    { 
        name: 'champion3', 
        description: 'unassigned rank' 
    }
];

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
    { name: 'foil', weight: 90, description: "Choose a card to foil", function: 'Multiplies [foil power + card level] to power when drawn' },
    { name: 'holo', weight: 90, description: "Choose a card to hologram", function: 'Multiplies [holo power + card level) to power when played' },
    { name: 'sleeve', weight: 70, description: "Choose a card to sleeve", function: 'Multiplies [sleeve power + card level) to power when held' },
    { name: 'gold_leaf', weight: 40, description: "Choose a card to gold leaf", function: 'Adds [gold credits + card level) to credits when played as part of a combo' },
    { name: 'upgrade', weight: 20, description: "Upgrade all combos one level" },
    { name: 'remove', weight: 15, description: "Choose a card to remove from your arsenal" },
    { name: 'attack', weight: 10, description: "+1 Attack" },
    { name: 'stow', weight: 10, description: "+1 Stow" },
    { name: 'texture', weight: 10, description: "Choose a card to texture", function: 'Level up [texture levels] when played as part of a combo'},
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
    { name: "Supernova Pack", weight: 60, cost: 15, description: "Choose 1 of <span class='pool'>3</span> randomly selected rare boosters." },
    { name: "Armament Pack", weight: 50, cost: 7, cardType: null, description: "For a randomly selected type, choose <span class='choose'>1</span> to add to your arsenal." },
    { name: "Chromatic Pack", weight: 50, cost: 7, cardColor: null, description: "For a randomly selected color, choose <span class='choose'>1</span> to add to your arsenal." },
    { name: "Stardust Pack", weight: 30, cost: 50, description: "Choose 1 of <span class='pool'>3</span> randomly selected rare injectors." },
    { name: "Special Pack", weight: 20, cost: 20, description: "Choose 1 of <span class='pool'>3</span> randomly selected special cards." },
    { name: "Comet Pack", weight: 20, cost: 20, description: "Choose 1 of <span class='pool'>3</span> randomly selected comet cards." },
    { name: "Cosmos Pack", weight: 10, cost: 25, description: "Choose 1 of <span class='pool'>10</span> randomly selected cards from your arsenal to duplicate." },
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
    {id: 'restocks', name: 'Discount Restocks', description: 'The cost of hangar restocks no longer increases.', rank: 5},
    {id: 'chances', name: 'Double Chances', description: 'All booster chances are doubled.', rank: 5},
    {id: 'specials', name: 'Double Specials', description: 'Foil, Holo, Sleeve, Gold Leaf, and Texture card effects are doubled.', rank: 5},
    {id: 'improves', name: 'Double Improves', description: 'Booster improve amounts are doubled.', rank: 5},
    {id: 'rares', name: 'Increased Rares', description: 'Chance of seeing rare boosters or experiencing rare events is increased.', rank: 5},
    {id: 'packs', name: 'Pack Size', description: 'Chance of seeing big and giant pack sizes is increased.', rank: 5},
    {id: 'duplicates', name: 'Duplicate Boosters', description: 'You can now have multiple copies of the same booster activated.', rank: 5},
    {id: 'max_wavelengths', name: 'Max Wavelength Damage', description: 'All cards now have the same base damage as black cards (10).'},
    {id: 'booster_sellbacks', name: 'Booster Sellbacks', description: 'Whenever you destroy a booster, receive a full refund.'},
];

let INJECTORS = [

    // COMMON
    {id: 'add_damage_2000', type: 'injector', rarity: 'common', damage: 1000, weight: 90, description: '+1000 damage'},
    {id: 'add_damage_4000', type: 'injector', rarity: 'common', damage: 2000, weight: 85, description: '+2000 damage'},
    {id: 'add_damage_6000', type: 'injector', rarity: 'common', damage: 3000, weight: 80, description: '+3000 damage'},
    {id: 'add_damage_8000', type: 'injector', rarity: 'common', damage: 4000, weight: 75, description: '+4000 damage'},
    {id: 'add_power_2000', type: 'injector', rarity: 'common', power: 1000, weight: 90, description: '+1000 power'},
    {id: 'add_power_4000', type: 'injector', rarity: 'common', power: 2000, weight: 85, description: '+2000 power'},
    {id: 'add_power_6000', type: 'injector', rarity: 'common', power: 3000, weight: 80, description: '+3000 power'},
    {id: 'add_power_8000', type: 'injector', rarity: 'common', power: 4000, weight: 75, description: '+4000 power'},
    {id: 'multiply_damage_2', type: 'injector', rarity: 'common', damage: 2, weight: 90, multiplicative: true, description: 'x2 damage'},
    {id: 'multiply_damage_4', type: 'injector', rarity: 'common', damage: 3, weight: 85, multiplicative: true, description: 'x3 damage'},
    {id: 'multiply_damage_6', type: 'injector', rarity: 'common', damage: 4, weight: 80, multiplicative: true, description: 'x4 damage'},
    {id: 'multiply_damage_8', type: 'injector', rarity: 'common', damage: 5, weight: 75, multiplicative: true, description: 'x5 damage'},
    {id: 'multiply_power_2', type: 'injector', rarity: 'common', power: 2, weight: 90, multiplicative: true, description: 'x2 power'},
    {id: 'multiply_power_4', type: 'injector', rarity: 'common', power: 3, weight: 85, multiplicative: true, description: 'x3 power'},
    {id: 'multiply_power_6', type: 'injector', rarity: 'common', power: 4, weight: 80, multiplicative: true, description: 'x4 power'},
    {id: 'multiply_power_8', type: 'injector', rarity: 'common', power: 5, weight: 75, multiplicative: true, description: 'x5 power'},

    // UNCOMMON
    {id: 'multiply_power_25', type: 'injector', rarity: 'common', power: 10, weight: 50, multiplicative: true, description: 'x10 power'},
    {id: 'multiply_power_35', type: 'injector', rarity: 'common', power: 20, weight: 45, multiplicative: true, description: 'x20 power'},
    {id: 'multiply_power_45', type: 'injector', rarity: 'common', power: 30, weight: 40, multiplicative: true, description: 'x30 power'},
    {id: 'multiply_power_55', type: 'injector', rarity: 'common', power: 40, weight: 35, multiplicative: true, description: 'x40 power'},
    {id: 'add_pierce_100', type: 'injector', rarity: 'uncommon', pierce: 100, weight: 50, description: '+100 pierce'},
    {id: 'add_pierce_200', type: 'injector', rarity: 'uncommon', pierce: 200, weight: 45, description: '+200 pierce'},
    {id: 'add_pierce_300', type: 'injector', rarity: 'uncommon', pierce: 300, weight: 40, description: '+300 pierce'},
    {id: 'add_pierce_400', type: 'injector', rarity: 'uncommon', pierce: 400, weight: 35, description: '+400 pierce'},
    {id: 'add_damage_power_5000', type: 'injector', rarity: 'uncommon', damage: 1000, power: 1000, weight: 30, description: '+1000 damage and power'},
    {id: 'add_damage_power_6000', type: 'injector', rarity: 'uncommon', damage: 2000, power: 2000, weight: 30, description: '+2000 damage and power'},
    {id: 'add_damage_power_7000', type: 'injector', rarity: 'uncommon', damage: 3000, power: 3000, weight: 30, description: '+3000 damage and power'},
    {id: 'add_damage_power_8000', type: 'injector', rarity: 'uncommon', damage: 4000, power: 4000, weight: 30, description: '+4000 damage and power'},

    // RARE
    {id: 'multiply_pierce_30', type: 'injector', rarity: 'rare', pierce: 10, weight: 25, multiplicative: true, description: 'x10 pierce'},
    {id: 'multiply_pierce_40', type: 'injector', rarity: 'rare', pierce: 20, weight: 25, multiplicative: true, description: 'x20 pierce'},
    {id: 'multiply_pierce_50', type: 'injector', rarity: 'rare', pierce: 30, weight: 25, multiplicative: true, description: 'x30 pierce'},
    {id: 'add_spread_1.5', type: 'injector', rarity: 'rare', spread: 1, weight: 10, description: '+1 spread'},
    {id: 'add_spread_2', type: 'injector', rarity: 'rare', spread: 1.5, weight: 10, description: '+1.5 spread'},
    {id: 'add_spread_2.5', type: 'injector', rarity: 'rare', spread: 2, weight: 10, description: '+2 spread'},
    {id: 'multiply_pierce_300', type: 'injector', rarity: 'rare', pierce: 50, weight: 9, multiplicative: true, description: 'x50 pierce'},
    {id: 'multiply_pierce_400', type: 'injector', rarity: 'rare', pierce: 60, weight: 9, multiplicative: true, description: 'x60 pierce'},
    {id: 'multiply_pierce_500', type: 'injector', rarity: 'rare', pierce: 70, weight: 9, multiplicative: true, description: 'x70 pierce'},
    {id: 'add_spread_15', type: 'injector', rarity: 'rare', spread: 10, weight: 4, description: '+10 spread'},
    {id: 'add_spread_20', type: 'injector', rarity: 'rare', spread: 15, weight: 3, description: '+15 spread'},
    {id: 'add_spread_25', type: 'injector', rarity: 'rare', spread: 20, weight: 2, description: '+20 spread'},
    {id: 'multiply_spread_1.5', type: 'injector', rarity: 'rare', spread: 1.2, weight: 5, multiplicative: true, description: 'x1.2 spread'},
    {id: 'multiply_spread_2', type: 'injector', rarity: 'rare', spread: 1.5, weight: 4, multiplicative: true, description: 'x1.5 spread'},
    {id: 'multiply_spread_2.5', type: 'injector', rarity: 'rare', spread: 1.8, weight: 3, multiplicative: true, description: 'x1.8 spread'},
    {id: 'multiply_damage_power_500', type: 'injector', rarity: 'rare', damage: 100, power: 100, weight: 3, multiplicative: true, description: 'x100 damage and power'},
    {id: 'multiply_damage_power_600', type: 'injector', rarity: 'rare', damage: 200, power: 200, weight: 3, multiplicative: true, description: 'x200 damage and power'},
    {id: 'multiply_damage_power_700', type: 'injector', rarity: 'rare', damage: 300, power: 300, weight: 3, multiplicative: true, description: 'x300 damage and power'},
    {id: 'multiply_damage_power_800', type: 'injector', rarity: 'rare', damage: 400, power: 400, weight: 3, multiplicative: true, description: 'x400 damage and power'},

    // LEGENDARY
    {id: 'multiply_damage_1000000', type: 'injector', rarity: 'legendary', damage: 100000, weight: 1, multiplicative: true, description: 'x100000 damage'},
    {id: 'multiply_power_100000', type: 'injector', rarity: 'legendary', power: 10000, weight: 1, multiplicative: true, description: 'x10000 power'},
    {id: 'multiply_pierce_10000', type: 'injector', rarity: 'legendary', pierce: 1000, weight: 1, multiplicative: true, description: 'x1000 pierce'},
    {id: 'add_spread_100', type: 'injector', rarity: 'legendary', spread: 100, weight: 1, description: '+100 spread'},
    {id: 'multiply_spread_25', type: 'injector', rarity: 'legendary', spread: 10, weight: 1, multiplicative: true, description: 'x10 spread'},
    {id: 'add_all', type: 'injector', rarity: 'legendary', damage: 2000, power: 200, pierce: 20, spread: 2, weight: 1, description: '+2000 damage, +200 power, +20 pierce, +2 spread'},
    {id: 'multiply_all', type: 'injector', rarity: 'legendary', damage: 50, power: 50, pierce: 50, spread: 1.5, weight: 1, multiplicative: true, description: 'x50 damage, x50 power, x50 pierce, x1.5 spread'},
];

const DEBUFFS = {
    minus_1_attack: "Minus one attack",                  
    minus_1_stow: "Minus one stow",                 
    disable_bridge_booster: "One random Bridge booster disabled",            
    disable_engineering_booster: "One random Engineering booster disabled",
    disable_armory_booster: "One random Armory booster disabled",            
    disable_random_booster: "One random booster disabled",        
    no_spectrum_bonus: "Spectrum bonus disabled",              
    minimum_wavelengths: "All card wavelength damage values set to minimum",
    injectors_disabled: "Injectors disabled",                
    time_shifts_disabled: "Time shifts disabled",                
    combos_ignored: "Bonus damage from combos ignored",                   
    attacks_require_stowed_combo: "Cannot attack until at least one combo is stowed",       
    disable_boosters_until_0_stows: "All boosters disabled until 0 stows are left",   
    disable_boosters_until_1_attack: "All boosters disabled until 1 attack is left",  
    disable_red_cards: "Red cards are disabled",                   
    disable_orange_cards: "Orange cards are disabled",                
    disable_yellow_cards: "Yellow cards are disabled",                  
    disable_green_cards: "Green cards are disabled",                   
    disable_blue_cards: "Blue cards are disabled",                    
    disable_indigo_cards: "Indigo cards are disabled",                  
    disable_violet_cards: "Violet cards are disabled",                  
    disable_white_cards: "White cards are disabled",                   
    disable_ultraviolet_cards: "Ultraviolet cards are disabled",             
    disable_black_cards: "Black cards are disabled",                   
    disable_plasma_cell_cards: "Plasma Cell cards are disabled",             
    disable_dark_matter_cards: "Dark Matter cards are disabled",             
    disable_quantum_shard_cards: "Quantum Shard cards are disabled",           
    disable_gravity_wave_cards: "Gravity Wave cards are disabled",            
    disable_nano_swarm_cards: "Nano Swarm cards are disabled",              
    disable_multiplicative_boosters: "Multiplicative boosters are disabled",       
    disable_additive_boosters: "Additive boosters are disabled",             
    disable_self_improving_boosters: "Self-Improving boosters are disabled",       
    disable_common_boosters: "Common boosters are disabled",               
    disable_uncommon_boosters: "Uncommon boosters are disabled",             
    disable_rare_boosters: "Rare boosters are disabled",                 
    disable_legendary_boosters: "Legendary boosters are disabled",            
    disable_retriggering_boosters: "Boosters that retrigger other boosters are disabled",         
    disable_damage_boosters: "Damage boosters are disabled",               
    disable_power_boosters: "Power boosters are disabled",                
    disable_pierce_boosters: "Pierce boosters are disabled",               
    disable_spread_boosters: "Spread boosters are disabled",               
    disable_credits_boosters: "Credits boosters are disabled",              
    disable_xp_boosters: "XP boosters are disabled",                   
    card_levels_nerfed: "All cards are considered level 1"                    
};

export { ALL_CARDS, COLOR_DAMAGE_SCALE, WARM_COLORS, COOL_COLORS, RAINBOW_ORDER, CARD_TYPES, RANKS, SPECIAL_ATTRIBUTES, ARCHETYPES, SPECIAL_CARDS, COMET_CARDS, PACK_TYPES, SYSTEMHEARTS, INJECTORS, DEBUFFS };