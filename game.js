import { ALL_BOOSTERS } from './boosters.js';
import { ALL_CARDS, INJECTORS, SYSTEMHEARTS } from './cards.js';

// Make deep clones of your imported arrays so you don't accidentally mutate them.
const cardsClone = JSON.parse(JSON.stringify(ALL_CARDS));
const boostersClone = JSON.parse(JSON.stringify(ALL_BOOSTERS));
const injectorsClone = JSON.parse(JSON.stringify(INJECTORS));
const systemHeartsClone = JSON.parse(JSON.stringify(SYSTEMHEARTS));

// Define your config, data, slots, etc. as plain objects
const config = {
  version: '0.1.0 Alpha',
  seed: false,
  debug: false,
  stowDelay: 100,
  cardDelay: 300,
  boosterDelay: 300,
  improveDelay: 300,
  triggerDelay: 300,
  multiplyDelay: 300,
  destroyDelay: 500,
  animationDecrementFactor: 0.9,
  animationMinimum: 60,
  animationSpeed: 'fast',  // 'slow', 'fast', 'instant'
  animationMomentum: true,
};

const data = {
  level: 1,
  xp: 0,
  xpThreshold: 100,
  spread: 1,
  credits: 0,
  mercenary: 5,
  restock: 5,
  systemHeartCost: 20,
  restockFixed: false,
  duplicateBoosters: false,
  maxWavelengths: false,
  boosterSellbacks: false,
  class: 0,
  system: 1,
  lives: 1,
  creditsMultiplier: 1,
  xpMultiplier: 1,
  enemyPool: 1,
  handSize: 7,
  attacksTotal: 3,
  attacksRemaining: 3,
  stowsTotal: 3,
  stowsRemaining: 3,
  foilPower: 2,
  holoPower: 2,
  sleevePower: 2,
  goldCredits: 5,
  textureLevels: 1,
  removals: 1,
  converts: 6,
  systemHearts: [],
  boosterRarity: {
    common: 5.5,
    uncommon: 3.4,
    rare: 1.0,
    legendary: 0.1
  },
  boosterCost: 5,
  boosterCostMultiplier: {
    common: 1,
    uncommon: 1.5,
    rare: 3,
    legendary: 10
  },
  injectorCost: 5,
  injectorCostMultiplier: {
    common: 1,
    uncommon: 1.5,
    rare: 3,
    legendary: 5
  },
  specialWeights: {
    foil: 2,
    holo: 2,
    sleeve: 1.5,
    gold_credits: 0.5,
    texture: 0.1
  },
  packSizeChances: {
    standard: 0.7,
    big: 0.2,
    giant: 0.1
  },
  chanceMultiplier: 1,
  specialMultiplier: 1,
  improveMultiplier: 1,
  creditsOwed: 0,
};

const slots = {
  gunSlots: 5,
  bridgeSlots: 2,
  bridgeCards: [],
  engineeringSlots: 2,
  engineeringCards: [],
  armorySlots: 2,
  armoryCards: [],
  injectorSlots: 1,
  injectorCards: [],
  shopBoosterSlots: 4,
  shopPackSlots: 2,
  shopInjectorSlots: 2,
};

const arsenal = [];

const temp = {
  gunCards: [],
  handCards: [],
  scoringCards: [],
  stowCards: [],
  currentEnemy: {},
  multiplierMapping: {},
  cumulativeDamage: 0,
  shopLevelUp: false,
  damage: 0,
  power: 1,
  pierce: 1,
  spread: 1,
  persistentDamage: 0,
  persistentPower: 0,
  dynamicPower: 0,
  persistentPierce: 0,
  persistentSpread: 0,
  currentContext: 'overworld', // overworld, hangar, combat, etc.
};

const comboTypeLevels = {
  biArmament: { level: 1, baseDamage: 20, played: 0 },
  biChromatic: { level: 1, baseDamage: 40, played: 0 },
  biChromaticArmament: { level: 1, baseDamage: 100, played: 0 },
  triArmament: { level: 1, baseDamage: 80, played: 0 },
  triChromatic: { level: 1, baseDamage: 150, played: 0 },
  triChromaticArmament: { level: 1, baseDamage: 400, played: 0 },
  chargedArmament: { level: 1, baseDamage: 200, played: 0 },
  chargedChromatic: { level: 1, baseDamage: 300, played: 0 },
  chargedChromaticArmament: { level: 1, baseDamage: 700, played: 0 },
  quadArmament: { level: 1, baseDamage: 500, played: 0 },
  quadChromatic: { level: 1, baseDamage: 800, played: 0 },
  quadChromaticArmament: { level: 1, baseDamage: 2000, played: 0 },
  fullArmament: { level: 1, baseDamage: 3000, played: 0 },
  fullChromatic: { level: 1, baseDamage: 6000, played: 0 },
  fullSpectrum: { level: 1, baseDamage: 8000, played: 0 },
  fullChromaticArmament: { level: 1, baseDamage: 10000, played: 0 },
  fullSpectrumArmament: { level: 1, baseDamage: 12000, played: 0 },
};

// This is our single shared game object:
const game = {
  config,
  data,
  slots,
  arsenal,
  cards: cardsClone,
  boosters: boostersClone,
  injectors: injectorsClone,
  systemHearts: systemHeartsClone,
  temp,
  comboTypeLevels,
};

export default game;
