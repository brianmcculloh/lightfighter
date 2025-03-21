import { Decimal } from 'decimal.js';

/*
DEBUFFS:
minus_1_attack
minus_1_stow
disable_bridge_booster
disable_engineering_booster
disable_armory_booster


TODO:
cannot attack until at least one combo is stowed
cannot use time shifts
one random booster is disabled at beginning of combat
cannot use injectors
cannot play a certain color of cards
cannot play a certain type of cards
no spectrum bonus
cannot play injectors
combos are ignored
all wavelengths are minimum
all boosters are disabled until stows remaining is 0
all boosters are disabled until attacks remaining is 0

*/

const ALL_ENEMIES = [

    {id: 'frigate_1', name: 'Frigate I', max:                   new Decimal(2000), current: new Decimal(0), system: 1, class: 1, vulnerability: ['warm']},
    {id: 'frigate_2', name: 'Frigate II', max:                  new Decimal(3000), current: new Decimal(0), system: 1, class: 2, vulnerability: ['cool']},
    {id: 'frigate_3', name: 'Frigate III', max:                 new Decimal(4000), current: new Decimal(0), system: 1, class: 3, vulnerability: ['black', 'ultraviolet']},
    {id: 'frigate_4', name: 'Frigate IV', max:                  new Decimal(5000), current: new Decimal(0), system: 1, class: 4, vulnerability: ['armament', 'chromatic']},
    {id: 'frigate_5_a', name: 'Frigate V A Boss', max:          new Decimal(7000), current: new Decimal(0), system: 1, class: 5, vulnerability: ['warm'], debuff: ['disable_bridge_booster']},
    {id: 'frigate_5_b', name: 'Frigate V B Boss', max:          new Decimal(7000), current: new Decimal(0), system: 1, class: 5, vulnerability: ['cool'], debuff: ['disable_engineering_booster']},
    {id: 'frigate_5_c', name: 'Frigate V C Boss', max:          new Decimal(7000), current: new Decimal(0), system: 1, class: 5, vulnerability: ['chromatic', 'armament'], debuff: ['disable_armory_booster']},

    {id: 'cruiser_1', name: 'Cruiser I', max:                   new Decimal(9000), current: new Decimal(0), system: 2, class: 1, vulnerability: ['warm']},
    {id: 'cruiser_2', name: 'Cruiser II', max:                  new Decimal(12000), current: new Decimal(0), system: 2, class: 2, vulnerability: ['cool']},
    {id: 'cruiser_3', name: 'Cruiser III', max:                 new Decimal(15000), current: new Decimal(0), system: 2, class: 3, vulnerability: ['black', 'ultraviolet']},
    {id: 'cruiser_4', name: 'Cruiser IV', max:                  new Decimal(25000), current: new Decimal(0), system: 2, class: 4, vulnerability: ['armament', 'chromatic']},
    {id: 'cruiser_5_a', name: 'Cruiser V A Boss', max:          new Decimal(35000), current: new Decimal(0), system: 2, class: 5, vulnerability: ['warm']},
    {id: 'cruiser_5_b', name: 'Cruiser V B Boss', max:          new Decimal(35000), current: new Decimal(0), system: 2, class: 5, vulnerability: ['cool']},
    {id: 'cruiser_5_c', name: 'Cruiser V C Boss', max:          new Decimal(35000), current: new Decimal(0), system: 2, class: 5, vulnerability: ['chromatic', 'armament']},

    {id: 'starship_1', name: 'Starship I', max:                 new Decimal(70000), current: new Decimal(0), system: 3, class: 1, vulnerability: ['warm']},
    {id: 'starship_2', name: 'Starship II', max:                new Decimal(140000), current: new Decimal(0), system: 3, class: 2, vulnerability: ['cool']},
    {id: 'starship_3', name: 'Starship III', max:               new Decimal(280000), current: new Decimal(0), system: 3, class: 3, vulnerability: ['black', 'ultraviolet']},
    {id: 'starship_c_4', name: 'Starship C IV', max:            new Decimal(520000), current: new Decimal(0), system: 3, class: 4, vulnerability: ['armament', 'chromatic']},
    {id: 'starship_5_a', name: 'Starship V A Boss', max:        new Decimal(1000000), current: new Decimal(0), system: 3, class: 5, vulnerability: ['warm']},
    {id: 'starship_5_b', name: 'Starship V B Boss', max:        new Decimal(1000000), current: new Decimal(0), system: 3, class: 5, vulnerability: ['cool']},
    {id: 'starship_5_c', name: 'Starship V C Boss', max:        new Decimal(1000000), current: new Decimal(0), system: 3, class: 5, vulnerability: ['armament', 'chromatic']},

    {id: 'commander_1', name: 'Commander I', max:               new Decimal(2000000), current: new Decimal(0), system: 4, class: 1},
    {id: 'commander_2', name: 'Commander II', max:              new Decimal(4000000), current: new Decimal(0), system: 4, class: 2},
    {id: 'commander_3', name: 'Commander III', max:             new Decimal(6000000), current: new Decimal(0), system: 4, class: 3},
    {id: 'commander_4', name: 'Commander IV', max:              new Decimal(8000000), current: new Decimal(0), system: 4, class: 4},
    {id: 'commander_5_a', name: 'Commander V A Boss', max:      new Decimal(10000000), current: new Decimal(0), system: 4, class: 5},
    {id: 'commander_5_b', name: 'Commander V B Boss', max:      new Decimal(10000000), current: new Decimal(0), system: 4, class: 5},
    {id: 'commander_5_c', name: 'Commander V C Boss', max:      new Decimal(10000000), current: new Decimal(0), system: 4, class: 5},

    {id: 'intrepid_1', name: 'Intrepid I', max:                 new Decimal(20000000), current: new Decimal(0), system: 5, class: 1},
    {id: 'intrepid_2', name: 'Intrepid II', max:                new Decimal(40000000), current: new Decimal(0), system: 5, class: 2},
    {id: 'intrepid_3', name: 'Intrepid III', max:               new Decimal(80000000), current: new Decimal(0), system: 5, class: 3},
    {id: 'intrepid_4', name: 'Intrepid IV', max:                new Decimal(100000000), current: new Decimal(0), system: 5, class: 4},
    {id: 'intrepid_5_a', name: 'Intrepid V A Boss', max:        new Decimal(150000000), current: new Decimal(0), system: 5, class: 5},
    {id: 'intrepid_5_b', name: 'Intrepid V B Boss', max:        new Decimal(150000000), current: new Decimal(0), system: 5, class: 5},
    {id: 'intrepid_5_c', name: 'Intrepid V C Boss', max:        new Decimal(150000000), current: new Decimal(0), system: 5, class: 5},

    {id: 'destroyer_1', name: 'Destroyer I', max:               new Decimal(200000000), current: new Decimal(0), system: 6, class: 1},
    {id: 'destroyer_2', name: 'Destroyer II', max:              new Decimal(400000000), current: new Decimal(0), system: 6, class: 2},
    {id: 'destroyer_3', name: 'Destroyer III', max:             new Decimal(800000000), current: new Decimal(0), system: 6, class: 3},
    {id: 'destroyer_4', name: 'Destroyer IV', max:              new Decimal(1600000000), current: new Decimal(0), system: 6, class: 4},
    {id: 'destroyer_5_a', name: 'Destroyer V A Boss', max:      new Decimal(2000000000), current: new Decimal(0), system: 6, class: 5},
    {id: 'destroyer_5_b', name: 'Destroyer V B Boss', max:      new Decimal(2000000000), current: new Decimal(0), system: 6, class: 5},
    {id: 'destroyer_5_c', name: 'Destroyer V C Boss', max:      new Decimal(2000000000), current: new Decimal(0), system: 6, class: 5},

    {id: 'executor_1', name: 'Executor I', max:                 new Decimal(4000000000), current: new Decimal(0), system: 7, class: 1},
    {id: 'executor_2', name: 'Executor II', max:                new Decimal(8000000000), current: new Decimal(0), system: 7, class: 2},
    {id: 'executor_3', name: 'Executor III', max:               new Decimal(16000000000), current: new Decimal(0), system: 7, class: 3},
    {id: 'executor_4', name: 'Executor IV', max:                new Decimal(32000000000), current: new Decimal(0), system: 7, class: 4},
    {id: 'executor_5_a', name: 'Executor V A Boss', max:        new Decimal(64000000000), current: new Decimal(0), system: 7, class: 5},
    {id: 'executor_5_b', name: 'Executor V B Boss', max:        new Decimal(64000000000), current: new Decimal(0), system: 7, class: 5},
    {id: 'executor_5_c', name: 'Executor V C Boss', max:        new Decimal(64000000000), current: new Decimal(0), system: 7, class: 5},

    {id: 'punisher_1', name: 'Punisher I', max:                 new Decimal(100000000000), current: new Decimal(0), system: 8, class: 1},
    {id: 'punisher_2', name: 'Punisher II', max:                new Decimal(200000000000), current: new Decimal(0), system: 8, class: 2},
    {id: 'punisher_3', name: 'Punisher III', max:               new Decimal(400000000000), current: new Decimal(0), system: 8, class: 3},
    {id: 'punisher_4', name: 'Punisher IV', max:                new Decimal(800000000000), current: new Decimal(0), system: 8, class: 4},
    {id: 'punisher_5_a', name: 'Punisher V A Boss', max:        new Decimal(200000000000), current: new Decimal(0), system: 8, class: 5},
    {id: 'punisher_5_b', name: 'Punisher V B Boss', max:        new Decimal(200000000000), current: new Decimal(0), system: 8, class: 5},
    {id: 'punisher_5_c', name: 'Punisher V C Boss', max:        new Decimal(200000000000), current: new Decimal(0), system: 8, class: 5},

    {id: 'monolith_1', name: 'Monolith I', max:                 new Decimal(2000000000000), current: new Decimal(0), system: 9, class: 1},
    {id: 'monolith_2', name: 'Monolith II', max:                new Decimal(10000000000000), current: new Decimal(0), system: 9, class: 2},
    {id: 'monolith_3', name: 'Monolith III', max:               new Decimal(20000000000000), current: new Decimal(0), system: 9, class: 3},
    {id: 'monolith_4', name: 'Monolith IV', max:                new Decimal(100000000000000), current: new Decimal(0), system: 9, class: 4},
    {id: 'monolith_5_a', name: 'Monolith V A Boss', max:        new Decimal(200000000000000), current: new Decimal(0), system: 9, class: 5},
    {id: 'monolith_5_b', name: 'Monolith V B Boss', max:        new Decimal(200000000000000), current: new Decimal(0), system: 9, class: 5},
    {id: 'monolith_5_c', name: 'Monolith V C Boss', max:        new Decimal(200000000000000), current: new Decimal(0), system: 9, class: 5},
    
    {id: 'vast_1', name: 'Vast I', max:                         new Decimal(200000000000000), current: new Decimal(0), system: 10, class: 1},
    {id: 'vast_2', name: 'Vast II', max:                        new Decimal(2000000000000000), current: new Decimal(0), system: 10, class: 2},
    {id: 'vast_3', name: 'Vast III', max:                       new Decimal(20000000000000000), current: new Decimal(0), system: 10, class: 3},
    {id: 'vast_4', name: 'Vast IV', max:                        new Decimal(200000000000000000), current: new Decimal(0), system: 10, class: 4},
    {id: 'vast_5_a', name: 'Vast V A Boss', max:                new Decimal(2000000000000000000), current: new Decimal(0), system: 10, class: 5},
    {id: 'vast_5_b', name: 'Vast V B Boss', max:                new Decimal(2000000000000000000), current: new Decimal(0), system: 10, class: 5},
    {id: 'vast_5_c', name: 'Vast V C Boss', max:                new Decimal(2000000000000000000), current: new Decimal(0), system: 10, class: 5},

    {id: 'enterprise_1', name: 'Enterprise I', max:             new Decimal(1000000000000000000000), current: new Decimal(0), system: 11, class: 1},
    {id: 'enterprise_2', name: 'Enterprise II', max:            new Decimal(10000000000000000000000), current: new Decimal(0), system: 11, class: 2},
    {id: 'enterprise_3', name: 'Enterprise III', max:           new Decimal(100000000000000000000000), current: new Decimal(0), system: 11, class: 3},
    {id: 'enterprise_4', name: 'Enterprise IV', max:            new Decimal(1000000000000000000000000), current: new Decimal(0), system: 11, class: 4},
    {id: 'enterprise_5_a', name: 'Enterprise V A Boss', max:    new Decimal(10000000000000000000000000), current: new Decimal(0), system: 11, class: 5},
    {id: 'enterprise_5_b', name: 'Enterprise V B Boss', max:    new Decimal(10000000000000000000000000), current: new Decimal(0), system: 11, class: 5},
    {id: 'enterprise_5_c', name: 'Enterprise V C Boss', max:    new Decimal(10000000000000000000000000), current: new Decimal(0), system: 11, class: 5},

    {id: 'assailant_1', name: 'Assailant I', max:               new Decimal(100000000000000000000000000000), current: new Decimal(0), system: 12, class: 1},
    {id: 'assailant_2', name: 'Assailant II', max:              new Decimal(1000000000000000000000000000000), current: new Decimal(0), system: 12, class: 2},
    {id: 'assailant_3', name: 'Assailant III', max:             new Decimal(10000000000000000000000000000000), current: new Decimal(0), system: 12, class: 3},
    {id: 'assailant_4', name: 'Assailant IV', max:              new Decimal(100000000000000000000000000000000), current: new Decimal(0), system: 12, class: 4},
    {id: 'assailant_5_a', name: 'Assailant V A Boss', max:      new Decimal(1000000000000000000000000000000000), current: new Decimal(0), system: 12, class: 5},
    {id: 'assailant_5_b', name: 'Assailant V B Boss', max:      new Decimal(1000000000000000000000000000000000), current: new Decimal(0), system: 12, class: 5},
    {id: 'assailant_5_c', name: 'Assailant V C Boss', max:      new Decimal(1000000000000000000000000000000000), current: new Decimal(0), system: 12, class: 5},

    {id: 'condemner_1', name: 'Condemner I', max:               new Decimal(1000000000000000000000000000000000000), current: new Decimal(0), system: 13, class: 1},
    {id: 'condemner_2', name: 'Condemner II', max:              new Decimal(10000000000000000000000000000000000000), current: new Decimal(0), system: 13, class: 2},
    {id: 'condemner_3', name: 'Condemner III', max:             new Decimal(100000000000000000000000000000000000000), current: new Decimal(0), system: 13, class: 3},
    {id: 'condemner_4', name: 'Condemner IV', max:              new Decimal(1000000000000000000000000000000000000000), current: new Decimal(0), system: 13, class: 4},
    {id: 'condemner_5_a', name: 'Condemner V A Boss', max:      new Decimal(10000000000000000000000000000000000000000), current: new Decimal(0), system: 13, class: 5},
    {id: 'condemner_5_b', name: 'Condemner V B Boss', max:      new Decimal(10000000000000000000000000000000000000000), current: new Decimal(0), system: 13, class: 5},
    {id: 'condemner_5_c', name: 'Condemner V C Boss', max:      new Decimal(10000000000000000000000000000000000000000), current: new Decimal(0), system: 13, class: 5},

    {id: 'endeavor_1', name: 'Endeavor I', max:                 new Decimal(10000000000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 1},
    {id: 'endeavor_2', name: 'Endeavor II', max:                new Decimal(1000000000000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 2},
    {id: 'endeavor_3', name: 'Endeavor III', max:               new Decimal(100000000000000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 3},
    {id: 'endeavor_4', name: 'Endeavor IV', max:                new Decimal(10000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 4},
    {id: 'endeavor_5_a', name: 'Endeavor V A Boss', max:        new Decimal(1000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 5},
    {id: 'endeavor_5_b', name: 'Endeavor V B Boss', max:        new Decimal(1000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 5},
    {id: 'endeavor_5_c', name: 'Endeavor V C Boss', max:        new Decimal(1000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 5},

    {id: 'axiom_1', name: 'Axiom I', max:                       new Decimal(10000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 1},
    {id: 'axiom_2', name: 'Axiom II', max:                      new Decimal(10000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 2},
    {id: 'axiom_3', name: 'Axiom III', max:                     new Decimal(10000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 3},
    {id: 'axiom_4', name: 'Axiom IV', max:                      new Decimal(10000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 4},
    {id: 'axiom_5_a', name: 'Axiom V A Boss', max:              new Decimal(10000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 5},
    {id: 'axiom_5_b', name: 'Axiom V B Boss', max:              new Decimal(10000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 5},
    {id: 'axiom_5_c', name: 'Axiom V C Boss', max:              new Decimal(10000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 5},

    {id: 'massive_1', name: 'Massive I', max:                   new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 1},
    {id: 'massive_2', name: 'Massive II', max:                  new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 2},
    {id: 'massive_3', name: 'Massive III', max:                 new Decimal(100000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 3},
    {id: 'massive_4', name: 'Massive IV', max:                  new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 4},
    {id: 'massive_5_a', name: 'Massive V A Boss', max:          new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 5},
    {id: 'massive_5_b', name: 'Massive V B Boss', max:          new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 5},
    {id: 'massive_5_c', name: 'Massive V C Boss', max:          new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 5},

    {id: 'colossus_1', name: 'Colossus I', max:                 new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 1},
    {id: 'colossus_2', name: 'Colossus II', max:                new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 2},
    {id: 'colossus_3', name: 'Colossus III', max:               new Decimal(100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 3},
    {id: 'colossus_4', name: 'Colossus IV', max:                new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 4},
    {id: 'colossus_5_a', name: 'Colossus V A Boss', max:        new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 5},
    {id: 'colossus_5_b', name: 'Colossus V B Boss', max:        new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 5},
    {id: 'colossus_5_c', name: 'Colossus V C Boss', max:        new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 5},
    
    {id: 'juggernaut_1', name: 'Juggernaut I', max:             new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 1},
    {id: 'juggernaut_2', name: 'Juggernaut II', max:            new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 2},
    {id: 'juggernaut_3', name: 'Juggernaut III', max:           new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 3},
    {id: 'juggernaut_4', name: 'Juggernaut IV', max:            new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 4},
    {id: 'juggernaut_5_a', name: 'Juggernaut V A Boss', max:    new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 5},
    {id: 'juggernaut_5_b', name: 'Juggernaut V B Boss', max:    new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 5},
    {id: 'juggernaut_5_c', name: 'Juggernaut V C Boss', max:    new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 5},

];

export default ALL_ENEMIES;