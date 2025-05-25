// Variabili Globali per gli elementi DOM principali
// Queste verranno inizializzate in DOMContentLoaded
let playerNameOverlayEl, playerNameInputEl, startGameButtonEl,
    scoreContainerEl, scoreEl, highScoreEl, welcomeMessageEl,
    modalitaSceltaEl, showTabellineButton, showDivisioniButton, showMoltiplicazioniScomposizioneButton,
    gameContainerEl, tabellineSectionEl, divisioniSectionEl, moltiplicazioniScomposizioneSectionEl,
    livelloDivisioneContainerEl, livelloDivisioneSelectEl,
    livelloMoltiplicazioneScomposizioneContainerEl, livelloMoltiplicazioneScomposizioneSelectEl,
    nuovaPartitaButtonEl, scomposizionePassaggi, risultatoDivisioneEl, restoFinaleDivisioneEl;

// Variabili di stato del gioco
let playerName = "Giocatore";
let punteggio = 0;
let highScore = 0;
let currentCorrectAnswer;
let currentDividend, currentDivisor;
let currentFactor1, currentFactor2;
let questionStartTime;
let livelloDivisione = 1;
let livelloMoltiplicazioneScomposizione = 1;
let activeSection = ''; // 'tabelline', 'divisioni', or 'moltiplicazioni-scomposizione'
let numScomposizioniRichieste = 1;
let numScomposizioniMoltiplicazioneRichieste = 2;

// DOM elements specifici per le tabelline (inizializzati in generaDomandaTabellina)
let domandaTabellinaEl, rispostaTabellinaInputEl, feedbackTabellinaEl;

// DOM elements specifici per le divisioni (inizializzati in generaDomandaDivisione)
let domandaDivisioneEl, decompDividend1InputEl, scompQuotient1InputEl,
    decompDividend2InputEl, scompQuotient2InputEl, decompDividend3InputEl,
    scompQuotient3InputEl, rispostaFinaleDivisioneInputEl,
    feedbackDivisioneEl, hintDivisioneEl;

// DOM elements specifici per le Moltiplicazioni con Scomposizione
let domandaMoltiplicazioneScomposizioneEl, msScomponiFattore1Parte1InputEl, msSecondoFattoreDisplay1El, msScomponiProdotto1InputEl,
    msScomponiFattore1Parte2InputEl, msSecondoFattoreDisplay2El, msScomponiProdotto2InputEl,
    msScomponiFattore1Parte3InputEl, msSecondoFattoreDisplay3El, msScomponiProdotto3InputEl,
    msRispostaFinaleMoltiplicazioneInputEl, feedbackMoltiplicazioneScomposizioneEl, hintMoltiplicazioneScomposizioneEl,
    msPassaggioScomponi1El, msPassaggioScomponi2El, msPassaggioScomponi3El;

