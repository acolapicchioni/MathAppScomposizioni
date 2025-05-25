// Variabili Globali per gli elementi DOM principali
// Queste verranno inizializzate in DOMContentLoaded
let playerNameOverlayEl, playerNameInputEl, startGameButtonEl,
    scoreContainerEl, scoreEl, highScoreEl, welcomeMessageEl,
    modalitaSceltaEl, showTabellineButton, showDivisioniButton,
    gameContainerEl, tabellineSectionEl, divisioniSectionEl,
    livelloDivisioneContainerEl, livelloDivisioneSelectEl,
    nuovaPartitaButtonEl, scomposizionePassaggi, risultatoDivisioneEl, restoFinaleDivisioneEl;

// Variabili di stato del gioco
let playerName = "Giocatore";
let punteggio = 0;
let highScore = 0;
let currentCorrectAnswer;
let currentDividend, currentDivisor;
let questionStartTime;
let livelloDivisione = 1;
let activeSection = ''; // 'tabelline' or 'divisioni'
let numScomposizioniRichieste = 1;

// DOM elements specifici per le tabelline (inizializzati in generaDomandaTabellina)
let domandaTabellinaEl, rispostaTabellinaInputEl, feedbackTabellinaEl;

// DOM elements specifici per le divisioni (inizializzati in generaDomandaDivisione)
let domandaDivisioneEl, decompDividend1InputEl, scompQuotient1InputEl,
    decompDividend2InputEl, scompQuotient2InputEl, decompDividend3InputEl,
    scompQuotient3InputEl, rispostaFinaleDivisioneInputEl,
    feedbackDivisioneEl, hintDivisioneEl;

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

    gameContainerEl = document.getElementById('game-container');
    tabellineSectionEl = document.getElementById('tabelline-section');
    divisioniSectionEl = document.getElementById('divisioni-section');
    livelloDivisioneContainerEl = document.getElementById('livello-divisione-container');
    livelloDivisioneSelectEl = document.getElementById('livello-divisione-select');

    nuovaPartitaButtonEl = document.getElementById('nuova-partita-button');

    risultatoDivisioneEl = document.getElementById('risposta-finale-divisione');
    restoFinaleDivisioneEl = document.getElementById('resto-finale-divisione');

    // Pulsanti per tornare al menu
    const tornaMenuTabellineBtn = document.getElementById('torna-menu-tabelline-btn');
    const tornaMenuDivisioniBtn = document.getElementById('torna-menu-divisioni-btn');

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
        'game-container': gameContainerEl,
        'tabelline-section': tabellineSectionEl,
        'divisioni-section': divisioniSectionEl,
        'livello-divisione-container': livelloDivisioneContainerEl,
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
        console.error("DOMContentLoaded: Setup interrotto a causa di elementi critici mancanti.");
        return;
    }

    console.log("DOMContentLoaded: Inizializzazione elementi DOM completata. Setup event listeners.");

    // Event Listeners
    startGameButtonEl.addEventListener('click', startGame);
    showTabellineButton.addEventListener('click', () => generaDomandaTabellina());
    showDivisioniButton.addEventListener('click', () => generaDomandaDivisione());
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

function updatePunteggio(punti) {
    punteggio += punti;
    if (scoreEl) scoreEl.textContent = punteggio;
    else console.warn("updatePunteggio: scoreEl non trovato");

    if (punteggio > highScore) {
        highScore = punteggio;
        if (highScoreEl) highScoreEl.textContent = highScore;
        else console.warn("updatePunteggio: highScoreEl non trovato per aggiornamento high score");
        saveHighScore();
    }
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
    if (!playerNameInputEl || !playerNameOverlayEl || !modalitaSceltaEl || !gameContainerEl || !livelloDivisioneContainerEl) {
        console.error("nuovaPartita: Uno o più elementi contenitore principali sono null. Impossibile resettare correttamente.");
        return;
    }
    resetPunteggio();
    playerNameInputEl.value = '';
    playerNameOverlayEl.style.display = 'flex';
    modalitaSceltaEl.style.display = 'none';
    gameContainerEl.style.display = 'none';
    livelloDivisioneContainerEl.style.display = 'none';
    activeSection = '';
}

