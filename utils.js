// utils.js
import game from './game.js';

// Seeding functionality
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function mulberry32(a) {
    return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

let seed = cyrb128('bananas');
let rand = mulberry32(seed[0]);

function setAnimationSpeed() {
    // deal with animation speeds
    if(game.config.animationSpeed==='slow') {
        game.config.cardDelay = 300;
        game.config.boosterDelay = 300;
        game.config.improveDelay = 300;
        game.config.triggerDelay = 300;
        game.config.multiplyDelay = 300;
        game.config.animationDecrementFactor = .9; 
        game.config.animationMinimum = 60;
    } else if(game.config.animationSpeed==='fast') {
        game.config.cardDelay = 200;
        game.config.boosterDelay = 200;
        game.config.improveDelay = 200;
        game.config.triggerDelay = 200;
        game.config.multiplyDelay = 200;
        game.config.animationDecrementFactor = .6; 
        game.config.animationMinimum = 40;
    } else if(game.config.animationSpeed==='instant') {
        game.config.cardDelay = 40;
        game.config.boosterDelay = 40;
        game.config.improveDelay = 40;
        game.config.triggerDelay = 40;
        game.config.multiplyDelay = 40;
        game.config.animationMinimum = 40;
    }
    // deal with animation momentum
    if(!game.config.animationMomentum) {
        game.config.animationDecrementFactor = 1;  
    }
}

function setGameSeed() {
    let gameseed = game.config.seed;
    if(gameseed == '' || gameseed == false) {
        gameseed = (Math.random() + 1).toString(36).substring(2);
    }
    game.config.seed = gameseed;
    document.getElementById('custom-seed').value = gameseed;
    seed = cyrb128(gameseed);
    rand = mulberry32(seed[0]);
}

function randDecimal() {
    return rand();
}

function randString() {
    return (randDecimal() + 1).toString(36).substring(2);
}

function randArrayIndex(arr) {
    return Math.floor(randDecimal() * arr.length);
}

function randFromArray(arr, count) {
    // Create a copy of the input array to shuffle
    let shuffled = [...arr].sort(() => 0.5 - randDecimal());
    return shuffled.slice(0, count);
}


function sortArsenal(combinedArsenal, RAINBOW_ORDER, CARD_TYPES) {
    return combinedArsenal.sort((a, b) => {
        // First, compare colors based on their index in RAINBOW_ORDER
        const colorIndexA = RAINBOW_ORDER.indexOf(a.color);
        const colorIndexB = RAINBOW_ORDER.indexOf(b.color);

        if (colorIndexA !== colorIndexB) {
            return colorIndexA - colorIndexB;
        } else {
            // If colors are the same, sort by type order as defined in CARD_TYPES
            const typeIndexA = CARD_TYPES.indexOf(a.type);
            const typeIndexB = CARD_TYPES.indexOf(b.type);
            return typeIndexA - typeIndexB;
        }
    });
}


function numberToRoman(num) {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

    let roman = "";
    for (let i = 0; i < values.length; i++) {
        while (num >= values[i]) {
            num -= values[i];
            roman += symbols[i];
        }
    }
    return roman;
}

function prettyName(att) {
    return att.split('_')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                   .join(' ');
}

// Function to format large numbers
function formatLargeNumber(num) {
    if (num === undefined || num === null) {
        return '';
    }
    // Try to convert to a number if possible
    num = Number(num);
    if (isNaN(num)) {
        return String(num);
    }
    if (num >= 1e12) {
        return num.toExponential(2);
    }
    return num.toLocaleString();
}

function weightedSelect(items, count) {
    // Create a shallow copy of the items array
    const itemsCopy = [...items];

    // Calculate the total weight for the copy (defaulting to 50 if missing)
    let totalWeight = itemsCopy.reduce((sum, item) => sum + (item.weight ?? 50), 0);

    const selected = [];

    // Keep selecting until we have `count` items or run out of items in the copy
    while (selected.length < count && itemsCopy.length > 0) {
        // Pick a random point within the total weight
        let random = randDecimal() * totalWeight;

        for (let i = 0; i < itemsCopy.length; i++) {
            const w = itemsCopy[i].weight ?? 50;
            random -= w;

            if (random <= 0) {
                // We found our chosen item; add it to selected
                selected.push(itemsCopy[i]);
                // Adjust totalWeight so it stays accurate
                totalWeight -= w;
                // Remove the selected item from the copy
                itemsCopy.splice(i, 1);
                break;
            }
        }
    }

    return selected;
}

function togglePointerEvents(enable) {
    document.querySelector('body').style.pointerEvents = enable ? 'auto' : 'none';
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fireAtEnemy(cardElement) {
    // 1) Calculate start (top center of the card)
    const cardRect = cardElement.getBoundingClientRect();
    const startX = cardRect.left + cardRect.width / 2;
    const startY = cardRect.top; // top edge
  
    // 2) Calculate end (bottom right of the enemy health bar)
    const enemyBar = document.querySelector('.enemy-health-bar');
    if (!enemyBar) {
      console.warn('No enemy health bar found!');
      return;
    }
    const barRect = enemyBar.getBoundingClientRect();
    const endX = barRect.left + barRect.width - 50;      // right edge minus offset
    const endY = barRect.top + barRect.height;      // bottom edge
  
    // 3) Determine the distance and angle
    const diffX = endX - startX;
    const diffY = endY - startY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY); // length of beam
    // Angle in degrees
    const angleDeg = Math.atan2(diffY, diffX) * (180 / Math.PI);
  
    // 4) Create the beam element
    const beam = document.createElement('div');
    beam.classList.add('energy-beam');
  
    // Position it so its "top-left corner" is exactly the beam's origin
    beam.style.left = `${startX}px`;
    beam.style.top = `${startY}px`;
    // The beam's width = final distance it needs to span
    beam.style.width = `${distance}px`;
    
    // By default, we set transform to rotate(...) scaleX(0) so it's “collapsed”
    // And we’ll transition to scaleX(1) to extend it to full length.
    beam.style.transform = `rotate(${angleDeg}deg) scaleX(0)`;

    // Set the color of the beam
    const color = cardElement.dataset.color;
    if(color) beam.classList.add(color);
  
    // 5) Append to the body (or another container) so it can move freely
    document.body.appendChild(beam);
  
    // Force a reflow so the browser applies initial styles
    // then trigger the scaleX animation
    beam.offsetHeight; // read a layout property to trigger reflow
  
    // Animate from scaleX(0) to scaleX(1)
    beam.style.transform = `rotate(${angleDeg}deg) scaleX(1)`;
  
    // 6) Clean up after the transition finishes
    beam.addEventListener('transitionend', () => {
      beam.remove();
    });
  }
  

function updateXPBar() {
    const xpBar = document.querySelector('.xp-bar');
    const xpSpan = document.querySelector('.xp span');

    const baseThreshold = game.data.xpThreshold; 
    const scalingFactor = game.data.scalingFactor; 

    let totalXP = 0;
    let newLevel = 1;

    // Calculate current level and next level threshold using quadratic scaling
    while (game.data.xp >= totalXP + baseThreshold + Math.floor(scalingFactor * Math.pow(newLevel, 1.5))) {
        totalXP += baseThreshold + Math.floor(scalingFactor * Math.pow(newLevel, 1.5));
        newLevel++;
    }
    
    const previousThreshold = totalXP;
    const nextThreshold = totalXP + baseThreshold + Math.floor(scalingFactor * Math.pow(newLevel, 1.5));

    // Calculate progress towards next level
    const progress = ((game.data.xp - previousThreshold) / (nextThreshold - previousThreshold)) * 100;

    // Animate and update the bar
    xpBar.style.width = `${progress}%`;

    // Update XP text
    xpSpan.textContent = `${game.data.xp} / ${nextThreshold}`;
}

function applyBoosterOverlap() {
    const boostersContainer = document.querySelector('#boosters');
    const slotGroups = document.querySelectorAll('#boosters .slot-group');
    const containerWidth = boostersContainer.offsetWidth - 16; // Account for 4px padding on each side of #boosters
    const groupWidth = (containerWidth - 20) / 3; // Account for the 10px gap between groups
    const slotWidth = 100; // Fixed width of each booster slot
    const slotGap = 4; // Gap between booster slots
    const gapCorrection = 13; // Adjusted for proper alignment

    slotGroups.forEach(group => {
        const slots = group.querySelectorAll('.booster-slot');
        const totalSlots = slots.length;

        // Set the fixed width for the group
        group.style.width = `${groupWidth}px`;
        group.style.position = 'relative'; // Ensure absolute children are positioned correctly

        // Check if overlapping is necessary
        const totalWidthWithoutOverlap = totalSlots * (slotWidth + slotGap); // Include the gap between slots
        if (totalWidthWithoutOverlap <= groupWidth - gapCorrection) {
            // Reset slot styles for groups where overlapping isn't necessary
            slots.forEach(slot => {
                slot.classList.remove('overlapped');
                slot.style.position = '';
                slot.style.left = '';
                slot.style.zIndex = ''; // Clear any previously set z-index
            });
            return; // Skip further calculations for this group
        }

        if (totalSlots > 1) {
            // Calculate overlap for the slots to fit within the group width
            const maxOverlap = Math.max(0, (((slotWidth + slotGap) * totalSlots - groupWidth + gapCorrection) / (totalSlots - 1)));
            const overlap = Math.min(maxOverlap, slotWidth * 0.6); // Cap overlap to 60% of slot width

            slots.forEach((slot, index) => {
                slot.classList.add('overlapped');
                slot.style.position = 'absolute'; // Stack the slots
                slot.style.left = `${8 + index * (slotWidth - overlap + slotGap)}px`; // Adjust position for overlap and gap
                
                // Explicitly set z-index and store it as a data attribute for hover behavior
                slot.style.zIndex = index;
                slot.dataset.originalZIndex = index; // Save the z-index for restoration
            });

            // Adjust the right-most slot to ensure it doesn't overflow the group width
            const totalWidth = (totalSlots - 1) * (slotWidth - overlap + slotGap) + slotWidth;
            if (totalWidth > groupWidth - gapCorrection) {
                const adjustment = totalWidth - groupWidth + gapCorrection;
                slots.forEach((slot, index) => {
                    const adjustedLeft = parseFloat(slot.style.left) - adjustment / (totalSlots - 1) * index;
                    slot.style.left = `${adjustedLeft}px`;
                });
            }
        }
    });
}

// Run the function on page load and window resize
window.addEventListener('resize', applyBoosterOverlap);

function applyCardOverlap() {
    const cardsContainer = document.querySelector('#cards');
    const cards = cardsContainer.querySelectorAll('.card');
    const containerWidth = cardsContainer.offsetWidth; // Width of the #cards container
    const cardWidth = 150; // Fixed width of each card as per the CSS
    const cardGap = 5; // Gap between cards

    // Calculate the total width of the cards without overlap
    const totalWidthWithoutOverlap = cards.length * (cardWidth + cardGap);

    // Check if overlapping is necessary
    if (totalWidthWithoutOverlap <= containerWidth) {
        // Reset styles if no overlap is needed
        cards.forEach(card => {
            card.classList.remove('overlapped');
            card.style.position = '';
            card.style.left = '';
            card.style.zIndex = '';
            card.removeAttribute('data-original-z-index'); // Remove the stored z-index
        });
        return; // Exit the function if no overlap is required
    }

    // Calculate overlap for the cards to fit within the container
    const maxOverlap = Math.max(0, ((cardWidth + cardGap) * cards.length - containerWidth) / (cards.length - 1));
    const overlap = Math.min(maxOverlap, cardWidth * 0.6); // Cap overlap to 60% of card width

    // Apply overlap positioning
    cards.forEach((card, index) => {
        card.classList.add('overlapped');
        card.style.position = 'absolute';
        card.style.left = `${index * (cardWidth - overlap + cardGap)}px`; // Adjust position for overlap and gap
        card.style.zIndex = index; // Ensure proper stacking order
        card.dataset.originalZIndex = index; // Save the original z-index for hover behavior
    });

    // Adjust the right-most card to ensure it doesn't overflow the container
    const totalWidth = (cards.length - 1) * (cardWidth - overlap + cardGap) + cardWidth;
    if (totalWidth > containerWidth) {
        const adjustment = totalWidth - containerWidth;
        cards.forEach((card, index) => {
            const adjustedLeft = parseFloat(card.style.left) - adjustment / (cards.length - 1) * index;
            card.style.left = `${adjustedLeft}px`;
        });
    }
}

window.addEventListener('resize', applyCardOverlap);

function applyGunSlotOverlap() {
    const gunsContainer = document.querySelector('#guns');
    const gunSlots = gunsContainer.querySelectorAll('.gun-slot');
    const containerWidth = gunsContainer.offsetWidth; // Width of the #guns container
    const slotWidth = 170; // Fixed width of each gun slot
    const slotGap = 10; // Gap between gun slots

    // Calculate the total width of the gun slots without overlap
    const totalWidthWithoutOverlap = gunSlots.length * (slotWidth + slotGap);

    // Check if overlapping is necessary
    if (totalWidthWithoutOverlap <= containerWidth) {
        // Reset styles if no overlap is needed
        gunSlots.forEach(slot => {
            slot.classList.remove('overlapped');
            slot.style.position = '';
            slot.style.left = '';
            slot.style.zIndex = '';
            slot.removeAttribute('data-original-z-index'); // Remove the stored z-index
        });
        return; // Exit the function if no overlap is required
    }

    // Calculate overlap for the slots to fit within the container
    const maxOverlap = Math.max(0, ((slotWidth + slotGap) * gunSlots.length - containerWidth) / (gunSlots.length - 1));
    const overlap = Math.min(maxOverlap, slotWidth * 0.6); // Cap overlap to 60% of slot width

    // Apply overlap positioning
    gunSlots.forEach((slot, index) => {
        slot.classList.add('overlapped');
        slot.style.position = 'absolute';
        slot.style.left = `${index * (slotWidth - overlap + slotGap)}px`; // Adjust position for overlap and gap
        slot.style.zIndex = index; // Ensure proper stacking order
        slot.dataset.originalZIndex = index; // Save the original z-index for hover behavior
    });

    // Adjust the right-most slot to ensure it doesn't overflow the container
    const totalWidth = (gunSlots.length - 1) * (slotWidth - overlap + slotGap) + slotWidth;
    if (totalWidth > containerWidth) {
        const adjustment = totalWidth - containerWidth;
        gunSlots.forEach((slot, index) => {
            const adjustedLeft = parseFloat(slot.style.left) - adjustment / (gunSlots.length - 1) * index;
            slot.style.left = `${adjustedLeft}px`;
        });
    }
}

window.addEventListener('resize', applyGunSlotOverlap);
window.addEventListener('resize', enableHoverZIndexBehavior('#guns .gun-slot .card.overlapped'));

function applySystemHeartOverlap() {
    const systemHeartsContainer = document.querySelector('#system-hearts');
    const hearts = systemHeartsContainer.querySelectorAll('.system-heart.card');
    const containerHeight = systemHeartsContainer.offsetHeight; // Height of the #system-hearts container
    const heartHeight = 50; // Fixed height of each system heart as per the CSS
    const heartGap = 2; // Gap between system hearts
    const containerPadding = 4; // Top and bottom padding of #system-hearts (2px each)

    // Calculate the total height of the hearts without overlap
    const totalHeightWithoutOverlap = hearts.length * (heartHeight + heartGap) - heartGap + containerPadding;

    // Check if overlapping is necessary
    if (totalHeightWithoutOverlap <= containerHeight) {
        // Reset styles if no overlap is needed
        hearts.forEach(heart => {
            heart.classList.remove('overlapped');
            heart.style.position = '';
            heart.style.top = '';
            heart.style.zIndex = '';
            heart.removeAttribute('data-original-z-index'); // Remove the stored z-index
        });
        return; // Exit the function if no overlap is required
    }

    // Calculate overlap for the hearts to fit within the container
    const maxOverlap = Math.max(0, (((heartHeight + heartGap) * hearts.length - containerHeight) / (hearts.length - 1)));
    const overlap = Math.min(maxOverlap, heartHeight * 0.6); // Cap overlap to 60% of heart height

    // Apply overlap positioning
    hearts.forEach((heart, index) => {
        heart.classList.add('overlapped');
        heart.style.position = 'absolute';
        heart.style.top = `${index * (heartHeight - overlap + heartGap)}px`; // Adjust position for overlap and gap
        heart.style.zIndex = hearts.length + index; // Ensure proper stacking order
        heart.dataset.originalZIndex = hearts.length + index; // Save the original z-index for hover behavior
    });

    // Adjust the bottom-most heart to ensure it doesn't overflow the container height
    const totalHeight = (hearts.length - 1) * (heartHeight - overlap + heartGap) + heartHeight;
    if (totalHeight > containerHeight) {
        const adjustment = totalHeight - containerHeight;
        hearts.forEach((heart, index) => {
            const adjustedTop = parseFloat(heart.style.top) - adjustment / (hearts.length - 1) * index;
            heart.style.top = `${adjustedTop}px`;
        });
    }
}

window.addEventListener('resize', applySystemHeartOverlap);

function enableHoverZIndexBehavior(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.zIndex = 1000; // Bring to the top
        });

        element.addEventListener('mouseleave', () => {
            element.style.zIndex = element.dataset.originalZIndex || ''; // Restore original z-index
        });
    });
}