// Ensure these are declared globally so they are accessible by functions outside DOMContentLoaded
let scomposizioneDividendoInputs, scomposizioneQuozienteInputs;

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded: Inizializzazione elementi DOM.");

    // Inizializzazione Elementi DOM Globali
    playerNameOverlayEl = document.getElementById('player-name-overlay');
    playerNameInputEl = document.getElementById('player-name');
    startGameButtonEl = document.getElementById('start-game-button');

    scoreContainerEl = document.getElementById('score-container');
    scoreEl = document.getElementById('current-score');
    highScoreEl = document.getElementById('high-score');
    welcomeMessageEl = document.getElementById('welcome-message');

    modalitaSceltaEl = document.getElementById('modalita-scelta');
    showTabellineButton = document.getElementById('show-tabelline');
    showDivisioniButton = document.getElementById('show-divisioni');
    showMoltiplicazioniScomposizioneButton = document.getElementById('show-moltiplicazioni-scomposizione');

    gameContainerEl = document.getElementById('game-container');
    tabellineSectionEl = document.getElementById('tabelline-section');
    divisioniSectionEl = document.getElementById('divisioni-section');
    moltiplicazioniScomposizioneSectionEl = document.getElementById('moltiplicazioni-scomposizione-section');
    livelloDivisioneContainerEl = document.getElementById('livello-divisione-container');
    livelloDivisioneSelectEl = document.getElementById('livello-divisione-select');
    livelloMoltiplicazioneScomposizioneContainerEl = document.getElementById('livello-moltiplicazione-scomposizione-container');
    livelloMoltiplicazioneScomposizioneSelectEl = document.getElementById('livello-moltiplicazione-scomposizione-select');

    nuovaPartitaButtonEl = document.getElementById('nuova-partita-button');

    risultatoDivisioneEl = document.getElementById('risposta-finale-divisione');
    restoFinaleDivisioneEl = document.getElementById('resto-finale-divisione');

    // Pulsanti per tornare al menu
    const tornaMenuTabellineBtn = document.getElementById('torna-menu-tabelline-btn');
    const tornaMenuDivisioniBtn = document.getElementById('torna-menu-divisioni-btn');
    const tornaMenuMoltiplicazioniScomposizioneBtn = document.getElementById('torna-menu-moltiplicazioni-scomposizione-btn');

    scomposizioneDividendoInputs = [
        document.getElementById('scomposizione-dividendo-1'),
        document.getElementById('scomposizione-dividendo-2'),
        document.getElementById('scomposizione-dividendo-3')
    ];
    scomposizioneQuozienteInputs = [
        document.getElementById('scomposizione-quoziente-1'),
        document.getElementById('scomposizione-quoziente-2'),
        document.getElementById('scomposizione-quoziente-3')
    ];
    scomposizionePassaggi = [
        document.getElementById('scomposizione-passaggio-1'),
        document.getElementById('scomposizione-passaggio-2'),
        document.getElementById('scomposizione-passaggio-3')
    ];

    // Verifica elementi critici
    const criticalElementMappings = {
        'player-name-overlay': playerNameOverlayEl,
        'player-name': playerNameInputEl,
        'start-game-button': startGameButtonEl,
        'score-container': scoreContainerEl,
        'modalita-scelta': modalitaSceltaEl,
        'show-tabelline': showTabellineButton,
        'show-divisioni': showDivisioniButton,
        'show-moltiplicazioni-scomposizione': showMoltiplicazioniScomposizioneButton,
        'game-container': gameContainerEl,
        'tabelline-section': tabellineSectionEl,
        'divisioni-section': divisioniSectionEl,
        'moltiplicazioni-scomposizione-section': moltiplicazioniScomposizioneSectionEl,
        'livello-divisione-container': livelloDivisioneContainerEl,
        'livello-moltiplicazione-scomposizione-container': livelloMoltiplicazioneScomposizioneContainerEl,
        'nuova-partita-button': nuovaPartitaButtonEl,
        'risposta-finale-divisione': risultatoDivisioneEl,
        'resto-finale-divisione': restoFinaleDivisioneEl
    };

    let allCriticalFound = true;
    for (const id in criticalElementMappings) {
        if (!criticalElementMappings[id]) {
            console.error(`CRITICAL_ERROR_DOM_INIT: Elemento con ID '${id}' NON TROVATO durante DOMContentLoaded.`);
            allCriticalFound = false;
        }
    }

    if (!allCriticalFound) {
        const body = document.querySelector('body');
        if (body) {
            let errorDiv = document.getElementById('critical-initialization-error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'critical-initialization-error-message';
                errorDiv.style.backgroundColor = 'pink';
                errorDiv.style.color = 'red';
                errorDiv.style.padding = '10px';
                errorDiv.style.border = '2px solid red';
                errorDiv.style.position = 'fixed';
                errorDiv.style.top = '10px';
                errorDiv.style.left = '10px';
                errorDiv.style.zIndex = '10000';
                errorDiv.innerHTML = '<h1>Errore Critico Inizializzazione</h1><p>Alcuni elementi HTML fondamentali non sono stati trovati. L\'applicazione non può funzionare correttamente. <br>Verifica che gli ID degli elementi in <code>index.html</code> corrispondano a quelli attesi dallo script.<br>Controlla la console (F12) per i dettagli (cerca CRITICAL_ERROR_DOM_INIT).</p>';
                body.prepend(errorDiv);
            }
        }
        if (startGameButtonEl) startGameButtonEl.disabled = true;
        if (showTabellineButton) showTabellineButton.disabled = true;
        if (showDivisioniButton) showDivisioniButton.disabled = true;
        if (showMoltiplicazioniScomposizioneButton) showMoltiplicazioniScomposizioneButton.disabled = true;
        console.error("DOMContentLoaded: Setup interrotto a causa di elementi critici mancanti.");
        return;
    }

    console.log("DOMContentLoaded: Inizializzazione elementi DOM completata. Setup event listeners.");

    // Event Listeners
    startGameButtonEl.addEventListener('click', startGame);
    showTabellineButton.addEventListener('click', () => generaDomandaTabellina());
    showDivisioniButton.addEventListener('click', () => generaDomandaDivisione());
    if (showMoltiplicazioniScomposizioneButton) {
        showMoltiplicazioniScomposizioneButton.addEventListener('click', () => generaDomandaMoltiplicazioneScomposizione());
    } else {
        console.warn("WARN: Elemento 'show-moltiplicazioni-scomposizione' non trovato.");
    }
    nuovaPartitaButtonEl.addEventListener('click', nuovaPartita);

    if (tornaMenuTabellineBtn) {
        tornaMenuTabellineBtn.addEventListener('click', tornaAlMenuPrincipale);
    } else {
        console.warn("WARN: Elemento 'torna-menu-tabelline-btn' non trovato.");
    }

    if (tornaMenuDivisioniBtn) {
        tornaMenuDivisioniBtn.addEventListener('click', tornaAlMenuPrincipale);
    } else {
        console.warn("WARN: Elemento 'torna-menu-divisioni-btn' non trovato.");
    }

    if (tornaMenuMoltiplicazioniScomposizioneBtn) {
        tornaMenuMoltiplicazioniScomposizioneBtn.addEventListener('click', tornaAlMenuPrincipale);
    } else {
        console.warn("WARN: Elemento 'torna-menu-moltiplicazioni-scomposizione-btn' non trovato.");
    }

    if (livelloDivisioneSelectEl) {
        livelloDivisioneSelectEl.addEventListener('change', (event) => {
            livelloDivisione = parseInt(event.target.value);
            if (activeSection === 'divisioni') {
                generaDomandaDivisione();
            }
        });
    } else {
        console.warn("WARN: Elemento 'livello-divisione-select' non trovato. Selezione livello divisione non funzionerà.");
    }

    if (livelloMoltiplicazioneScomposizioneSelectEl) {
        livelloMoltiplicazioneScomposizioneSelectEl.addEventListener('change', (event) => {
            livelloMoltiplicazioneScomposizione = parseInt(event.target.value);
            if (activeSection === 'moltiplicazioni-scomposizione') {
                generaDomandaMoltiplicazioneScomposizione();
            }
        });
    } else {
        console.warn("WARN: Elemento 'livello-moltiplicazione-scomposizione-select' non trovato. Selezione livello moltiplicazione non funzionerà.");
    }

    playerNameOverlayEl.style.display = 'flex';
    scoreContainerEl.style.display = 'none';
    modalitaSceltaEl.style.display = 'none';
    gameContainerEl.style.display = 'none';
    loadHighScore();
});

