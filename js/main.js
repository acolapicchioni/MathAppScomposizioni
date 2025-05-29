// js/main.js
import {
    DEFAULT_PLAYER_NAME,
    // Import point constants if main.js directly awards points for any generic action (unlikely for now)
} from './config.js';

import {
    initScore,
    resetPunteggio,
    // getCurrentScore, // Import if needed for display logic directly in main.js
} from './score.js';

import {
    initGlobalDomElements,
    showElement,
    hideElement,
    hideAllGameSections,
    showGameSection,
    // Exported DOM element variables (use them directly after initGlobalDomElements)
    playerNameOverlayEl, playerNameInputEl, startGameButtonEl,
    scoreContainerEl, scoreEl, highScoreEl,
    welcomeMessageEl, modalitaSceltaEl, gameContainerEl,
    tabellineSectionEl, divisioniSectionEl, moltiplicazioniScomposizioneSectionEl,
    nuovaPartitaButtonEl,
    // Specific section elements if needed for event listeners in main
    // showTabellineButton, showDivisioniButton, showMoltiplicazioniScomposizioneButton, // These are not in domUtils yet
} from './domUtils.js';

import { initTabelline, generaDomandaTabellina } from './tabelline.js';
import { initDivisioni, generaDomandaDivisione } from './divisioni.js';
import { initMoltiplicazioniScomposizione, generaDomandaMoltiplicazioneScomposizione } from './moltiplicazioniScomposizione.js';

// Game state variables that might reside in main or be moved to a dedicated state module later
let playerName = DEFAULT_PLAYER_NAME;
let activeSection = ''; // To keep track of the current game mode

