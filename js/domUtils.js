// js/domUtils.js

// Variables for globally used DOM elements
export let playerNameOverlayEl, playerNameInputEl, startGameButtonEl;
export let scoreContainerEl, scoreEl, highScoreEl; // scoreEl and highScoreEl will be passed to score.js
export let welcomeMessageEl, modalitaSceltaEl, gameContainerEl;
export let tabellineSectionEl, divisioniSectionEl, moltiplicazioniScomposizioneSectionEl;
export let nuovaPartitaButtonEl;

// More specific elements, still potentially useful globally for setup
export let livelloDivisioneContainerEl, livelloDivisioneSelectEl;
export let livelloMoltiplicazioneScomposizioneContainerEl, livelloMoltiplicazioneScomposizioneSelectEl;

/**
 * Initializes all global DOM element variables.
 * Should be called once the DOM is loaded.
 */
export function initGlobalDomElements() {
    playerNameOverlayEl = document.getElementById('player-name-overlay');
    playerNameInputEl = document.getElementById('player-name');
    startGameButtonEl = document.getElementById('start-game-button');

    scoreContainerEl = document.getElementById('score-container');
    scoreEl = document.getElementById('current-score');
    highScoreEl = document.getElementById('high-score');
    welcomeMessageEl = document.getElementById('welcome-message');

    modalitaSceltaEl = document.getElementById('modalita-scelta');
    gameContainerEl = document.getElementById('game-container');

    tabellineSectionEl = document.getElementById('tabelline-section');
    divisioniSectionEl = document.getElementById('divisioni-section');
    moltiplicazioniScomposizioneSectionEl = document.getElementById('moltiplicazioni-scomposizione-section');

    nuovaPartitaButtonEl = document.getElementById('nuova-partita-button');

    livelloDivisioneContainerEl = document.getElementById('livello-divisione-container');
    livelloDivisioneSelectEl = document.getElementById('livello-divisione-select');
    livelloMoltiplicazioneScomposizioneContainerEl = document.getElementById('livello-moltiplicazione-scomposizione-container');
    livelloMoltiplicazioneScomposizioneSelectEl = document.getElementById('livello-moltiplicazione-scomposizione-select');

    console.log("Global DOM elements initialized.");
}

/**
 * Shows a DOM element by setting its display style to 'block' or a specified value.
 * @param {HTMLElement} element - The DOM element to show.
 * @param {string} displayType - The display type (e.g., 'block', 'flex', 'inline-block'). Defaults to 'block'.
 */
export function showElement(element, displayType = 'block') {
    if (element) {
        element.style.display = displayType;
    }
}

/**
 * Hides a DOM element by setting its display style to 'none'.
 * @param {HTMLElement} element - The DOM element to hide.
 */
export function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Hides all main game sections.
 */
export function hideAllGameSections() {
    if (tabellineSectionEl) hideElement(tabellineSectionEl);
    if (divisioniSectionEl) hideElement(divisioniSectionEl);
    if (moltiplicazioniScomposizioneSectionEl) hideElement(moltiplicazioniScomposizioneSectionEl);
    // Add any other main sections if they exist
}

// Example of a more specific UI utility that might live here or in main.js
// For now, placing it here as it directly uses the section elements.
/**
 * Shows a specific game section and hides others.
 * @param {HTMLElement} sectionToShow - The game section element to show.
 */
export function showGameSection(sectionToShow) {
    hideAllGameSections();
    if (sectionToShow) {
        showElement(sectionToShow);
        showElement(gameContainerEl); // Ensure the main game container is visible
        hideElement(modalitaSceltaEl); // Hide mode selection
    }
}
