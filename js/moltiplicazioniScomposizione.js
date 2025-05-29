// js/moltiplicazioniScomposizione.js
import { PUNTI_MOLTIPLICAZIONE_SCOMPOSIZIONE, CALCOLA_PUNTI_BONUS } from './config.js';
import { incrementaPunteggio } from './score.js';
import { playSound } from './utils.js'; // Assuming a utils.js for playSound

// DOM Elements
let domandaMoltiplicazioneScomposizioneEl,
    msScomponiFattore1Parte1InputEl, msSecondoFattoreDisplay1El, msScomponiProdotto1InputEl,
    msScomponiFattore1Parte2InputEl, msSecondoFattoreDisplay2El, msScomponiProdotto2InputEl,
    msScomponiFattore1Parte3InputEl, msSecondoFattoreDisplay3El, msScomponiProdotto3InputEl,
    msRispostaFinaleMoltiplicazioneInputEl, feedbackMoltiplicazioneScomposizioneEl, hintMoltiplicazioneScomposizioneEl,
    msPassaggioScomponi1El, msPassaggioScomponi2El, msPassaggioScomponi3El,
    controllaMoltiplicazioneScomposizioneBtn, aiutoMoltiplicazioneScomposizioneBtn,
    livelloMoltiplicazioneScomposizioneSelectEl;


// Game State
let currentCorrectAnswerMS;
let questionStartTimeMS;
let livelloMoltiplicazioneScomposizione = 1;
let numScomposizioniMoltiplicazioneRichieste = 2; // Default for level 1

export function initMoltiplicazioniScomposizione() {
    console.log("initMoltiplicazioniScomposizione: Initializing elements and listeners.");
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
    controllaMoltiplicazioneScomposizioneBtn = document.getElementById('controlla-moltiplicazione-scomposizione-btn');
    aiutoMoltiplicazioneScomposizioneBtn = document.getElementById('aiuto-moltiplicazione-scomposizione-btn');
    livelloMoltiplicazioneScomposizioneSelectEl = document.getElementById('livello-moltiplicazione-scomposizione-select');

    if (controllaMoltiplicazioneScomposizioneBtn) {
        controllaMoltiplicazioneScomposizioneBtn.addEventListener('click', controllaMoltiplicazioneScomposizione);
    }
    if (aiutoMoltiplicazioneScomposizioneBtn) {
        aiutoMoltiplicazioneScomposizioneBtn.addEventListener('click', mostraAiutoMoltiplicazioneScomposizione);
    }
    if (livelloMoltiplicazioneScomposizioneSelectEl) {
        livelloMoltiplicazioneScomposizioneSelectEl.addEventListener('change', (event) => {
            livelloMoltiplicazioneScomposizione = parseInt(event.target.value);
            // Assuming this function is called when the section is active
            // Consider if an explicit check for activeSection is needed if this can fire anytime
            generaDomandaMoltiplicazioneScomposizione();
        });
    }
}

function clearMoltiplicazioneScomposizioneInputs() {
    if (msScomponiFattore1Parte1InputEl) msScomponiFattore1Parte1InputEl.value = '';
    if (msScomponiProdotto1InputEl) msScomponiProdotto1InputEl.value = '';
    if (msScomponiFattore1Parte2InputEl) msScomponiFattore1Parte2InputEl.value = '';
    if (msScomponiProdotto2InputEl) msScomponiProdotto2InputEl.value = '';
    if (msScomponiFattore1Parte3InputEl) msScomponiFattore1Parte3InputEl.value = '';
    if (msScomponiProdotto3InputEl) msScomponiProdotto3InputEl.value = '';
    if (msRispostaFinaleMoltiplicazioneInputEl) msRispostaFinaleMoltiplicazioneInputEl.value = '';
    if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = '';
    if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = '';
}

