// Variabili Globali per gli elementi DOM principali
// Queste verranno inizializzate in DOMContentLoaded
let playerNameOverlayEl, playerNameInputEl, startGameButtonEl,
    scoreContainerEl, scoreEl, highScoreEl, welcomeMessageEl,
    modalitaSceltaEl, showTabellineButton, showDivisioniButton, showMoltiplicazioniScomposizioneButton,
    gameContainerEl, tabellineSectionEl, divisioniSectionEl, moltiplicazioniScomposizioneSectionEl,
    livelloDivisioneContainerEl, livelloDivisioneSelectEl,
    livelloMoltiplicazioneScomposizioneContainerEl, livelloMoltiplicazioneScomposizioneSelectEl,
    nuovaPartitaButtonEl, scomposizionePassaggi, risultatoDivisioneEl;

// Variabili di stato del gioco
let playerName = "Giocatore";
let currentScore = 0; // Use this as the primary variable for the current game's score
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Load high score from localStorage
let currentCorrectAnswer;
let currentDividend, currentDivisor;
let currentFactor1, currentFactor2;
let questionStartTime;
let livelloDivisione = 1;
let livelloMoltiplicazioneScomposizione = 1;
let activeSection = ''; // 'tabelline', 'divisioni', or 'moltiplicazioni-scomposizione'
let numScomposizioniRichieste = 1;
let numScomposizioniMoltiplicazioneRichieste = 2;

// Variabili per il timer
let startTime;
let timerInterval; // Potrebbe servire per un timer visibile, non usato attivamente ora

// Costanti per i punti (esempio)
const PUNTI_TABELLINA = 10;
const PUNTI_DIVISIONE_LIVELLO_1 = 10;
const PUNTI_DIVISIONE_LIVELLO_2_3 = 20;
const PUNTI_MOLTIPLICAZIONE_SCOMPOSIZIONE = 15;

// Funzioni di gestione del punteggio
function incrementaPunteggio(punti) {
    currentScore += punti;
    console.log(`Punteggio incrementato di ${punti}. Nuovo punteggio: ${currentScore}`);
    aggiornaPunteggioDisplay();
}

function decrementaPunteggio(punti) {
    currentScore -= punti;
    if (currentScore < 0) {
        currentScore = 0; // Evita punteggi negativi
    }
    console.log(`Punteggio decrementato di ${punti}. Nuovo punteggio: ${currentScore}`);
    aggiornaPunteggioDisplay();
}

function aggiornaPunteggioDisplay() {
    if (scoreEl) {
        scoreEl.textContent = currentScore;
    }
    if (currentScore > highScore) {
        highScore = currentScore;
        if (highScoreEl) {
            highScoreEl.textContent = highScore;
        }
        localStorage.setItem('highScore', highScore.toString());
        console.log(`Nuovo record: ${highScore}`);
    }
    console.log(`Punteggio aggiornato sul display: Corrente=${currentScore}, Record=${highScore}`);
}

