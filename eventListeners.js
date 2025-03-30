import { populateArsenalModal, populateCombosModal, populateStatsModal, stowEquippedCards, playEquippedCards, showOverworld, shop, init, checkLevel, visitMercenary, restockShop, refreshDom } from './script.js';
import { clearGameState, loadGameState, clearStats, saveStats } from './db.js';
import { customDialog } from './utils.js';
import game from './game.js';
import stats from './stats.js';

// eventListeners.js
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('stow-button').addEventListener('click', function() {
        // Check if there are no cards equipped and if the button is unavailable
        if (!this.classList.contains('unavailable') && game.temp.gunCards.length > 0) {
            stowEquippedCards();
        }
    });

    document.getElementById('attack-button').addEventListener('click', function() {
        // Check if there are no cards equipped before proceeding
        if (game.temp.gunCards.length > 0) {
            playEquippedCards();
        }
    });

    document.querySelector('#shop .done').addEventListener('click', function() {
        document.querySelector('#shop').classList.remove('shown');
        document.querySelectorAll('#boosters .destroy, #injectors .destroy').forEach(element => {
            element.classList.remove('shown');
        });
        showOverworld();
    });
    
    document.querySelector('#selection-modal .done').addEventListener('click', function() {
        document.querySelector('#selection-modal').classList.remove('shown');
        document.querySelector('#selection-modal .cancel').classList.add('shown');
        refreshDom();
    });

    document.querySelector('#selection-modal .cancel').addEventListener('click', function() {
        document.querySelector('#selection-modal').classList.remove('shown');
    });

    document.querySelector('#end-combat .button').addEventListener('click', async function() {

        document.querySelector('#end-combat').classList.remove('shown');

        document.querySelector('.stats .credits span').classList.add("active");
        let credits = parseInt(document.querySelector('.collect-credits span').textContent, 10);
        game.data.credits += credits;
        document.querySelector('.stats .credits span').textContent = game.data.credits;
        await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
        document.querySelector('.stats .credits span').classList.remove("active");

        document.querySelector('.stats .xp span').classList.add("active");
        let xp = parseInt(document.querySelector('.gain-xp span').textContent, 10);
        game.data.xp += xp;
        document.querySelector('.stats .xp span').textContent = game.data.xp;
        await new Promise(resolve => setTimeout(resolve, game.config.cardDelay)); 
        document.querySelector('.stats .xp span').classList.remove("active");

        checkLevel();
        shop();

    });
    
    document.querySelector('#arsenal-modal .done').addEventListener('click', function() {
        document.querySelector('#arsenal-modal').classList.remove('shown');
    });
    document.querySelector('#combos-modal .done').addEventListener('click', function() {
        document.querySelector('#combos-modal').classList.remove('shown');
    });
    document.querySelector('#stats-modal .done').addEventListener('click', function() {
        document.querySelector('#stats-modal').classList.remove('shown');
    });
    document.querySelector('#settings-modal .done').addEventListener('click', function() {
        document.querySelector('#settings-modal').classList.remove('shown');
    });
    document.querySelector('#stats-modal .reset').addEventListener('click', async function() {
        // Now we have everything we need to do the destroy, stored safely.
        customDialog("Are you sure you want to reset your stats? They will be lost forever!")
        .then((confirmed) => {
            if (confirmed) {
                clearStats();
                stats.reset();
                populateStatsModal();
            }
        });
    });
    
    document.getElementById('view-arsenal').addEventListener('click', populateArsenalModal);
    document.getElementById('view-combos').addEventListener('click', populateCombosModal);
    document.getElementById('view-stats').addEventListener('click', populateStatsModal);
    document.getElementById('view-settings').addEventListener('click', async function() {
        document.querySelector('#settings-modal').classList.add('shown');
    });

    document.querySelector('#shop .mercenary').addEventListener('click', function() {
        visitMercenary();
    });

    document.querySelector('#shop .restock').addEventListener('click', function() {
        restockShop();
    });

    document.getElementById('continue-game').addEventListener('click', async function () {
        document.getElementById('splash').classList.remove('shown');
        const savedGame = await loadGameState();
        Object.assign(game, savedGame);
        await init();
        showOverworld(false);
    });
    document.getElementById('new-game').addEventListener('click', async function () {
        // Show the customDialog, which returns a Promise
        customDialog("Are you sure you want to start a new game? You will lose all saved progress.")
            .then((confirmed) => {
            // Only call destroyBoosterHandler if confirmed is true
            if (confirmed) {
                document.getElementById('embark').classList.add('shown');
                document.getElementById('continue-game').classList.remove('shown');
                document.getElementById('new-game').classList.remove('shown');
                clearGameState();
            }
        });
    });
    document.getElementById('embark').addEventListener('click', async function () {
        stats.data.total_runs += 1;
        stats.data.highest_win_streak += 1;
        saveStats(stats.data);
        document.getElementById('splash').classList.remove('shown');
        await init();
        showOverworld();
    });

    // Initialize Tippy tooltips on all elements with the `data-tippy-content` attribute
    tippy('[data-tippy-content]', {
        allowHTML: true, // Enables HTML content in tooltips
        // You can add more Tippy options here as needed
    });
    
});
