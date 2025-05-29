// js/divisioni.js
import {
    PUNTI_DIVISIONE_LIVELLO_1,
    PUNTI_DIVISIONE_LIVELLO_2_3
} from './config.js';
import { incrementaPunteggio, decrementaPunteggio } from './score.js';
import { playSound } from './utils.js'; // Import playSound

// DOM Elements specific to Divisioni game
let divisionSectionEl;
let domandaDivisioneEl, scomposizioneStepsDivEl, livelloDivisioneSelectEl;
let controllaDivisioneButtonEl, aiutoDivisioneButtonEl, feedbackDivisioneEl, hintDivisioneEl;
let labelSommaQuozientiEl, rispostaFinaleDivisioneEl;

// Game state for Divisioni
let currentDivisionLevel = 1;

/**
 * Initializes the Divisioni game module.
 * - Gets references to DOM elements.
 * - Sets up event listeners.
 */
export function initDivisioni() {
    divisionSectionEl = document.getElementById('divisioni-section');
    if (!divisionSectionEl) {
        console.error("Divisioni section not found!");
        return;
    }

    domandaDivisioneEl = document.getElementById('domanda-divisione');
    scomposizioneStepsDivEl = document.getElementById('scomposizione-steps');
    livelloDivisioneSelectEl = document.getElementById('livello-divisione-select');
    feedbackDivisioneEl = document.getElementById('feedback-divisione');
    hintDivisioneEl = document.getElementById('hint-divisione');
    labelSommaQuozientiEl = document.getElementById('label-somma-quozienti');
    rispostaFinaleDivisioneEl = document.getElementById('risposta-finale-divisione');

    // Buttons - use new IDs
    controllaDivisioneButtonEl = document.getElementById('controlla-divisione-btn');
    if (controllaDivisioneButtonEl) {
        controllaDivisioneButtonEl.addEventListener('click', controllaDivisione);
        console.log("Event listener added to controlla-divisione-btn");
    } else {
        console.error("Controlla Divisione button not found by ID!");
    }

    aiutoDivisioneButtonEl = document.getElementById('aiuto-divisione-btn');
    if (aiutoDivisioneButtonEl) {
        aiutoDivisioneButtonEl.addEventListener('click', mostraAiutoDivisione);
        console.log("Event listener added to aiuto-divisione-btn");
    } else {
        console.error("Aiuto Divisione button not found by ID!");
    }

    if (livelloDivisioneSelectEl) {
        livelloDivisioneSelectEl.addEventListener('change', (event) => {
            currentDivisionLevel = parseInt(event.target.value);
            console.log(`Livello Divisione cambiato a: ${currentDivisionLevel}`);
            generaDomandaDivisione(); // Regenerate question for new level
        });
    }
    
    // Initialize with default level value from HTML select if needed, or ensure currentDivisionLevel is used
    if(livelloDivisioneSelectEl) currentDivisionLevel = parseInt(livelloDivisioneSelectEl.value);

    console.log("Divisioni module initialized.");
}

function clearDivisionInputs() {
    if (scomposizioneStepsDivEl) {
        const dynamicSteps = scomposizioneStepsDivEl.querySelectorAll('.scomposizione-step');
        dynamicSteps.forEach(step => step.remove());
    }
    // const quozienteInputs = divisionSectionEl.querySelectorAll('.quoziente-parziale'); // Already cleared by removing steps
    // quozienteInputs.forEach(input => input.value = '');

    if (rispostaFinaleDivisioneEl) rispostaFinaleDivisioneEl.value = '';
    if (feedbackDivisioneEl) feedbackDivisioneEl.textContent = '';
    if (hintDivisioneEl) hintDivisioneEl.textContent = '';
    console.log("Division inputs cleared (dynamic steps removed).");
}

function generaProblemaDivisione() {
    let dividendo, divisore, quozienteTarget;
    const minDivisore = 2;
    const maxDivisore = currentDivisionLevel === 1 ? 5 : (currentDivisionLevel === 2 ? 7 : 9);
    const minQuoziente = currentDivisionLevel === 1 ? 2 : (currentDivisionLevel === 2 ? 3 : 4);
    const maxQuoziente = currentDivisionLevel === 1 ? 5 : (currentDivisionLevel === 2 ? 8 : 10);

    divisore = Math.floor(Math.random() * (maxDivisore - minDivisore + 1)) + minDivisore;
    quozienteTarget = Math.floor(Math.random() * (maxQuoziente - minQuoziente + 1)) + minQuoziente;
    dividendo = divisore * quozienteTarget;

    // Ensure variety, especially for higher levels if needed
    // For level 3, ensure the number is decomposable in 3 steps if that's a strict rule
    // This might require more complex logic if simple multiplication isn't enough

    const problema = {
        dividendoOriginale: dividendo,
        divisore: divisore,
        quozienteCorretto: quozienteTarget,
        livello: currentDivisionLevel
    };
    console.log(`Divisione Lv${currentDivisionLevel}: ${dividendo} : ${divisore} = ${quozienteTarget}`, problema);
    return problema;
}