function resetPunteggio() {
    currentScore = 0;
    console.log("Punteggio resettato a 0.");
    aggiornaPunteggioDisplay();
}

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
        'risposta-finale-divisione': risultatoDivisioneEl
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

    // Inizializza la visualizzazione del punteggio
    if (scoreEl) scoreEl.textContent = currentScore;
    if (highScoreEl) highScoreEl.textContent = highScore;

    // Event Listeners
    startGameButtonEl.addEventListener('click', startGame);

    showTabellineButton.addEventListener('click', () => {
        if (!modalitaSceltaEl || !gameContainerEl || !tabellineSectionEl || !divisioniSectionEl || !moltiplicazioniScomposizioneSectionEl || !livelloDivisioneContainerEl || !livelloMoltiplicazioneScomposizioneContainerEl) {
            console.error("showTabellineButton: Elementi contenitore principali mancanti.");
            return;
        }
        activeSection = 'tabelline';
        modalitaSceltaEl.style.display = 'none';
        gameContainerEl.style.display = 'block';
        tabellineSectionEl.style.display = 'block';
        divisioniSectionEl.style.display = 'none';
        moltiplicazioniScomposizioneSectionEl.style.display = 'none';
        livelloDivisioneContainerEl.style.display = 'none'; // Nascondi selettore livello divisioni
        livelloMoltiplicazioneScomposizioneContainerEl.style.display = 'none'; // Nascondi selettore livello moltiplicazioni
        generaDomandaTabellina();
    });

    showDivisioniButton.addEventListener('click', () => {
        if (!modalitaSceltaEl || !gameContainerEl || !tabellineSectionEl || !divisioniSectionEl || !moltiplicazioniScomposizioneSectionEl || !livelloDivisioneContainerEl || !livelloMoltiplicazioneScomposizioneContainerEl) {
            console.error("showDivisioniButton: Elementi contenitore principali mancanti.");
            return;
        }
        activeSection = 'divisioni';
        modalitaSceltaEl.style.display = 'none';
        gameContainerEl.style.display = 'block';
        tabellineSectionEl.style.display = 'none';
        divisioniSectionEl.style.display = 'block';
        moltiplicazioniScomposizioneSectionEl.style.display = 'none';
        livelloDivisioneContainerEl.style.display = 'block'; // Mostra selettore livello divisioni
        livelloMoltiplicazioneScomposizioneContainerEl.style.display = 'none'; // Nascondi selettore livello moltiplicazioni
        generaDomandaDivisione();
    });

    if (showMoltiplicazioniScomposizioneButton) {
        showMoltiplicazioniScomposizioneButton.addEventListener('click', () => {
            generaDomandaMoltiplicazioneScomposizione();
        });
    } else {
        console.warn("WARN: Elemento 'show-moltiplicazioni-scomposizione' non trovato.");
    }

    nuovaPartitaButtonEl.addEventListener('click', () => {
        resetPunteggio();
        playerNameInputEl.value = '';
        playerNameOverlayEl.style.display = 'flex';
        modalitaSceltaEl.style.display = 'none';
        gameContainerEl.style.display = 'none';
        livelloDivisioneContainerEl.style.display = 'none';
        livelloMoltiplicazioneScomposizioneContainerEl.style.display = 'none';
        activeSection = '';
    });

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

// Timer functions
function startTimer() {
    startTime = new Date();
}

function stopTimer() {
}

