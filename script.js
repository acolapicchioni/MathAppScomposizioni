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

function updatePunteggio(puntiBase, moltiplicatoreParam) {
    let moltiplicatore = moltiplicatoreParam;
    
    // Se moltiplicatoreParam non è fornito, lo determiniamo in base al livello di divisione
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
    if (elapsedTime < 8) return 2;
    if (elapsedTime < 15) return 1;
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

function generaProblemaDivisione(livello) {
    console.log("Generating division problem (no remainder) for level:", livello, "(Type:", typeof livello, ")");
    let minDivisor, maxDivisor;
    let minDividend_guideline, maxDividend_guideline; // Rinominato per chiarezza

    // numScomposizioniRichieste è una variabile globale, viene aggiornata qui
    switch (livello) {
        case '1':
            minDivisor = 2; maxDivisor = 9;
            numScomposizioniRichieste = 1;
            minDividend_guideline = 10; maxDividend_guideline = 99; // Es. dividendi a 2 cifre
            break;
        case '2':
            minDivisor = 2; maxDivisor = 9;
            numScomposizioniRichieste = 2;
            minDividend_guideline = 50; maxDividend_guideline = 199; // Es. dividendi che portano a quozienti fino a 20 con divisori comuni
            break;
        case '3':
            minDivisor = 2; maxDivisor = 9;
            numScomposizioniRichieste = 3;
            minDividend_guideline = 70; maxDividend_guideline = 299; // Es. dividendi che portano a quozienti fino a 30
            break;
        default:
            console.warn("Unknown level passed to generaProblemaDivisione. Defaulting to level 1 settings.");
            minDivisor = 2; maxDivisor = 9;
            numScomposizioniRichieste = 1;
            minDividend_guideline = 10; maxDividend_guideline = 99;
    }

    let min_total_quotient_for_level;
    let max_total_quotient_for_level;

    switch (livello) {
        case '1':
            min_total_quotient_for_level = 1; // Almeno 1
            max_total_quotient_for_level = 10; // Massimo 10 per il quoziente totale
            break;
        case '2':
            min_total_quotient_for_level = numScomposizioniRichieste; // Almeno 1 per ogni "passaggio ideale"
            max_total_quotient_for_level = numScomposizioniRichieste * 10; // Es. 2 * 10 = 20
            break;
        case '3':
            min_total_quotient_for_level = numScomposizioniRichieste;
            max_total_quotient_for_level = numScomposizioniRichieste * 10; // Es. 3 * 10 = 30
            break;
        default: // Coerente con il default precedente
            min_total_quotient_for_level = 1;
            max_total_quotient_for_level = 10;
    }
    // Assicura che min non sia maggiore di max (non dovrebbe succedere con la logica attuale)
    max_total_quotient_for_level = Math.max(max_total_quotient_for_level, min_total_quotient_for_level);


    let dividend, divisor, quotient;
    const remainder = 0; // Generiamo solo divisioni esatte
    let attempts = 0;
    const MAX_ATTEMPTS = 100; // Aumentato un po' per sicurezza con le guideline

    do {
        divisor = Math.floor(Math.random() * (maxDivisor - minDivisor + 1)) + minDivisor;
        
        // Assicurati che il range del quoziente sia valido
        let current_max_q = max_total_quotient_for_level;
        let current_min_q = min_total_quotient_for_level;

        // Adatta il range del quoziente se necessario per rispettare le guideline del dividendo con il divisore scelto
        // current_min_q = Math.max(current_min_q, Math.ceil(minDividend_guideline / divisor));
        // current_max_q = Math.min(current_max_q, Math.floor(maxDividend_guideline / divisor));

        if (current_min_q > current_max_q) { // Se il range del quoziente diventa invalido con questo divisore
            attempts++;
            if (attempts > MAX_ATTEMPTS / 2 && minDivisor < maxDivisor) { // Se fatica, prova a cambiare strategia di scelta del divisore
                 // Potrebbe essere utile un log qui o una strategia di fallback più robusta se i range sono troppo stretti
            }
            continue; // Prova un altro divisore
        }
        
        quotient = Math.floor(Math.random() * (current_max_q - current_min_q + 1)) + current_min_q;
        dividend = divisor * quotient;
        attempts++;

        // Verifica primaria: il quoziente deve essere nel range definito per il livello
        // (già garantito dalla scelta del quoziente, ma una doppia verifica non fa male)
        // e il dividendo deve essere entro le linee guida di grandezza.
        if (dividend >= minDividend_guideline && dividend <= maxDividend_guideline &&
            quotient >= min_total_quotient_for_level && quotient <= max_total_quotient_for_level) {
            break; // Problema valido trovato
        }

        if (attempts >= MAX_ATTEMPTS) {
            console.warn(`Max attempts (${MAX_ATTEMPTS}) reached for level ${livello}. Using last generated values or a fallback.`);
            // Fallback se non si trova un problema ideale: usa l'ultimo generato se il quoziente è valido,
            // altrimenti crea un problema minimo.
            if (!(quotient >= min_total_quotient_for_level && quotient <= max_total_quotient_for_level)) {
                console.warn("Last generated quotient was outside limits. Creating minimal fallback.");
                divisor = minDivisor; // Usa il divisore minimo
                quotient = min_total_quotient_for_level;
                dividend = divisor * quotient;
            }
            // Se il quoziente era valido ma il dividendo fuori guideline, lo usiamo comunque.
            console.log(`Fallback problem for level ${livello}: ${dividend} ÷ ${divisor} = ${quotient}`);
            break; 
        }
    } while (true);


    console.log(`Division problem (no remainder): ${dividend} ÷ ${divisor} = ${quotient}. Steps: ${numScomposizioniRichieste}`);
    return { dividend, divisor, quotient, remainder };
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

    const labelSommaQuozientiEl = document.getElementById('label-somma-quozienti');

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

    // Imposta il testo del divisore negli span dedicati
    const scompDivisorDisplay1 = document.getElementById('scomp-divisor-display-1');
    const scompDivisorDisplay2 = document.getElementById('scomp-divisor-display-2');
    const scompDivisorDisplay3 = document.getElementById('scomp-divisor-display-3');

    if (scompDivisorDisplay1) scompDivisorDisplay1.textContent = currentDivisor;
    else console.warn("scomp-divisor-display-1 not found");
    if (scompDivisorDisplay2) scompDivisorDisplay2.textContent = currentDivisor;
    else console.warn("scomp-divisor-display-2 not found");
    if (scompDivisorDisplay3) scompDivisorDisplay3.textContent = currentDivisor;
    else console.warn("scomp-divisor-display-3 not found");

    // Aggiorna la visibilità dei passaggi di scomposizione in base a numScomposizioniRichieste
    // numScomposizioniRichieste è stato aggiornato in generaProblemaDivisione
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

    domandaDivisioneEl.textContent = `${currentDividend} ÷ ${currentDivisor} = ?`;
    clearDivisionInputs(); // Chiamata esistente
    feedbackDivisioneEl.textContent = '';
    hintDivisioneEl.textContent = '';

    // Gestione visibilità campi specifici per livello
    if (labelSommaQuozientiEl && rispostaFinaleDivisioneInputEl) {
        if (livelloToUse === '1') {
            labelSommaQuozientiEl.style.display = 'none';
            rispostaFinaleDivisioneInputEl.style.display = 'none';
        } else {
            labelSommaQuozientiEl.style.display = 'inline'; // O il suo display CSS di default
            rispostaFinaleDivisioneInputEl.style.display = 'inline-block'; // O il suo display CSS di default
        }
    } else {
        if (!labelSommaQuozientiEl) console.warn("generaDomandaDivisione: Elemento 'label-somma-quozienti' non trovato.");
    }

    // Precompilazione e gestione focus per livello facile
    if (decompDividend1InputEl) {
        if (livelloToUse === '1') {
            decompDividend1InputEl.value = currentDividend;
            decompDividend1InputEl.readOnly = true;
            if (scompQuotient1InputEl) {
                scompQuotient1InputEl.focus(); 
            } else if (rispostaFinaleDivisioneInputEl) {
                rispostaFinaleDivisioneInputEl.focus(); // Fallback se scompQuotient1InputEl non esiste
            }
        } else {
            decompDividend1InputEl.focus(); 
        }
    } else if (rispostaFinaleDivisioneInputEl) {
         rispostaFinaleDivisioneInputEl.focus(); // Fallback generale se decompDividend1InputEl non esiste
    }

    questionStartTime = new Date();
    console.log("generaDomandaDivisione: Fine esecuzione.");
}

function controllaDivisione() {
    console.log("[controllaDivisione] Inizio. Valore di currentCorrectAnswer (oggetto):", currentCorrectAnswer);
    console.log("[controllaDivisione] Livello attuale (da var globale numerica):", livelloDivisione);

    const elapsedTime = (new Date() - questionStartTime) / 1000; // Dichiarata una sola volta qui

    if (!feedbackDivisioneEl || !hintDivisioneEl) {
        console.error("controllaDivisione: Elementi feedbackDivisioneEl o hintDivisioneEl non inizializzati.");
        if (!rispostaFinaleDivisioneInputEl && livelloDivisione !== 1) {
             console.error("controllaDivisione: Elementi DOM specifici per la divisione non inizializzati.");
             return;
        }
    }
    if (currentCorrectAnswer === undefined) {
        console.error("controllaDivisione: currentCorrectAnswer è undefined.");
        if (feedbackDivisioneEl) {
            feedbackDivisioneEl.textContent = "Errore: la domanda di divisione non è stata generata. Riprova.";
            feedbackDivisioneEl.className = 'feedback error';
        }
        return;
    }

    // Logica specifica per il Livello 1
    if (livelloDivisione === 1) {
        if (!scompQuotient1InputEl || !decompDividend1InputEl) {
            console.error("controllaDivisione (Livello 1): scompQuotient1InputEl o decompDividend1InputEl non trovati.");
            if (feedbackDivisioneEl) {
                feedbackDivisioneEl.textContent = "Errore: campi input per livello 1 mancanti.";
                feedbackDivisioneEl.className = 'feedback error';
            }
            return;
        }

        const scompQuotient1 = scompQuotient1InputEl.value !== '' ? parseInt(scompQuotient1InputEl.value) : null;

        if (scompQuotient1 === null) {
            feedbackDivisioneEl.textContent = "Inserisci il risultato!";
            feedbackDivisioneEl.className = 'feedback error';
            if (hintDivisioneEl) hintDivisioneEl.textContent = ''; // Clear previous hint
            scompQuotient1InputEl.focus();
            return;
        }

        if (scompQuotient1 === currentCorrectAnswer.quotient) {
            const bonus = calcolaPuntiBonus(elapsedTime);
            updatePunteggio(1 + bonus); // Moltiplicatore gestito in updatePunteggio
            feedbackDivisioneEl.textContent = `Corretto, ${playerName}! +${1 + bonus} punti.`;
            feedbackDivisioneEl.className = 'feedback success';
            if (hintDivisioneEl) hintDivisioneEl.textContent = '';
            playSound('success');
            if (bonus === 2) playSound('awesome');
            else if (bonus === 1) playSound('good');
            setTimeout(generaDomandaDivisione, 2000);
        } else {
            feedbackDivisioneEl.textContent = `Sbagliato, ${playerName}. La risposta corretta è ${currentCorrectAnswer.quotient}.`;
            feedbackDivisioneEl.className = 'feedback error';
            if (hintDivisioneEl) {
                hintDivisioneEl.textContent = `Ricorda: ${currentDividend} ÷ ${currentDivisor} = ?`;
                // Non cancellare l'hint immediatamente, lascia che l'utente lo legga
            }
            playSound('error');
            scompQuotient1InputEl.value = '';
            scompQuotient1InputEl.focus();
        }
        return;
    }

    // Logica esistente per Livelli 2 e 3 (scomposizione multi-passaggio)
    if (!rispostaFinaleDivisioneInputEl || !decompDividend1InputEl || !scompQuotient1InputEl) {
        console.error("controllaDivisione (Livelli 2/3): Elementi DOM per scomposizione o risposta finale non inizializzati.");
        if (feedbackDivisioneEl) {
            feedbackDivisioneEl.textContent = "Errore: mancano campi per la scomposizione o la risposta finale.";
            feedbackDivisioneEl.className = 'feedback error';
        }
        return;
    }

    if (rispostaFinaleDivisioneInputEl.value === '') {
        feedbackDivisioneEl.textContent = "Inserisci la risposta finale!";
        feedbackDivisioneEl.className = 'feedback error';
        if (hintDivisioneEl) hintDivisioneEl.textContent = ''; // Clear previous hint
        return;
    }

    const decompDividend1 = decompDividend1InputEl.value !== '' ? parseInt(decompDividend1InputEl.value) : null;
    const scompQuotient1 = scompQuotient1InputEl.value !== '' ? parseInt(scompQuotient1InputEl.value) : null;
    const decompDividend2 = decompDividend2InputEl.value !== '' ? parseInt(decompDividend2InputEl.value) : null;
    const scompQuotient2 = scompQuotient2InputEl.value !== '' ? parseInt(scompQuotient2InputEl.value) : null;
    const decompDividend3 = decompDividend3InputEl.value !== '' ? parseInt(decompDividend3InputEl.value) : null;
    const scompQuotient3 = scompQuotient3InputEl.value !== '' ? parseInt(scompQuotient3InputEl.value) : null;
    const rispostaFinaleUtente = rispostaFinaleDivisioneInputEl.value !== '' ? parseInt(rispostaFinaleDivisioneInputEl.value) : null;

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
    } else if (decompDividend1 !== null || scompQuotient1 !== null) { // Campi parzialmente riempiti
        parzialeCorretto = false; erroreScomposizione = true;
        hintMessage = "Completa entrambe le caselle per ogni riga di scomposizione usata.";
    }

    if (parzialeCorretto && decompDividend2 !== null && scompQuotient2 !== null) {
        if (dividendoResiduo >= 0 && decompDividend2 <= dividendoResiduo && decompDividend2 % currentDivisor === 0 && decompDividend2 / currentDivisor === scompQuotient2) {
            quozienteParzialeTotale += scompQuotient2;
            dividendoResiduo -= decompDividend2;
        } else {
            parzialeCorretto = false; erroreScomposizione = true;
            if (decompDividend2 > dividendoResiduo && dividendoResiduo >= 0) hintMessage = `Il secondo dividendo (${decompDividend2}) è maggiore del residuo (${dividendoResiduo}).`;
            else if (dividendoResiduo < 0) hintMessage = `Hai già scomposto più del dividendo iniziale. Controlla i passaggi precedenti.`;
            else hintMessage = `Controlla la seconda scomposizione: ${decompDividend2} ÷ ${currentDivisor} non fa ${scompQuotient2}.`;
        }
    } else if (parzialeCorretto && (decompDividend2 !== null || scompQuotient2 !== null)) { // Campi parzialmente riempiti
        parzialeCorretto = false; erroreScomposizione = true;
        hintMessage = "Completa entrambe le caselle per la seconda riga di scomposizione, se usata.";
    }

    if (parzialeCorretto && decompDividend3 !== null && scompQuotient3 !== null) {
        if (dividendoResiduo >= 0 && decompDividend3 <= dividendoResiduo && decompDividend3 % currentDivisor === 0 && decompDividend3 / currentDivisor === scompQuotient3) {
            quozienteParzialeTotale += scompQuotient3;
            dividendoResiduo -= decompDividend3;
        } else {
            parzialeCorretto = false; erroreScomposizione = true;
            if (decompDividend3 > dividendoResiduo && dividendoResiduo >= 0) hintMessage = `Il terzo dividendo (${decompDividend3}) è maggiore del residuo (${dividendoResiduo}).`;
            else if (dividendoResiduo < 0) hintMessage = `Hai già scomposto più del dividendo iniziale. Controlla i passaggi precedenti.`;
            else hintMessage = `Controlla la terza scomposizione: ${decompDividend3} ÷ ${currentDivisor} non fa ${scompQuotient3}.`;
        }
    } else if (parzialeCorretto && (decompDividend3 !== null || scompQuotient3 !== null)) { // Campi parzialmente riempiti
        parzialeCorretto = false; erroreScomposizione = true;
        hintMessage = "Completa entrambe le caselle per la terza riga di scomposizione, se usata.";
    }
    
    // Verifica finale se tutti i campi di scomposizione sono vuoti
    const scomposizioneNonTentata = decompDividend1 === null && scompQuotient1 === null &&
                                decompDividend2 === null && scompQuotient2 === null &&
                                decompDividend3 === null && scompQuotient3 === null;

    if (erroreScomposizione) {
        feedbackDivisioneEl.textContent = `Errore nella scomposizione, ${playerName}.`;
        feedbackDivisioneEl.className = 'feedback error';
        hintDivisioneEl.textContent = hintMessage; // L'hint persiste
        playSound('error');
    } else if (rispostaFinaleUtente === currentCorrectAnswer.quotient && quozienteParzialeTotale === currentCorrectAnswer.quotient && dividendoResiduo === 0 && !scomposizioneNonTentata) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        updatePunteggio(2 + bonus); // Moltiplicatore gestito in updatePunteggio
        feedbackDivisioneEl.textContent = `Corretto, ${playerName}! Ottima scomposizione! +${2 + bonus} punti.`;
        feedbackDivisioneEl.className = 'feedback success';
        hintDivisioneEl.textContent = '';
        playSound('success');
        if (bonus === 2) playSound('awesome'); else if (bonus === 1) playSound('good');
        setTimeout(generaDomandaDivisione, 2000);
    } else if (rispostaFinaleUtente === currentCorrectAnswer.quotient && scomposizioneNonTentata) {
        const bonus = calcolaPuntiBonus(elapsedTime);
        updatePunteggio(1 + bonus); // Punteggio base minore, moltiplicatore gestito in updatePunteggio
        feedbackDivisioneEl.textContent = `Risposta finale corretta, ${playerName}! +${1 + bonus} punti.`;
        feedbackDivisioneEl.className = 'feedback success';
        hintDivisioneEl.textContent = `La scomposizione aiuta a capire meglio! Provala la prossima volta.`; // Hint persiste per un po'
        playSound('success');
        if (bonus >= 1) playSound('good');
        setTimeout(() => {
            if (hintDivisioneEl.textContent === `La scomposizione aiuta a capire meglio! Provala la prossima volta.`) {
                 hintDivisioneEl.textContent = ''; // Cancella l'hint dopo un po' se non è cambiato
            }
            generaDomandaDivisione();
        }, 3500); // Timeout più lungo per leggere l'hint
    } else { // Risposta finale errata o scomposizione errata che porta a risultato finale errato
        feedbackDivisioneEl.textContent = `Sbagliato, ${playerName}. La risposta corretta è ${currentCorrectAnswer.quotient}.`;
        if (quozienteParzialeTotale !== currentCorrectAnswer.quotient || dividendoResiduo !== 0) {
            if (!scomposizioneNonTentata){
                 hintDivisioneEl.textContent = `La tua scomposizione porta a ${quozienteParzialeTotale} con un resto di ${dividendoResiduo}. Controlla i passaggi.`;
            } else {
                 hintDivisioneEl.textContent = `Prova a scomporre il dividendo (${currentDividend}) in parti più piccole.`;
            }
        } else if (rispostaFinaleUtente !== currentCorrectAnswer.quotient) {
            // Questo caso implica che la scomposizione era corretta (quozienteParzialeTotale === currentCorrectAnswer.quotient && dividendoResiduo === 0)
            // ma la rispostaFinaleUtente è diversa.
            // Potrebbe accadere se l'utente corregge la scomposizione ma non la risposta finale, o viceversa.
            hintDivisioneEl.textContent = `La scomposizione sembra corretta, ma la risposta finale (${rispostaFinaleUtente}) non corrisponde.`;
        } else {
            // Caso generico se nessun altro hint specifico è stato impostato
            hintDivisioneEl.textContent = `Controlla la scomposizione e la risposta finale.`;
        }
        feedbackDivisioneEl.className = 'feedback error';
        playSound('error');
        // Non cancellare l'hint, lascia che l'utente lo legga
    }
}