// --- DOM Element variables for buttons not yet in domUtils --- 
// These will be initialized in DOMContentLoaded after initGlobalDomElements
let showTabellineButton, showDivisioniButton, showMoltiplicazioniScomposizioneButton;
let tornaMenuTabellineBtn, tornaMenuDivisioniBtn, tornaMenuMoltiplicazioniScomposizioneBtn;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main.js: DOMContentLoaded - Initializing application...");

    // 1. Initialize all global DOM element variables from domUtils
    initGlobalDomElements();

    // 2. Initialize the score module, passing the relevant DOM elements
    // scoreEl and highScoreEl are now available as they were initialized by initGlobalDomElements
    if (scoreEl && highScoreEl) {
        initScore(scoreEl, highScoreEl);
    }

    // 2.5 Initialize game modules (this will set up their specific DOM elements and event listeners)
    initTabelline(); // Initialize tabelline game elements and listeners
    initDivisioni(); // Initialize divisioni game elements and listeners
    initMoltiplicazioniScomposizione(); // Initialize moltiplicazioniScomposizione game elements and listeners

    // --- Initialize buttons for mode selection and menu navigation ---
    showTabellineButton = document.getElementById('show-tabelline');
    showDivisioniButton = document.getElementById('show-divisioni');
    showMoltiplicazioniScomposizioneButton = document.getElementById('show-moltiplicazioni-scomposizione');
    
    tornaMenuTabellineBtn = document.getElementById('torna-menu-tabelline-btn');
    tornaMenuDivisioniBtn = document.getElementById('torna-menu-divisioni-btn');
    tornaMenuMoltiplicazioniScomposizioneBtn = document.getElementById('torna-menu-moltiplicazioni-scomposizione-btn');

    // 3. Setup initial UI state (e.g., player name overlay)
    if (playerNameOverlayEl) {
        showElement(playerNameOverlayEl, 'flex'); // Assuming it's a flex container
    }
    if (gameContainerEl) hideElement(gameContainerEl);
    if (modalitaSceltaEl) hideElement(modalitaSceltaEl);
    if (scoreContainerEl) hideElement(scoreContainerEl);

    // 4. Setup core event listeners
    if (startGameButtonEl && playerNameInputEl && welcomeMessageEl) {
        startGameButtonEl.addEventListener('click', () => {
            playerName = playerNameInputEl.value || DEFAULT_PLAYER_NAME;
            welcomeMessageEl.textContent = `Ciao ${playerName}! Scegli una modalità per iniziare.`;
            hideElement(playerNameOverlayEl);
            showElement(modalitaSceltaEl);
            showElement(scoreContainerEl);
            // Update player name display in score area if it exists
            const playerNameDisplay = document.getElementById('player-name-display');
            if(playerNameDisplay) playerNameDisplay.textContent = playerName;
            console.log(`Game started for player: ${playerName}`);
        });
    }

    if (nuovaPartitaButtonEl) {
        nuovaPartitaButtonEl.addEventListener('click', () => {
            resetPunteggio();
            // Hide all game sections and the main game container
            hideAllGameSections();
            if (gameContainerEl) hideElement(gameContainerEl);
            
            // Hide mode selection and score container
            if (modalitaSceltaEl) hideElement(modalitaSceltaEl);
            if (scoreContainerEl) hideElement(scoreContainerEl);

            // Show player name overlay and clear input
            if (playerNameInputEl) playerNameInputEl.value = '';
            if (playerNameOverlayEl) showElement(playerNameOverlayEl, 'flex');
            
            // Reset active section and player name variable
            activeSection = '';
            playerName = DEFAULT_PLAYER_NAME; // Reset to default or handle as preferred
            if (welcomeMessageEl) welcomeMessageEl.textContent = ''; // Clear welcome message
            
            console.log("Nuova partita iniziata: Punteggio resettato, nome richiesto.");
        });
    }

    // --- Event listeners for mode selection --- 
    if (showTabellineButton) {
        showTabellineButton.addEventListener('click', () => {
            activeSection = 'tabelline';
            showGameSection(tabellineSectionEl);
            generaDomandaTabellina(); // Generate the first question for tabelline
            console.log("Tabelline mode selected");
        });
    }

    if (showDivisioniButton) {
        showDivisioniButton.addEventListener('click', () => {
            activeSection = 'divisioni';
            showGameSection(divisioniSectionEl);
            generaDomandaDivisione(); // Generate the first question for divisioni
            console.log("Divisioni mode selected");
        });
    }

    if (showMoltiplicazioniScomposizioneButton) {
        showMoltiplicazioniScomposizioneButton.addEventListener('click', () => {
            activeSection = 'moltiplicazioni-scomposizione';
            showGameSection(moltiplicazioniScomposizioneSectionEl);
            generaDomandaMoltiplicazioneScomposizione(); // Generate the first question for moltiplicazioni scomposizione
            console.log("Moltiplicazioni Scomposizione mode selected");
        });
    }
    
    // --- Event listeners for "Torna al Menu" buttons ---
    const tornaMenuButtons = [
        tornaMenuTabellineBtn, 
        tornaMenuDivisioniBtn, 
        tornaMenuMoltiplicazioniScomposizioneBtn
    ];
    tornaMenuButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', mostraSceltaModalita);
        }
    });

    console.log("Main.js: Application initialized.");
});

/**
 * Shows the main mode selection screen and hides game areas.
 */
export function mostraSceltaModalita() {
    hideAllGameSections();
    if (gameContainerEl) hideElement(gameContainerEl); // Hide the overall game container
    if (modalitaSceltaEl) showElement(modalitaSceltaEl);
    // Ensure score container is visible when showing mode choice after initial game start
    if (scoreContainerEl && !playerNameOverlayEl.style.display || playerNameOverlayEl.style.display === 'none') {
        showElement(scoreContainerEl);
    }
    activeSection = '';
    console.log("Returned to mode selection menu.");
}

// If any other functions from script.js were meant to be globally accessible
// (e.g., called by inline HTML event attributes), they would need to be defined here
// and potentially exported, or the HTML refactored to use addEventListener.
