const ALL_CARDS = [

    {type: 'plasma_cell', name: 'Plasma Cell', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'plasma_cell', name: 'Plasma Cell', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},

    {type: 'dark_matter', name: 'Dark Matter', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'dark_matter', name: 'Dark Matter', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},

    {type: 'quantum_shard', name: 'Quantum Shard', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'quantum_shard', name: 'Quantum Shard', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},

    {type: 'gravity_wave', name: 'Gravity Wave', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'gravity_wave', name: 'Gravity Wave', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},

    {type: 'nano_swarm', name: 'Nano Swarm', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'nano_swarm', name: 'Nano Swarm', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},

    /*
    {type: 'photon_beam', name: 'Photon Beam', color: 'red', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'orange', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'yellow', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'green', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'blue', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'indigo', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'violet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'white', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'ultraviolet', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    {type: 'photon_beam', name: 'Photon Beam', color: 'black', level: 1, foil: false, holo: false, sleeve: false, gold_leaf: false, texture: false},
    */

];

const COLOR_DAMAGE_SCALE = {
    red: 1,
    orange: 2,
    yellow: 3,
    green: 4,
    blue: 5,
    indigo: 6,
    violet: 7,
    white: 8,
    ultraviolet: 9,
    black: 10
};

const WARM_COLORS = ['red', 'orange', 'yellow', 'green'];
const COOL_COLORS = ['blue', 'indigo', 'violet', 'white'];

const RAINBOW_ORDER = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'ultraviolet', 'black'];

const CARD_TYPES = ['plasma_cell', 'dark_matter', 'quantum_shard', 'gravity_wave', 'nano_swarm'];

const SPECIAL_CARDS = [
    { name: 'foil', weight: 90 },
    { name: 'holo', weight: 60 },
    { name: 'sleeve', weight: 40 },
    { name: 'gold_leaf', weight: 30 },
    { name: 'texture', weight: 30 },
    { name: 'remove', weight: 20 },
    { name: 'attack', weight: 5 },
    { name: 'discard', weight: 5 },
    { name: 'booster', weight: 5 }
];

// Export both ALL_CARDS and COLOR_DAMAGE_SCALE
export { ALL_CARDS, COLOR_DAMAGE_SCALE, WARM_COLORS, COOL_COLORS, RAINBOW_ORDER, CARD_TYPES, SPECIAL_CARDS };