let timerInterval;
let seconds = 0;

/**
 * Aggiorna lo stato dei pulsanti Start, Stop e Reset in base allo stato del timer.
 */
function updateButtonStates() {
  const startBtn = document.querySelector(".btn-start");
  const stopBtn = document.querySelector(".btn-stop");
  const resetBtn = document.querySelector(".btn-reset");

  if (timerInterval) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = seconds === 0;
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
