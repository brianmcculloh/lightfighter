import { Decimal } from 'decimal.js';

/*
SHIELD/VULNERABILITY
warm
cool
armament
chromatic
all colors
all types

RANDOM
To randomize the set selections for shield/vuln/debuff, use the following syntax:
random: ['shield']
random: ['vulnerability', 'shield']
random: ['vulnerability', 'shield', 'debuff']

DEBUFFS are defined in cards.js

*/

const ALL_ENEMIES = [

    {id: 'frigate_1', name: 'Frigate I', max:                   new Decimal(1000), current: new Decimal(0), system: 1, class: 1, vulnerability: ['warm']},
    {id: 'frigate_2', name: 'Frigate II', max:                  new Decimal(2000), current: new Decimal(0), system: 1, class: 2, vulnerability: ['cool']},
    {id: 'frigate_3', name: 'Frigate III', max:                 new Decimal(3000), current: new Decimal(0), system: 1, class: 3, vulnerability: ['chromatic']},
    {id: 'frigate_4', name: 'Frigate IV', max:                  new Decimal(4000), current: new Decimal(0), system: 1, class: 4, vulnerability: ['armament']},
    {id: 'frigate_5_a', name: 'Frigate V A Boss', max:          new Decimal(5000), current: new Decimal(0), system: 1, class: 5, vulnerability: ['warm', 'cool', 'chromatic', 'armament'], random: ['vulnerability']},
    {id: 'frigate_5_b', name: 'Frigate V B Boss', max:          new Decimal(5000), current: new Decimal(0), system: 1, class: 5, vulnerability: ['warm', 'cool', 'chromatic', 'armament'], random: ['vulnerability']},
    {id: 'frigate_5_c', name: 'Frigate V C Boss', max:          new Decimal(5000), current: new Decimal(0), system: 1, class: 5, vulnerability: ['warm', 'cool', 'chromatic', 'armament'], random: ['vulnerability']},

    {id: 'cruiser_1', name: 'Cruiser I', max:                   new Decimal(10000), current: new Decimal(0), system: 2, class: 1, vulnerability: ['plasma_cell', 'dark_matter']},
    {id: 'cruiser_2', name: 'Cruiser II', max:                  new Decimal(20000), current: new Decimal(0), system: 2, class: 2, vulnerability: ['dark_matter', 'quantum_shard']},
    {id: 'cruiser_3', name: 'Cruiser III', max:                 new Decimal(30000), current: new Decimal(0), system: 2, class: 3, vulnerability: ['quantum_shard', 'nano_swarm']},
    {id: 'cruiser_4', name: 'Cruiser IV', max:                  new Decimal(40000), current: new Decimal(0), system: 2, class: 4, vulnerability: ['nano_swarm', 'gravity_wave']},
    {id: 'cruiser_5_a', name: 'Cruiser V A Boss', max:          new Decimal(50000), current: new Decimal(0), system: 2, class: 5, vulnerability: ['gravity_wave']},
    {id: 'cruiser_5_b', name: 'Cruiser V B Boss', max:          new Decimal(50000), current: new Decimal(0), system: 2, class: 5, vulnerability: ['plasma_cell']},
    {id: 'cruiser_5_c', name: 'Cruiser V C Boss', max:          new Decimal(50000), current: new Decimal(0), system: 2, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability']},

    {id: 'starship_1', name: 'Starship I', max:                 new Decimal(100000), current: new Decimal(0), system: 3, class: 1, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability']},
    {id: 'starship_2', name: 'Starship II', max:                new Decimal(200000), current: new Decimal(0), system: 3, class: 2, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability']},
    {id: 'starship_3', name: 'Starship III', max:               new Decimal(300000), current: new Decimal(0), system: 3, class: 3, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability']},
    {id: 'starship_c_4', name: 'Starship C IV', max:            new Decimal(400000), current: new Decimal(0), system: 3, class: 4, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability']},
    {id: 'starship_5_a', name: 'Starship V A Boss', max:        new Decimal(500000), current: new Decimal(0), system: 3, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['time_shifts_disabled'], random: ['vulnerability']},
    {id: 'starship_5_b', name: 'Starship V B Boss', max:        new Decimal(500000), current: new Decimal(0), system: 3, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['injectors_disabled'], random: ['vulnerability']},
    {id: 'starship_5_c', name: 'Starship V C Boss', max:        new Decimal(500000), current: new Decimal(0), system: 3, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['no_spectrum_bonus'], random: ['vulnerability']},

    {id: 'commander_1', name: 'Commander I', max:               new Decimal(1000000), current: new Decimal(0), system: 4, class: 1, vulnerability: ['red', 'orange']},
    {id: 'commander_2', name: 'Commander II', max:              new Decimal(2000000), current: new Decimal(0), system: 4, class: 2, vulnerability: ['yellow', 'green']},
    {id: 'commander_3', name: 'Commander III', max:             new Decimal(3000000), current: new Decimal(0), system: 4, class: 3, vulnerability: ['blue', 'indigo']},
    {id: 'commander_4', name: 'Commander IV', max:              new Decimal(4000000), current: new Decimal(0), system: 4, class: 4, vulnerability: ['violet', 'white']},
    {id: 'commander_5_a', name: 'Commander V A Boss', max:      new Decimal(5000000), current: new Decimal(0), system: 4, class: 5, vulnerability: ['ultraviolet'], debuff: ['minimum_wavelengths']},
    {id: 'commander_5_b', name: 'Commander V B Boss', max:      new Decimal(5000000), current: new Decimal(0), system: 4, class: 5, vulnerability: ['black'], debuff: ['combos_ignored']},
    {id: 'commander_5_c', name: 'Commander V C Boss', max:      new Decimal(5000000), current: new Decimal(0), system: 4, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], debuff: ['card_levels_nerfed'], random: ['vulnerability']},

    {id: 'intrepid_1', name: 'Intrepid I', max:                 new Decimal(10000000), current: new Decimal(0), system: 5, class: 1, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], random: ['vulnerability']},
    {id: 'intrepid_2', name: 'Intrepid II', max:                new Decimal(20000000), current: new Decimal(0), system: 5, class: 2, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], random: ['vulnerability']},
    {id: 'intrepid_3', name: 'Intrepid III', max:               new Decimal(30000000), current: new Decimal(0), system: 5, class: 3, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], random: ['vulnerability']},
    {id: 'intrepid_4', name: 'Intrepid IV', max:                new Decimal(40000000), current: new Decimal(0), system: 5, class: 4, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], random: ['vulnerability']},
    {id: 'intrepid_5_a', name: 'Intrepid V A Boss', max:        new Decimal(50000000), current: new Decimal(0), system: 5, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], debuff: ['disable_bridge_booster'], random: ['vulnerability']},
    {id: 'intrepid_5_b', name: 'Intrepid V B Boss', max:        new Decimal(50000000), current: new Decimal(0), system: 5, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], debuff: ['disable_engineering_booster'], random: ['vulnerability']},
    {id: 'intrepid_5_c', name: 'Intrepid V C Boss', max:        new Decimal(50000000), current: new Decimal(0), system: 5, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], debuff: ['disable_armory_booster'], random: ['vulnerability']},

    {id: 'destroyer_1', name: 'Destroyer I', max:               new Decimal(100000000), current: new Decimal(0), system: 6, class: 1, vulnerability: ['warm'], shield: ['red']},
    {id: 'destroyer_2', name: 'Destroyer II', max:              new Decimal(200000000), current: new Decimal(0), system: 6, class: 2, vulnerability: ['cool'], shield: ['orange']},
    {id: 'destroyer_3', name: 'Destroyer III', max:             new Decimal(300000000), current: new Decimal(0), system: 6, class: 3, vulnerability: ['chromatic'], shield: ['yellow']},
    {id: 'destroyer_4', name: 'Destroyer IV', max:              new Decimal(400000000), current: new Decimal(0), system: 6, class: 4, vulnerability: ['armament'], shield: ['green']},
    {id: 'destroyer_5_a', name: 'Destroyer V A Boss', max:      new Decimal(500000000), current: new Decimal(0), system: 6, class: 5, vulnerability: ['warm', 'cool', 'chromatic', 'armament'], shield: ['blue'], debuff: ['minus_1_attack'], random: ['vulnerability']},
    {id: 'destroyer_5_b', name: 'Destroyer V B Boss', max:      new Decimal(500000000), current: new Decimal(0), system: 6, class: 5, vulnerability: ['warm', 'cool', 'chromatic', 'armament'], shield: ['red', 'orange', 'yellow', 'green', 'blue'], debuff: ['minus_1_stow'], random: ['vulnerability', 'shield']},
    {id: 'destroyer_5_c', name: 'Destroyer V C Boss', max:      new Decimal(500000000), current: new Decimal(0), system: 6, class: 5, vulnerability: ['warm', 'cool', 'chromatic', 'armament'], shield: ['red', 'orange', 'yellow', 'green', 'blue'], debuff: ['disable_random_booster'], random: ['vulnerability', 'shield']},

    {id: 'executor_1', name: 'Executor I', max:                 new Decimal(1000000000), current: new Decimal(0), system: 7, class: 1, vulnerability: ['plasma_cell', 'dark_matter'], shield: ['indigo']},
    {id: 'executor_2', name: 'Executor II', max:                new Decimal(2000000000), current: new Decimal(0), system: 7, class: 2, vulnerability: ['dark_matter', 'quantum_shard'], shield: ['violet']},
    {id: 'executor_3', name: 'Executor III', max:               new Decimal(3000000000), current: new Decimal(0), system: 7, class: 3, vulnerability: ['quantum_shard', 'nano_swarm'], shield: ['white']},
    {id: 'executor_4', name: 'Executor IV', max:                new Decimal(4000000000), current: new Decimal(0), system: 7, class: 4, vulnerability: ['nano_swarm', 'gravity_wave'], shield: ['ultraviolet']},
    {id: 'executor_5_a', name: 'Executor V A Boss', max:        new Decimal(5000000000), current: new Decimal(0), system: 7, class: 5, vulnerability: ['gravity_wave'], shield: ['black'], debuff: ['attacks_require_stowed_combo']},
    {id: 'executor_5_b', name: 'Executor V B Boss', max:        new Decimal(5000000000), current: new Decimal(0), system: 7, class: 5, vulnerability: ['plasma_cell'], shield: ['indigo', 'violet', 'white', 'ultraviolet', 'black'], debuff: ['disable_boosters_until_0_stows'], random: ['shield']},
    {id: 'executor_5_c', name: 'Executor V C Boss', max:        new Decimal(5000000000), current: new Decimal(0), system: 7, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['indigo', 'violet', 'white', 'ultraviolet', 'black'], debuff: ['disable_boosters_until_1_attack'], random: ['vulnerability', 'shield']},

    {id: 'punisher_1', name: 'Punisher I', max:                 new Decimal(10000000000), current: new Decimal(0), system: 8, class: 1, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['warm'], random: ['vulnerability']},
    {id: 'punisher_2', name: 'Punisher II', max:                new Decimal(20000000000), current: new Decimal(0), system: 8, class: 2, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['cool'], random: ['vulnerability']},
    {id: 'punisher_3', name: 'Punisher III', max:               new Decimal(30000000000), current: new Decimal(0), system: 8, class: 3, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['chromatic'], random: ['vulnerability']},
    {id: 'punisher_4', name: 'Punisher IV', max:                new Decimal(40000000000), current: new Decimal(0), system: 8, class: 4, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['armament'], random: ['vulnerability']},
    {id: 'punisher_5_a', name: 'Punisher V A Boss', max:        new Decimal(50000000000), current: new Decimal(0), system: 8, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['warm', 'cool', 'chromatic', 'armament'], debuff: ['disable_red_cards'], random: ['vulnerability', 'shield']},
    {id: 'punisher_5_b', name: 'Punisher V B Boss', max:        new Decimal(50000000000), current: new Decimal(0), system: 8, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['warm', 'cool', 'chromatic', 'armament'], debuff: ['disable_blue_cards'], random: ['vulnerability', 'shield']},
    {id: 'punisher_5_c', name: 'Punisher V C Boss', max:        new Decimal(50000000000), current: new Decimal(0), system: 8, class: 5, vulnerability: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], shield: ['warm', 'cool', 'chromatic', 'armament'], debuff: ['disable_plasma_cell_cards'], random: ['vulnerability', 'shield']},

    {id: 'monolith_1', name: 'Monolith I', max:                 new Decimal(100000000000), current: new Decimal(0), system: 9, class: 1, vulnerability: ['red', 'orange'], shield: ['plasma_cell']},
    {id: 'monolith_2', name: 'Monolith II', max:                new Decimal(200000000000), current: new Decimal(0), system: 9, class: 2, vulnerability: ['yellow', 'green'], shield: ['dark_matter']},
    {id: 'monolith_3', name: 'Monolith III', max:               new Decimal(300000000000), current: new Decimal(0), system: 9, class: 3, vulnerability: ['blue', 'indigo'], shield: ['quantum_shard']},
    {id: 'monolith_4', name: 'Monolith IV', max:                new Decimal(400000000000), current: new Decimal(0), system: 9, class: 4, vulnerability: ['violet', 'white'], shield: ['nano_swarm']},
    {id: 'monolith_5_a', name: 'Monolith V A Boss', max:        new Decimal(500000000000), current: new Decimal(0), system: 9, class: 5, vulnerability: ['ultraviolet'], shield: ['gravity_wave'], debuff: ['disable_orange_cards']},
    {id: 'monolith_5_b', name: 'Monolith V B Boss', max:        new Decimal(500000000000), current: new Decimal(0), system: 9, class: 5, vulnerability: ['black'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['disable_indigo_cards'], random: ['shield']},
    {id: 'monolith_5_c', name: 'Monolith V C Boss', max:        new Decimal(500000000000), current: new Decimal(0), system: 9, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['disable_dark_matter_cards'], random: ['vulnerability', 'shield']},
    
    {id: 'vast_1', name: 'Vast I', max:                         new Decimal(1000000000000), current: new Decimal(0), system: 10, class: 1, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability', 'shield']},
    {id: 'vast_2', name: 'Vast II', max:                        new Decimal(2000000000000), current: new Decimal(0), system: 10, class: 2, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability', 'shield']},
    {id: 'vast_3', name: 'Vast III', max:                       new Decimal(3000000000000), current: new Decimal(0), system: 10, class: 3, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability', 'shield']},
    {id: 'vast_4', name: 'Vast IV', max:                        new Decimal(4000000000000), current: new Decimal(0), system: 10, class: 4, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], random: ['vulnerability', 'shield']},
    {id: 'vast_5_a', name: 'Vast V A Boss', max:                new Decimal(5000000000000), current: new Decimal(0), system: 10, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['disable_yellow_cards'], random: ['vulnerability', 'shield']},
    {id: 'vast_5_b', name: 'Vast V B Boss', max:                new Decimal(5000000000000), current: new Decimal(0), system: 10, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['disable_violet_cards'], random: ['vulnerability', 'shield']},
    {id: 'vast_5_c', name: 'Vast V C Boss', max:                new Decimal(5000000000000), current: new Decimal(0), system: 10, class: 5, vulnerability: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white'], shield: ['plasma_cell', 'dark_matter', 'quantum_shard', 'nano_swarm', 'gravity_wave'], debuff: ['disable_quantum_shard_cards'], random: ['vulnerability', 'shield']},

    {id: 'enterprise_1', name: 'Enterprise I', max:             new Decimal(10000000000000), current: new Decimal(0), system: 11, class: 1, vulnerability: [], shield: []},
    {id: 'enterprise_2', name: 'Enterprise II', max:            new Decimal(100000000000000), current: new Decimal(0), system: 11, class: 2, vulnerability: [], shield: []},
    {id: 'enterprise_3', name: 'Enterprise III', max:           new Decimal(1000000000000000), current: new Decimal(0), system: 11, class: 3, vulnerability: [], shield: []},
    {id: 'enterprise_4', name: 'Enterprise IV', max:            new Decimal(10000000000000000), current: new Decimal(0), system: 11, class: 4, vulnerability: [], shield: []},
    {id: 'enterprise_5_a', name: 'Enterprise V A Boss', max:    new Decimal(100000000000000000), current: new Decimal(0), system: 11, class: 5, vulnerability: [], shield: [], debuff: ['disable_green_cards']},
    {id: 'enterprise_5_b', name: 'Enterprise V B Boss', max:    new Decimal(100000000000000000), current: new Decimal(0), system: 11, class: 5, vulnerability: [], shield: [], debuff: ['disable_white_cards']},
    {id: 'enterprise_5_c', name: 'Enterprise V C Boss', max:    new Decimal(100000000000000000), current: new Decimal(0), system: 11, class: 5, vulnerability: [], shield: [], debuff: ['disable_gravity_wave_cards']},

    {id: 'assailant_1', name: 'Assailant I', max:               new Decimal(1000000000000000000), current: new Decimal(0), system: 12, class: 1, vulnerability: [], shield: []},
    {id: 'assailant_2', name: 'Assailant II', max:              new Decimal(10000000000000000000), current: new Decimal(0), system: 12, class: 2, vulnerability: [], shield: []},
    {id: 'assailant_3', name: 'Assailant III', max:             new Decimal(100000000000000000000), current: new Decimal(0), system: 12, class: 3, vulnerability: [], shield: []},
    {id: 'assailant_4', name: 'Assailant IV', max:              new Decimal(1000000000000000000000), current: new Decimal(0), system: 12, class: 4, vulnerability: [], shield: []},
    {id: 'assailant_5_a', name: 'Assailant V A Boss', max:      new Decimal(10000000000000000000000), current: new Decimal(0), system: 12, class: 5, vulnerability: [], shield: [], debuff: ['disable_ultraviolet_cards']},
    {id: 'assailant_5_b', name: 'Assailant V B Boss', max:      new Decimal(10000000000000000000000), current: new Decimal(0), system: 12, class: 5, vulnerability: [], shield: [], debuff: ['disable_black_cards']},
    {id: 'assailant_5_c', name: 'Assailant V C Boss', max:      new Decimal(10000000000000000000000), current: new Decimal(0), system: 12, class: 5, vulnerability: [], shield: [], debuff: ['disable_nano_swarm_cards']},

    {id: 'condemner_1', name: 'Condemner I', max:               new Decimal(100000000000000000000000), current: new Decimal(0), system: 13, class: 1, vulnerability: [], shield: []},
    {id: 'condemner_2', name: 'Condemner II', max:              new Decimal(1000000000000000000000000), current: new Decimal(0), system: 13, class: 2, vulnerability: [], shield: []},
    {id: 'condemner_3', name: 'Condemner III', max:             new Decimal(10000000000000000000000000), current: new Decimal(0), system: 13, class: 3, vulnerability: [], shield: []},
    {id: 'condemner_4', name: 'Condemner IV', max:              new Decimal(100000000000000000000000000), current: new Decimal(0), system: 13, class: 4, vulnerability: [], shield: []},
    {id: 'condemner_5_a', name: 'Condemner V A Boss', max:      new Decimal(1000000000000000000000000000), current: new Decimal(0), system: 13, class: 5, vulnerability: [], shield: [], debuff: ['disable_xp_boosters']},
    {id: 'condemner_5_b', name: 'Condemner V B Boss', max:      new Decimal(1000000000000000000000000000), current: new Decimal(0), system: 13, class: 5, vulnerability: [], shield: [], debuff: ['disable_credits_boosters']},
    {id: 'condemner_5_c', name: 'Condemner V C Boss', max:      new Decimal(1000000000000000000000000000), current: new Decimal(0), system: 13, class: 5, vulnerability: [], shield: [], debuff: ['disable_common_boosters']},

    {id: 'endeavor_1', name: 'Endeavor I', max:                 new Decimal(100000000000000000000000000000), current: new Decimal(0), system: 14, class: 1, vulnerability: [], shield: []},
    {id: 'endeavor_2', name: 'Endeavor II', max:                new Decimal(10000000000000000000000000000000), current: new Decimal(0), system: 14, class: 2, vulnerability: [], shield: []},
    {id: 'endeavor_3', name: 'Endeavor III', max:               new Decimal(1000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 3, vulnerability: [], shield: []},
    {id: 'endeavor_4', name: 'Endeavor IV', max:                new Decimal(100000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 4, vulnerability: [], shield: []},
    {id: 'endeavor_5_a', name: 'Endeavor V A Boss', max:        new Decimal(10000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 5, vulnerability: [], shield: [], debuff: ['disable_additive_boosters']},
    {id: 'endeavor_5_b', name: 'Endeavor V B Boss', max:        new Decimal(10000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 5, vulnerability: [], shield: [], debuff: ['disable_multiplicative_boosters']},
    {id: 'endeavor_5_c', name: 'Endeavor V C Boss', max:        new Decimal(10000000000000000000000000000000000000), current: new Decimal(0), system: 14, class: 5, vulnerability: [], shield: [], debuff: ['disable_self_improving_boosters']},

    {id: 'axiom_1', name: 'Axiom I', max:                       new Decimal(10000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 1, vulnerability: [], shield: []},
    {id: 'axiom_2', name: 'Axiom II', max:                      new Decimal(10000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 2, vulnerability: [], shield: []},
    {id: 'axiom_3', name: 'Axiom III', max:                     new Decimal(10000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 3, vulnerability: [], shield: []},
    {id: 'axiom_4', name: 'Axiom IV', max:                      new Decimal(10000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 4, vulnerability: [], shield: []},
    {id: 'axiom_5_a', name: 'Axiom V A Boss', max:              new Decimal(10000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 5, vulnerability: [], shield: [], debuff: ['disable_damage_boosters']},
    {id: 'axiom_5_b', name: 'Axiom V B Boss', max:              new Decimal(10000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 5, vulnerability: [], shield: [], debuff: ['disable_power_boosters']},
    {id: 'axiom_5_c', name: 'Axiom V C Boss', max:              new Decimal(10000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 15, class: 5, vulnerability: [], shield: [], debuff: ['disable_pierce_boosters']},

    {id: 'massive_1', name: 'Massive I', max:                   new Decimal(100000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 1, vulnerability: [], shield: []},
    {id: 'massive_2', name: 'Massive II', max:                  new Decimal(1000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 2, vulnerability: [], shield: []},
    {id: 'massive_3', name: 'Massive III', max:                 new Decimal(10000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 3, vulnerability: [], shield: []},
    {id: 'massive_4', name: 'Massive IV', max:                  new Decimal(100000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 4, vulnerability: [], shield: []},
    {id: 'massive_5_a', name: 'Massive V A Boss', max:          new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 5, vulnerability: [], shield: [], debuff: ['disable_retriggering_boosters']},
    {id: 'massive_5_b', name: 'Massive V B Boss', max:          new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 5, vulnerability: [], shield: [], debuff: ['disable_spread_boosters']},
    {id: 'massive_5_c', name: 'Massive V C Boss', max:          new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 16, class: 5, vulnerability: [], shield: [], debuff: ['disable_legendary_boosters']},

    {id: 'colossus_1', name: 'Colossus I', max:                 new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 1, shield: []},
    {id: 'colossus_2', name: 'Colossus II', max:                new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 2, shield: []},
    {id: 'colossus_3', name: 'Colossus III', max:               new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 3, shield: []},
    {id: 'colossus_4', name: 'Colossus IV', max:                new Decimal(100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 4, shield: []},
    {id: 'colossus_5_a', name: 'Colossus V A Boss', max:        new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 5, shield: [], debuff: ['minus_1_stow', 'disable_uncommon_boosters']},
    {id: 'colossus_5_b', name: 'Colossus V B Boss', max:        new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 5, shield: [], debuff: ['disable_bridge_booster', 'disable_engineering_booster', 'disable_armory_booster']},
    {id: 'colossus_5_c', name: 'Colossus V C Boss', max:        new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 17, class: 5, shield: [], debuff: ['minus_1_attack', 'disable_rare_boosters']},
    
    {id: 'juggernaut_1', name: 'Juggernaut I', max:             new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 1, shield: []},
    {id: 'juggernaut_2', name: 'Juggernaut II', max:            new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 2, shield: []},
    {id: 'juggernaut_3', name: 'Juggernaut III', max:           new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 3, shield: []},
    {id: 'juggernaut_4', name: 'Juggernaut IV', max:            new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 4, shield: []},
    {id: 'juggernaut_5_a', name: 'Juggernaut V A Boss', max:    new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 5, shield: [], debuff: ['injectors_disabled', 'combos_ignored', 'card_levels_nerfed']},
    {id: 'juggernaut_5_b', name: 'Juggernaut V B Boss', max:    new Decimal(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 5, shield: [], debuff: ['time_shifts_disabled', 'no_spectrum_bonus', 'minimum_wavelengths']},
    {id: 'juggernaut_5_c', name: 'Juggernaut V C Boss', max:    new Decimal(10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000), current: new Decimal(0), system: 18, class: 5, shield: [], debuff: ['disable_boosters_until_0_stows', 'disable_boosters_until_1_attack', 'attacks_require_stowed_combo']},

];

export default ALL_ENEMIES;