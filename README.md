# Progetti UF07WEB

Questo repository contiene tre applicazioni web sviluppate secondo le linee guida del file `Linee guida progetti UF07WEB.pdf`, con **funzionalità aggiuntive** rispetto ai requisiti minimi.

## 📁 Struttura del progetto

```
index.html                # Pagina iniziale di selezione progetto
js/
  01tm-base.js            # Task Manager base
  01tm-advanced.js        # Task Manager avanzato
  02crono-base.js         # Cronometro base
  02crono-advanced.js     # Cronometro avanzato
  03meteo-base.js         # Meteo base
  03meteo-advanced.js     # Meteo avanzato
  theme.js                # File per cambio tema
projects/
  01tm-base.html
  01tm-advanced.html
  02crono-base.html
  02crono-advanced.html
  03meteo-base.html
  03meteo-advanced.html
style/
  dark/
    01tm.css
    02crono-advanced.css
    02crono-base.css
    03meteo.css
    style.css
  light/
    01tm.css
    02crono-advanced.css
    02crono-base.css
    03meteo.css
    style.css
Linee guida progetti UF07WEB.pdf
README.md
```

---

## 📌 Descrizione dei progetti

### ✅ Task Manager

- **Base:**
  - Aggiunta ed eliminazione di attività.
  - Sezione "Eliminati di recente" per recuperare task cancellati (funzionalità aggiuntiva).
  - Salvataggio dei dati nel LocalStorage
- **Avanzato:**
  - Stato attività (da fare, in corso, completata).
  - Modifica, filtri, ricerca.
  - Eliminazione definitiva e ripristino.
  - Sezione "Eliminati di recente" (funzionalità aggiuntiva).
  - Salvataggio dei dati nel LocalStorage

### ⏱️ Cronometro

- **Base:**
  - Start, stop, reset.
  - Icone sui pulsanti (funzionalità aggiuntiva).
  - Salvataggio tempi con nome e data (funzionalità aggiuntiva).
  - Modifica nome dei tempi salvati (funzionalità aggiuntiva).
  - Salvataggio dei dati nel LocalStorage
- **Avanzato:**
  - Giri (lap), resume, lista giri.
  - Riepilogo corsa con statistiche (funzionalità aggiuntiva).
  - Icone sui pulsanti (funzionalità aggiuntiva).
  - Salvataggio dei dati nel LocalStorage
  - Download e upload sessione in JSON (funzionalità aggiuntiva).

### 🌤️ Meteo App

- **Base:**
  - Meteo per posizione fissa (temperatura, umidità, pioggia, vento, ecc.).
  - Rilevamento automatico della città tramite reverse geocoding (funzionalità aggiuntiva).
- **Avanzato:**
  - Meteo per posizione attuale tramite geolocalizzazione.
  - Dettagli meteo, icone, elenco città famose (funzionalità aggiuntiva).
  - Rilevamento automatico della città tramite reverse geocoding (funzionalità aggiuntiva).

---

## 🚀 Funzionalità aggiuntive rispetto alle linee guida

- **Pagina iniziale** di selezione progetto (`index.html`).
- **Task Manager:** eliminati di recente e recupero attività cancellate.
- **Cronometro:** icone sui pulsanti (base e avanzato), riepilogo statistico dettagliato (avanzato), salvataggio e modifica nomi tempi, download sessioni.
- **Meteo:** riconoscimento automatico della città dalle coordinate (base e avanzato), meteo delle città famose (avanzato).
- **UI responsive** e accessibile, con design uniforme tra le app.
- **Tema chiaro/scuro** selezionabile in tutte le app.

---

## 🛠️ Come usare

**Apertura:**  
Apri il file `index.html` con un browser moderno (Chrome, Edge, Firefox, ecc.).

**Selezione progetto:**  
Scegli il progetto che vuoi provare tra Task Manager, Cronometro e Meteo App, cliccando sui pulsanti "Base" o "Avanzato".

**Utilizzo:**  
Ogni progetto si apre in una pagina dedicata e puoi interagire con tutte le sue funzionalità senza bisogno di installare nulla o di un server.

---

## ⚙️ Funzionamento dei progetti

### ✅ Task Manager

**Versione Base (`01tm-base.html` / `01tm-base.js`):**
- **Aggiungi attività:** Inserisci il nome di una nuova attività e premi "Aggiungi".
- **Elimina attività:** Clicca su "Rimuovi" accanto a una task per spostarla negli "Eliminati di recente".
- **Recupera attività:** Nella sezione "Eliminati di recente", puoi ripristinare una task con "Ripristina" oppure eliminarla definitivamente con "Rimuovi definitivamente".
- **Nota:** Le attività sono semplici stringhe, senza stato.

**Versione Avanzata (`01tm-advanced.html` / `01tm-advanced.js`):**
- **Aggiungi attività:** Come nella base, ma ogni attività ha uno stato (da fare, in corso, completata) che è impostato di default a "Da Fare".
- **Cambia stato:** Usa i pulsanti accanto a ogni attività per cambiarne lo stato.
- **Modifica nome:** Puoi modificare il nome di una task cliccando su "Modifica".
- **Elimina attività:** Le attività rimosse finiscono negli "Eliminati di recente" e possono essere ripristinate o eliminate definitivamente.
- **Filtri e ricerca:** Puoi filtrare le attività per stato e cercare per nome.
- **Gestione avanzata eliminati:** Anche le attività eliminate mantengono memoria dello stato originale e possono essere ripristinate nello stato corretto.