function loadHighScore() {
    const savedHighScore = localStorage.getItem('highScoreMathApp');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
        if (highScoreEl) highScoreEl.textContent = highScore;
        else console.warn("loadHighScore: highScoreEl non trovato");
    }
}

function saveHighScore() {
    localStorage.setItem('highScoreMathApp', highScore.toString());
}

function updatePunteggio(puntiBase, moltiplicatoreParam) {
    let moltiplicatore = moltiplicatoreParam;

    if (typeof moltiplicatore === 'undefined') {
        if (activeSection === 'divisioni') {
            switch (livelloDivisione) {
                case 1:
                    moltiplicatore = 1;
                    break;
                case 2:
                    moltiplicatore = 1.5;
                    break;
                case 3:
                    moltiplicatore = 2;
                    break;
                default:
                    moltiplicatore = 1;
            }
        } else if (activeSection === 'moltiplicazioni-scomposizione') {
            switch (livelloMoltiplicazioneScomposizione) {
                case 1:
                    moltiplicatore = 1.2;
                    break;
                case 2:
                    moltiplicatore = 1.8;
                    break;
                default:
                    moltiplicatore = 1;
            }
        } else {
            moltiplicatore = 1;
        }
    }

    const puntiEffettivi = Math.round(puntiBase * moltiplicatore);
    punteggio += puntiEffettivi;

    if (scoreEl) scoreEl.textContent = punteggio;
    else console.warn("updatePunteggio: scoreEl non trovato");

    if (punteggio > highScore) {
        highScore = punteggio;
        if (highScoreEl) highScoreEl.textContent = highScore;
        else console.warn("updatePunteggio: highScoreEl non trovato per aggiornamento high score");
        saveHighScore();
    }
    return puntiEffettivi;
}

function resetPunteggio() {
    punteggio = 0;
    if (scoreEl) scoreEl.textContent = punteggio;
    else console.warn("resetPunteggio: scoreEl non trovato");
}

function startGame() {
    playerName = playerNameInputEl.value.trim() || "Giocatore";
    if (!playerNameOverlayEl || !scoreContainerEl || !modalitaSceltaEl || !gameContainerEl || !welcomeMessageEl) {
        console.error("startGame: Uno o più elementi contenitore principali sono null. Impossibile avviare il gioco correttamente.");
        return;
    }
    playerNameOverlayEl.style.display = 'none';
    scoreContainerEl.style.display = 'block';
    modalitaSceltaEl.style.display = 'block';
    gameContainerEl.style.display = 'none';
    welcomeMessageEl.textContent = `Ciao, ${playerName}! Scegli una modalità:`;
    resetPunteggio();
}

function nuovaPartita() {
    if (!playerNameInputEl || !playerNameOverlayEl || !modalitaSceltaEl || !gameContainerEl || !livelloDivisioneContainerEl || !livelloMoltiplicazioneScomposizioneContainerEl) {
        console.error("nuovaPartita: Uno o più elementi contenitore principali sono null. Impossibile resettare correttamente.");
        return;
    }
    resetPunteggio();
    playerNameInputEl.value = '';
    playerNameOverlayEl.style.display = 'flex';
    modalitaSceltaEl.style.display = 'none';
    gameContainerEl.style.display = 'none';
    livelloDivisioneContainerEl.style.display = 'none';
    livelloMoltiplicazioneScomposizioneContainerEl.style.display = 'none';
    activeSection = '';
}

function tornaAlMenuPrincipale() {
    if (!modalitaSceltaEl || !gameContainerEl || !tabellineSectionEl || !divisioniSectionEl || !moltiplicazioniScomposizioneSectionEl || !livelloDivisioneContainerEl || !livelloMoltiplicazioneScomposizioneContainerEl || !welcomeMessageEl) {
        console.error("tornaAlMenuPrincipale: Uno o più elementi contenitore principali sono null. Impossibile tornare al menu.");
        return;
    }
    console.log("tornaAlMenuPrincipale: Ritorno al menu di scelta modalità.");

    gameContainerEl.style.display = 'none';
    tabellineSectionEl.style.display = 'none';
    divisioniSectionEl.style.display = 'none';
    moltiplicazioniScomposizioneSectionEl.style.display = 'none';
    livelloDivisioneContainerEl.style.display = 'none';
    livelloMoltiplicazioneScomposizioneContainerEl.style.display = 'none';

    modalitaSceltaEl.style.display = 'block';
    welcomeMessageEl.textContent = `Ciao, ${playerName}! Scegli una nuova modalità o continua con la precedente:`;
    activeSection = '';

    if (rispostaTabellinaInputEl) rispostaTabellinaInputEl.value = '';
    if (feedbackTabellinaEl) feedbackTabellinaEl.textContent = '';
    clearDivisionInputs();
    if (feedbackDivisioneEl) feedbackDivisioneEl.textContent = '';
    if (hintDivisioneEl) hintDivisioneEl.textContent = '';
    clearMoltiplicazioneScomposizioneInputs();
    if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = '';
    if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = '';
}