function generaProblemaMoltiplicazioneScomposizioneInternal(livello) {
    let fattore1, fattore2, prodotto;
    let partiScompostePerHint = [];

    switch (livello) {
        case 1:
            numScomposizioniMoltiplicazioneRichieste = 2;
            fattore1 = Math.floor(Math.random() * 89) + 11; // 11-99
            fattore2 = Math.floor(Math.random() * 8) + 2;   // 2-9

            let p1_lvl1 = Math.floor(fattore1 / 10) * 10;
            let p2_lvl1 = fattore1 % 10;

            if (p2_lvl1 === 0) { // E.g. fattore1 = 50
                 partiScompostePerHint = [p1_lvl1 - 10, 10];
                 if (p1_lvl1 - 10 <= 0)  partiScompostePerHint = [Math.floor(p1_lvl1/2), Math.ceil(p1_lvl1/2)];
            } else { // E.g. fattore1 = 53 -> p1=50, p2=3
                partiScompostePerHint = [p1_lvl1, p2_lvl1];
            }
            break;
        case 2: // 3 scomposizioni, fattore1 più grande
            numScomposizioniMoltiplicazioneRichieste = 3;
            fattore1 = Math.floor(Math.random() * 150) + 25; // 25-174
            fattore2 = Math.floor(Math.random() * 8) + 2;    // 2-9

            if (fattore1 >= 100) {
                let h = 100;
                let rem = fattore1 - h; // 0-74
                if (rem === 0) partiScompostePerHint = [50, 30, 20]; // Example for 100
                else if (rem < 10) partiScompostePerHint = [h, Math.floor(rem / 2), Math.ceil(rem / 2)]; // e.g. 107 -> 100, 3, 4
                else { // rem is 10-74
                    let t_rem = Math.floor(rem / 10) * 10; // 10, 20 .. 70
                    let u_rem = rem % 10;                  // 0..4
                    if (u_rem === 0) partiScompostePerHint = [h, t_rem / 2, t_rem / 2]; // e.g. 120 -> 100, 10, 10
                    else partiScompostePerHint = [h, t_rem, u_rem]; // e.g. 123 -> 100, 20, 3
                }
            } else { // fattore1 is 25-99
                let t_f1 = Math.floor(fattore1 / 10) * 10; // 20..90
                let u_f1 = fattore1 % 10;                  // 0..9
                if (u_f1 === 0) { // e.g. 30, 40 ... 90
                    partiScompostePerHint = [10, 10, fattore1 - 20]; // e.g. 30 -> 10,10,10. 40 -> 10,10,20
                } else { // e.g. 25, 37, 98
                     partiScompostePerHint = [t_f1, Math.floor(u_f1/2), Math.ceil(u_f1/2)]; // e.g. 25 -> 20, 2, 3. This might be too simple.
                     // Alternative for 3 parts:
                     let p1 = Math.max(10, t_f1 -10); // take at least 10 or t_f1-10
                     let p2 = (t_f1 > p1 && u_f1 > 0) ? Math.min(10, u_f1 + (t_f1-p1)) : (t_f1 > p1 ? (t_f1-p1) : (u_f1 > 0 ? u_f1 : 10));
                     let p3 = fattore1 - p1 - p2;
                     partiScompostePerHint = [p1,p2,p3];
                }
            }
            break;
        default: // Fallback to level 1 logic
            numScomposizioniMoltiplicazioneRichieste = 2;
            fattore1 = Math.floor(Math.random() * 89) + 11;
            fattore2 = Math.floor(Math.random() * 8) + 2;
            let p1_def = Math.floor(fattore1 / 10) * 10;
            let p2_def = fattore1 % 10;
            if (p2_def === 0) partiScompostePerHint = [p1_def - 10, 10]; else partiScompostePerHint = [p1_def, p2_def];
            if (partiScompostePerHint.some(p => p <= 0)) partiScompostePerHint = [Math.floor(fattore1/2), Math.ceil(fattore1/2)];
    }

    // Ensure the scomposition is valid
    partiScompostePerHint = partiScompostePerHint.filter(p => p > 0);
    if (partiScompostePerHint.length !== numScomposizioniMoltiplicazioneRichieste || partiScompostePerHint.reduce((a, b) => a + b, 0) !== fattore1) {
        console.warn(`Adjusting scomposition for ${fattore1} from ${partiScompostePerHint.join('+')} to ${numScomposizioniMoltiplicazioneRichieste} parts.`);
        partiScompostePerHint = [];
        let remaining = fattore1;
        for (let i = 0; i < numScomposizioniMoltiplicazioneRichieste - 1; i++) {
            let part = Math.max(1, Math.floor(remaining / (numScomposizioniMoltiplicazioneRichieste - i)));
            // Try to make parts somewhat even or use tens/units logic if possible
            if (livello === 1 && i === 0 && fattore1 > 10) part = Math.floor(fattore1/10)*10;
            if (livello === 2 && i === 0 && fattore1 > 100) part = 100;
            else if (livello === 2 && i === 1 && fattore1 > 20 && remaining > 10) part = Math.floor(remaining/10)*10;

            part = Math.max(1, Math.min(part, remaining - (numScomposizioniMoltiplicazioneRichieste - 1 - i))); // Ensure remaining can be at least 1 for other parts
            partiScompostePerHint.push(part);
            remaining -= part;
        }
        partiScompostePerHint.push(Math.max(1, remaining)); // Ensure last part is at least 1

        // Final check and adjustment if sum is not correct
        let currentSum = partiScompostePerHint.reduce((a,b)=>a+b,0);
        if (currentSum !== fattore1) {
            partiScompostePerHint[partiScompostePerHint.length-1] += (fattore1 - currentSum);
        }
         partiScompostePerHint = partiScompostePerHint.filter(p => p > 0); // remove zero or negative parts if any slipped through
         // If still not right length, force a simple split
         if (partiScompostePerHint.length !== numScomposizioniMoltiplicazioneRichieste) {
            partiScompostePerHint = [];
            let base = Math.floor(fattore1/numScomposizioniMoltiplicazioneRichieste);
            for(let k=0; k<numScomposizioniMoltiplicazioneRichieste-1; k++) partiScompostePerHint.push(base);
            partiScompostePerHint.push(fattore1 - base*(numScomposizioniMoltiplicazioneRichieste-1));
         }
    }

    prodotto = fattore1 * fattore2;
    let prodottiParzialiPerHint = partiScompostePerHint.map(parte => parte * fattore2);

    console.log(`MS Lv${livello}: ${fattore1}x${fattore2}=${prodotto}. Scomp(${numScomposizioniMoltiplicazioneRichieste}): ${partiScompostePerHint.join('+')}. Prod.Parz: ${prodottiParzialiPerHint.join('+')}`);
    return { fattore1, fattore2, prodotto, partiScomposte: partiScompostePerHint, prodottiParziali: prodottiParzialiPerHint, numScomposizioni: numScomposizioniMoltiplicazioneRichieste };
}