function tornaAlMenuPrincipale() {
    if (!modalitaSceltaEl || !gameContainerEl || !tabellineSectionEl || !divisioniSectionEl || !livelloDivisioneContainerEl || !welcomeMessageEl) {
        console.error("tornaAlMenuPrincipale: Uno o più elementi contenitore principali sono null. Impossibile tornare al menu.");
        return;
    }
    console.log("tornaAlMenuPrincipale: Ritorno al menu di scelta modalità.");

    gameContainerEl.style.display = 'none';
    tabellineSectionEl.style.display = 'none';
    divisioniSectionEl.style.display = 'none';
    livelloDivisioneContainerEl.style.display = 'none';
    
    modalitaSceltaEl.style.display = 'block';
    welcomeMessageEl.textContent = `Ciao, ${playerName}! Scegli una nuova modalità o continua con la precedente:`; // Messaggio aggiornato
    activeSection = '';

    // Opzionale: pulire i campi di input e feedback delle sezioni di gioco
    if (rispostaTabellinaInputEl) rispostaTabellinaInputEl.value = '';
    if (feedbackTabellinaEl) feedbackTabellinaEl.textContent = '';
    clearDivisionInputs(); // Funzione esistente per pulire gli input della divisione
    if (feedbackDivisioneEl) feedbackDivisioneEl.textContent = '';
    if (hintDivisioneEl) hintDivisioneEl.textContent = '';
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
    if (elapsedTime < 5) return 2;
    if (elapsedTime < 10) return 1;
    return 0;
}

function generaDomandaTabellina() {
    console.log("generaDomandaTabellina: Inizio esecuzione.");
    if (!tabellineSectionEl || !divisioniSectionEl || !modalitaSceltaEl || !gameContainerEl || !livelloDivisioneContainerEl) {
        console.error("generaDomandaTabellina: ERRORE CRITICO - Elementi contenitore globali (es. tabellineSectionEl, modalitaSceltaEl) non trovati. Impossibile continuare.");
        return;
    }

    activeSection = 'tabelline';
    tabellineSectionEl.style.display = 'block';
    divisioniSectionEl.style.display = 'none';
    modalitaSceltaEl.style.display = 'none';
    gameContainerEl.style.display = 'block';
    livelloDivisioneContainerEl.style.display = 'none';

    domandaTabellinaEl = document.getElementById('domanda-tabellina');
    rispostaTabellinaInputEl = document.getElementById('risposta-tabellina');
    feedbackTabellinaEl = document.getElementById('feedback-tabellina');

    // Rimuovi listener precedente se esiste, per evitare duplicati
    if (rispostaTabellinaInputEl && rispostaTabellinaInputEl.handleEnterKey) {
        rispostaTabellinaInputEl.removeEventListener('keypress', rispostaTabellinaInputEl.handleEnterKey);
    }

    if (!domandaTabellinaEl) {
        console.error("generaDomandaTabellina: Elemento 'domanda-tabellina' NON TROVATO. Impossibile generare domanda.");
        if (feedbackTabellinaEl) feedbackTabellinaEl.textContent = "Errore: 'domanda-tabellina' non trovato."; else console.error("feedbackTabellinaEl non disponibile per messaggio errore.");
        return;
    }
    if (!rispostaTabellinaInputEl) {
        console.error("generaDomandaTabellina: Elemento 'risposta-tabellina' NON TROVATO. Impossibile accettare risposta.");
        if (feedbackTabellinaEl) feedbackTabellinaEl.textContent = "Errore: 'risposta-tabellina' non trovato."; else console.error("feedbackTabellinaEl non disponibile per messaggio errore.");
        return;
    } else {
        // Definisci la funzione handler qui in modo che possa essere rimossa correttamente
        rispostaTabellinaInputEl.handleEnterKey = function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Impedisce il comportamento predefinito (es. submit di un form)
                controllaTabellina();
            }
        };
        rispostaTabellinaInputEl.addEventListener('keypress', rispostaTabellinaInputEl.handleEnterKey);
    }
    if (!feedbackTabellinaEl) {
        console.warn("generaDomandaTabellina: Elemento 'feedback-tabellina' non trovato. Il feedback non verrà mostrato.");
    }

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    currentCorrectAnswer = num1 * num2;
    console.log("[generaDomandaTabellina] Domanda generata. currentCorrectAnswer impostato a:", currentCorrectAnswer);

    domandaTabellinaEl.textContent = `${num1} x ${num2} = ?`;
    rispostaTabellinaInputEl.value = '';
    if (feedbackTabellinaEl) feedbackTabellinaEl.textContent = '';
    rispostaTabellinaInputEl.focus();
    questionStartTime = new Date();
    console.log("generaDomandaTabellina: Fine esecuzione.");
}

