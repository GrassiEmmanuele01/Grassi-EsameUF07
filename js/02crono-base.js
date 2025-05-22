let timerInterval;
let seconds = 0;
let savedTimes = []; 
let canSaveTime = false; 

// Riferimenti ai pulsanti
const startBtn = document.querySelector(".btn-start");
const stopBtn = document.querySelector(".btn-stop");
const resetBtn = document.querySelector(".btn-reset");
const saveBtn = document.querySelector(".btn-lap"); 

/**
 * Aggiorna lo stato dei pulsanti Start, Stop, Reset e Salva tempo.
 */
function updateButtonStates() {
  if (timerInterval) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;
    saveBtn.disabled = true;
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = seconds === 0;

    saveBtn.disabled = !canSaveTime || seconds === 0;
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

  canSaveTime = false;

  updateButtonStates();
}

/**
 * Ferma il cronometro e aggiorna lo stato dei pulsanti.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  canSaveTime = true;

  updateButtonStates();
}

/**
 * Reimposta il cronometro a zero e aggiorna la visualizzazione.
 */
function resetTimer() {
  stopTimer();
  seconds = 0;
  updateTimer();

  canSaveTime = false;

  updateButtonStates();
}

/**
 * Salva il tempo corrente nel cronometro.
 */
function saveTime() {
  if (!canSaveTime || seconds === 0) return; 

  const currentTime = formatTime(seconds); 
  savedTimes.push(currentTime); 

  updateSavedTimesList();

  document.getElementById("savedTimesContainer").classList.remove("hidden");
  document.getElementById("savedTimesContainer").classList.add("container");

  canSaveTime = false;

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
  list.innerHTML = "";

  savedTimes.forEach((time, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `#${index + 1}: ${time}`;
    list.appendChild(listItem);
  });
}

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