export function generaDomandaDivisione() {
    if (!domandaDivisioneEl || !scomposizioneStepsDivEl || !divisionSectionEl || !labelSommaQuozientiEl || !rispostaFinaleDivisioneEl) {
        console.error("Required DOM elements for generaDomandaDivisione not found.");
        return;
    }
    clearDivisionInputs();
    const problema = generaProblemaDivisione();
    domandaDivisioneEl.textContent = `${problema.dividendoOriginale} : ${problema.divisore} = ?`;

    divisionSectionEl.dataset.currentProblem = JSON.stringify(problema);

    const numSteps = problema.livello === 1 ? 1 : (problema.livello === 2 ? 2 : 3);
    // console.log(`generaDomandaDivisione: Livello ${problema.livello}, Numero Passi: ${numSteps}`);

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
        scomposizioneStepsDivEl.appendChild(stepDiv);
    }

    if (problema.livello === 1) {
        if (labelSommaQuozientiEl) labelSommaQuozientiEl.style.display = 'none';
        if (rispostaFinaleDivisioneEl) rispostaFinaleDivisioneEl.style.display = 'none';
    } else {
        if (labelSommaQuozientiEl) labelSommaQuozientiEl.style.display = 'inline';
        if (rispostaFinaleDivisioneEl) rispostaFinaleDivisioneEl.style.display = 'inline-block';
    }
}