export function generaDomandaMoltiplicazioneScomposizione() {
    console.log("MS: Genera domanda");
    if (!domandaMoltiplicazioneScomposizioneEl || !msScomponiFattore1Parte1InputEl) {
        console.error("MS: Elementi DOM critici non trovati.");
        if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = "Errore: elementi mancanti.";
        return;
    }

    currentCorrectAnswerMS = generaProblemaMoltiplicazioneScomposizioneInternal(livelloMoltiplicazioneScomposizione);

    if (!currentCorrectAnswerMS || typeof currentCorrectAnswerMS.prodotto === 'undefined') {
        console.error("MS: Errore generazione problema.");
        if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = "Errore generazione problema.";
        return;
    }

    domandaMoltiplicazioneScomposizioneEl.textContent = `Quanto fa ${currentCorrectAnswerMS.fattore1} x ${currentCorrectAnswerMS.fattore2}? Scomponi ${currentCorrectAnswerMS.fattore1}.`;

    if (msSecondoFattoreDisplay1El) msSecondoFattoreDisplay1El.textContent = currentCorrectAnswerMS.fattore2;
    if (msSecondoFattoreDisplay2El) msSecondoFattoreDisplay2El.textContent = currentCorrectAnswerMS.fattore2;
    if (msSecondoFattoreDisplay3El) msSecondoFattoreDisplay3El.textContent = currentCorrectAnswerMS.fattore2;

    clearMoltiplicazioneScomposizioneInputs();

    if (msPassaggioScomponi1El) msPassaggioScomponi1El.style.display = currentCorrectAnswerMS.numScomposizioni >= 1 ? 'flex' : 'none';
    if (msPassaggioScomponi2El) msPassaggioScomponi2El.style.display = currentCorrectAnswerMS.numScomposizioni >= 2 ? 'flex' : 'none';
    if (msPassaggioScomponi3El) msPassaggioScomponi3El.style.display = currentCorrectAnswerMS.numScomposizioni >= 3 ? 'flex' : 'none';

    if (msScomponiFattore1Parte1InputEl) msScomponiFattore1Parte1InputEl.focus();
    questionStartTimeMS = new Date();
}

