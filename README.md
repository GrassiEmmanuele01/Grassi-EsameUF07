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
projects/
  01tm-base.html
  01tm-advanced.html
  02crono-base.html
  02crono-advanced.html
  03meteo-base.html
  03meteo-advanced.html
style/
  01tm.css
  02crono.css
  03meteo.css
  style.css
Linee guida progetti UF07WEB.pdf
```

---

## 📌 Descrizione dei progetti

### ✅ Task Manager

- **Base:**
  - Aggiunta ed eliminazione di attività.
  - Sezione "Eliminati di recente" per recuperare task cancellati (funzionalità aggiuntiva rispetto alle linee guida).
- **Avanzato:**
  - Stato attività (da fare, in corso, completata).
  - Modifica, filtri, ricerca
  - Eliminazione definitiva e ripristino.
  - Sezione "Eliminati di recente" (funzionalità aggiuntiva).

### ⏱️ Cronometro

- **Base:**
  - Start, stop, reset.
  - Icone sui pulsanti (funzionalità aggiuntiva).
- **Avanzato:**
  - Giri (lap), resume, lista giri.
  - Riepilogo corsa con statistiche (funzionalità aggiuntiva).
  - Icone sui pulsanti (funzionalità aggiuntiva).

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
- **Cronometro:** icone sui pulsanti (base e avanzato), riepilogo statistico dettagliato (avanzato).
- **Meteo:** riconoscimento automatico della città dalle coordinate (base e avanzato), meteo delle città famose (avanzato).
- **UI responsive** e accessibile, con design uniforme tra le app.

---

## 🛠️ Come usare

Apri `index.html` in un browser e seleziona l'app che vuoi testare.  
Tutti i progetti funzionano **senza server**.

---

## 👨‍💻 Per sviluppatori

- Tutte le funzioni JavaScript sono documentate con **JSDoc**.
- I file JS seguono la convenzione `numero-funzionalità-versione.js`.
- Commit organizzati secondo [Conventional Commits](https://www.conventionalcommits.org/it/v1.0.0/).
- Nessuna dipendenza esterna: solo HTML, CSS, JS puro.

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
