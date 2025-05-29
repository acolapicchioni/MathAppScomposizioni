// js/score.js

let currentScore = 0;
// Using a more specific localStorage key to avoid potential conflicts
let highScore = localStorage.getItem('highScore_mathAppFiglie') ? parseInt(localStorage.getItem('highScore_mathAppFiglie')) : 0;

// DOM elements - these will be set by an init function from the main script
let scoreDisplayElement;
let highScoreDisplayElement;

/**
 * Initializes the score module with the necessary DOM elements.
 * Should be called once the DOM is loaded and elements are available.
 * @param {HTMLElement} scoreEl - The DOM element for displaying the current score.
 * @param {HTMLElement} highScoreEl - The DOM element for displaying the high score.
 */
export function initScore(scoreEl, highScoreEl) {
    scoreDisplayElement = scoreEl;
    highScoreDisplayElement = highScoreEl;
    // Initialize display with current values
    if (scoreDisplayElement) {
        scoreDisplayElement.textContent = currentScore;
    }
    if (highScoreDisplayElement) {
        highScoreDisplayElement.textContent = highScore;
    }
    console.log(`Score module initialized. Current: ${currentScore}, High: ${highScore}`);
}

export function getCurrentScore() {
    return currentScore;
}

export function getHighScore() {
    return highScore;
}

export function incrementaPunteggio(punti) {
    currentScore += punti;
    console.log(`Punteggio incrementato di ${punti}. Nuovo punteggio: ${currentScore}`);
    aggiornaPunteggioDisplay();
}

export function decrementaPunteggio(punti) {
    currentScore -= punti;
    if (currentScore < 0) {
        currentScore = 0; // Prevent negative scores
    }
    console.log(`Punteggio decrementato di ${punti}. Nuovo punteggio: ${currentScore}`);
    aggiornaPunteggioDisplay();
}

export function aggiornaPunteggioDisplay() {
    if (scoreDisplayElement) {
        scoreDisplayElement.textContent = currentScore;
    }
    if (currentScore > highScore) {
        highScore = currentScore;
        if (highScoreDisplayElement) {
            highScoreDisplayElement.textContent = highScore;
        }
        localStorage.setItem('highScore_mathAppFiglie', highScore.toString());
        console.log(`Nuovo record: ${highScore}`);
    }
    // console.log(`Punteggio aggiornato sul display: Corrente=${currentScore}, Record=${highScore}`); // Can be a bit verbose
}

export function resetPunteggio() {
    currentScore = 0;
    console.log("Punteggio resettato a 0.");
    aggiornaPunteggioDisplay();
}