function controllaTabellina() {
    console.log("[controllaTabellina] Inizio. Valore di currentCorrectAnswer:", currentCorrectAnswer);

    if (!rispostaTabellinaInputEl || !feedbackTabellinaEl) {
        console.error("controllaTabellina: Elementi rispostaTabellinaInputEl o feedbackTabellinaEl non inizializzati. Impossibile controllare.");
        return;
    }
    if (currentCorrectAnswer === undefined) {
        console.error("controllaTabellina: currentCorrectAnswer è undefined. La domanda potrebbe non essere stata generata correttamente.");
        feedbackTabellinaEl.textContent = "Errore: la domanda non è stata generata. Riprova a selezionare la modalità.";
        feedbackTabellinaEl.className = 'feedback error';
        return;
    }
    if (rispostaTabellinaInputEl.value === '') {
        feedbackTabellinaEl.textContent = "Inserisci una risposta!";
        feedbackTabellinaEl.className = 'feedback error';
        return;
    }

    const rispostaUtente = parseInt(rispostaTabellinaInputEl.value);
    const elapsedTime = (new Date() - questionStartTime) / 1000;

    if (rispostaUtente === currentCorrectAnswer) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        updatePunteggio(1 + bonus);
        feedbackTabellinaEl.textContent = `Corretto, ${playerName}! +${1 + bonus} punti.`;
        feedbackTabellinaEl.className = 'feedback success';
        playSound('success');
        if (bonus === 2) playSound('awesome');
        else if (bonus === 1) playSound('good');
        setTimeout(generaDomandaTabellina, 1500);
    } else {
        feedbackTabellinaEl.textContent = `Sbagliato, ${playerName}. La risposta era ${currentCorrectAnswer}. Ritenta!`;
        feedbackTabellinaEl.className = 'feedback error';
        playSound('error');
        rispostaTabellinaInputEl.value = '';
        rispostaTabellinaInputEl.focus();
    }
}