function playSound(type) {
    try {
        const audio = new Audio(`sounds/${type}.mp3`);
        audio.play().catch(e => console.warn("Errore durante la riproduzione del suono:", e));
    } catch (e) {
        console.warn("Impossibile creare oggetto Audio:", e);
    }
}

function calcolaPuntiBonus(elapsedTime) {
    if (elapsedTime < 8) return 2;
    if (elapsedTime < 15) return 1;
    return 0;
}

// --- Funzioni per Moltiplicazioni con Scomposizione ---

function clearMoltiplicazioneScomposizioneInputs() {
    console.log("clearMoltiplicazioneScomposizioneInputs: Pulizia input.");
    if (msScomponiFattore1Parte1InputEl) msScomponiFattore1Parte1InputEl.value = '';
    if (msScomponiProdotto1InputEl) msScomponiProdotto1InputEl.value = '';
    if (msScomponiFattore1Parte2InputEl) msScomponiFattore1Parte2InputEl.value = '';
    if (msScomponiProdotto2InputEl) msScomponiProdotto2InputEl.value = '';
    if (msScomponiFattore1Parte3InputEl) msScomponiFattore1Parte3InputEl.value = '';
    if (msScomponiProdotto3InputEl) msScomponiProdotto3InputEl.value = '';
    if (msRispostaFinaleMoltiplicazioneInputEl) msRispostaFinaleMoltiplicazioneInputEl.value = '';
}