function controllaMoltiplicazioneScomposizione() {
    if (!currentCorrectAnswerMS || !feedbackMoltiplicazioneScomposizioneEl || !msRispostaFinaleMoltiplicazioneInputEl) {
        console.error("MS: Elementi mancanti per il controllo.");
        if (feedbackMoltiplicazioneScomposizioneEl) feedbackMoltiplicazioneScomposizioneEl.textContent = "Errore: elementi mancanti per il controllo.";
        playSound('error'); // Play error sound
        return;
    }

    const rispostaUtenteFinale = parseInt(msRispostaFinaleMoltiplicazioneInputEl.value);
    if (isNaN(rispostaUtenteFinale)) {
        feedbackMoltiplicazioneScomposizioneEl.textContent = "Per favore, inserisci la somma finale.";
        msRispostaFinaleMoltiplicazioneInputEl.focus();
        playSound('error'); // Play error sound
        return;
    }

    let allStepsCorrect = true;
    let sommaProdottiParzialiUtente = 0;
    const inputGroups = [
        { fattore: msScomponiFattore1Parte1InputEl, prodotto: msScomponiProdotto1InputEl, stepEl: msPassaggioScomponi1El },
        { fattore: msScomponiFattore1Parte2InputEl, prodotto: msScomponiProdotto2InputEl, stepEl: msPassaggioScomponi2El },
        { fattore: msScomponiFattore1Parte3InputEl, prodotto: msScomponiProdotto3InputEl, stepEl: msPassaggioScomponi3El }
    ];

    for (let i = 0; i < currentCorrectAnswerMS.numScomposizioni; i++) {
        const gruppo = inputGroups[i];
        if (!gruppo || !gruppo.fattore || !gruppo.prodotto) {
            console.error(`MS: Input mancanti per lo step ${i + 1}`);
            feedbackMoltiplicazioneScomposizioneEl.textContent = `Errore interno, input mancanti per step ${i+1}.`;
            allStepsCorrect = false;
            playSound('error'); // Play error sound
            break;
        }
        const fattoreUtente = parseInt(gruppo.fattore.value);
        const prodottoUtente = parseInt(gruppo.prodotto.value);

        if (isNaN(fattoreUtente) || isNaN(prodottoUtente)) {
            feedbackMoltiplicazioneScomposizioneEl.textContent = `Inserisci numeri validi per la scomposizione ${i + 1}.`;
            allStepsCorrect = false;
            playSound('error'); // Play error sound
            break;
        }

        if (fattoreUtente !== currentCorrectAnswerMS.partiScomposte[i] || prodottoUtente !== currentCorrectAnswerMS.prodottiParziali[i]) {
            feedbackMoltiplicazioneScomposizioneEl.textContent = `Errore nella scomposizione ${i + 1}. Controlla i tuoi calcoli.`;
            allStepsCorrect = false;
            playSound('error'); // Play error sound
            break;
        }
        sommaProdottiParzialiUtente += prodottoUtente;
    }

    if (!allStepsCorrect) {
        // Hint for the first incorrect step if applicable
        for (let i = 0; i < currentCorrectAnswerMS.numScomposizioni; i++) {
            const gruppo = inputGroups[i];
            const fattoreUtente = parseInt(gruppo.fattore.value);
            const prodottoUtente = parseInt(gruppo.prodotto.value);
            if (fattoreUtente !== currentCorrectAnswerMS.partiScomposte[i] || prodottoUtente !== currentCorrectAnswerMS.prodottiParziali[i]) {
                hintMoltiplicazioneScomposizioneEl.textContent = `Suggerimento: per lo step ${i+1}, prova a scomporre ${currentCorrectAnswerMS.fattore1} in ${currentCorrectAnswerMS.partiScomposte.join(' + ')}. Il ${i+1}° fattore dovrebbe essere ${currentCorrectAnswerMS.partiScomposte[i]}. E ${currentCorrectAnswerMS.partiScomposte[i]} x ${currentCorrectAnswerMS.fattore2} = ${currentCorrectAnswerMS.prodottiParziali[i]}.`;
                break;
            }
        }
        return; // Stop if any step is wrong
    }

    // Check if the sum of user's partial products matches the final user answer
    if (sommaProdottiParzialiUtente !== rispostaUtenteFinale) {
        feedbackMoltiplicazioneScomposizioneEl.textContent = `La somma dei tuoi prodotti parziali (${sommaProdottiParzialiUtente}) non corrisponde alla tua risposta finale (${rispostaUtenteFinale}). Controlla la somma!`;
        msRispostaFinaleMoltiplicazioneInputEl.focus();
        playSound('error'); // Play error sound
        return;
    }

    if (rispostaUtenteFinale === currentCorrectAnswerMS.prodotto) {
        const elapsedTime = (Date.now() - questionStartTimeMS) / 1000;
        const bonus = CALCOLA_PUNTI_BONUS(elapsedTime);
        incrementaPunteggio(PUNTI_MOLTIPLICAZIONE_SCOMPOSIZIONE + bonus);
        feedbackMoltiplicazioneScomposizioneEl.textContent = `Corretto! +${PUNTI_MOLTIPLICAZIONE_SCOMPOSIZIONE}${bonus > 0 ? ` (+${bonus} bonus)` : ''}. Tempo: ${elapsedTime.toFixed(1)}s`;
        playSound('success'); // Play success sound
        setTimeout(generaDomandaMoltiplicazioneScomposizione, 2500);
    } else {
        feedbackMoltiplicazioneScomposizioneEl.textContent = `Sbagliato. La risposta corretta è ${currentCorrectAnswerMS.prodotto}. Tu hai scritto ${rispostaUtenteFinale}.`;
        playSound('error'); // Play error sound
    }
}

