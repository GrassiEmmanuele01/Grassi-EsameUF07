/**
 * Variabili globali per il timer personalizzato.
 */
let customTimerInterval;
let customTimerRemaining = 0;

/**
 * Avvia il timer personalizzato.
 */
function startCustomTimer() {
  const input = document.getElementById("customTimerInput");
  const timeInSeconds = parseInt(input.value, 10);

  if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
    alert("Inserisci un tempo valido in secondi.");
    return;
  }

  customTimerRemaining = timeInSeconds;
  updateCustomTimerDisplay();

  clearInterval(customTimerInterval);
  customTimerInterval = setInterval(() => {
    if (customTimerRemaining <= 0) {
      clearInterval(customTimerInterval);
      alert("Tempo scaduto!"); // Puoi sostituire con un suono o una notifica
      return;
    }
    customTimerRemaining--;
    updateCustomTimerDisplay();
  }, 1000);
}

/**
 * Aggiorna il display del timer personalizzato.
 */
function updateCustomTimerDisplay() {
  const minutes = Math.floor(customTimerRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (customTimerRemaining % 60).toString().padStart(2, "0");
  document.getElementById(
    "customTimerDisplay"
  ).textContent = `${minutes}:${seconds}`;
}