function generaProblemaMoltiplicazioneScomposizione(livello) {
    console.log(`generaProblemaMoltiplicazioneScomposizione: Livello ${livello}`);
    let fattore1, fattore2, prodotto;
    let partiScompostePerHint = []; // This will be the one for hints
    let prodottiParzialiPerHint = [];

    switch (livello) {
        case 1: // 2 parts
            numScomposizioniMoltiplicazioneRichieste = 2;
            fattore1 = Math.floor(Math.random() * 89) + 11; // 11-99
            fattore2 = Math.floor(Math.random() * 8) + 2;   // 2-9

            let p1_lvl1 = Math.floor(fattore1 / 10) * 10;
            let p2_lvl1 = fattore1 - p1_lvl1;

            if (p2_lvl1 === 0 && p1_lvl1 === fattore1) { // e.g., fattore1 = 30, p1=30, p2=0
                if (p1_lvl1 >= 20) partiScompostePerHint = [p1_lvl1 - 10, 10]; // 30 -> [20, 10]
                else partiScompostePerHint = [Math.floor(p1_lvl1/2), Math.ceil(p1_lvl1/2)]; // 10 -> [5,5]
            } else if (p1_lvl1 === 0 && p2_lvl1 === fattore1) { // e.g., fattore1 = 7 (though range is 11-99)
                 partiScompostePerHint = [Math.floor(p2_lvl1/2), Math.ceil(p2_lvl1/2)];
            } else {
                partiScompostePerHint = [p1_lvl1, p2_lvl1]; // e.g. 34 -> [30, 4]
            }
            // Ensure two positive parts
            if (partiScompostePerHint.length === 1 || partiScompostePerHint.some(p => p <= 0)) {
                partiScompostePerHint = [Math.floor(fattore1/2), fattore1 - Math.floor(fattore1/2)];
            }
            break;
        case 2: // 3 parts
            numScomposizioniMoltiplicazioneRichieste = 3;
            fattore1 = Math.floor(Math.random() * 150) + 25; // 25 to 174
            fattore2 = Math.floor(Math.random() * 8) + 2;   // 2 to 9

            if (fattore1 >= 100) { // 100-174
                let h = 100;
                let rem = fattore1 - h; // 0-74
                if (rem === 0) partiScompostePerHint = [50, 30, 20]; // For 100
                else if (rem < 10) partiScompostePerHint = [h, Math.floor(rem / 2), Math.ceil(rem / 2)]; // For 101-109 -> [100, x, y]
                else { // rem 10-74
                    let t_rem = Math.floor(rem / 10) * 10;
                    let u_rem = rem % 10;
                    if (u_rem === 0) partiScompostePerHint = [h, t_rem / 2, t_rem / 2]; // For 110, 120... -> [100, t_rem/2, t_rem/2]
                    else partiScompostePerHint = [h, t_rem, u_rem]; // For 123 -> [100, 20, 3]
                }
            } else { // fattore1 is 25-99
                let t_f1 = Math.floor(fattore1 / 10) * 10;
                let u_f1 = fattore1 % 10;
                if (u_f1 === 0) { // 30, 40 .. 90 (fattore1 >= 25, so t_f1 >= 20)
                    partiScompostePerHint = [10, 10, fattore1 - 20]; // e.g. 30 -> [10,10,10], 90 -> [10,10,70]
                } else { // Units digit is not 0. e.g. 25, 34, 99
                    if (t_f1 >= 10) { // fattore1 >= 25 means t_f1 is 20,30...
                         partiScompostePerHint = [t_f1 - 10, 10, u_f1]; // e.g. 25 -> [10,10,5]. 34 -> [20,10,4]
                    } else { // Should not happen for fattore1 >= 25
                        let p1 = Math.floor(fattore1/3); let p2 = Math.floor(fattore1/3);
                        partiScompostePerHint = [p1, p2, fattore1-p1-p2];
                    }
                }
            }
            // Ensure 3 positive parts that sum correctly
            partiScompostePerHint = partiScompostePerHint.filter(p => p > 0);
            if (partiScompostePerHint.length !== 3 || partiScompostePerHint.reduce((a,b)=>a+b,0) !== fattore1) {
                console.warn(`Adjusting scomposition for ${fattore1} from ${partiScompostePerHint.join('+')} to 3 parts.`);
                partiScompostePerHint = [];
                let p1 = Math.max(1, Math.floor(fattore1 / 3));
                let p2 = Math.max(1, Math.floor(fattore1 / 3));
                let p3 = fattore1 - p1 - p2;
                if (p3 <= 0) { // if p1,p2 were too large
                    p1 = Math.max(1, Math.floor(fattore1 / numScomposizioniMoltiplicazioneRichieste) -1 );
                    p2 = Math.max(1, Math.floor(fattore1 / numScomposizioniMoltiplicazioneRichieste) -1 );
                    p3 = fattore1 - p1 - p2;
                }
                partiScompostePerHint = [p1,p2,p3].map(p => p <= 0 ? 1 : p); // Ensure positive
                // Final sum adjustment
                let currentSum = partiScompostePerHint.reduce((a,b)=>a+b,0);
                if (currentSum !== fattore1) {
                    partiScompostePerHint[partiScompostePerHint.length-1] += (fattore1 - currentSum);
                }
                 partiScompostePerHint = partiScompostePerHint.filter(p => p > 0); // Final safety filter
                 if (partiScompostePerHint.length !== 3) { // Absolute fallback
                     partiScompostePerHint = [1,1,fattore1-2];
                     if (fattore1 === 2) partiScompostePerHint = [1,1,0]; // Will be filtered, error
                     if (fattore1 < 2) partiScompostePerHint = [1,0,0]; // error
                 }
            }

            break;
        default: // Fallback to level 1 logic if level is unrecognized
            numScomposizioniMoltiplicazioneRichieste = 2;
            fattore1 = Math.floor(Math.random() * 89) + 11;
            fattore2 = Math.floor(Math.random() * 8) + 2;
            let p1_def = Math.floor(fattore1 / 10) * 10;
            let p2_def = fattore1 - p1_def;
            if (p2_def === 0) partiScompostePerHint = [p1_def - 10, 10]; else partiScompostePerHint = [p1_def, p2_def];
            if (partiScompostePerHint.some(p => p <= 0)) partiScompostePerHint = [Math.floor(fattore1/2), fattore1 - Math.floor(fattore1/2)];

    }

    // Final check on partiScompostePerHint to ensure they are valid for the number of scomposizioni
    partiScompostePerHint = partiScompostePerHint.filter(p => p > 0);
    if (partiScompostePerHint.length !== numScomposizioniMoltiplicazioneRichieste || partiScompostePerHint.reduce((a,b)=>a+b,0) !== fattore1) {
        console.error(`FALLBACK: Scomposition for ${fattore1} into ${numScomposizioniMoltiplicazioneRichieste} parts failed. Original: ${partiScompostePerHint.join('+')}`);
        partiScompostePerHint = [];
        let basePart = Math.max(1, Math.floor(fattore1 / numScomposizioniMoltiplicazioneRichieste));
        for(let i=0; i < numScomposizioniMoltiplicazioneRichieste -1; i++) {
            partiScompostePerHint.push(basePart);
        }
        let lastPart = fattore1 - (basePart * (numScomposizioniMoltiplicazioneRichieste -1));
        partiScompostePerHint.push(Math.max(1, lastPart)); // Ensure last part is at least 1

        // Adjust sum if making last part 1 caused issues
        let finalSum = partiScompostePerHint.reduce((a,b)=>a+b,0);
        if (finalSum !== fattore1) {
            partiScompostePerHint[partiScompostePerHint.length-1] += (fattore1 - finalSum);
        }
        // One last check for positivity after adjustment
        partiScompostePerHint = partiScompostePerHint.map(p => p <= 0 ? 1 : p);
        finalSum = partiScompostePerHint.reduce((a,b)=>a+b,0);
        if (finalSum !== fattore1) { // Adjust again if mapping to 1 caused sum issue
             partiScompostePerHint[partiScompostePerHint.length-1] += (fattore1 - finalSum);
        }
    }


    prodotto = fattore1 * fattore2;
    prodottiParzialiPerHint = partiScompostePerHint.map(parte => parte * fattore2);

    currentFactor1 = fattore1;
    currentFactor2 = fattore2;

    console.log(`Moltiplicazione: ${fattore1} x ${fattore2} = ${prodotto}. Parti (per hint): ${partiScompostePerHint.join('+')}, Prodotti Parziali (per hint): ${prodottiParzialiPerHint.join('+')}`);
    return { fattore1, fattore2, prodotto, partiScomposte: partiScompostePerHint, prodottiParziali: prodottiParzialiPerHint, numScomposizioni: numScomposizioniMoltiplicazioneRichieste };
}

