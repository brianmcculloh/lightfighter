const defaultData = {
    total_runs: 0,
    highest_total_damage: 0,
    highest_system_class: 0.0,
    highest_damage: 0,
    highest_power: 1,
    highest_pierce: 1,
    highest_spread: 1,
    highest_player_level: 1,
    highest_card_level: 1,
    highest_combo_level: 1,
    highest_win_streak: 0,

    discovered: {
        boosters: [],
        system_hearts: [],
        injectors: [],
    },

    deaths: {},

}

// This is our single shared stats object:
const stats = {
  data: { ...defaultData },
  reset() {
    Object.assign(this.data, defaultData);
  }
};

export default stats;