function generaDomandaDivisione(livelloSceltoParam) {
    console.log("generaDomandaDivisione: Inizio esecuzione.");
    if (livelloSceltoParam) {
        console.log(`generaDomandaDivisione: Livello passato come parametro: '${livelloSceltoParam}'`);
    }

    let livelloToUse;
    if (livelloSceltoParam) { // Se il livello viene cambiato MENTRE si è già in modalità divisione
        livelloToUse = livelloSceltoParam;
        // Assicurati che il select rifletta questo cambiamento se necessario (anche se l'evento 'change' dovrebbe gestirlo)
        if (livelloDivisioneSelectEl && livelloDivisioneSelectEl.value !== livelloSceltoParam) {
            livelloDivisioneSelectEl.value = livelloSceltoParam;
        }
    } else { // Se si entra in modalità divisione per la prima volta o si torna al menu e si riseleziona
        if (livelloDivisioneSelectEl) {
            livelloToUse = livelloDivisioneSelectEl.value; // Prende "1", "2", o "3" dalla select
            console.log(`generaDomandaDivisione: Livello letto da select: '${livelloToUse}'`);
        } else {
            console.error("CRITICAL: livelloDivisioneSelectEl non trovato! Fallback a livello '1'.");
            livelloToUse = '1'; // Fallback di emergenza
        }
    }

    console.log(`generaDomandaDivisione: Livello determinato per il problema: '${livelloToUse}' (tipo: ${typeof livelloToUse})`);

    if (!tabellineSectionEl || !divisioniSectionEl || !modalitaSceltaEl || !gameContainerEl || !livelloDivisioneContainerEl) {
        console.error("generaDomandaDivisione: ERRORE CRITICO - Elementi contenitore globali non trovati. Impossibile continuare.");
        return;
    }
    activeSection = 'divisioni';
    tabellineSectionEl.style.display = 'none';
    divisioniSectionEl.style.display = 'block';
    modalitaSceltaEl.style.display = 'none';
    gameContainerEl.style.display = 'block';
    livelloDivisioneContainerEl.style.display = 'block';

    domandaDivisioneEl = document.getElementById('domanda-divisione');
    decompDividend1InputEl = document.getElementById('scomposizione-dividendo-1');
    scompQuotient1InputEl = document.getElementById('scomposizione-quoziente-1');
    decompDividend2InputEl = document.getElementById('scomposizione-dividendo-2');
    scompQuotient2InputEl = document.getElementById('scomposizione-quoziente-2');
    decompDividend3InputEl = document.getElementById('scomposizione-dividendo-3');
    scompQuotient3InputEl = document.getElementById('scomposizione-quoziente-3');
    rispostaFinaleDivisioneInputEl = document.getElementById('risposta-finale-divisione');
    feedbackDivisioneEl = document.getElementById('feedback-divisione');
    hintDivisioneEl = document.getElementById('hint-divisione');

    if (!domandaDivisioneEl || !decompDividend1InputEl || !rispostaFinaleDivisioneInputEl || !feedbackDivisioneEl || !hintDivisioneEl) {
        console.error("generaDomandaDivisione: Uno o più elementi specifici per la divisione non trovati. Es. 'domanda-divisione'. Impossibile generare domanda.");
        if (feedbackDivisioneEl) feedbackDivisioneEl.textContent = "Errore: elementi per la divisione non trovati."; else console.error("feedbackDivisioneEl non disponibile per messaggio errore.");
        return;
    }

    currentCorrectAnswer = generaProblemaDivisione(livelloToUse);

    if (!currentCorrectAnswer || typeof currentCorrectAnswer.quotient === 'undefined') {
        console.error("CRITICAL: generaProblemaDivisione non ha restituito un oggetto problema valido.");
        if (feedbackDivisioneEl) feedbackDivisioneEl.textContent = "Errore critico nella generazione del problema. Riprova.";
        return;
    }

    currentDividend = currentCorrectAnswer.dividend;
    currentDivisor = currentCorrectAnswer.divisor;
    console.log("[generaDomandaDivisione] Domanda generata. Oggetto currentCorrectAnswer impostato:", currentCorrectAnswer);

    domandaDivisioneEl.textContent = `${currentDividend} ÷ ${currentDivisor} = ?`;
    clearDivisionInputs();
    feedbackDivisioneEl.textContent = '';
    hintDivisioneEl.textContent = '';
    decompDividend1InputEl.focus();
    questionStartTime = new Date();
    console.log("generaDomandaDivisione: Fine esecuzione.");
}