function generaDomandaMoltiplicazioneScomposizione() {
    console.log("generaDomandaMoltiplicazioneScomposizione: Inizio.");

    domandaMoltiplicazioneScomposizioneEl = document.getElementById('domanda-moltiplicazione-scomposizione');
    msScomponiFattore1Parte1InputEl = document.getElementById('ms-scomponi-fattore-1-parte-1');
    msSecondoFattoreDisplay1El = document.getElementById('ms-secondo-fattore-display-1');
    msScomponiProdotto1InputEl = document.getElementById('ms-scomponi-prodotto-1');
    msScomponiFattore1Parte2InputEl = document.getElementById('ms-scomponi-fattore-1-parte-2');
    msSecondoFattoreDisplay2El = document.getElementById('ms-secondo-fattore-display-2');
    msScomponiProdotto2InputEl = document.getElementById('ms-scomponi-prodotto-2');
    msScomponiFattore1Parte3InputEl = document.getElementById('ms-scomponi-fattore-1-parte-3');
    msSecondoFattoreDisplay3El = document.getElementById('ms-secondo-fattore-display-3');
    msScomponiProdotto3InputEl = document.getElementById('ms-scomponi-prodotto-3');
    msRispostaFinaleMoltiplicazioneInputEl = document.getElementById('ms-risposta-finale-moltiplicazione');
    feedbackMoltiplicazioneScomposizioneEl = document.getElementById('feedback-moltiplicazione-scomposizione');
    hintMoltiplicazioneScomposizioneEl = document.getElementById('hint-moltiplicazione-scomposizione');
    msPassaggioScomponi1El = document.getElementById('ms-passaggio-scomponi-1');
    msPassaggioScomponi2El = document.getElementById('ms-passaggio-scomponi-2');
    msPassaggioScomponi3El = document.getElementById('ms-passaggio-scomponi-3');

    if (!domandaMoltiplicazioneScomposizioneEl || !msScomponiFattore1Parte1InputEl || !moltiplicazioniScomposizioneSectionEl || !livelloMoltiplicazioneScomposizioneContainerEl) {
        console.error("generaDomandaMoltiplicazioneScomposizione: Elementi DOM critici per la sezione moltiplicazioni non trovati.");
        if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = "Errore: elementi mancanti per questa modalità.";
        return;
    }

    activeSection = 'moltiplicazioni-scomposizione';
    tabellineSectionEl.style.display = 'none';
    divisioniSectionEl.style.display = 'none';
    moltiplicazioniScomposizioneSectionEl.style.display = 'block';
    modalitaSceltaEl.style.display = 'none';
    gameContainerEl.style.display = 'block';
    livelloDivisioneContainerEl.style.display = 'none';
    livelloMoltiplicazioneScomposizioneContainerEl.style.display = 'block';

    currentCorrectAnswer = generaProblemaMoltiplicazioneScomposizione(livelloMoltiplicazioneScomposizione);

    if (!currentCorrectAnswer || typeof currentCorrectAnswer.prodotto === 'undefined') {
        console.error("CRITICAL: generaProblemaMoltiplicazioneScomposizione non ha restituito un oggetto problema valido.");
        if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = "Errore critico nella generazione del problema. Riprova.";
        return;
    }

    domandaMoltiplicazioneScomposizioneEl.textContent = `Quanto fa ${currentCorrectAnswer.fattore1} x ${currentCorrectAnswer.fattore2}? Scomponi ${currentCorrectAnswer.fattore1}.`;

    if (msSecondoFattoreDisplay1El) msSecondoFattoreDisplay1El.textContent = currentCorrectAnswer.fattore2;
    if (msSecondoFattoreDisplay2El) msSecondoFattoreDisplay2El.textContent = currentCorrectAnswer.fattore2;
    if (msSecondoFattoreDisplay3El) msSecondoFattoreDisplay3El.textContent = currentCorrectAnswer.fattore2;

    clearMoltiplicazioneScomposizioneInputs();
    if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = '';
    if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = '';

    if (msPassaggioScomponi1El) msPassaggioScomponi1El.style.display = numScomposizioniMoltiplicazioneRichieste >= 1 ? 'flex' : 'none';
    if (msPassaggioScomponi2El) msPassaggioScomponi2El.style.display = numScomposizioniMoltiplicazioneRichieste >= 2 ? 'flex' : 'none';
    if (msPassaggioScomponi3El) msPassaggioScomponi3El.style.display = numScomposizioniMoltiplicazioneRichieste >= 3 ? 'flex' : 'none';

    if (msScomponiFattore1Parte1InputEl) msScomponiFattore1Parte1InputEl.focus();
    questionStartTime = new Date();
    console.log("generaDomandaMoltiplicazioneScomposizione: Fine.");
}