function getElapsedTime() {
    if (!startTime) return 0;
    const endTime = new Date();
    const timeDiff = endTime - startTime;
    return timeDiff / 1000;
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
    let partiScompostePerHint = [];
    let prodottiParzialiPerHint = [];

    switch (livello) {
        case 1:
            numScomposizioniMoltiplicazioneRichieste = 2;
            fattore1 = Math.floor(Math.random() * 89) + 11;
            fattore2 = Math.floor(Math.random() * 8) + 2;

            let p1_lvl1 = Math.floor(fattore1 / 10) * 10;
            let p2_lvl1 = fattore1 - p1_lvl1;

            if (p2_lvl1 === 0 && p1_lvl1 === fattore1) {
                if (p1_lvl1 >= 20) partiScompostePerHint = [p1_lvl1 - 10, 10];
                else partiScompostePerHint = [Math.floor(p1_lvl1/2), Math.ceil(p1_lvl1/2)];
            } else if (p1_lvl1 === 0 && p2_lvl1 === fattore1) {
                 partiScompostePerHint = [Math.floor(p2_lvl1/2), Math.ceil(p2_lvl1/2)];
            } else {
                partiScompostePerHint = [p1_lvl1, p2_lvl1];
            }
            if (partiScompostePerHint.length === 1 || partiScompostePerHint.some(p => p <= 0)) {
                partiScompostePerHint = [Math.floor(fattore1/2), fattore1 - Math.floor(fattore1/2)];
            }
            break;
        case 2:
            numScomposizioniMoltiplicazioneRichieste = 3;
            fattore1 = Math.floor(Math.random() * 150) + 25;
            fattore2 = Math.floor(Math.random() * 8) + 2;

            if (fattore1 >= 100) {
                let h = 100;
                let rem = fattore1 - h;
                if (rem === 0) partiScompostePerHint = [50, 30, 20];
                else if (rem < 10) partiScompostePerHint = [h, Math.floor(rem / 2), Math.ceil(rem / 2)];
                else {
                    let t_rem = Math.floor(rem / 10) * 10;
                    let u_rem = rem % 10;
                    if (u_rem === 0) partiScompostePerHint = [h, t_rem / 2, t_rem / 2];
                    else partiScompostePerHint = [h, t_rem, u_rem];
                }
            } else {
                let t_f1 = Math.floor(fattore1 / 10) * 10;
                let u_f1 = fattore1 % 10;
                if (u_f1 === 0) {
                    partiScompostePerHint = [10, 10, fattore1 - 20];
                } else {
                    if (t_f1 >= 10) {
                         partiScompostePerHint = [t_f1 - 10, 10, u_f1];
                    } else {
                        let p1 = Math.floor(fattore1/3); let p2 = Math.floor(fattore1/3);
                        partiScompostePerHint = [p1, p2, fattore1-p1-p2];
                    }
                }
            }
            partiScompostePerHint = partiScompostePerHint.filter(p => p > 0);
            if (partiScompostePerHint.length !== 3 || partiScompostePerHint.reduce((a,b)=>a+b,0) !== fattore1) {
                console.warn(`Adjusting scomposition for ${fattore1} from ${partiScompostePerHint.join('+')} to 3 parts.`);
                partiScompostePerHint = [];
                let p1 = Math.max(1, Math.floor(fattore1 / 3));
                let p2 = Math.max(1, Math.floor(fattore1 / 3));
                let p3 = fattore1 - p1 - p2;
                if (p3 <= 0) {
                    p1 = Math.max(1, Math.floor(fattore1 / numScomposizioniMoltiplicazioneRichieste) -1 );
                    p2 = Math.max(1, Math.floor(fattore1 / numScomposizioniMoltiplicazioneRichieste) -1 );
                    p3 = fattore1 - p1 - p2;
                }
                partiScompostePerHint = [p1,p2,p3].map(p => p <= 0 ? 1 : p);
                let currentSum = partiScompostePerHint.reduce((a,b)=>a+b,0);
                if (currentSum !== fattore1) {
                    partiScompostePerHint[partiScompostePerHint.length-1] += (fattore1 - currentSum);
                }
                 partiScompostePerHint = partiScompostePerHint.filter(p => p > 0);
                 if (partiScompostePerHint.length !== 3) {
                     partiScompostePerHint = [1,1,fattore1-2];
                     if (fattore1 === 2) partiScompostePerHint = [1,1,0];
                     if (fattore1 < 2) partiScompostePerHint = [1,0,0];
                 }
            }

            break;
        default:
            numScomposizioniMoltiplicazioneRichieste = 2;
            fattore1 = Math.floor(Math.random() * 89) + 11;
            fattore2 = Math.floor(Math.random() * 8) + 2;
            let p1_def = Math.floor(fattore1 / 10) * 10;
            let p2_def = fattore1 - p1_def;
            if (p2_def === 0) partiScompostePerHint = [p1_def - 10, 10]; else partiScompostePerHint = [p1_def, p2_def];
            if (partiScompostePerHint.some(p => p <= 0)) partiScompostePerHint = [Math.floor(fattore1/2), fattore1 - Math.floor(fattore1/2)];

    }

    partiScompostePerHint = partiScompostePerHint.filter(p => p > 0);
    if (partiScompostePerHint.length !== numScomposizioniMoltiplicazioneRichieste || partiScompostePerHint.reduce((a,b)=>a+b,0) !== fattore1) {
        console.error(`FALLBACK: Scomposition for ${fattore1} into ${numScomposizioniMoltiplicazioneRichieste} parts failed. Original: ${partiScompostePerHint.join('+')}`);
        partiScompostePerHint = [];
        let basePart = Math.max(1, Math.floor(fattore1 / numScomposizioniMoltiplicazioneRichieste));
        for(let i=0; i < numScomposizioniMoltiplicazioneRichieste -1; i++) {
            partiScompostePerHint.push(basePart);
        }
        let lastPart = fattore1 - (basePart * (numScomposizioniMoltiplicazioneRichieste -1));
        partiScompostePerHint.push(Math.max(1, lastPart));

        let finalSum = partiScompostePerHint.reduce((a,b)=>a+b,0);
        if (finalSum !== fattore1) {
            partiScompostePerHint[partiScompostePerHint.length-1] += (fattore1 - finalSum);
        }
        partiScompostePerHint = partiScompostePerHint.map(p => p <= 0 ? 1 : p);
        finalSum = partiScompostePerHint.reduce((a,b)=>a+b,0);
        if (finalSum !== fattore1) {
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

    if (msPassaggioScomponi1El) msPassaggioScomponi1El.style.display = currentCorrectAnswer.numScomposizioni >= 1 ? 'flex' : 'none';
    if (msPassaggioScomponi2El) msPassaggioScomponi2El.style.display = currentCorrectAnswer.numScomposizioni >= 2 ? 'flex' : 'none';
    if (msPassaggioScomponi3El) msPassaggioScomponi3El.style.display = currentCorrectAnswer.numScomposizioni >= 3 ? 'flex' : 'none';

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
    if (currentCorrectAnswer.numScomposizioni >= 3) {
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

        if (prodottiParzialiCorretti && currentCorrectAnswer.numScomposizioni >= 3) {
            if (parte3 !== null && prodotto3 !== null) {
                if (parte3 * currentCorrectAnswer.fattore2 !== prodotto3) { prodottiParzialiCorretti = false; hintMsg = `Controlla: ${parte3} x ${currentCorrectAnswer.fattore2} non fa ${prodotto3}.`; erroreScomposizione = true;}
                else { sommaProdottiParzialiUtente += prodotto3; }
            } else if (prodottiParzialiCorretti && (parte3 !== null || prodotto3 !== null)) { prodottiParzialiCorretti = false; hintMsg = "Completa il terzo passaggio (parte e prodotto)."; erroreScomposizione = true;}
        }
    }

    const scomposizioneNonTentata = parte1 === null && prodotto1 === null && parte2 === null && prodotto2 === null && (currentCorrectAnswer.numScomposizioni < 3 || (parte3 === null && prodotto3 === null));

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
        const puntiGuadagnati = incrementaPunteggio(2 + bonus);
        feedbackMoltiplicazioneScomposizioneEl.textContent = `Correttissimo, ${playerName}! Ottima scomposizione! +${puntiGuadagnati} punti.`;
        feedbackMoltiplicazioneScomposizioneEl.className = 'feedback success';
        if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = '';
        playSound('success');
        if (bonus === 2) playSound('awesome'); else if (bonus === 1) playSound('good');
        setTimeout(generaDomandaMoltiplicazioneScomposizione, 2000);
    } else if (rispostaFinaleUtente === currentCorrectAnswer.prodotto && scomposizioneNonTentata) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        const puntiGuadagnati = incrementaPunteggio(1 + bonus);
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
        hintMsg = `Prova a scomporre ${fattore1} in ${numScomposizioni} parti. Ad esempio: ${partiScomposte.join(' + ')} (somma = ${partiScomposte.reduce((a,b)=>a+b,0)}).\n`;
        hintMsg += `Poi calcola i prodotti parziali:\n`;
        for (let i = 0; i < partiScomposte.length; i++) {
            let parte = partiScomposte[i];
            let f2 = fattore2;
            let partialProductCalcString = `(${parte} x ${f2})`;
            let partialProductResult = parte * f2;
            
            hintMsg += `${partialProductCalcString} = ${partialProductResult}`;

            if (parte % 10 === 0 && parte > 10 && parte < 100 && f2 >= 2 && f2 <= 9) {
                let N = parte / 10;
                let intermediateCalc = `(${N} x ${f2})`;
                let intermediateResult = N * f2;
                let finalStepCalc = `${intermediateResult} x 10`;

                hintMsg += ` (Suggerimento: per ${parte}x${f2}, puoi fare ${intermediateCalc}=${intermediateResult}, e poi ${finalStepCalc}=${partialProductResult})`;
            }

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
    hintMoltiplicazioneScomposizioneEl.style.whiteSpace = 'pre-line';
    playSound('good');
}

// Funzioni per la modalità Tabelline
function generaProblemaTabellina() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    currentCorrectAnswer = num1 * num2;
    console.log(`Tabellina: ${num1} x ${num2} = ${currentCorrectAnswer}`);
    return { num1, num2 };
}

function generaDomandaTabellina() {
    const problema = generaProblemaTabellina();
    document.getElementById('domanda-tabellina').textContent = `${problema.num1} x ${problema.num2} = ?`;
    const answerInput = document.getElementById('risposta-tabellina');
    answerInput.value = '';
    answerInput.focus();
    document.getElementById('feedback-tabellina').textContent = '';
    document.getElementById('feedback-tabellina').className = 'feedback';
    startTimer();
}

function controllaTabellina() {
    stopTimer();
    const userAnswer = parseInt(document.getElementById('risposta-tabellina').value);
    const feedbackEl = document.getElementById('feedback-tabellina');

    if (isNaN(userAnswer)) {
        feedbackEl.textContent = "Per favore, inserisci un numero.";
        feedbackEl.className = 'feedback error';
        playSound('error');
        document.getElementById('risposta-tabellina').focus();
        return;
    }

    if (userAnswer === currentCorrectAnswer) {
        const elapsedTime = getElapsedTime();
        const bonusPoints = calcolaPuntiBonus(elapsedTime);
        incrementaPunteggio(10 + bonusPoints);
        feedbackEl.textContent = "Corretto! Ottimo lavoro!";
        feedbackEl.className = 'feedback success';
        playSound('success');
        setTimeout(generaDomandaTabellina, 2000);
    } else {
        feedbackEl.textContent = `Sbagliato! La risposta corretta era ${currentCorrectAnswer}. Ritenta!`;
        feedbackEl.className = 'feedback error';
        playSound('error');
        document.getElementById('risposta-tabellina').focus();
    }
}

// Funzioni per la modalità Divisioni con Scomposizione
function clearDivisionInputs() {
    const scomposizioneStepsDiv = document.getElementById('scomposizione-steps');
    const dynamicSteps = scomposizioneStepsDiv.querySelectorAll('.scomposizione-step');
    dynamicSteps.forEach(step => step.remove());

    const quozienteInputs = document.querySelectorAll('#divisioni-section .quoziente-parziale');
    quozienteInputs.forEach(input => input.value = '');

    const risultatoFinaleInput = document.getElementById('risposta-finale-divisione'); 
    if (risultatoFinaleInput) risultatoFinaleInput.value = '';

    const feedbackEl = document.getElementById('feedback-divisione'); 
    if (feedbackEl) feedbackEl.textContent = '';

    const hintEl = document.getElementById('hint-divisione'); 
    if (hintEl) hintEl.textContent = '';

    console.log("Division inputs cleared (dynamic steps removed).");
}

function generaProblemaDivisione() {
    const livello = parseInt(document.getElementById('livello-divisione-select').value);
    let dividendo, divisore, quozienteTarget;
    let minDivisore = 2, maxDivisore = 9;

    if (livello === 1) {
        divisore = Math.floor(Math.random() * (maxDivisore - minDivisore + 1)) + minDivisore;
        quozienteTarget = Math.floor(Math.random() * 9) + 2;
        dividendo = divisore * quozienteTarget;
    } else if (livello === 2) {
        divisore = Math.floor(Math.random() * (maxDivisore - minDivisore + 1)) + minDivisore;
        quozienteTarget = Math.floor(Math.random() * 11) + 10;
        dividendo = divisore * quozienteTarget;
    } else {
        divisore = Math.floor(Math.random() * (maxDivisore - minDivisore + 1)) + minDivisore;
        quozienteTarget = Math.floor(Math.random() * 31) + 20;
        dividendo = divisore * quozienteTarget;
    }

    currentCorrectAnswer = {
        dividendoOriginale: dividendo,
        divisore: divisore,
        quozienteCorretto: quozienteTarget,
        livello: livello
    };
    console.log(`Divisione Lv${livello}: ${dividendo} : ${divisore} = ${quozienteTarget}`, currentCorrectAnswer);
    return currentCorrectAnswer;
}

function generaDomandaDivisione() {
    clearDivisionInputs();
    const problema = generaProblemaDivisione();
    document.getElementById('domanda-divisione').textContent = `${problema.dividendoOriginale} : ${problema.divisore} = ?`; 

    const divisionSection = document.getElementById('divisioni-section');
    if (divisionSection) {
        divisionSection.dataset.currentProblem = JSON.stringify(problema);
    } else {
        console.error("Elemento 'divisioni-section' non trovato per salvare i dati del problema.");
    }

    const scomposizioneStepsDiv = document.getElementById('scomposizione-steps');

    const numSteps = problema.livello === 1 ? 1 : (problema.livello === 2 ? 2 : 3);
    console.log(`generaDomandaDivisione: Livello ${problema.livello}, Numero Passi: ${numSteps}`);

    for (let i = 0; i < numSteps; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'scomposizione-step';
        const placeholderDividendo = (problema.livello === 1 && i === 0) ? problema.dividendoOriginale : `Dividendo ${i + 1}`;
        const readOnlyDividendo = (problema.livello === 1 && i === 0);

        stepDiv.innerHTML = `
            <input type="number" class="scomponi-dividendo" placeholder="${placeholderDividendo}" ${readOnlyDividendo ? 'value="' + problema.dividendoOriginale + '" readonly' : ''}> :
            <span class="divisore-fisso">${problema.divisore}</span> =
            <input type="number" class="quoziente-parziale" placeholder="Q ${i + 1}">
        `;
        scomposizioneStepsDiv.appendChild(stepDiv);
    }

    const labelSomma = document.getElementById('label-somma-quozienti');
    const risultatoFinaleInput = document.getElementById('risposta-finale-divisione'); 
    const restoFinaleInput = document.getElementById('resto-finale-divisione');
    if (restoFinaleInput) {
        restoFinaleInput.style.display = 'none';
    }


    if (!labelSomma || !risultatoFinaleInput) {
        console.error("generaDomandaDivisione: labelSomma o risultatoFinaleInput non trovati!");
    } else { 
        if (problema.livello === 1) {
            labelSomma.style.display = 'none';
            risultatoFinaleInput.style.display = 'none';
            console.log("generaDomandaDivisione: Livello 1, nascondo somma/risultato finale.");
        } else {
            labelSomma.style.display = 'inline'; 
            risultatoFinaleInput.style.display = 'inline-block'; 
            console.log("generaDomandaDivisione: Livello > 1, mostro somma/risultato finale.");
        }
    }

    document.getElementById('feedback-divisione').textContent = ''; 
    document.getElementById('feedback-divisione').className = 'feedback';
    document.getElementById('hint-divisione').textContent = ''; 
    startTimer();
    const firstInput = scomposizioneStepsDiv.querySelector(problema.livello === 1 ? '.quoziente-parziale' : '.scomponi-dividendo');
    if (firstInput) firstInput.focus();
}

function controllaDivisione() {
    const feedbackEl = document.getElementById('feedback-divisione');
    const divisionSection = document.getElementById('divisioni-section');
    
    if (!divisionSection || !divisionSection.dataset.currentProblem) {
        console.error("controllaDivisione: Dati del problema non trovati sull'elemento 'divisioni-section'.");
        if (feedbackEl) feedbackEl.textContent = "Errore interno: impossibile verificare la risposta.";
        return;
    }

    const problemData = JSON.parse(divisionSection.dataset.currentProblem);

    const dividendoOriginale = problemData.dividendoOriginale;
    const divisoreOriginale = problemData.divisore;
    const quozienteCorretto = problemData.quozienteCorretto;
    const livello = problemData.livello;

    console.log(`controllaDivisione: Inizio controllo per ${dividendoOriginale} : ${divisoreOriginale}. Livello: ${livello}. Dati problema:`, problemData);

    const scomposizioneStepsDiv = document.getElementById('scomposizione-steps');
    const stepElements = scomposizioneStepsDiv.querySelectorAll('.scomposizione-step');

    if (livello === 1) {
        const quozienteParzialeInput = scomposizioneStepsDiv.querySelector('.quoziente-parziale');

        if (!quozienteParzialeInput) {
            feedbackEl.textContent = "Errore: input del quoziente per livello 1 non trovato.";
            return;
        }
        const quozienteParzialeUtente = parseFloat(quozienteParzialeInput.value);

        if (isNaN(quozienteParzialeUtente)) {
            feedbackEl.textContent = "Per favore, inserisci un numero come quoziente.";
            return;
        }

        if (quozienteParzialeUtente === quozienteCorretto) {
            feedbackEl.textContent = "Corretto!";
            incrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_1);
        } else {
            feedbackEl.textContent = `Sbagliato. ${dividendoOriginale} : ${divisoreOriginale} = ${quozienteCorretto}. Tu hai scritto ${quozienteParzialeUtente}.`;
            decrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_1);
        }
        setTimeout(generaDomandaDivisione, 2000);
        return; 
    }

    let sommaQuozientiParziali = 0;
    let dividendoRimanente = dividendoOriginale;
    const numScomposizioniUtente = stepElements.length;

    for (let i = 0; i < numScomposizioniUtente; i++) {
        const stepDiv = stepElements[i];
        const scomponiDvInput = stepDiv.querySelector('.scomponi-dividendo');
        const scomponiQzInput = stepDiv.querySelector('.quoziente-parziale');

        if (!scomponiDvInput || !scomponiQzInput) {
            feedbackEl.textContent = `Errore: input mancanti al passaggio ${i + 1}.`;
            return;
        }

        const dividendoParzialeUtente = parseFloat(scomponiDvInput.value);
        const quozienteParzialeUtente = parseFloat(scomponiQzInput.value);
        
        console.log(`Passaggio ${i + 1}: DP Utente=${dividendoParzialeUtente}, QP Utente=${quozienteParzialeUtente}, Dividendo Rimanente Inizio=${dividendoRimanente}`);


        if (isNaN(dividendoParzialeUtente) || isNaN(quozienteParzialeUtente)) {
            feedbackEl.textContent = `Errore al passaggio ${i + 1}: assicurati di inserire numeri validi.`;
            return;
        }

        if (dividendoParzialeUtente <= 0 || quozienteParzialeUtente < 0) {
            feedbackEl.textContent = `Errore al passaggio ${i + 1}: i numeri devono essere positivi. Il quoziente può essere zero.`;
            return;
        }
        
        if (typeof divisoreOriginale === 'undefined' || divisoreOriginale === 0) {
            console.error("controllaDivisione: divisoreOriginale non definito o zero!", problemData);
            feedbackEl.textContent = "Errore interno critico: il divisore non è valido.";
            return;
        }

        if (dividendoParzialeUtente % divisoreOriginale !== 0) {
            feedbackEl.textContent = `Errore al passaggio ${i + 1}: il dividendo parziale (${dividendoParzialeUtente}) non è divisibile esattamente per ${divisoreOriginale}. Le nostre divisioni non hanno resto!`;
            return;
        }

        if (dividendoParzialeUtente / divisoreOriginale !== quozienteParzialeUtente) {
            feedbackEl.textContent = `Errore al passaggio ${i + 1}: ${dividendoParzialeUtente} : ${divisoreOriginale} non fa ${quozienteParzialeUtente}.`;
            return;
        }

        if (dividendoParzialeUtente > dividendoRimanente) {
             feedbackEl.textContent = `Errore al passaggio ${i + 1}: il dividendo parziale (${dividendoParzialeUtente}) è maggiore del dividendo rimanente (${dividendoRimanente}).`;
             return;
        }

        sommaQuozientiParziali += quozienteParzialeUtente;
        dividendoRimanente -= dividendoParzialeUtente;
    }

    const risultatoFinaleInput = document.getElementById('risposta-finale-divisione');
    const risultatoFinaleUtente = parseFloat(risultatoFinaleInput.value);
    
    console.log(`Controllo Risultato Finale: Utente=${risultatoFinaleUtente}, Corretto=${quozienteCorretto}, SommaQParziali=${sommaQuozientiParziali}`);

    if (livello > 1 && isNaN(risultatoFinaleUtente) && stepElements.length > 0) {
        feedbackEl.textContent = "Per favore, inserisci il risultato finale della divisione.";
        return;
    }
    
    if (dividendoRimanente === 0 && sommaQuozientiParziali === quozienteCorretto) {
        if (livello > 1 && risultatoFinaleUtente !== quozienteCorretto) {
            feedbackEl.textContent = `La scomposizione è corretta, ma il risultato finale (${risultatoFinaleUtente}) non corrisponde alla somma dei quozienti (${quozienteCorretto}).`;
            decrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_2_3);
        } else {
            feedbackEl.textContent = "Corretto! Ottima scomposizione!";
            incrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_2_3);
            setTimeout(generaDomandaDivisione, 2000);
        }
    } else {
        let messaggioErrore = "Sbagliato. ";
        if (dividendoRimanente !== 0) {
            messaggioErrore += `Il dividendo non è stato scomposto completamente (rimane ${dividendoRimanente}). `;
        }
        if (sommaQuozientiParziali !== quozienteCorretto) {
            messaggioErrore += `La somma dei quozienti parziali (${sommaQuozientiParziali}) non corrisponde al quoziente corretto (${quozienteCorretto}). `;
        }
        if (livello > 1 && risultatoFinaleUtente !== quozienteCorretto && stepElements.length > 0){
             messaggioErrore += `Il risultato finale inserito (${risultatoFinaleUtente}) non è corretto.`;
        }
        feedbackEl.textContent = messaggioErrore.trim();
        decrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_2_3);
        if (stepElements.length === 0 && livello > 1) {
             feedbackEl.textContent = "Devi scomporre la divisione prima di inserire il risultato finale.";
        }
    }
}