function mostraAiutoMoltiplicazioneScomposizione() {
    if (!currentCorrectAnswerMS || !hintMoltiplicazioneScomposizioneEl) {
        if (hintMoltiplicazioneScomposizioneEl) hintMoltiplicazioneScomposizioneEl.textContent = "Suggerimento non disponibile.";
        return;
    }

    const { fattore1, fattore2, partiScomposte, numScomposizioni } = currentCorrectAnswerMS;
    let hintMsg = "";

    if (partiScomposte && partiScomposte.length === numScomposizioni && partiScomposte.every(p => p > 0) && partiScomposte.reduce((a,b)=>a+b,0) === fattore1) {
        hintMsg = `Prova a scomporre ${fattore1} in ${numScomposizioni} parti. Ad esempio: ${partiScomposte.join(' + ')}.\n`;
        hintMsg += `Poi calcola i prodotti parziali:\n`;
        partiScomposte.forEach((parte, index) => {
            hintMsg += `(${parte} x ${fattore2}) = ${parte * fattore2}`;
            if (index < partiScomposte.length - 1) hintMsg += ",\n";
        });
        let sommaProdottiParziali = partiScomposte.map(p => p * fattore2).reduce((a,b)=>a+b,0);
        hintMsg += `.\nInfine somma i prodotti parziali: ${partiScomposte.map(p => p * fattore2).join(' + ')} = ${sommaProdottiParziali}.`;
    } else {
        hintMsg = `Pensa a come puoi dividere ${fattore1} in ${numScomposizioni} numeri più facili (come decine e unità). Poi moltiplica ciascuna parte per ${fattore2} e somma i risultati.`;
    }
    hintMoltiplicazioneScomposizioneEl.textContent = hintMsg;
    hintMoltiplicazioneScomposizioneEl.style.whiteSpace = 'pre-line';
    // playSound('good');
}