function generaProblemaDivisione(livello) {
    console.log("Generating division problem (no remainder) for level:", livello, "(Type:", typeof livello, ")");
    let minDividend, maxDividend, minDivisor, maxDivisor;

    const allInputs = document.querySelectorAll('#divisione-section .scomposizione-input, #risultato-divisione, #resto-finale-divisione');
    allInputs.forEach(input => {
        if (input) input.value = '';
    });
    if (feedbackDivisioneEl) feedbackDivisioneEl.textContent = '';

    if (risultatoDivisioneEl) {
        risultatoDivisioneEl.value = '';
    } else {
        console.error("generaProblemaDivisione: risultatoDivisioneEl non è ancora definito o trovato!");
    }
    if (restoFinaleDivisioneEl) {
        restoFinaleDivisioneEl.value = '';
    } else {
        console.error("generaProblemaDivisione: restoFinaleDivisioneEl non è ancora definito o trovato!");
    }

    switch (livello) {
        case '1':
            minDividend = 10; maxDividend = 50;
            minDivisor = 2; maxDivisor = 5;
            numScomposizioniRichieste = 1;
            break;
        case '2':
            minDividend = 30; maxDividend = 150;
            minDivisor = 2; maxDivisor = 9;
            numScomposizioniRichieste = 2;
            break;
        case '3':
            minDividend = 100; maxDividend = 500;
            minDivisor = 3; maxDivisor = 9;
            numScomposizioniRichieste = 3;
            break;
        default:
            console.warn(`Livello divisione non riconosciuto: '${livello}'. Default a 1 passaggio.`);
            minDividend = 10; maxDividend = 50;
            minDivisor = 2; maxDivisor = 5;
            numScomposizioniRichieste = 1;
    }

    let minQuotientForSteps = numScomposizioniRichieste > 0 ? numScomposizioniRichieste : 1;

    let dividend, divisor, quotient;
    let attempts = 0;
    const MAX_ATTEMPTS = 150;

    do {
        if (minDivisor > maxDivisor) {
            console.warn(`Correcting invalid divisor range for level ${livello}: min ${minDivisor}, max ${maxDivisor}`);
            maxDivisor = minDivisor;
        }
        divisor = Math.floor(Math.random() * (maxDivisor - minDivisor + 1)) + minDivisor;
        if (divisor === 0) divisor = minDivisor > 0 ? minDivisor : 2;

        let minQuotFromConfig = minQuotientForSteps;
        let minQuotFromDividendConstraint = divisor > 0 ? Math.ceil(minDividend / divisor) : minQuotientForSteps;
        let actualMinQuotient = Math.max(minQuotFromConfig, minQuotFromDividendConstraint);

        let actualMaxQuotient = divisor > 0 ? Math.floor(maxDividend / divisor) : actualMinQuotient;

        if (actualMinQuotient > actualMaxQuotient) {
            attempts++;
            if (attempts > MAX_ATTEMPTS * 0.75 && livello === 'facile' && maxDividend < 40) {
                maxDividend = Math.min(50, maxDividend + 5);
            }
            continue;
        }

        quotient = Math.floor(Math.random() * (actualMaxQuotient - actualMinQuotient + 1)) + actualMinQuotient;

        dividend = quotient * divisor;

        if (dividend >= minDividend && dividend <= maxDividend && quotient >= minQuotientForSteps && divisor > 0) {
            if (dividend / divisor === quotient) {
                break;
            }
        }
        attempts++;
    } while (attempts < MAX_ATTEMPTS);

    if (attempts >= MAX_ATTEMPTS) {
        console.warn(`Failed to generate a suitable division problem (no remainder) after ${MAX_ATTEMPTS} attempts for level ${livello}. Using fallback.`);
        let fallbackDivisor;
        switch (livello) {
            case 'facile': fallbackDivisor = 2; break;
            case 'medio': fallbackDivisor = 3; break;
            case 'difficile': fallbackDivisor = 4; break;
            default: fallbackDivisor = 2;
        }
        let originalMinDivisorForLevel = 2;
        if (livello === 'difficile') originalMinDivisorForLevel = 3;

        divisor = Math.max(originalMinDivisorForLevel, fallbackDivisor);
        quotient = minQuotientForSteps;
        dividend = quotient * divisor;

        if (dividend > maxDividend || dividend < minDividend && minDividend > 0) {
            console.error(`Fallback dividend ${dividend} (q:${quotient}, d:${divisor}) is outside configured range [${minDividend}-${maxDividend}] for level ${livello}.`);
            divisor = 2; quotient = 2; dividend = 4;
        }
        console.log("Using fallback problem:", { dividend, divisor, quotient });
    }

    const remainder = 0;

    if (domandaDivisioneEl) {
        domandaDivisioneEl.textContent = `${dividend} ÷ ${divisor} = ?`;
    } else {
        console.error("CRITICAL_ERROR_DOM_MISSING: domandaDivisioneEl not found in generaProblemaDivisione");
    }

    const scompDivisorDisplay1 = document.getElementById('scomp-divisor-display-1');
    const scompDivisorDisplay2 = document.getElementById('scomp-divisor-display-2');
    const scompDivisorDisplay3 = document.getElementById('scomp-divisor-display-3');

    if (scompDivisorDisplay1) scompDivisorDisplay1.textContent = divisor;
    else console.warn("scomp-divisor-display-1 not found");
    if (scompDivisorDisplay2) scompDivisorDisplay2.textContent = divisor;
    else console.warn("scomp-divisor-display-2 not found");
    if (scompDivisorDisplay3) scompDivisorDisplay3.textContent = divisor;
    else console.warn("scomp-divisor-display-3 not found");

    if (scomposizionePassaggi && scomposizionePassaggi.length > 0) {
        scomposizionePassaggi.forEach((passaggio, index) => {
            if (passaggio) {
                passaggio.style.display = index < numScomposizioniRichieste ? 'flex' : 'none';
            } else {
                console.warn(`scomposizione-passaggio-${index + 1} not found when trying to set visibility.`);
            }
        });
    } else {
        console.warn("scomposizionePassaggi array is not initialized or is empty. Cannot configure step visibility.");
    }

    if (scomposizioneDividendoInputs && scomposizioneDividendoInputs[0]) {
        // scomposizioneDividendoInputs[0].value = dividend;
    }

    if (risultatoDivisioneEl) risultatoDivisioneEl.value = '';
    const restoFinaleEl = document.getElementById('resto-finale-divisione');
    if (restoFinaleEl) restoFinaleEl.value = '';
    if (feedbackDivisioneEl) feedbackDivisioneEl.textContent = '';

    console.log(`Division problem (no remainder): ${dividend} ÷ ${divisor} = ${quotient}. Steps: ${numScomposizioniRichieste}`);
    return { dividend, divisor, quotient, remainder };
}

