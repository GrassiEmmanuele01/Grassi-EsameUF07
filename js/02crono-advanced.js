/**
 * Variabili globali per gestire il cronometro principale.
 */
let timerInterval;
let startTime = null;
let lapStartTime = null;
let totalElapsedTime = 0;
let hasRunAtLeastOnce = false;
const laps = [];
let savedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
let sortOrder = {};

/**
 * Variabili globali per il timer personalizzato.
 */
let customTimerInterval;
let customTimerRemaining = 0;

/**
 * Aggiorna lo stato dei pulsanti in base allo stato del cronometro.
 */
function updateButtonStates() {
  const startBtn = document.querySelector(".btn-start");
  const stopBtn = document.querySelector(".btn-stop");
  const resetBtn = document.querySelector(".btn-reset");
  const lapBtn = document.querySelector(".btn-lap");
  const endBtn = document.querySelector(".btn-end");
  const saveBtn = document.querySelector(".btn-save");
  if (timerInterval) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    lapBtn.disabled = false;
    endBtn.disabled = false;
    resetBtn.disabled = true;
    saveBtn.disabled = true;
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;
    endBtn.disabled = true;
    const raceSummaryVisible = !document
      .getElementById("raceSummary")
      .classList.contains("hidden");
    resetBtn.disabled = !(
      laps.length > 0 ||
      raceSummaryVisible ||
      hasRunAtLeastOnce
    );
    saveBtn.disabled = !raceSummaryVisible;
  }
}

/**
 * Avvia il cronometro principale.
 */
function startTimer() {
  if (timerInterval) return;
  hasRunAtLeastOnce = true;
  if (!document.getElementById("raceSummary").classList.contains("hidden")) {
    resetTimer();
  }
  if (!startTime) {
    startTime = Date.now();
    lapStartTime = startTime;
  } else {
    lapStartTime = Date.now() - (Date.now() - lapStartTime);
  }
  timerInterval = setInterval(() => {
    const now = Date.now();
    totalElapsedTime = now - startTime;
    const currentLapTime = now - lapStartTime;
    updateTimer(totalElapsedTime);
    updateLapTimer(currentLapTime);
  }, 10);
  updateButtonStates();
}

/**
 * Ferma il cronometro principale.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  updateButtonStates();
}

/**
 * Resetta il cronometro principale.
 */
function resetTimer() {
  stopTimer();
  startTime = null;
  lapStartTime = null;
  totalElapsedTime = 0;
  hasRunAtLeastOnce = false;
  updateTimer(0);
  updateLapTimer(0);
  document.getElementById("totalTimeDisplay").textContent = "00:00:000";
  document.getElementById("bestLap").textContent = "--:--:---";
  document.getElementById("lapsList").innerHTML = "";
  document.getElementById("raceSummary").classList.add("hidden");
  document.getElementById("summaryDetails").innerHTML = "";
  laps.length = 0;
  updateButtonStates();
}

/**
 * Salva un giro nel cronometro principale.
 */
function saveLap() {
  const now = Date.now();
  const lapTime = now - lapStartTime;
  if (lapTime <= 0) return;
  laps.push(lapTime);
  lapStartTime = now;
  renderLaps();
}

/**
 * Termina la corsa e mostra il riepilogo.
 */
function endRace() {
  saveLap();
  stopTimer();
  const summary = calculateRaceSummary();
  const summaryDetails = document.getElementById("summaryDetails");
  summaryDetails.innerHTML = `
        <li><strong>Giri Totali:</strong> ${summary.totalLaps}</li>
        <li><strong>Tempo Totale:</strong> ${formatTime(summary.totalTime)}</li>
        <li><strong>Miglior Giro:</strong> ${formatTime(summary.bestLap)}</li>
        <li><strong>Peggior Giro:</strong> ${formatTime(summary.worstLap)}</li>
        <li><strong>Media Giri:</strong> ${formatTime(
          Math.ceil(summary.averageLap)
        )}</li>
    `;
  document.getElementById("raceSummary").classList.remove("hidden");
  updateButtonStates();
  const saveBtn = document.querySelector(".btn-save");
  saveBtn.disabled = false;
  saveBtn.onclick = () => {
    saveSessionManually();
    saveBtn.disabled = true;
  };
}

/**
 * Calcola il riepilogo della corsa.
 * @returns {Object} Oggetto contenente i dettagli della corsa.
 */
function calculateRaceSummary() {
  if (laps.length === 0) return {};
  const totalLaps = laps.length;
  const totalTime = laps.reduce((sum, t) => sum + t, 0);
  const bestLap = Math.min(...laps);
  const worstLap = Math.max(...laps);
  const averageLap = totalTime / totalLaps;
  return { totalLaps, totalTime, bestLap, worstLap, averageLap };
}

/**
 * Aggiorna il display del cronometro principale.
 * @param {number} ms - Tempo in millisecondi.
 */
function updateTimer(ms) {
  document.getElementById("timer").textContent = formatTime(ms);
}

/**
 * Aggiorna il display del tempo del giro corrente.
 * @param {number} ms - Tempo in millisecondi.
 */
function updateLapTimer(ms) {
  document.getElementById("lapTime").textContent = formatTime(ms);
}

/**
 * Formatta il tempo in millisecondi nel formato mm:ss:ms.
 * @param {number} ms - Millisecondi totali.
 * @returns {string} Tempo formattato.
 */
function formatTime(ms) {
  if (isNaN(ms) || ms < 0) return "00:00:000";
  const minutes = Math.floor(ms / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const milliseconds = (ms % 1000).toString().padStart(3, "0");
  return `${minutes}:${seconds}:${milliseconds}`;
}

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