function customDialog(message, options = {}) {
    return new Promise((resolve) => {
        // Create the overlay
        const overlay = document.createElement("div");
        overlay.className = "custom-dialog-overlay";

        // Create the dialog box
        const dialog = document.createElement("div");
        dialog.className = "custom-dialog";

        // Create the message container
        const messageElem = document.createElement("p");
        messageElem.textContent = message;
        dialog.appendChild(messageElem);

        // Create the button container
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "custom-dialog-buttons";

        // Default button text
        const okText = options.okText || "OK";
        const cancelText = options.cancelText || "Cancel";
        const showCancel = options.showCancel !== undefined ? options.showCancel : true;

        // OK Button
        const okButton = document.createElement("button");
        okButton.textContent = okText;
        okButton.className = "custom-dialog-ok";
        okButton.onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };
        buttonContainer.appendChild(okButton);

        // Cancel Button (if enabled)
        if (showCancel) {
            const cancelButton = document.createElement("button");
            cancelButton.textContent = cancelText;
            cancelButton.className = "custom-dialog-cancel";
            cancelButton.onclick = () => {
                document.body.removeChild(overlay);
                resolve(false);
            };
            buttonContainer.appendChild(cancelButton);
        }

        // Append everything
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    });
}

/**
 * Displays a floating text message for 4 seconds:
 *   - Fully visible for the first 2 seconds
 *   - Then fades out and moves up over the last 2 seconds
 *   - Removed from the DOM at the 4-second mark
 * Multiple calls stack the messages on top of each other.
 *
 * @param {string} message - The text to display.
 */
