let timerInterval;
let seconds = 0;

let savedTimes = JSON.parse(localStorage.getItem("savedTimesBase")) || [];
let deletedTimes = JSON.parse(localStorage.getItem("deletedTimesBase")) || [];

// Riferimenti ai pulsanti
const startBtn = document.querySelector(".btn-start");
const stopBtn = document.querySelector(".btn-stop");
const resetBtn = document.querySelector(".btn-reset");
const saveBtn = document.querySelector(".btn-lap"); 

/**
 * Salva i dati nel localStorage.
 */
function saveToLocalStorage() {
  localStorage.setItem("savedTimesBase", JSON.stringify(savedTimes));
  localStorage.setItem("deletedTimesBase", JSON.stringify(deletedTimes));
}

/**
 * Aggiorna lo stato dei pulsanti Start, Stop, Reset e Salva tempo.
 */
function updateButtonStates() {
  if (timerInterval) {
    // Cronometro in esecuzione
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;
    saveBtn.disabled = true; // Disabilita "Salva tempo"
  } else {
    // Cronometro fermo
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = seconds === 0;

    // Abilita "Salva tempo" solo se ci sono secondi salvati
    saveBtn.disabled = seconds === 0;
  }
}

/**
 * Avvia il cronometro.
 */
function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);

  updateButtonStates();
}

/**
 * Ferma il cronometro e aggiorna lo stato dei pulsanti.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  updateButtonStates();
}

/**
 * Reimposta il cronometro a zero e aggiorna la visualizzazione.
 */
function resetTimer() {
  stopTimer();
  seconds = 0;
  updateTimer();

  updateButtonStates();
}

/**
 * Salva il tempo corrente nel cronometro.
 */
function saveTime() {
  if (seconds === 0) return; // Non salvare se il timer è a zero

  const currentTime = formatTime(seconds); // Ottieni il tempo formattato
  savedTimes.push(currentTime); // Aggiungi il tempo all'array

  // Salva i dati nel localStorage
  saveToLocalStorage();

  // Aggiorna la visualizzazione dello storico
  updateSavedTimesList();


  // Disabilita il pulsante "Salva tempo"
  saveBtn.disabled = true;
}

/**
 * Formatta il tempo in formato mm:ss.
 */
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

/**
 * Aggiorna la lista degli storici tempi salvati.
 */
function updateSavedTimesList() {
  const list = document.getElementById("savedTimesList");
  list.innerHTML = ""; // Pulisce la lista

  savedTimes.forEach((time, index) => {
    const listItem = document.createElement("li");

    // Testo del tempo
    const timeText = document.createElement("span");
    timeText.textContent = `#${index + 1}: ${time}`;

    // Pulsante "Elimina"
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Elimina";
    deleteButton.onclick = () => deleteSavedTime(index);

    // Aggiungi al listItem
    listItem.appendChild(timeText);
    listItem.appendChild(deleteButton);

    // Aggiungi alla lista
    list.appendChild(listItem);
  });
}

/**
 * Elimina un tempo salvato.
 */
function deleteSavedTime(index) {
  if (index >= 0 && index < savedTimes.length) {
    const [deletedTime] = savedTimes.splice(index, 1); // Rimuove il tempo dall'array
    deletedTimes.push(deletedTime); // Aggiunge il tempo eliminato all'array deletedTimes

    // Salva i dati nel localStorage
    saveToLocalStorage();

    // Aggiorna la visualizzazione dello storico
    updateSavedTimesList();
  }
}

// Carica i tempi salvati dal localStorage all'avvio della pagina
updateSavedTimesList();

/**
 * Aggiorna la visualizzazione del timer nel formato mm:ss.
 */
function updateTimer() {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  document.getElementById(
    "timer"
  ).textContent = `${minutes}:${remainingSeconds}`;
}