function controllaDivisione() {
    console.log("[controllaDivisione] Inizio. Valore di currentCorrectAnswer (oggetto):", currentCorrectAnswer);

    if (!rispostaFinaleDivisioneInputEl || !feedbackDivisioneEl || !hintDivisioneEl) {
        console.error("controllaDivisione: Elementi DOM specifici per la divisione non inizializzati.");
        return;
    }
    if (currentCorrectAnswer === undefined) {
        console.error("controllaDivisione: currentCorrectAnswer è undefined.");
        feedbackDivisioneEl.textContent = "Errore: la domanda di divisione non è stata generata. Riprova.";
        feedbackDivisioneEl.className = 'feedback error';
        return;
    }
    if (rispostaFinaleDivisioneInputEl.value === '') {
        feedbackDivisioneEl.textContent = "Inserisci la risposta finale!";
        feedbackDivisioneEl.className = 'feedback error';
        return;
    }

    const decompDividend1 = decompDividend1InputEl.value !== '' ? parseInt(decompDividend1InputEl.value) : null;
    const scompQuotient1 = scompQuotient1InputEl.value !== '' ? parseInt(scompQuotient1InputEl.value) : null;
    const decompDividend2 = decompDividend2InputEl.value !== '' ? parseInt(decompDividend2InputEl.value) : null;
    const scompQuotient2 = scompQuotient2InputEl.value !== '' ? parseInt(scompQuotient2InputEl.value) : null;
    const decompDividend3 = decompDividend3InputEl.value !== '' ? parseInt(decompDividend3InputEl.value) : null;
    const scompQuotient3 = scompQuotient3InputEl.value !== '' ? parseInt(scompQuotient3InputEl.value) : null;
    const rispostaFinaleUtente = rispostaFinaleDivisioneInputEl.value !== '' ? parseInt(rispostaFinaleDivisioneInputEl.value) : null;

    const elapsedTime = (new Date() - questionStartTime) / 1000;
    let parzialeCorretto = true;
    let quozienteParzialeTotale = 0;
    let dividendoResiduo = currentDividend;
    let hintMessage = "";
    let erroreScomposizione = false;

    if (decompDividend1 !== null && scompQuotient1 !== null) {
        if (decompDividend1 % currentDivisor === 0 && decompDividend1 / currentDivisor === scompQuotient1) {
            quozienteParzialeTotale += scompQuotient1;
            dividendoResiduo -= decompDividend1;
        } else {
            parzialeCorretto = false; erroreScomposizione = true;
            hintMessage = `Controlla la prima scomposizione: ${decompDividend1} ÷ ${currentDivisor} non fa ${scompQuotient1}.`;
        }
    } else if (decompDividend1 !== null || scompQuotient1 !== null) {
        parzialeCorretto = false; erroreScomposizione = true;
        hintMessage = "Completa entrambe le caselle per ogni riga di scomposizione.";
    }

    if (parzialeCorretto && decompDividend2 !== null && scompQuotient2 !== null) {
        if (dividendoResiduo > 0 && decompDividend2 <= dividendoResiduo && decompDividend2 % currentDivisor === 0 && decompDividend2 / currentDivisor === scompQuotient2) {
            quozienteParzialeTotale += scompQuotient2;
            dividendoResiduo -= decompDividend2;
        } else {
            parzialeCorretto = false; erroreScomposizione = true;
            if (decompDividend2 > dividendoResiduo) hintMessage = `Il secondo dividendo (${decompDividend2}) è maggiore del residuo (${dividendoResiduo}).`;
            else hintMessage = `Controlla la seconda scomposizione: ${decompDividend2} ÷ ${currentDivisor} non fa ${scompQuotient2}.`;
        }
    } else if (parzialeCorretto && (decompDividend2 !== null || scompQuotient2 !== null)) {
        parzialeCorretto = false; erroreScomposizione = true;
        hintMessage = "Completa entrambe le caselle per la seconda riga di scomposizione, se usata.";
    }

    if (parzialeCorretto && decompDividend3 !== null && scompQuotient3 !== null) {
        if (dividendoResiduo > 0 && decompDividend3 <= dividendoResiduo && decompDividend3 % currentDivisor === 0 && decompDividend3 / currentDivisor === scompQuotient3) {
            quozienteParzialeTotale += scompQuotient3;
            dividendoResiduo -= decompDividend3;
        } else {
            parzialeCorretto = false; erroreScomposizione = true;
            if (decompDividend3 > dividendoResiduo) hintMessage = `Il terzo dividendo (${decompDividend3}) è maggiore del residuo (${dividendoResiduo}).`;
            else hintMessage = `Controlla la terza scomposizione: ${decompDividend3} ÷ ${currentDivisor} non fa ${scompQuotient3}.`;
        }
    } else if (parzialeCorretto && (decompDividend3 !== null || scompQuotient3 !== null)) {
        parzialeCorretto = false; erroreScomposizione = true;
        hintMessage = "Completa entrambe le caselle per la terza riga di scomposizione, se usata.";
    }

    if (erroreScomposizione) {
        feedbackDivisioneEl.textContent = `Errore nella scomposizione, ${playerName}.`;
        feedbackDivisioneEl.className = 'feedback error';
        hintDivisioneEl.textContent = hintMessage;
        playSound('error');
    } else if (rispostaFinaleUtente === currentCorrectAnswer.quotient && quozienteParzialeTotale === currentCorrectAnswer.quotient && dividendoResiduo === 0) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        updatePunteggio(2 + bonus);
        feedbackDivisioneEl.textContent = `Corretto, ${playerName}! Ottima scomposizione! +${2 + bonus} punti.`;
        feedbackDivisioneEl.className = 'feedback success';
        hintDivisioneEl.textContent = '';
        playSound('success');
        if (bonus === 2) playSound('awesome'); else if (bonus === 1) playSound('good');
        setTimeout(generaDomandaDivisione, 2000);
    } else if (rispostaFinaleUtente === currentCorrectAnswer.quotient && (decompDividend1 === null && decompDividend2 === null && decompDividend3 === null)) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        updatePunteggio(1 + bonus);
        feedbackDivisioneEl.textContent = `Risposta finale corretta, ${playerName}! +${1 + bonus} punti. La prossima volta prova a usare la scomposizione!`;
        feedbackDivisioneEl.className = 'feedback success';
        hintDivisioneEl.textContent = `La scomposizione aiuta a capire meglio!`;
        playSound('success');
        if (bonus >= 1) playSound('good');
        setTimeout(generaDomandaDivisione, 2500);
    } else {
        feedbackDivisioneEl.textContent = `Sbagliato, ${playerName}. La risposta corretta è ${currentCorrectAnswer.quotient}.`;
        if (quozienteParzialeTotale !== currentCorrectAnswer.quotient || dividendoResiduo !== 0) {
            hintDivisioneEl.textContent = `La tua scomposizione porta a ${quozienteParzialeTotale} con un resto di ${dividendoResiduo}. Controlla i passaggi.`;
        } else if (rispostaFinaleUtente !== currentCorrectAnswer.quotient) {
            hintDivisioneEl.textContent = `La scomposizione sembra corretta (somma quozienti parziali = ${quozienteParzialeTotale}, residuo = ${dividendoResiduo}), ma la risposta finale (${rispostaFinaleUtente}) non corrisponde al quoziente atteso (${currentCorrectAnswer.quotient}).`;
        } else {
            hintDivisioneEl.textContent = `Controlla la scomposizione e la risposta finale.`;
        }
        feedbackDivisioneEl.className = 'feedback error';
        playSound('error');
    }
}