function controllaMoltiplicazioneScomposizione() {
    console.log("controllaMoltiplicazioneScomposizione: Placeholder. Logica da implementare.");
    if (!currentCorrectAnswer || !feedbackMoltiplicazioneScomposizioneEl) {
        console.error("controllaMoltiplicazioneScomposizione: currentCorrectAnswer o feedback non disponibili.");
        return;
    }
    const elapsedTime = (new Date() - questionStartTime) / 1000;

    const parte1 = msScomponiFattore1Parte1InputEl.value !== '' ? parseInt(msScomponiFattore1Parte1InputEl.value) : null;
    const prodotto1 = msScomponiProdotto1InputEl.value !== '' ? parseInt(msScomponiProdotto1InputEl.value) : null;
    const parte2 = msScomponiFattore1Parte2InputEl.value !== '' ? parseInt(msScomponiFattore1Parte2InputEl.value) : null;
    const prodotto2 = msScomponiProdotto2InputEl.value !== '' ? parseInt(msScomponiProdotto2InputEl.value) : null;
    let parte3 = null;
    let prodotto3 = null;
    if (numScomposizioniMoltiplicazioneRichieste >= 3) {
        parte3 = msScomponiFattore1Parte3InputEl.value !== '' ? parseInt(msScomponiFattore1Parte3InputEl.value) : null;
        prodotto3 = msScomponiProdotto3InputEl.value !== '' ? parseInt(msScomponiProdotto3InputEl.value) : null;
    }
    const rispostaFinaleUtente = msRispostaFinaleMoltiplicazioneInputEl.value !== '' ? parseInt(msRispostaFinaleMoltiplicazioneInputEl.value) : null;

    let erroreScomposizione = false;
    let hintMsg = "";
    let sommaPartiCorretta = false;
    let prodottiParzialiCorretti = true;
    let sommaProdottiParzialiUtente = 0;

    let sommaPartiUtente = 0;
    if (parte1 !== null) sommaPartiUtente += parte1;
    if (parte2 !== null) sommaPartiUtente += parte2;
    if (parte3 !== null) sommaPartiUtente += parte3;

    if (sommaPartiUtente !== currentCorrectAnswer.fattore1) {
        erroreScomposizione = true;
        hintMsg = `La somma delle parti (${sommaPartiUtente}) non corrisponde a ${currentCorrectAnswer.fattore1}.`;
    } else {
        sommaPartiCorretta = true;
    }

    if (sommaPartiCorretta) {
        if (parte1 !== null && prodotto1 !== null) {
            if (parte1 * currentCorrectAnswer.fattore2 !== prodotto1) { prodottiParzialiCorretti = false; hintMsg = `Controlla: ${parte1} x ${currentCorrectAnswer.fattore2} non fa ${prodotto1}.`; erroreScomposizione = true;}
            else { sommaProdottiParzialiUtente += prodotto1; }
        } else if (parte1 !== null || prodotto1 !== null) { prodottiParzialiCorretti = false; hintMsg = "Completa il primo passaggio (parte e prodotto)."; erroreScomposizione = true;}

        if (prodottiParzialiCorretti && parte2 !== null && prodotto2 !== null) {
            if (parte2 * currentCorrectAnswer.fattore2 !== prodotto2) { prodottiParzialiCorretti = false; hintMsg = `Controlla: ${parte2} x ${currentCorrectAnswer.fattore2} non fa ${prodotto2}.`; erroreScomposizione = true;}
            else { sommaProdottiParzialiUtente += prodotto2; }
        } else if (prodottiParzialiCorretti && (parte2 !== null || prodotto2 !== null)) { prodottiParzialiCorretti = false; hintMsg = "Completa il secondo passaggio (parte e prodotto)."; erroreScomposizione = true;}

        if (prodottiParzialiCorretti && numScomposizioniMoltiplicazioneRichieste >= 3) {
            if (parte3 !== null && prodotto3 !== null) {
                if (parte3 * currentCorrectAnswer.fattore2 !== prodotto3) { prodottiParzialiCorretti = false; hintMsg = `Controlla: ${parte3} x ${currentCorrectAnswer.fattore2} non fa ${prodotto3}.`; erroreScomposizione = true;}
                else { sommaProdottiParzialiUtente += prodotto3; }
            } else if (prodottiParzialiCorretti && (parte3 !== null || prodotto3 !== null)) { prodottiParzialiCorretti = false; hintMsg = "Completa il terzo passaggio (parte e prodotto)."; erroreScomposizione = true;}
        }
    }

    const scomposizioneNonTentata = parte1 === null && prodotto1 === null && parte2 === null && prodotto2 === null && (numScomposizioniMoltiplicazioneRichieste < 3 || (parte3 === null && prodotto3 === null));

    if (rispostaFinaleUtente === null && !erroreScomposizione && !scomposizioneNonTentata) {
        feedbackMoltiplicazioneScomposizioneEl.textContent = "Inserisci la risposta finale!";
        feedbackMoltiplicazioneScomposizioneEl.className = 'feedback error';
        if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = "Somma i prodotti parziali.";
        return;
    }

    if (erroreScomposizione) {
        feedbackMoltiplicazioneScomposizioneEl.textContent = `Errore nella scomposizione, ${playerName}.`;
        feedbackMoltiplicazioneScomposizioneEl.className = 'feedback error';
        if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = hintMsg;
        playSound('error');
    } else if (rispostaFinaleUtente === currentCorrectAnswer.prodotto && sommaPartiCorretta && prodottiParzialiCorretti && sommaProdottiParzialiUtente === currentCorrectAnswer.prodotto && !scomposizioneNonTentata) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        const puntiGuadagnati = updatePunteggio(2 + bonus);
        feedbackMoltiplicazioneScomposizioneEl.textContent = `Correttissimo, ${playerName}! Ottima scomposizione! +${puntiGuadagnati} punti.`;
        feedbackMoltiplicazioneScomposizioneEl.className = 'feedback success';
        if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = '';
        playSound('success');
        if (bonus === 2) playSound('awesome'); else if (bonus === 1) playSound('good');
        setTimeout(generaDomandaMoltiplicazioneScomposizione, 2000);
    } else if (rispostaFinaleUtente === currentCorrectAnswer.prodotto && scomposizioneNonTentata) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        const puntiGuadagnati = updatePunteggio(1 + bonus);
        feedbackMoltiplicazioneScomposizioneEl.textContent = `Risposta finale corretta, ${playerName}! +${puntiGuadagnati} punti.`;
        feedbackMoltiplicazioneScomposizioneEl.className = 'feedback success';
        if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = `La prossima volta prova a usare la scomposizione! Aiuta a capire meglio.`;
        playSound('success');
        if (bonus >= 1) playSound('good');
        setTimeout(() => {
            if (hintMoltiplicazioneScomposizioneEl && hintMoltiplicazioneScomposizioneEl.textContent.startsWith('La prossima volta')) {
                hintMoltiplicazioneScomposizioneEl.textContent = '';
            }
            generaDomandaMoltiplicazioneScomposizione();
        }, 3500);
    } else {
        feedbackMoltiplicazioneScomposizioneEl.textContent = `Sbagliato, ${playerName}. La risposta corretta è ${currentCorrectAnswer.prodotto}.`;
        if (!sommaPartiCorretta) {
            if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = hintMsg;
        } else if (!prodottiParzialiCorretti) {
            if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = hintMsg;
        } else if (sommaProdottiParzialiUtente !== currentCorrectAnswer.prodotto && !scomposizioneNonTentata) {
            if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = `La scomposizione e i prodotti parziali sembrano corretti, ma la loro somma (${sommaProdottiParzialiUtente}) non dà il risultato finale.`;
        } else if (rispostaFinaleUtente !== currentCorrectAnswer.prodotto) {
            if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = `La risposta finale (${rispostaFinaleUtente}) non è corretta.`;
        } else {
            if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = `Controlla tutti i passaggi e la risposta finale.`;
        }
        feedbackMoltiplicazioneScomposizioneEl.className = 'feedback error';
        playSound('error');
    }
}

