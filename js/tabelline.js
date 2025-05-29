// js/tabelline.js
import { PUNTI_TABELLINA } from './config.js';
import { incrementaPunteggio, decrementaPunteggio } from './score.js';
import { playSound } from './utils.js'; // Import playSound

// DOM elements specific to the tabelline game
let domandaTabellinaEl, rispostaTabellinaInputEl, feedbackTabellinaEl, controllaTabellinaButtonEl;

// State for the current tabellina question
let currentTabellinaCorrectAnswer;

/**
 * Initializes the Tabelline game module.
 * - Gets references to DOM elements for the tabelline game.
 * - Sets up event listeners for the tabelline game.
 */
export function initTabelline() {
    domandaTabellinaEl = document.getElementById('domanda-tabellina');
    rispostaTabellinaInputEl = document.getElementById('risposta-tabellina');
    feedbackTabellinaEl = document.getElementById('feedback-tabellina');
    controllaTabellinaButtonEl = document.getElementById('controlla-tabellina-btn'); // Use the new ID
    
    if (controllaTabellinaButtonEl) {
        // No need to remove 'onclick' if it was already removed in HTML
        controllaTabellinaButtonEl.addEventListener('click', controllaTabellina);
        console.log("Controlla Tabellina button event listener attached.");
    } else {
        console.warn("Controlla Tabellina button (ID: controlla-tabellina-btn) not found.");
    }

    if (rispostaTabellinaInputEl) {
        rispostaTabellinaInputEl.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') { // Use event.key for modern browsers
                event.preventDefault();
                controllaTabellina();
            }
        });
        console.log("Enter key listener attached to tabelline answer input.");
    } else {
        console.warn("Risposta Tabellina input element not found for Enter key listener.");
    }
    
    console.log("Tabelline module initialized.");
}

/**
 * Generates and displays a new multiplication table question.
 */
export function generaDomandaTabellina() {
    if (!domandaTabellinaEl || !rispostaTabellinaInputEl || !feedbackTabellinaEl) {
        console.error("Tabelline DOM elements not found. Did you call initTabelline and are they present in the HTML?");
        return;
    }

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    currentTabellinaCorrectAnswer = num1 * num2;

    domandaTabellinaEl.textContent = `${num1} x ${num2} = ?`;
    rispostaTabellinaInputEl.value = '';
    feedbackTabellinaEl.textContent = '';
    rispostaTabellinaInputEl.focus();
    // console.log(`Tabellina: ${num1} x ${num2} = ${currentTabellinaCorrectAnswer}`); // Already logged in old script
}

/**
 * Checks the user's answer for the current multiplication table question.
 */
function controllaTabellina() {
    if (!rispostaTabellinaInputEl || !feedbackTabellinaEl) {
        console.error("Tabelline DOM elements for checking not found.");
        return;
    }

    const rispostaUtente = parseInt(rispostaTabellinaInputEl.value);

    if (isNaN(rispostaUtente)) {
        feedbackTabellinaEl.textContent = "Per favore, inserisci un numero.";
        playSound('error'); // Play error sound
        return;
    }

    if (rispostaUtente === currentTabellinaCorrectAnswer) {
        feedbackTabellinaEl.textContent = "Corretto!";
        incrementaPunteggio(PUNTI_TABELLINA);
        playSound('success'); // Play success sound
        setTimeout(generaDomandaTabellina, 1500); 
    } else {
        feedbackTabellinaEl.textContent = `Sbagliato. La risposta corretta era ${currentTabellinaCorrectAnswer}. Ritenta!`;
        decrementaPunteggio(PUNTI_TABELLINA);
        playSound('error'); // Play error sound
    }
}