function message(message) {
    // Ensure there's a container in the document
    let container = document.querySelector('.info-text-container');
    if (!container) {
      container = document.createElement('div');
      container.classList.add('info-text-container');
      document.body.appendChild(container);
    }
  
    // Create the message element
    const msgElem = document.createElement('div');
    msgElem.classList.add('info-text-message');
    msgElem.textContent = message;
  
    // Append to container so it sits above other messages
    container.appendChild(msgElem);
  
    // After 2 seconds, trigger the fade-out & upward movement
    setTimeout(() => {
      msgElem.classList.add('fade-out');
    }, 1000);
  
    // After 4 seconds, remove it entirely
    setTimeout(() => {
      if (msgElem.parentNode) {
        msgElem.parentNode.removeChild(msgElem);
      }
    }, 4000);
  }
  

function flourish(message) {
    // Ensure there's a container in the document
    let container = document.querySelector('.flourish-text-container');
    if (!container) {
      container = document.createElement('div');
      container.classList.add('flourish-text-container');
      document.body.appendChild(container);
    }
  
    // Create the message element
    const msgElem = document.createElement('div');
    msgElem.classList.add('flourish-text-message');
    msgElem.textContent = message;
  
    // Append to container so it sits above other messages
    container.appendChild(msgElem);
  
    // After 1 seconds, trigger the fade-out & upward movement
    setTimeout(() => {
      msgElem.classList.add('fade-out');
    }, 1000);
  
    // After 2 seconds, remove it entirely
    setTimeout(() => {
      if (msgElem.parentNode) {
        msgElem.parentNode.removeChild(msgElem);
      }
    }, 2000);
  }
  

export {
    setGameSeed,
    setAnimationSpeed,
    randDecimal,
    randString,
    formatLargeNumber,
    randArrayIndex,
    sortArsenal,
    numberToRoman,
    randFromArray,
    prettyName,
    weightedSelect,
    togglePointerEvents,
    capitalize,
    fireAtEnemy,
    updateXPBar,
    applyBoosterOverlap,
    applyCardOverlap,
    applyGunSlotOverlap,
    applySystemHeartOverlap,
    enableHoverZIndexBehavior,
    customDialog,
    message,
    flourish
};