function mostraAiutoMoltiplicazioneScomposizione() {
    console.log("mostraAiutoMoltiplicazioneScomposizione: Fornendo aiuto.");
    if (!currentCorrectAnswer || !hintMoltiplicazioneScomposizioneEl) {
        console.warn("mostraAiutoMoltiplicazioneScomposizione: currentCorrectAnswer o hintMoltiplicazioneScomposizioneEl non disponibili.");
        if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = "Suggerimento non disponibile al momento.";
        return;
    }

    const { fattore1, fattore2, partiScomposte, numScomposizioni } = currentCorrectAnswer;
    let hintMsg = "";

    if (partiScomposte && partiScomposte.length === numScomposizioni && partiScomposte.every(p => p > 0) && partiScomposte.reduce((a,b)=>a+b,0) === fattore1) {
        hintMsg = `Prova a scomporre ${fattore1} in ${numScomposizioni} parti. Ad esempio: ${partiScomposte.join(' + ')} (somma = ${partiScomposte.reduce((a,b)=>a+b,0)}).`;
        hintMsg += ` Poi calcola i prodotti parziali:\n`;
        for (let i = 0; i < partiScomposte.length; i++) {
            hintMsg += `(${partiScomposte[i]} x ${fattore2}) = ${partiScomposte[i] * fattore2}`;
            if (i < partiScomposte.length - 1) {
                hintMsg += ",\n";
            }
        }
        let sommaProdottiParziali = partiScomposte.map(p => p * fattore2).reduce((a,b)=>a+b,0);
        hintMsg += `.\nInfine somma i prodotti parziali: ${partiScomposte.map(p => p * fattore2).join(' + ')} = ${sommaProdottiParziali}.`;
        if (sommaProdottiParziali !== fattore1 * fattore2) {
             console.warn("Hint logic error: Sum of partial products in hint does not match total product.");
             hintMsg += ` (Attenzione: il prodotto totale dovrebbe essere ${fattore1*fattore2})`;
        }
    } else {
        hintMsg = `Pensa a come puoi dividere ${fattore1} in ${numScomposizioni} numeri più facili (come decine e unità). Poi moltiplica ciascuna parte per ${fattore2} e somma i risultati.`;
        console.warn("mostraAiutoMoltiplicazioneScomposizione: currentCorrectAnswer.partiScomposte non era ideale per il suggerimento. Parti: ", partiScomposte, "NumScomp:", numScomposizioni, "Fattore1:", fattore1);
    }
    hintMoltiplicazioneScomposizioneEl.textContent = hintMsg;
    hintMoltiplicazioneScomposizioneEl.style.whiteSpace = 'pre-line'; // Allow newlines in hint
    playSound('good');
}