### ⏱️ Cronometro

**Versione Base (`02crono-base.html` / `02crono-base.js`):**
- **Start:** Avvia il conteggio del tempo (in secondi).
- **Stop:** Ferma il cronometro.
- **Reset:** Riporta il tempo a zero.
- **Visualizzazione:** Il tempo viene mostrato in formato minuti:secondi.
- **Icone:** I pulsanti hanno icone per una migliore usabilità.
- **Salvataggio tempi:** Puoi salvare i tempi con un nome e una data.
- **Modifica nome tempi:** Puoi modificare il nome di ogni tempo salvato.

**Versione Avanzata (`02crono-advanced.html` / `02crono-advanced.js`):**
- **Start/Stop/Reset:** Come nella versione base, ma il tempo è in millisecondi.
- **Lap (Giro):** Salva il tempo del giro corrente e lo aggiunge alla lista dei giri.
- **Fine Corsa:** Salva il tempo dell'ultimo giro, lo aggiunge alla lista dei giri e stoppa il cronometro.
- **Lista giri:** Visualizza tutti i giri effettuati, evidenziando il migliore.
- **Riepilogo corsa:** Al termine puoi vedere statistiche come numero di giri, tempo totale, miglior/peggior giro, media giri.
- **Icone:** Tutti i pulsanti sono dotati di icone.
- **Funzionalità avanzate:** Resume, gestione dettagliata dei giri, riepilogo dettagliato.
- **Download sessione:** Puoi scaricare la sessione in formato JSON.

### 🌤️ Meteo App

**Versione Base (`03meteo-base.html` / `03meteo-base.js`):**
- **Meteo posizione fissa:** Visualizza le condizioni meteo (temperatura, umidità, pioggia, vento, ecc.) di una località predefinita.
- **Nome città:** Il nome della città viene rilevato automaticamente tramite reverse geocoding.
- **Dati aggiornati:** I dati sono ottenuti tramite API Open-Meteo e OpenStreetMap Nominatim.

**Versione Avanzata (`03meteo-advanced.html` / `03meteo-advanced.js`):**
- **Meteo posizione attuale:** Usa la geolocalizzazione del browser per mostrare il meteo dove ti trovi.
- **Meteo città famose:** Visualizza anche il meteo di alcune città famose.
- **Dettagli meteo:** Oltre ai dati base, mostra icone meteo e dettagli aggiuntivi.
- **Nome città:** Anche qui il nome viene rilevato automaticamente.
- **Funzionalità avanzate:** Interfaccia più ricca, gestione errori geolocalizzazione, visualizzazione multipla.

---

## 👨‍💻 Per sviluppatori

- Tutte le funzioni JavaScript sono documentate con **JSDoc**.
- I file JS seguono la convenzione `numero-funzionalità-versione.js`.
- Commit organizzati secondo [Conventional Commits](https://www.conventionalcommits.org/it/v1.0.0/).
- Nessuna dipendenza esterna: solo HTML, CSS, JS puro.

---

## 🌱 Branch di sviluppo (`dev`)

> **Nota:** Tutte le nuove funzionalità, bugfix e modifiche devono essere sviluppate sul branch `dev`.  
> Una volta testate e validate, le modifiche verranno integrate nel branch `main` tramite pull request.

### Come contribuire

1. **Clona il repository e passa al branch `dev`:**
   ```sh
   git clone https://github.com/GrassiEmmanuele01/Grassi-EsameUF07.git
   cd Grassi-EsameUF07
   git checkout dev
   ```

2. **Sviluppa e testa localmente.**
   - Apri i file HTML nella cartella `projects/` per testare le app.
   - Usa solo browser moderni (Chrome, Edge, Firefox).

3. **Assicurati che il codice sia documentato con JSDoc e rispetti la struttura del progetto.**

4. **Fai commit seguendo la convenzione Conventional Commits.**

5. **Apri una pull request verso `dev` per la revisione.**

---

## 🌐 API utilizzate

- [**Open-Meteo API**](https://open-meteo.com/en/docs)
  - Fornisce dati meteo in tempo reale (temperatura, umidità, precipitazioni, pioggia, copertura nuvole, vento, codice meteo) per una posizione geografica.
- [**OpenStreetMap Nominatim**](https://nominatim.openstreetmap.org/ui/reverse.html)
  - Servizio di reverse geocoding per ottenere il nome della città a partire da coordinate geografiche.
- [**Geolocation API (browser)**](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
  - Permette di ottenere la posizione attuale dell’utente tramite browser.

---

## ℹ️ Altre informazioni

- **Facilità di estensione:** La struttura a cartelle e la modularità del codice facilitano l'aggiunta di nuove funzionalità.
- **Sicurezza:** Non vengono richiesti dati sensibili e tutte le API usate sono pubbliche.

---

**Autore:** Emmanuele Grassi  
**Docente:** Pietro Rocchio