function clearDivisionInputs() {
    scomposizioneDividendoInputs.forEach(input => { 
        if (input) {
            input.value = ''; 
            input.readOnly = false; // Resetta readOnly
        }
    });
    scomposizioneQuozienteInputs.forEach(input => { if (input) input.value = ''; });
    if (rispostaFinaleDivisioneInputEl) rispostaFinaleDivisioneInputEl.value = '';
    if (restoFinaleDivisioneEl) restoFinaleDivisioneEl.value = '';
}

function mostraAiutoDivisione() {
    if (!hintDivisioneEl || !currentDividend || !currentDivisor || currentDivisor === 0) {
        console.warn("mostraAiutoDivisione: Impossibile fornire aiuto, dati mancanti o divisore nullo.");
        if (hintDivisioneEl) hintDivisioneEl.textContent = "Non riesco a darti un aiuto specifico ora.";
        return;
    }

    let suggerimentoDividendo1 = 0;
    let quozienteSuggerito = Math.floor(currentDividend / currentDivisor / 2);

    if (quozienteSuggerito > 0) {
        suggerimentoDividendo1 = quozienteSuggerito * currentDivisor;
    }

    if (suggerimentoDividendo1 === 0 && currentDividend >= 2 * currentDivisor) {
        suggerimentoDividendo1 = currentDivisor;
    } else if (suggerimentoDividendo1 === 0) {
        suggerimentoDividendo1 = currentDividend; 
    }
    
    if (suggerimentoDividendo1 > currentDividend) {
        suggerimentoDividendo1 = currentDividend - (currentDividend % currentDivisor);
        if (suggerimentoDividendo1 === 0 && currentDividend > 0) suggerimentoDividendo1 = currentDividend;
    }

    if (suggerimentoDividendo1 > 0) {
        const quozienteParzialeSuggerito = suggerimentoDividendo1 / currentDivisor;
        hintDivisioneEl.textContent = `Potresti iniziare scomponendo ${suggerimentoDividendo1}. Quanto fa ${suggerimentoDividendo1} ÷ ${currentDivisor}? (Risposta: ${quozienteParzialeSuggerito}). Poi vedi cosa rimane.`;
        if (scomposizioneDividendoInputs && scomposizioneDividendoInputs[0]) {
            scomposizioneDividendoInputs[0].focus();
        }
    } else {
        hintDivisioneEl.textContent = "Prova a trovare un numero facile da dividere per " + currentDivisor + " che sia parte di " + currentDividend + ".";
    }
    playSound('good');
}