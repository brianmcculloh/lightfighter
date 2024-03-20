export default function Game() {

    let version = '0.01 Alpha';
    let seed = false;
    let credits = 20;
    let floor = 0;
    let system = 1;
    let lives = 1;
    let handSize = 8;
    let handCards = [];
    let gunSlots = 5;
    let gunCards = [];
    let scoringCards = [];
    let boosterSlots = 4;
    let boosterCards = [];
    let attacksTotal = 4;
    let attacksRemaining = 4;
    let discardsTotal = 10;
    let discardsRemaining = 10;
    let discardCards = [];
    let currentEnemy = {};
    let shopBoosterSlots = 3;
    let shopPackSlots = 2;
    let foilPower = 5;
    let holoPower = 2;
    let sleevePower = 2;
    let goldCredits = 5;
    let cumulativeDamage = 0;
    let handTypeLevels = {
        triChromatic: {level: 1, baseDamage: 10},
        triArmament: {level: 1, baseDamage: 20},
        triChromaticArmament: {level: 1, baseDamage: 40},
        quadChromatic: {level: 1, baseDamage: 15},
        quadArmament: {level: 1, baseDamage: 25},
        quadChromaticArmament: {level: 1, baseDamage: 50},
        fullChromatic: {level: 1, baseDamage: 20},
        fullArmament: {level: 1, baseDamage: 30},
        spectrum: {level: 1, baseDamage: 35},
        fullChromaticArmament: {level: 1, baseDamage: 60},
        fullSpectrumArmament: {level: 1, baseDamage: 70},
    };
    
    
    return {
        version,
        seed,
        credits,
        floor,
        system,
        lives,
        handSize,
        handCards,
        gunSlots,
        gunCards,
        scoringCards,
        boosterSlots,
        boosterCards,
        attacksTotal,
        attacksRemaining,
        discardsTotal,
        discardsRemaining,
        discardCards,
        currentEnemy,
        shopBoosterSlots,
        shopPackSlots,
        foilPower,
        holoPower,
        sleevePower,
        goldCredits,
        cumulativeDamage,
        handTypeLevels,
    };

}