function mostraAiutoDivisione() {
    const hintEl = document.getElementById('hint-divisione'); 
    const { dividendoOriginale, divisore, quozienteCorretto, livello } = currentCorrectAnswer;
    let hintText = `Stai calcolando ${dividendoOriginale} : ${divisore}.\n`;

    if (livello === 1) {
        hintText += `Il risultato (quoziente) è ${quozienteCorretto}. Devi solo scrivere ${quozienteCorretto} nel campo del quoziente. Ricorda: ${quozienteCorretto} x ${divisore} = ${dividendoOriginale}.`;
    } else if (livello === 2) {
        let parte1 = Math.floor(quozienteCorretto / 2) * divisore;
        if (parte1 === 0 && quozienteCorretto > 0) parte1 = divisore;
        if (dividendoOriginale - parte1 < divisore && parte1 > divisore) parte1 -= divisore;

        let parte2 = dividendoOriginale - parte1;

        if (parte1 > 0 && parte2 > 0 && parte1 % divisore === 0 && parte2 % divisore === 0) {
            hintText += `Prova a scomporre ${dividendoOriginale} in ${parte1} e ${parte2}.\n`;
            hintText += `Poi calcola: \n1) ${parte1} : ${divisore} = ${parte1 / divisore}\n`;
            hintText += `2) ${parte2} : ${divisore} = ${parte2 / divisore}\n`;
            hintText += `Infine somma i quozienti: ${parte1 / divisore} + ${parte2 / divisore} = ${quozienteCorretto}.`;
        } else {
            hintText += `Pensa a come dividere ${dividendoOriginale} in due numeri più piccoli, entrambi divisibili per ${divisore}. Il risultato finale è ${quozienteCorretto}.`;
        }
    } else {
        let q1 = Math.floor(quozienteCorretto / 3);
        let q2 = Math.floor(quozienteCorretto / 3);
        let q3 = quozienteCorretto - q1 - q2;

        let p1 = q1 * divisore;
        let p2 = q2 * divisore;
        let p3 = q3 * divisore;

        if (p1 > 0 && p2 > 0 && p3 > 0 && (p1 + p2 + p3 === dividendoOriginale)) {
            hintText += `Puoi scomporre ${dividendoOriginale} in tre parti: ${p1}, ${p2}, e ${p3}.\n`;
            hintText += `1) ${p1} : ${divisore} = ${q1}\n`;
            hintText += `2) ${p2} : ${divisore} = ${q2}\n`;
            hintText += `3) ${p3} : ${divisore} = ${q3}\n`;
            hintText += `Somma: ${q1} + ${q2} + ${q3} = ${quozienteCorretto}.`;
        } else {
            hintText += `Cerca di dividere ${dividendoOriginale} in tre numeri più piccoli, tutti divisibili per ${divisore}. Il risultato finale è ${quozienteCorretto}.`;
        }
    }

    hintEl.textContent = hintText;
    playSound('error');
}