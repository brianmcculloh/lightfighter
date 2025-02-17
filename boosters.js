export const ALL_BOOSTERS = [
    /* 

    {
        // all of the options are single values except where noted

        id: 'plasma_core',          // must be unique
        type: 'bridge',             // 'bridge', 'engineering', 'armory' 
                                        - bridge is generally used for combos
                                        - engineering is generally used for colors
                                        - armory is generally used for weapons
        context: 'played',          // 'played' (default), 'stowed', 'drawn', 'any'
        rarity: 'uncommon',         // 'common' (default), 'uncommon', 'rare', 'legendary'
        weight: 50,                 // default: 100. all weights are relative to every other booster, regardless of rarity.
        conditional: false,         // true (default), false - false is not card dependent and will fire once per attack
        customCondition: 'one_played'   // condition that triggers this booster
        cardType: 'plasma_cell',    // singular or array: ['plasma_cell', 'dark_matter', 'quantum_shard']
        cardColor: 'red',           // singular or array: ['red', 'green', 'blue']
        colorTemperature: 'warm'    // 'warm', 'cold'
        comboType: 'biArmament'     // singular or array: ['armament', 'chromatic', 'biArmament', 'triChromatic']
        cardEffect: 'foil',         // singular or array: ['foil', 'holo', 'sleeve', 'gold_leaf', 'texture']
        cardStatus: 'epic',         // singular or array: ['epic', 'legendary', 'mythical']
        cardLevel: 1,               // the level of the card
        comboLevel: 1,              // the level of the played combo
        compareLevel: 'less'        // 'equal' (default), 'less', 'greater' - how to compare the card's level to the specified level
        compareEffects: 'and',      // 'or' (default), 'and' - whether all conditions must be met ('and') or at least one ('or')   
        to: 'scoringCards',         // 'gunCards' (default), 'scoringCards', 'handCards'
                                        - scoringCards means it has to be a part of a named combo
                                        - gunCards just means it's equipped and played
                                        - handCards means it remains in hand and not played
        damage: 10,                 // damage, power, pierce, spread - multiple values allowed (each as singular non-array values)
        credits: 10,                // will gain credits if booster procs
        xp: 10,                     // will gain xp if booster procs
        multiplicative: true        // true, false (default) - whether the value multiplies the current value
        procChance: .25             // number between 0 and 1 - chance this booster procs per attack
        cardChance: .25             // number between 0 and 1 - chance this booster procs per attack for each card affected
        boosterAction: 'upgrade_high_combo'  // the action to perform when conditions are met
        selfImprove: 'damage',      // singular or array: ['damage', 'power', 'pierce', 'spread', 'xp', 'credits', 'retriggerTimes'] - any booster attribute that is a number
        improveAmount: 5,           // singular or array: [5, 10, .1] - if selfImprove is an array, this MUST be an array of equal length
        improveEvent: 'crit'        // the event that triggers the improveCondition
        improveCondition: 'four_stows'   // the condition that must be met during the improveEvent 
        improveChance: .5           // number between 0 and 1 - chance this booster improves
        retriggerCondition: {'procChance': 'exists'}    // key value pair to match for retriggering
                                        - if second value is a string 'red' for instance, the key would exactly match
                                        - if second value is array ['red'] for instance, the key would contain the value
                                        - {'cardColor': 'red'} triggers cardColor: 'red', but not cardColor: ['red', 'orange']
                                        - {'cardColor': ['red']} triggers cardColor: ['red', 'orange']
        retriggerTimes: 2           // number of times to retrigger the booster
        retriggerChance: .5         // chance that this booster will retrigger its target - NOT CURRENTLY USED
        description: '...'          // what will display in the tooltip
    },


    BOOSTER IDEA QUEUE

    small chance to destroy a common booster and add x to spread
    x10 power. small chance to destroy itself each time it procs.
    x10 power. small chance to destroy a random common relic
    small chance to double the effects of the booster to the right
    all booster power values are doubled (should visually display like double retriggers)
    double the effects of all non-multiplicative (additive) boosters
    multiply power, pierce, and spread but no self-improve (too many self-improving boosters)
    double all damage/power/pierce/spread values
    
    

    red - pierce archetype
    orange - credits archetype
    yellow - xp archetype
    green - upgrade card archetype
    blue - power archetype  
    indigo - upgrade combo archetype
    violet - create special archetype
    white - retrigger/multi archetype
    ultraviolet - meta archetype
    black - spread archetype

    plasma cell - foil archetype
    dark matter - holo archetype
    quantum shard - sleeve archetype
    gravity wave - gold leaf archetype
    nano swarm - texture archetype
                                        TOTAL   COMMON  UNCOMMON RARE LEGENDARY
    Bridge (combo archetype):           58      24      19       13     2
    Engineering (color archetype):      56      23      20       11     2
    Armory (type archetype):            64      26      22       14     2

                                Total:  178

    */


    //////////////////////////////////////
    //ISCARDAFFECTED PROCESSING
    //////////////////////////////////////

    // COMMON
    // bridge
    {id: 'chromatic_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'chromatic', damage: 40, description: '+100 damage for every scoring card in a Chromatic combo.'},
    {id: 'armament_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'armament', damage: 40, description: '+100 damage for every scoring card in an Armament combo.'},
    {id: 'bi_Chromatic_scoring', type: 'engineering', rarity: 'common', weight: 100, comboType: 'biChromatic', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Bi Chromatic combo.'},
    {id: 'bi_Armament_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'biArmament', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Bi Armament combo.'},
    {id: 'tri_Chromatic_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'triChromatic', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Tri Chromatic combo.'},
    {id: 'tri_Armament_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'triArmament', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Tri Armament combo.'},
    {id: 'charged_Chromatic_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'chargedChromatic', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Charged Chromatic combo.'},
    {id: 'charged_Armament_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'chargedArmament', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Charged Armament combo.'},
    {id: 'quad_Chromatic_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'quadChromatic', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Quad Chromatic combo.'},
    {id: 'quad_Armament_scoring', type: 'bridge', rarity: 'common', weight: 100, comboType: 'quadArmament', power: 1.5, multiplicative: true, description: 'x1.5 power for every scoring card in a Quad Armament combo.'},
    {
        id: 'white_retrigger', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        retriggerCondition: {'cardColor': ['white']},
        retriggerTimes: 2,
        description: 'Retrigger all boosters that target white cards <span class="description-retriggerTimes">2</span> times.'
    },
    {
        id: 'system_class', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        cardLevel: 0,
        compareLevel: 'greater',
        multiplicative: true,
        power: 'system_class',
        description: 'x power equal to the current system plus the current class.'
    },
    {
        id: 'card_level_10', 
        type: 'bridge', 
        rarity: 'common', weight: 80, 
        cardLevel: 9,
        compareLevel: 'greater',
        multiplicative: true,
        power: 1.5,
        description: 'x1.5 power for every played card level 10 or higher.'
    },
    {
        id: 'card_level_20', 
        type: 'bridge', 
        rarity: 'common', weight: 80, 
        cardLevel: 19,
        compareLevel: 'greater',
        multiplicative: true,
        power: 1.5,
        description: 'x1.5 power for every played card level 20 or higher.'
    },
    {
        id: 'retrigger_multiplicative', 
        type: 'armory', 
        rarity: 'common', weight: 60, 
        context: 'any',
        retriggerCondition: {'multiplicative': true},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target multiplicative boosters <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'retrigger_cardEffect', 
        type: 'armory', 
        rarity: 'common', weight: 60, 
        context: 'any',
        retriggerCondition: {'cardEffect': 'exists'},
        retriggerTimes: 1,
        selfImprove: 'retriggerTimes',
        improveEvent: 'attack', 
        improveChance: .25,
        improveAmount: 1,
        description: 'Retrigger all boosters that target special cards <span class="description-retriggerTimes">1</span> time. 25% chance to improve the number of times this booster retriggers by 1 when you attack.'
    },
    

    // engineering
    {id: 'red_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'red', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Red card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'orange_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'orange', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Orange card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'yellow_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'yellow', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Yellow card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'green_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'green', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Green card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'blue_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'blue', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Blue card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'indigo_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'indigo', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Indigo card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'violet_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'violet', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Violet card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'white_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'white', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring White card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'ultraviolet_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'ultraviolet', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Ultraviolet card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'black_scoring', type: 'engineering', rarity: 'common', weight: 95, cardColor: 'black', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every scoring Black card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    
    {id: 'red_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'red', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Red card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'orange_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'orange', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Orange card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'yellow_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'yellow', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Yellow card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'green_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'green', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Green card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'blue_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'blue', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Blue card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'indigo_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'indigo', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Indigo card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'violet_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'violet', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Violet card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'white_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'white', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn White card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'ultraviolet_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'ultraviolet', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Ultraviolet card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'black_drawn', type: 'engineering', rarity: 'common', weight: 90, cardColor: 'black', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Black card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    
    {
        id: 'upgrade_random_combo', 
        type: 'engineering', 
        rarity: 'common', weight: 95, 
        cardColor: ['indigo'],
        boosterAction: 'upgrade_random_combo',
        description: '+1 level to random combo whenever an indigo card is played.'
    },
 
    // armory
    {id: 'plasma_cell_played', type: 'armory', rarity: 'common', weight: 100, cardType: 'plasma_cell', damage: 10, selfImprove: 'damage', improveAmount: 25, description: '+<span class="description-damage">10</span> damage for every played Plasma Cell. Increase damage by <span class="description-damage-improve">25</span> each time.'},
    {id: 'dark_matter_played', type: 'armory', rarity: 'common', weight: 100, cardType: 'dark_matter', damage: 10, selfImprove: 'damage', improveAmount: 25, description: '+<span class="description-damage">10</span> damage for every played Dark Matter. Increase damage by <span class="description-damage-improve">25</span> each time.'},
    {id: 'quantum_shard_played', type: 'armory', rarity: 'common', weight: 100, cardType: 'quantum_shard', damage: 10, selfImprove: 'damage', improveAmount: 25, description: '+<span class="description-damage">10</span> damage for every played Quantum Shard. Increase damage by <span class="description-damage-improve">25</span> each time.'},
    {id: 'gravity_wave_played', type: 'armory', rarity: 'common', weight: 100, cardType: 'gravity_wave', damage: 10, selfImprove: 'damage', improveAmount: 25, description: '+<span class="description-damage">10</span> damage for every played Gravity Wave. Increase damage by <span class="description-damage-improve">25</span> each time.'},
    {id: 'nano_swarm_played', type: 'armory', rarity: 'common', weight: 100, cardType: 'nano_swarm', damage: 10, selfImprove: 'damage', improveAmount: 25, description: '+<span class="description-damage">10</span> damage for every played Nano Swarm. Increase damage by <span class="description-damage-improve">25</span> each time.'},
    {id: 'plasma_cell_scoring', type: 'armory', rarity: 'common', weight: 100, cardType: 'plasma_cell', to: 'scoringCards', power: 25, description: '+25 power for every scoring Plasma Cell.'},
    {id: 'dark_matter_scoring', type: 'armory', rarity: 'common', weight: 100, cardType: 'dark_matter', to: 'scoringCards', power: 25, description: '+25 power for every scoring Dark Matter.'},
    {id: 'quantum_shard_scoring', type: 'armory', rarity: 'common', weight: 100, cardType: 'quantum_shard', to: 'scoringCards', power: 25, description: '+25 power for every scoring Quantum Shard.'},
    {id: 'gravity_wave_scoring', type: 'armory', rarity: 'common', weight: 100, cardType: 'gravity_wave', to: 'scoringCards', power: 25, description: '+25 power for every scoring Gravity Wave.'},
    {id: 'nano_swarm_scoring', type: 'armory', rarity: 'common', weight: 100, cardType: 'nano_swarm', to: 'scoringCards', power: 25, description: '+25 power for every scoring Nano Swarm.'},

    {id: 'plasma_cell_drawn', type: 'armory', rarity: 'common', weight: 90, cardType: 'plasma_cell', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Plasma Cell card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'dark_matter_drawn', type: 'armory', rarity: 'common', weight: 90, cardType: 'dark_matter', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Dark Matter card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'quantum_shard_drawn', type: 'armory', rarity: 'common', weight: 90, cardType: 'quantum_shard', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Quantum Shard card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'gravity_wave_drawn', type: 'armory', rarity: 'common', weight: 90, cardType: 'gravity_wave', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Gravity Wave card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},
    {id: 'nano_swarm_drawn', type: 'armory', rarity: 'common', weight: 90, cardType: 'nano_swarm', to: 'handCards', power: 2, context: 'drawn', selfImprove: 'power', improveAmount: 10, improveChance: .5, description: '+<span class="description-power">2</span> power for every drawn Nano Swarm card. 50% chance to increase power by <span class="description-power-improve">10</span> each time.'},

    {
        id: 'plasma_cell_retrigger', 
        type: 'armory', 
        rarity: 'common', weight: 90, 
        context: 'any',
        retriggerCondition: {'cardType': ['plasma_cell']},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target Plasma Cells <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'dark_matter_retrigger', 
        type: 'armory', 
        rarity: 'common', weight: 90, 
        context: 'any',
        retriggerCondition: {'cardType': ['dark_matter']},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target Dark Matter <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'quantum_shard_retrigger', 
        type: 'armory', 
        rarity: 'common', weight: 90, 
        context: 'any',
        retriggerCondition: {'cardType': ['quantum_shard']},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target Quantum Shards <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'gravity_wave_retrigger', 
        type: 'armory', 
        rarity: 'common', weight: 90, 
        context: 'any',
        retriggerCondition: {'cardType': ['gravity_wave']},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target Gravity Waves <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'nano_swarms_retrigger', 
        type: 'armory', 
        rarity: 'common', weight: 90, 
        context: 'any',
        retriggerCondition: {'cardType': ['nano_swarm']},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target Nano Swarms <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'combo_level_10', 
        type: 'armory', 
        rarity: 'common', weight: 80, 
        comboLevel: 9,
        compareLevel: 'greater',
        multiplicative: true,
        to: 'scoringCards',
        power: 1.5,
        description: 'x1.5 power for every card played as part of a combo level 10 or higher.'
    },
    {
        id: 'combo_level_20', 
        type: 'armory', 
        rarity: 'common', weight: 80, 
        comboLevel: 19,
        compareLevel: 'greater',
        multiplicative: true,
        to: 'scoringCards',
        power: 1.5,
        description: 'x1.5 power for every card played as part of a combo level 20 or higher.'
    },
    

    // UNCOMMON
    // bridge 
    {id: 'full_Chromatic_scoring', type: 'bridge', rarity: 'uncommon', weight: 70, comboType: 'fullChromatic', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring card in a Full Chromatic combo. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'full_Armament_scoring', type: 'bridge', rarity: 'uncommon', weight: 70, comboType: 'fullArmament', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring card in a Full Armament combo. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'full_Spectrum_scoring', type: 'bridge', rarity: 'uncommon', weight: 70, comboType: 'fullSpectrum', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring card in a Full Spectrum combo. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'full_Chromatic_Armament_scoring', type: 'bridge', rarity: 'uncommon', weight: 70, comboType: 'fullChromaticArmament', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring card in a Full Chromatic Armament combo. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'full_Spectrum_Armament_scoring', type: 'bridge', rarity: 'uncommon', weight: 70, comboType: 'fullSpectrumArmament', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring card in a Full Spectrum Armament combo. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {
        id: 'special_cards', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 75, 
        cardEffect: ['foil', 'holo', 'sleeve', 'gold_leaf', 'texture'], 
        power: 1.5, 
        multiplicative: true,
        description: 'x1.5 power for every played special card.'
    },
    {
        id: 'compare_level', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 60, 
        cardLevel: 1, 
        compareLevel: 'greater', 
        power: 1.5, 
        multiplicative: true,
        description: 'x1.5 power for every played card higher than level 1.'
    },
    {
        id: 'pierce_stow', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 70,
        cardLevel: 0,
        compareLevel: 'greater',
        pierce: 'stow_cards', 
        description: 'For every card played, add +0.2 pierce for every card in the stow pile.'
    },
    {
        id: 'card_level_30', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 70,
        cardLevel: 29,
        compareLevel: 'greater',
        multiplicative: true,
        power: 1.5,
        description: 'x1.5 power for every played card level 30 or higher.'
    },
    {
        id: 'card_level_40', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 70,
        cardLevel: 39,
        compareLevel: 'greater',
        multiplicative: true,
        power: 1.5,
        description: 'x1.5 power for every played card level 40 or higher.'
    },
    {
        id: 'retrigger_cardStatus', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60,
        context: 'any',
        retriggerCondition: {'cardStatus': 'exists'},
        retriggerTimes: 1,
        selfImprove: 'retriggerTimes',
        improveEvent: 'attack', 
        improveChance: .25,
        improveAmount: 1,
        description: 'Retrigger all boosters that target epic, legendary, and mythical cards <span class="description-retriggerTimes">1</span> time. 25% chance to improve the number of times this booster retriggers by 1 when you attack.'
    },
    {
        id: 'retrigger_comboType', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60,
        context: 'any',
        retriggerCondition: {'comboType': 'exists'},
        retriggerTimes: 1,
        selfImprove: 'retriggerTimes',
        improveEvent: 'attack', 
        improveChance: .25,
        improveAmount: 1,
        description: 'Retrigger all boosters that target combos <span class="description-retriggerTimes">1</span> time. 25% chance to improve the number of times this booster retriggers by 1 when you attack.'
    },
    {
        id: 'retrigger_drawn', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50,
        context: 'drawn',
        retriggerCondition: {'context': 'drawn'},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target drawn cards <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'retrigger_stowed', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50,
        context: 'stowed',
        retriggerCondition: {'context': 'stowed'},
        retriggerTimes: 1,
        description: 'Retrigger all boosters that target stowed cards <span class="description-retriggerTimes">1</span> time.'
    },


    // engineering
    {id: 'warm_improve', type: 'engineering', rarity: 'uncommon', weight: 70, colorTemperature: 'warm', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Warm card. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'cool_improve', type: 'engineering', rarity: 'uncommon', weight: 70, colorTemperature: 'cool', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Cool card. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'ultraviolet_improve', type: 'engineering', rarity: 'uncommon', weight: 70, cardColor: 'ultraviolet', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Ultraviolet card. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'black_improve', type: 'engineering', rarity: 'uncommon', weight: 70, cardColor: 'black', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .1, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Black card. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {
        id: 'upgrade_high_combo', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        cardColor: ['indigo'],
        boosterAction: 'upgrade_high_combo',
        description: '+1 level to highest level combo whenever an indigo card is played.'
    },
    {
        id: 'orange_credits', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        cardColor: ['orange'],
        cardChance: .25,
        credits: 10, 
        description: '25% chance for +10 credits whenever an orange card is played.'
    },
    {
        id: 'yellow_xp', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        cardColor: ['yellow'],
        cardChance: .25,
        xp: 40, 
        description: '25% chance for +40 xp whenever a yellow card is played.'
    },
    {
        id: 'upgrade_random_for_green', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        cardColor: ['green'],
        to: 'scoringCards',
        boosterAction: 'upgrade_random_played_card',
        description: 'Upgrade a random played card for each scoring green card.'
    },
    {
        id: 'upgrade_green', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 50, 
        cardColor: ['green'],
        boosterAction: 'upgrade_green_cards',
        procChance: .25,
        description: 'For every green card played, 25% chance for +1 level to every green card played.'
    },
    {
        id: 'blue_hand', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60,
        cardColor: ['blue'], 
        to: 'handCards', 
        power: 2, 
        multiplicative: true,
        description: 'x2 power for every blue card in your hand.'
    },
    {
        id: 'red_drawn_pierce', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60,
        to: 'handCards',
        context: 'drawn',
        cardColor: ['red'],
        cardChance: .5,
        pierce: .5,
        description: '50% chance for +<span class="description-pierce">0.5</span> pierce for each drawn red card.'
    },
    {
        id: 'orange_drawn_credits', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        to: 'handCards',
        context: 'drawn',
        cardColor: ['orange'],
        cardChance: .5,
        credits: 5, 
        description: '50% chance for +5 credits for each drawn orange card.'
    },
    {
        id: 'yellow_drawn_xp', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        to: 'handCards',
        context: 'drawn',
        cardColor: ['yellow'],
        xp: 15, 
        description: '+15 xp for each drawn yellow card.'
    },
    {
        id: 'green_drawn_upgrade', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 50, 
        cardColor: ['green'],
        to: 'handCards',
        context: 'drawn',
        boosterAction: 'upgrade_random_drawn_card',
        description: 'Upgrade a random card in hand for each drawn green card.'
    },
    {
        id: 'blue_drawn_hand', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60,
        cardColor: ['blue'], 
        to: 'handCards', 
        context: 'drawn',
        power: 2, 
        multiplicative: true,
        description: 'x2 power for every blue card drawn.'
    },
    {
        id: 'indigo_drawn_upgrade_high_combo', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        cardColor: ['indigo'],
        to: 'handCards', 
        context: 'drawn',
        boosterAction: 'upgrade_high_combo',
        description: '+1 level to highest level combo whenever an indigo card is drawn.'
    },
    {
        id: 'white_drawn_hand', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60, 
        cardColor: ['white'],
        power: 10,
        pierce: 1,
        to: 'handCards', 
        context: 'drawn',
        description: '+<span class="description-power">10</span> power and +<span class="description-pierce">1</span> pierce for every drawn White card.'
    },
    

    //armory
    {id: 'plasma_cell_improve', type: 'armory', rarity: 'uncommon', weight: 70, cardType: 'plasma_cell', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .10, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Plasma Cell. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'dark_matter_improve', type: 'armory', rarity: 'uncommon', weight: 70, cardType: 'dark_matter', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .10, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Dark Matter. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'quantum_shard_improve', type: 'armory', rarity: 'uncommon', weight: 70, cardType: 'quantum_shard', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .10, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Quantum Shard. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'gravity_wave_improve', type: 'armory', rarity: 'uncommon', weight: 70, cardType: 'gravity_wave', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .10, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Gravity Wave. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {id: 'nano_swarm_improve', type: 'armory', rarity: 'uncommon', weight: 70, cardType: 'nano_swarm', to: 'scoringCards', power: 2, selfImprove: 'power', improveAmount: .05, improveChance: .10, multiplicative: true, description: 'x<span class="description-power">2</span> power for every scoring Nano Swarm. 10% chance to increase power by <span class="description-power-improve">0.05</span> each time.'},
    {
        id: 'combo_level_30', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60,
        comboLevel: 29,
        compareLevel: 'greater',
        multiplicative: true,
        to: 'scoringCards',
        power: 1.5,
        description: 'x1.5 power for every card played as part of a combo level 30 or higher.'
    },
    {
        id: 'combo_level_40', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60,
        comboLevel: 39,
        compareLevel: 'greater',
        multiplicative: true,
        to: 'scoringCards',
        power: 1.5,
        description: 'x1.5 power for every card played as part of a combo level 40 or higher.'
    },
    {
        id: 'epic_played', 
        type: 'armory', 
        rarity: 'uncommon', 
        cardStatus: 'epic', 
        spread: .05, 
        description: '+.05 spread for every played epic card.'
    },
    {
        id: 'epic_played_improve', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60, 
        cardStatus: 'epic', 
        pierce: 1, 
        selfImprove: 'pierce', 
        improveAmount: 1, 
        improveChance: .2, 
        description: '+<span class="description-pierce">1</span> pierce for every played epic card. 20% chance to increase pierce by <span class="description-pierce-improve">1</span> each time.'
    },
    {
        id: 'legendary_played', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50, 
        cardStatus: 'legendary', 
        spread: .05, 
        description: '+.05 spread for every played legendary card.'
    },
    {
        id: 'legendary_played_improve', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50, 
        cardStatus: 'legendary', 
        pierce: 1, 
        selfImprove: 'pierce', 
        improveAmount: 1, 
        improveChance: .2, 
        description: '+<span class="description-pierce">1</span> pierce for every played legendary card. 20% chance to increase pierce by <span class="description-pierce-improve">1</span> each time.'
    },
    {
        id: 'mythical_played', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60, 
        cardStatus: 'mythical', 
        spread: .05, 
        description: '+.05 spread for every played mythical card.'
    },
    {
        id: 'mythical_played_improve', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50,
        cardStatus: 'mythical', 
        pierce: 1, 
        selfImprove: 'pierce', 
        improveAmount: 1, 
        improveChance: .2, 
        description: '+<span class="description-pierce">1</span> pierce for every played mythical card. 20% chance to increase pierce by <span class="description-pierce-improve">1</span> each time.'
    },
    {
        id: 'plasma_cell_played_foil', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50, 
        cardType: ['plasma_cell'],
        boosterAction: 'random_played_foil',
        cardChance: .2,
        description: '20% chance to convert a random hand card to a foil card whenver a plasma cell is played.'
    },
    {
        id: 'dark_matter_played_holo', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50, 
        cardType: ['dark_matter'],  
        boosterAction: 'random_played_holo',
        cardChance: .2,
        description: '20% chance to convert a random hand card to a holo card whenver a dark matter is played.'
    },
    {
        id: 'quantum_shard_played_sleeve', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50, 
        cardType: ['quantum_shard'],
        boosterAction: 'random_played_sleeve',
        cardChance: .2,
        description: '20% chance to convert a random hand card to a sleeve card whenver a quantum shard is played.'
    },
    {
        id: 'gravity_wave_played_gold_leaf', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50, 
        cardType: ['gravity_wave'],
        boosterAction: 'random_played_gold_leaf',
        cardChance: .2,
        description: '20% chance to convert a random hand card to a gold leaf card whenver a gravity wave is played.'
    },
    {
        id: 'nano_swarm_played_texture', 
        type: 'armory', 
        rarity: 'uncommon', weight: 50, 
        cardType: ['nano_swarm'],
        boosterAction: 'random_played_texture',
        cardChance: .2,
        description: '20% chance to convert a random hand card to a texture card whenver a nano swarm is played.'
    },


    // RARE
    // bridge
    {
        id: 'increase_pierce', 
        type: 'bridge', 
        rarity: 'rare', weight: 40,
        cardLevel: 0,
        compareLevel: 'greater',
        pierce: 1.5,
        cardChance: .5,
        description: '50% chance for x1.5 pierce for every played card.'
    },
    {
        id: 'white_retrigger_improve', 
        type: 'bridge', 
        rarity: 'rare', weight: 40,
        context: 'any',
        retriggerCondition: {'cardColor': ['white']},
        retriggerTimes: 1,
        selfImprove: 'retriggerTimes',
        improveEvent: 'attack', 
        improveAmount: 1,
        improveChance: .25,
        description: 'Retrigger all boosters that target white cards <span class="description-retriggerTimes">1</span> times. 25% chance to increase the number of times this booster retriggers by 1 when you attack.'
    },
    {
        id: 'card_level_50', 
        type: 'bridge',
        rarity: 'rare', weight: 40, 
        cardLevel: 49,
        compareLevel: 'greater',
        multiplicative: true,
        power: 1.5,
        selfImprove: 'power',
        improveAmount: .1,
        description: 'x<span class="description-power">1.5</span> power for every played card level 50 or higher. Increase power by .1 each time this booster procs.'
    },
    {
        id: 'retrigger_selfImprove', 
        type: 'armory', 
        rarity: 'rare', weight: 20,
        context: 'any',
        retriggerCondition: {'selfImprove': 'exists'},
        retriggerTimes: 1,
        selfImprove: 'retriggerTimes',
        improveEvent: 'attack', 
        improveChance: .25,
        improveAmount: 1,
        description: 'Retrigger all boosters that have a chance to improve <span class="description-retriggerTimes">1</span> time(s). 25% chance to improve the number of times this booster retriggers by 1 when you attack.'
    },
    {
        id: 'retrigger_commons', 
        type: 'armory', 
        rarity: 'rare', weight: 20,
        context: 'any',
        retriggerCondition: {'rarity': 'common'},
        retriggerTimes: 1,
        description: 'Retrigger all common boosters <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'retrigger_uncommons', 
        type: 'armory', 
        rarity: 'rare', weight: 20,
        context: 'any',
        retriggerCondition: {'rarity': 'uncommon'},
        retriggerTimes: 1,
        description: 'Retrigger all uncommon boosters <span class="description-retriggerTimes">1</span> time.'
    },
    {
        id: 'retrigger_rares', 
        type: 'armory', 
        rarity: 'rare', weight: 20,
        context: 'any',
        retriggerCondition: {'rarity': 'rare'},
        retriggerTimes: 1,
        description: 'Retrigger all rare boosters <span class="description-retriggerTimes">1</span> time.'
    },


    // engineering
    {
        id: 'random_hand_special_card', 
        type: 'engineering', 
        rarity: 'rare', weight: 40,
        cardColor: ['violet'],
        cardChance: .20,
        boosterAction: 'random_hand_special_card',
        description: '20% chance to convert a random card in hand to a random special card whenever a violet card is played.'
    },
    {
        id: 'played_special_card', 
        type: 'engineering', 
        rarity: 'rare', weight: 40,
        cardColor: ['violet'],
        to: 'scoringCards',
        cardChance: .1,
        boosterAction: 'played_special_card',
        description: '10% chance to convert each scoring card to a random special card for each scoring violet card.'
    },
    {
        id: 'black_spread', 
        type: 'engineering', 
        rarity: 'rare', weight: 40,
        cardColor: ['black'],
        cardChance: .1,
        spread: .1,
        selfImprove: 'spread', 
        improveChance: .5,
        improveAmount: .1, 
        description: '10% chance for +<span class="description-spread">0.1</span> spread for every black card played. 50% to improve spread modifier by <span class="description-spread-improve">0.1</span> when this booster procs.'
    },
    {
        id: 'black_spread_improve', 
        type: 'engineering', 
        rarity: 'rare', weight: 40,
        cardColor: ['black'],
        cardChance: .2,
        spread: .02,
        selfImprove: 'spread', 
        improveAmount: .02, 
        description: '20% chance for +<span class="description-spread">0.02</span> spread for every black card played. Improve spread modifier by <span class="description-spread-improve">0.02</span> when this booster procs.'
    },
    {
        id: 'scoring_red', 
        type: 'engineering', 
        rarity: 'rare', weight: 30,
        to: 'scoringCards',
        cardColor: ['red'],
        pierce: .05,
        selfImprove: 'pierce',
        improveAmount: .05,
        description: '+<span class="description-pierce">0.05</span> pierce for each scoring red card. Increase pierce by <span class="description-pierce-improve">0.05</span> when this booster procs.'
    },
    {
        id: 'orange_credits_improve', 
        type: 'engineering', 
        rarity: 'rare', weight: 30,
        cardColor: ['orange'],
        cardChance: .1,
        credits: 10, 
        selfImprove: 'cardChance',
        improveAmount: .01,
        description: '<span class="description-cardChance">10</span>% chance for +<span class="description-credits">10</span> credits whenever an orange card is played. Increase chance by <span class="description-cardChance-improve">1</span>% when this booster procs.'
    },
    {
        id: 'yellow_xp_improve', 
        type: 'engineering', 
        rarity: 'rare', weight: 30, 
        to: 'scoringCards',
        cardColor: ['yellow'],
        xp: 1, 
        selfImprove: 'xp',
        improveAmount: 1,
        description: '+<span class="description-xp">1</span> xp whenever a yellow card scores. Increase xp gained by <span class="description-xp-improve">1</span> when this booster procs.'
    },
    {
        id: 'violet_drawn_random_hand_special_card', 
        type: 'engineering', 
        rarity: 'rare', weight: 20,
        cardColor: ['violet'],
        context: 'drawn',
        to: 'handCards',
        cardChance: .2,
        boosterAction: 'random_hand_special_card',
        description: '20% chance to convert a random card in hand to a random special card whenever a violet card is drawn.'
    },
    {
        id: 'black_drawn_spread', 
        type: 'engineering', 
        rarity: 'rare', weight: 30,
        cardColor: ['black'],
        context: 'drawn',
        to: 'handCards',
        cardChance: .1,
        spread: .1,
        selfImprove: 'spread', 
        improveChance: .5,
        improveAmount: .1, 
        description: '10% chance for +<span class="description-spread">0.1</span> spread for every black card drawn. 50% to improve spread modifier by <span class="description-spread-improve">0.1</span> when this booster procs.'
    },



    // armory
    {
        id: 'random_special_meta_increase', 
        type: 'armory', 
        rarity: 'rare', weight: 40,
        cardColor: ['ultraviolet'],
        cardChance: .20,
        boosterAction: 'random_special_meta_increase',
        description: '20% chance to increase the effects of a random special type of cards whenever an ultraviolet card is played.'
    },
    {
        id: 'random_special_meta_improve', 
        type: 'armory', 
        rarity: 'rare', weight: 30,
        cardColor: ['ultraviolet'],
        cardChance: .1,
        selfImprove: 'cardChance',
        improveAmount: .05,
        improveChance: .5,
        boosterAction: 'random_special_meta_increase',
        description: '<span class="description-cardChance">10</span>% chance to increase the effects of a random special type of cards whenever an ultraviolet card is played. 50% chance to improve that chance by <span class="description-cardChance-improve">1</span>% when this booster procs.'
    },
    {
        id: 'blue_level_power', 
        type: 'armory', 
        rarity: 'rare', weight: 40,
        cardColor: ['blue'],
        cardChance: .5,
        multiplicative: true,
        power: 'total_blue_levels',
        description: "For every blue card played, 50% chance to multiply power by the sum of every blue card's level"
    },
    {
        id: 'random_special_meta_increase_drawn', 
        type: 'armory', 
        rarity: 'rare', weight: 30,
        cardColor: ['ultraviolet'],
        cardChance: .20,
        context: 'drawn',
        to: 'handCards',
        boosterAction: 'random_special_meta_increase',
        description: '20% chance to increase the effects of a random special type of cards whenever an ultraviolet card is drawn.'
    },
    {
        id: 'combo_level_50', 
        type: 'armory',
        rarity: 'rare', weight: 40, 
        comboLevel: 49,
        compareLevel: 'greater',
        multiplicative: true,
        to: 'scoringCards',
        power: 1.5,
        selfImprove: 'power',
        improveAmount: .1,
        description: 'x<span class="description-power">1.5</span> power for every card played as part of a combo level 50 or higher. Increase power by .1 each time this booster procs.'
    },
    {
        id: 'epic_played_multi', 
        type: 'armory', 
        rarity: 'rare',  weight: 30,
        cardStatus: 'epic', 
        damage: 75,
        power: 25,
        pierce: 5,
        spread: .01, 
        cardChance: .5,
        description: '50% chance for +75 damage, +25 power, +5 pierce, and +.01 spread for every played epic card.'
    },
    {
        id: 'epic_scores_improve', 
        type: 'armory', 
        rarity: 'rare', weight: 30, 
        cardStatus: 'epic', 
        multiplicative: true,
        to: 'scoringCards', 
        power: 1.5,
        selfImprove: 'power',
        improveAmount: .25,
        improveChance: .5,
        description: 'x<span class="description-power">1.5</span> power for every scoring epic card. 50% chance to increase power by .25 each time this booster procs.'
    },
    {
        id: 'legendary_played_multi', 
        type: 'armory', 
        rarity: 'rare', weight: 30, 
        cardStatus: 'legendary', 
        damage:75,
        power: 25,
        pierce: 5, 
        spread: .01,
        cardChance: .5,
        description: '50% chance for +75 damage, +25 power, +5 pierce, and +.01 spread for every played legendary card.'
    },
    {
        id: 'legendary_scores_improve', 
        type: 'armory', 
        rarity: 'rare', weight: 30, 
        cardStatus: 'legendary', 
        multiplicative: true,
        to: 'scoringCards', 
        power: 1.5,
        selfImprove: 'power',
        improveAmount: .25,
        improveChance: .5,
        description: 'x<span class="description-power">1.5</span> power for every scoring legendary card. 50% chance to increase power by .25 each time this booster procs.'
    },
    {
        id: 'mythical_played_multi', 
        type: 'armory', 
        rarity: 'rare', weight: 30, 
        cardStatus: 'mythical', 
        damage: 75,
        power: 25,
        pierce: 5, 
        spread: .01,
        cardChance: .5,
        description: '50% chance for +75 damage, +25 power, +5 pierce, and +.01 spread for every played mythical card.'
    },
    {
        id: 'mythical_scores_improve', 
        type: 'armory', 
        rarity: 'rare', weight: 30, 
        cardStatus: 'mythical', 
        multiplicative: true,
        power: 1.5,
        to: 'scoringCards', 
        selfImprove: 'power',
        improveAmount: .25,
        improveChance: .5,
        description: 'x<span class="description-power">1.5</span> power for every scoring mythical card. 50% chance to increase power by .25 each time this booster procs.'
    },
    

    // LEGENDARY
    // bridge
    {
        id: 'power_amount_doubles', 
        type: 'bridge', 
        rarity: 'legendary', weight: 5,
        conditional: false,
        power: 2,
        selfImprove: 'power', 
        improveAmount: 'double', 
        improveChance: .5,
        description: '+<span class="description-power">2</span> power. 50% chance to double power each time this booster procs.'
    },
    {
        id: 'retrigger_power', 
        type: 'bridge', 
        rarity: 'legendary', weight: 5, 
        power: 1.5,
        conditional: false,
        multiplicative: true,
        retriggerTimes: 1,
        selfImprove: 'retriggerTimes',
        retriggerCondition: {'power': 'exists'},
        improveChance: .25,
        improveAmount: 1,
        improveEvent: 'attack', 
        description: 'x<span class="description-power">1.5</span> power. Retriggers all other boosters that increase power <span class="description-retriggerTimes">1</span> time. 25% chance to improve the number of times this booster retriggers by 1 when you attack.'
    },


    // engineering
    {
        id: 'combined_card_level', 
        type: 'engineering', 
        rarity: 'legendary', weight: 5, 
        cardLevel: 0,
        compareLevel: 'greater',
        conditional: false,
        multiplicative: true,
        power: 'combined_card_level',
        description: 'x power equal to the combined level of all of your played cards.'
    },
    {
        id: 'pierce_player_level', 
        type: 'engineering', 
        rarity: 'legendary', weight: 5, 
        conditional: false,
        multiplicative: true,
        pierce: 'player_level',
        description: 'x pierce equal to your level.'
    },



    // armory
    {
        id: 'damage_to_power', 
        type: 'armory', 
        rarity: 'legendary', weight: 8,
        conditional: false,
        power: 'damage',
        description: '+power equal to damage being dealt.'
    },
    {
        id: 'stats_highest_level', 
        type: 'armory', 
        rarity: 'legendary', weight: 3,
        conditional: false,
        damage: 'highest_level_card',
        power: 'highest_level_card',
        pierce: 'highest_level_card',
        spread: 'highest_level_card',
        description: '+damage, +power, +pierce, and +spread equal to your highest played card level.'
    },




    //////////////////////////////////////
    //CUSTOM PROCESSING
    //////////////////////////////////////
    // COMMON
    // bridge
    {
        id: 'upgrade_random', 
        type: 'bridge', 
        rarity: 'common', weight: 95, 
        conditional: false,
        boosterAction: 'upgrade_random_played_card',
        description: 'Upgrade a random played card.'
    },
    {
        id: 'credit_improve', 
        type: 'bridge', 
        rarity: 'common', weight: 90, 
        credits: 1, 
        conditional: false,
        selfImprove: 'credits', 
        improveAmount: 1, 
        improveChance: .1,
        description: '+<span class="description-credits">1</span> credits. 10% chance to increase credits amount by <span class="description-credits-improve">1</span> each time you attack.'
    },
    {
        id: 'upgrade_stowed_combo', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        conditional: false,
        context: 'stowed',
        procChance: .25,
        boosterAction: 'upgrade_stowed_combo',
        description: '25% chance to +1 level to stowed combo.'
    },
    {
        id: 'pierce_stowed_one', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        context: 'stowed',
        customCondition: 'one_played',
        pierce: .1,
        improveAmount: .05,
        selfImprove: 'pierce',
        description: '+<span class="description-pierce">0.1</span> pierce when one card is stowed. Increase pierce by <span class="description-pierce-improve">0.05</span> each time this booster procs.'
    },
    {
        id: 'pierce_stowed_two', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        context: 'stowed',
        customCondition: 'two_played',
        pierce: .1,
        improveAmount: .04,
        selfImprove: 'pierce',
        description: '+<span class="description-pierce">0.1</span> pierce for each card when two cards are stowed. Increase pierce by <span class="description-pierce-improve">0.04</span> each time this booster procs.'
    },
    {
        id: 'pierce_stowed_three', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        context: 'stowed',
        customCondition: 'three_played',
        pierce: .1,
        improveAmount: .03,
        selfImprove: 'pierce',
        description: '+<span class="description-pierce">0.1</span> pierce for each card when three cards are stowed. Increase pierce by <span class="description-pierce-improve">0.03</span> each time this booster procs.'
    },
    {
        id: 'pierce_stowed_four', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        context: 'stowed',
        customCondition: 'four_played',
        pierce: .1,
        improveAmount: .02,
        selfImprove: 'pierce',
        description: '+<span class="description-pierce">0.1</span> pierce for each card when four cards are stowed. Increase pierce by <span class="description-pierce-improve">0.02</span> each time this booster procs.'
    },
    {
        id: 'pierce_stowed_five', 
        type: 'bridge', 
        rarity: 'common', weight: 100, 
        context: 'stowed',
        customCondition: 'five_played',
        pierce: .1,
        improveAmount: .01,
        selfImprove: 'pierce',
        description: '+<span class="description-pierce">0.1</span> pierce for each card when five cards are stowed. Increase pierce by <span class="description-pierce-improve">0.01</span> each time this booster procs.'
    },
    

    // engineering
    {
        id: 'crit_improve', 
        type: 'engineering', 
        rarity: 'common', weight: 90,
        conditional: false, 
        power: 1.5, 
        multiplicative: true, 
        selfImprove: 'power', 
        improveEvent: 'crit', 
        improveAmount: .1, 
        description: 'x<span class="description-power">1.5</span> power. Increase power by <span class="description-power-improve">0.1</span> each time you crit an enemy.'
    },
    {
        id: 'highest_wavelength', 
        type: 'engineering', weight: 90, 
        rarity: 'common', 
        conditional: false,
        power: 'highest_wavelength',
        multiplicative: true,
        description: 'Multiply power equal to damage of highest wavelength card.'
    },
    

    // armory
    {
        id: 'one_played', 
        type: 'armory', 
        rarity: 'common', weight: 80, 
        customCondition: 'one_played',
        spread: .1, 
        description: 'When only one card is played, +.1 spread.'
    },
    {
        id: 'two_played', 
        type: 'armory', 
        rarity: 'common', weight: 80, 
        customCondition: 'two_played',
        pierce: 2, 
        description: 'When exactly two cards are played, +2 pierce for each card.'
    },
    {
        id: 'three_played', 
        type: 'armory', 
        rarity: 'common', weight: 80, 
        customCondition: 'three_played',
        power: 3, 
        multiplicative: true,
        description: 'When exactly three cards are played, x3 power for each card.'
    },
    {
        id: 'four_played', 
        type: 'armory', 
        rarity: 'common', weight: 80, 
        customCondition: 'four_played',
        power: 4,
        damage: 40, 
        description: 'When exactly four cards are played, +40 damage and +4 power for each card.'
    },


    // UNCOMMON
    // bridge
    {
        id: 'pierce_improve', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 70,
        conditional: false,
        pierce: .5, 
        selfImprove: 'pierce', 
        improveAmount: .1, 
        description: '+<span class="description-pierce">0.5</span> pierce. Increase pierce amount by <span class="description-pierce-improve">0.1</span> each time you attack.'
    },
    {
        id: 'combo_frequency', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 60,
        conditional: false,
        multiplicative: true,
        power: 'combo_frequency',
        description: 'Multiply power equal to the number of times this combo has been played.'
    },
    {
        id: 'retrigger_random', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 50,
        retriggerCondition: {'type': 'random'},
        retriggerTimes: 1,
        context: 'any',
        description: 'Whenever boosters can fire, retrigger one of them randomly.'
    },
    {
        id: 'pierce_stowed_combo', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 70,
        context: 'stowed',
        customCondition: 'stowed_combo',
        pierce: .1,
        improveAmount: .1,
        selfImprove: 'pierce',
        description: '+<span class="description-pierce">0.1</span> pierce for each card that is part of a stowed combo. Increase pierce by <span class="description-pierce-improve">0.1</span> each time this booster procs.'
    },
    {
        id: 'single_booster_bridge', 
        type: 'bridge', 
        rarity: 'uncommon', weight: 60,
        customCondition: 'single_booster',
        to: 'scoringCards',
        power: 1.1,
        multiplicative: true,
        improveAmount: .1,
        improveChance: .2,
        selfImprove: 'power',
        description: 'x<span class="description-power">1.1</span> power for every scoring card if this is the only booster in its group. 20% chance to increase power by <span class="description-power-improve">.1</span> each time this booster procs.'
    },


    // engineering
    {
        id: 'one_trick_pony', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60,
        conditional: false, 
        power: 5, 
        multiplicative: true, 
        procChance: .5,
        selfImprove: 'power', 
        improveEvent: 'attack', 
        improveCondition: 'one_card', 
        improveAmount: 2.5, 
        improveChance: .5,
        description: '50% chance of x<span class="description-power">5</span> power. 50% chance to increase power by <span class="description-power-improve">2.5</span> each time you play only one card.'
    },
    {
        id: 'single_red', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 60,
        customCondition: 'single_red',
        pierce: 'draw_cards', 
        description: 'When only one red card is played, add +0.1 pierce for every card in draw pile.'
    },
    {
        id: 'single_booster_engineering', 
        type: 'engineering', 
        rarity: 'uncommon', weight: 70,
        customCondition: 'single_booster',
        to: 'scoringCards',
        power: 1.1,
        multiplicative: true,
        improveAmount: .1,
        improveChance: .2,
        selfImprove: 'power',
        description: 'x<span class="description-power">1.1</span> power for every scoring card if this is the only booster in its group. 20% chance to increase power by <span class="description-power-improve">.1</span> each time this booster procs.'
    },


    // armory
    {
        id: 'three_stows', 
        type: 'armory', 
        rarity: 'uncommon', weight: 70,
        conditional: false, 
        power: 2, 
        multiplicative: true, 
        selfImprove: 'power', 
        improveEvent: 'win', 
        improveCondition: 'three_stows', 
        improveAmount: .5, 
        description: 'x<span class="description-power">2</span> power. Increase power by <span class="description-power-improve">.5</span> each time you end combat with 3 stows left.'
    },
    {
        id: 'first_attack_spread', 
        type: 'armory', 
        rarity: 'uncommon', weight: 70,
        customCondition: 'first_attack',
        spread: .1,
        procChance: .5,
        description: '50% chance of +<span class="description-spread">0.1</span> spread for each card played every first combat attack.'
    },
    {
        id: 'attack_no_combo', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60,
        customCondition: 'attack_no_combo',
        spread: .1,
        procChance: .5,
        description: '50% chance of +<span class="description-spread">0.1</span> spread for each card played when your attack has no combo.'
    },
    {
        id: 'single_booster_armory', 
        type: 'armory', 
        rarity: 'uncommon', weight: 60,
        customCondition: 'single_booster',
        to: 'scoringCards',
        power: 1.1,
        multiplicative: true,
        improveAmount: .1,
        improveChance: .2,
        selfImprove: 'power',
        description: 'x<span class="description-power">1.1</span> power for every scoring card if this is the only booster in its group. 20% chance to increase power by <span class="description-power-improve">.1</span> each time this booster procs.'
    },


    // RARE
    // bridge
    {
        id: 'retrigger_engineering', 
        type: 'bridge', 
        rarity: 'rare', weight: 6,
        retriggerCondition: {'type': 'engineering'},
        retriggerTimes: 1,
        context: 'any',
        description: 'Retrigger engineering boosters one time.'
    },
    {
        id: 'retrigger_bridge', 
        type: 'bridge', 
        rarity: 'rare', weight: 6,
        retriggerCondition: {'type': 'bridge'},
        retriggerTimes: 1,
        context: 'any',
        description: 'Retrigger bridge boosters one time.'
    },
    {
        id: 'retrigger_armory', 
        type: 'bridge', 
        rarity: 'rare', weight: 6,
        retriggerCondition: {'type': 'armory'},
        retriggerTimes: 1,
        context: 'any',
        description: 'Retrigger armory boosters one time.'
    },
    {
        id: 'retrigger_all', 
        type: 'bridge', 
        rarity: 'rare', weight: 3,
        retriggerCondition: {'type': ['bridge', 'engineering', 'armory']},
        retriggerTimes: 1,
        context: 'any',
        description: 'Retrigger all boosters one time.'
    },
    {
        id: 'double_retrigger', 
        type: 'bridge', 
        rarity: 'rare', weight: 3,
        boosterAction: 'double_retriggers',
        retriggerCondition: {},
        context: 'any',
        description: 'Double the number of times boosters retrigger things.'
    },
    {
        id: 'stow_wavelengths', 
        type: 'bridge', 
        rarity: 'rare', weight: 10,
        context: 'stowed',
        conditional: false,
        boosterAction: 'stow_wavelengths',
        description: 'Increase wavelength of each stowed card.'
    },

    // engineering
    {
        id: 'upgrade_scoring_cards', 
        type: 'engineering', 
        rarity: 'rare', weight: 30,
        procChance: .25,
        conditional: false,
        boosterAction: 'upgrade_scoring_cards',
        description: '25% chance to upgrade all scoring cards.'
    },
    {
        id: 'upgrade_played_combo', 
        type: 'engineering', 
        rarity: 'rare', weight: 30,
        procChance: .25,
        conditional: false,
        improveAmount: .1,
        improveChance: .25,
        selfImprove: 'procChance',
        boosterAction: 'upgrade_played_combo',
        description: '<span class="description-procChance">25</span>% chance of +1 level to played combo. 25% chance to increase chance this booster procs by <span class="description-procChance-improve">10</span>% when this booster procs.'
    },
    {
        id: 'double_power_values', 
        type: 'engineering', 
        rarity: 'rare', weight: 6,
        boosterAction: 'double_power_values',
        retriggerCondition: {},
        context: 'any',
        description: 'Double the power values of all other boosters.'
    },



    // armory
    {
        id: 'stowed_special_card', 
        type: 'armory', 
        rarity: 'rare', weight: 20,
        conditional: false,
        context: 'stowed',
        procChance: .25,
        boosterAction: 'stowed_special_card',
        description: '25% chance to convert a random stowed card to a random special card.'
    },
    {
        id: 'stowed_upgrade_card', 
        type: 'armory', 
        rarity: 'rare', weight: 40,
        conditional: false,
        context: 'stowed',
        boosterAction: 'stowed_upgrade_card',
        description: 'Upgrade a random stowed card.'
    },
    {
        id: 'upgrade_stowed_cards', 
        type: 'armory', 
        rarity: 'rare', weight: 40,
        procChance: .25,
        conditional: false,
        context: 'stowed',
        boosterAction: 'upgrade_stowed_cards',
        description: '25% chance to upgrade all stowed cards.'
    },



];
export default ALL_BOOSTERS;
