# MathAppScomposizioni

Applicazione web interattiva per aiutare i bambini a fare pratica con la matematica (tabelline, divisioni e moltiplicazioni con metodo di scomposizione).

## Descrizione

Questa applicazione è pensata per rendere l'apprendimento della matematica più divertente e coinvolgente per bambini (target 9 anni circa).
Include:

* Esercizi sulle tabelline.
* Esercizi sulle divisioni, con un focus sul metodo di scomposizione.
* Esercizi sulle moltiplicazioni, con un focus sul metodo di scomposizione.
* Diversi livelli di difficoltà per divisioni e moltiplicazioni con scomposizione.
* Sistema di punteggio che tiene conto anche della velocità di risposta.
* Feedback sonoro per risposte corrette/errate e bonus.
* Personalizzazione con il nome del giocatore.
* Salvataggio del punteggio più alto (High Score).

## Stato Attuale del Progetto

Il progetto è stato recentemente refattorizzato per utilizzare moduli JavaScript ES6. Questo ha migliorato l'organizzazione del codice, separando la logica in diversi file specializzati.

**Funzionalità Implementate:**

* Gioco delle Tabelline completo con suoni e invio tramite tasto "Enter".
* Gioco delle Divisioni con Scomposizione completo, con diversi livelli e suoni.
* Gioco delle Moltiplicazioni con Scomposizione completo, con diversi livelli e suoni.
* Gestione del punteggio e del nome giocatore.
* Logica "Nuova Partita" e "Torna al Menu".

## Struttura del Progetto

* `index.html`: Struttura principale della pagina web.
* `style.css`: Fogli di stile per l'aspetto grafico.
* `js/`: Cartella contenente i moduli JavaScript.
  * `main.js`: Script principale che inizializza l'applicazione e gestisce la logica globale.
  * `config.js`: Contiene costanti di configurazione e funzioni di utilità (es. calcolo bonus).
  * `score.js`: Gestisce la logica del punteggio.
  * `domUtils.js`: Funzioni di utilità per la manipolazione del DOM.
  * `utils.js`: Funzioni di utilità generiche (es. `playSound`).
  * `tabelline.js`: Logica specifica per il gioco delle tabelline.
  * `divisioni.js`: Logica specifica per il gioco delle divisioni con scomposizione.
  * `moltiplicazioniScomposizione.js`: Logica specifica per il gioco delle moltiplicazioni con scomposizione.
* `sounds/`: Cartella contenente i file audio per il feedback.
  * `success.mp3`
  * `error.mp3`
  * `awesome.mp3`
  * `good.mp3`
* `watercolor.webp`: Immagine di sfondo.
* `.gitignore`: Specifica i file da ignorare per Git.
* `README.md`: Questo file.

## Come Avviare

**Importante:** A causa dell'utilizzo dei moduli JavaScript ES6, l'applicazione non può essere avviata semplicemente aprendo il file `index.html` direttamente nel browser (a causa delle restrizioni CORS/Cross-Origin). È necessario servirla tramite un server web locale.

1. Clonare il repository (se già su GitHub) o scaricare i file del progetto.
2. Assicurarsi di avere Node.js installato (opzionale, ma utile per avere `npx`).
3. Aprire un terminale nella cartella principale del progetto.
4. Avviare un server web locale. Un modo semplice è usare `http-server` (se installato globalmente) o tramite `npx`:

   ```bash
   npx http-server -c-1
   ```

   L'opzione `-c-1` disabilita la cache, utile durante lo sviluppo.
   In alternativa, si può usare l'estensione "Live Server" di VS Code.
5. Aprire il browser e navigare all'indirizzo fornito dal server (solitamente `http://localhost:8080` o simile).

## Funzionalità Future (Roadmap)

* Revisione grafica e UX (feedback visivo, layout).
* Miglioramento timing per feedback e bonus.
* Possibilità di scegliere quali tabelline praticare.
* Statistiche di gioco più dettagliate.
* Opzione per rimuovere il vecchio `script.js` dopo una verifica completa.

## Contributi

Suggerimenti e contributi sono benvenuti.