function controllaDivisione() {
    if (!feedbackDivisioneEl || !divisionSectionEl || !scomposizioneStepsDivEl) {
        console.error("Core elements for controllaDivisione missing.");
        playSound('error');
        return;
    }
    const problemDataString = divisionSectionEl.dataset.currentProblem;
    if (!problemDataString) {
        feedbackDivisioneEl.textContent = "Errore interno: dati del problema non trovati.";
        playSound('error');
        return;
    }
    const problemData = JSON.parse(problemDataString);
    const { dividendoOriginale, divisore: divisoreOriginale, quozienteCorretto, livello } = problemData;

    // console.log(`controllaDivisione: Inizio controllo per ${dividendoOriginale} : ${divisoreOriginale}. Livello: ${livello}.`);

    const stepElements = scomposizioneStepsDivEl.querySelectorAll('.scomposizione-step');

    if (livello === 1) {
        const quozienteParzialeInput = scomposizioneStepsDivEl.querySelector('.quoziente-parziale');
        if (!quozienteParzialeInput) {
            feedbackDivisioneEl.textContent = "Errore: input del quoziente per livello 1 non trovato.";
            playSound('error');
            return;
        }
        const quozienteParzialeUtente = parseFloat(quozienteParzialeInput.value);
        if (isNaN(quozienteParzialeUtente)) {
            feedbackDivisioneEl.textContent = "Per favore, inserisci un numero come quoziente.";
            playSound('error');
            return;
        }
        if (quozienteParzialeUtente === quozienteCorretto) {
            feedbackDivisioneEl.textContent = "Corretto!";
            incrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_1);
            playSound('success');
            setTimeout(generaDomandaDivisione, 2000);
        } else {
            feedbackDivisioneEl.textContent = `Sbagliato. ${dividendoOriginale} : ${divisoreOriginale} = ${quozienteCorretto}. Tu hai scritto ${quozienteParzialeUtente}.`;
            decrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_1);
            playSound('error');
        }
        return;
    }

    // Livelli > 1
    let sommaQuozientiParziali = 0;
    let dividendoRimanente = dividendoOriginale;

    for (let i = 0; i < stepElements.length; i++) {
        const stepDiv = stepElements[i];
        const scomponiDvInput = stepDiv.querySelector('.scomponi-dividendo');
        const scomponiQzInput = stepDiv.querySelector('.quoziente-parziale');

        if (!scomponiDvInput || !scomponiQzInput) {
            feedbackDivisioneEl.textContent = `Errore: input mancanti al passaggio ${i + 1}.`;
            playSound('error');
            return;
        }
        const dividendoParzialeUtente = parseFloat(scomponiDvInput.value);
        const quozienteParzialeUtente = parseFloat(scomponiQzInput.value);

        if (isNaN(dividendoParzialeUtente) || isNaN(quozienteParzialeUtente)) {
            feedbackDivisioneEl.textContent = `Errore al passaggio ${i + 1}: assicurati di inserire numeri validi.`;
            playSound('error');
            return;
        }
        if (dividendoParzialeUtente <= 0 || quozienteParzialeUtente < 0) {
            feedbackDivisioneEl.textContent = `Errore al passaggio ${i + 1}: i numeri devono essere positivi. Il quoziente può essere zero.`;
            playSound('error');
            return;
        }
        if (typeof divisoreOriginale === 'undefined' || divisoreOriginale === 0) {
            feedbackDivisioneEl.textContent = "Errore interno critico: il divisore non è valido.";
            playSound('error');
            return;
        }
        if (dividendoParzialeUtente % divisoreOriginale !== 0) {
            feedbackDivisioneEl.textContent = `Errore al passaggio ${i + 1}: il dividendo parziale (${dividendoParzialeUtente}) non è divisibile esattamente per ${divisoreOriginale}. Le nostre divisioni non hanno resto!`;
            playSound('error');
            return;
        }
        if (dividendoParzialeUtente / divisoreOriginale !== quozienteParzialeUtente) {
            feedbackDivisioneEl.textContent = `Errore al passaggio ${i + 1}: ${dividendoParzialeUtente} : ${divisoreOriginale} non fa ${quozienteParzialeUtente}.`;
            playSound('error');
            return;
        }
        if (dividendoParzialeUtente > dividendoRimanente) {
            feedbackDivisioneEl.textContent = `Errore al passaggio ${i + 1}: il dividendo parziale (${dividendoParzialeUtente}) è maggiore del dividendo rimanente (${dividendoRimanente}).`;
            playSound('error');
            return;
        }
        sommaQuozientiParziali += quozienteParzialeUtente;
        dividendoRimanente -= dividendoParzialeUtente;
    }

    if (!rispostaFinaleDivisioneEl) {
        console.error("Input risposta finale divisione non trovato per livelli > 1");
        feedbackDivisioneEl.textContent = "Errore interno: campo risposta finale mancante.";
        playSound('error');
        return;
    }
    const risultatoFinaleUtente = parseFloat(rispostaFinaleDivisioneEl.value);
    if (isNaN(risultatoFinaleUtente) && stepElements.length > 0) { // Only require final answer if steps were present
        feedbackDivisioneEl.textContent = "Per favore, inserisci il risultato finale della divisione.";
        playSound('error');
        return;
    }

    if (dividendoRimanente === 0 && sommaQuozientiParziali === quozienteCorretto) {
        if (risultatoFinaleUtente !== quozienteCorretto && stepElements.length > 0) { // Check final answer only if steps were involved
            feedbackDivisioneEl.textContent = `La scomposizione è corretta, ma il risultato finale (${risultatoFinaleUtente}) non corrisponde alla somma dei quozienti (${quozienteCorretto}).`;
            decrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_2_3 / 2); // Penalità parziale
            playSound('error');
        } else {
            feedbackDivisioneEl.textContent = "Corretto! Ottima scomposizione!";
            incrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_2_3);
            playSound('success');
            setTimeout(generaDomandaDivisione, 2000);
        }
    } else {
        let messaggioErrore = "Sbagliato. ";
        if (dividendoRimanente !== 0) {
            messaggioErrore += `Il dividendo non è stato scomposto completamente (rimane ${dividendoRimanente}). `;
        }
        if (sommaQuozientiParziali !== quozienteCorretto) {
            messaggioErrore += `La somma dei quozienti parziali (${sommaQuozientiParziali}) non è corretta (dovrebbe essere ${quozienteCorretto}). `;
        }
        if (risultatoFinaleUtente !== quozienteCorretto && stepElements.length > 0) {
             messaggioErrore += `Il risultato finale (${risultatoFinaleUtente}) non è corretto.`;
        }
        feedbackDivisioneEl.textContent = messaggioErrore.trim() + ` La risposta corretta è ${quozienteCorretto}.`;
        decrementaPunteggio(PUNTI_DIVISIONE_LIVELLO_2_3);
        playSound('error');
    }
}

function mostraAiutoDivisione() {
    if (!hintDivisioneEl || !divisionSectionEl) return;
    const problemDataString = divisionSectionEl.dataset.currentProblem;
    if (!problemDataString) {
        hintDivisioneEl.textContent = "Nessun problema caricato per fornire aiuto.";
        return;
    }
    const problemData = JSON.parse(problemDataString);
    const { dividendoOriginale, divisore, livello } = problemData;

    let hintText = "Suggerimento: ";
    if (livello === 1) {
        hintText += `Pensa a quale numero moltiplicato per ${divisore} dà ${dividendoOriginale}.`;
    } else {
        hintText += `Prova a scomporre ${dividendoOriginale} in parti più piccole che siano facili da dividere per ${divisore}. Ad esempio, se devi fare 48 : 4, potresti pensare a (40 : 4) + (8 : 4).`;
        if (livello === 2) {
            hintText += " Cerca di usare due scomposizioni.";
        } else if (livello === 3) {
            hintText += " Cerca di usare tre scomposizioni.";
        }
    }
    hintDivisioneEl.textContent = hintText;
    setTimeout(() => {
        if (hintDivisioneEl) hintDivisioneEl.textContent = ''; // Clear hint after some time
    }, 7000);
}