function clearDivisionInputs() {
    if (decompDividend1InputEl) decompDividend1InputEl.value = '';
    if (scompQuotient1InputEl) scompQuotient1InputEl.value = '';
    if (decompDividend2InputEl) decompDividend2InputEl.value = '';
    if (scompQuotient2InputEl) scompQuotient2InputEl.value = '';
    if (decompDividend3InputEl) decompDividend3InputEl.value = '';
    if (scompQuotient3InputEl) scompQuotient3InputEl.value = '';
    if (rispostaFinaleDivisioneInputEl) rispostaFinaleDivisioneInputEl.value = '';
    if (hintDivisioneEl) hintDivisioneEl.textContent = '';
}

function mostraAiutoDivisione() {
    if (!hintDivisioneEl || !currentDividend || !currentDivisor || currentDivisor === 0) {
        console.warn("mostraAiutoDivisione: Impossibile fornire aiuto, dati mancanti o divisore nullo.");
        if (hintDivisioneEl) hintDivisioneEl.textContent = "Non riesco a darti un aiuto specifico ora.";
        return;
    }

    // Prova a suggerire un primo passo per la scomposizione
    // Cerchiamo un multiplo del divisore che sia una "buona parte" del dividendo
    let suggerimentoDividendo1 = 0;
    let quozienteSuggerito = Math.floor(currentDividend / currentDivisor / 2); // Prova con circa metà del quoziente totale

    if (quozienteSuggerito > 0) {
        suggerimentoDividendo1 = quozienteSuggerito * currentDivisor;
    }

    // Se il suggerimento è troppo piccolo (es. per divisioni piccole) o nullo, prova con il divisore stesso se il dividendo è almeno il doppio
    if (suggerimentoDividendo1 === 0 && currentDividend >= 2 * currentDivisor) {
        suggerimentoDividendo1 = currentDivisor;
    } else if (suggerimentoDividendo1 === 0) {
        // Caso estremo, non un gran suggerimento ma meglio di niente
        suggerimentoDividendo1 = currentDividend; 
    }
    
    // Assicurati che il suggerimento non sia più grande del dividendo stesso
    if (suggerimentoDividendo1 > currentDividend) {
        suggerimentoDividendo1 = currentDividend - (currentDividend % currentDivisor); // Il più grande multiplo <= dividendo
        if (suggerimentoDividendo1 === 0 && currentDividend > 0) suggerimentoDividendo1 = currentDividend; // Se finisce a 0 ma c'è un dividendo
    }

    if (suggerimentoDividendo1 > 0) {
        const quozienteParzialeSuggerito = suggerimentoDividendo1 / currentDivisor;
        hintDivisioneEl.textContent = `Potresti iniziare scomponendo ${suggerimentoDividendo1}. Quanto fa ${suggerimentoDividendo1} ÷ ${currentDivisor}? (Risposta: ${quozienteParzialeSuggerito}). Poi vedi cosa rimane.`;
        // Evidenzia il primo input del dividendo per la scomposizione
        if (scomposizioneDividendoInputs && scomposizioneDividendoInputs[0]) {
            scomposizioneDividendoInputs[0].focus();
            // Potresti anche volerlo pre-compilare, ma per ora solo focus
            // scomposizioneDividendoInputs[0].value = suggerimentoDividendo1;
        }
    } else {
        hintDivisioneEl.textContent = "Prova a trovare un numero facile da dividere per " + currentDivisor + " che sia parte di " + currentDividend + ".";
    }
    playSound('good'); // Un suono per indicare che l'aiuto è stato dato
}