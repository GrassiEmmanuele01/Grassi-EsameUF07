let timerInterval;
let startTime = null;
let lapStartTime = null;
let totalElapsedTime = 0;
let hasRunAtLeastOnce = false;

const laps = [];

/**
 * Aggiorna lo stato dei pulsanti in base allo stato del cronometro.
 */
function updateButtonStates() {
  const startBtn = document.querySelector(".btn-start");
  const stopBtn = document.querySelector(".btn-stop");
  const resetBtn = document.querySelector(".btn-reset");
  const lapBtn = document.querySelector(".btn-lap");
  const endBtn = document.querySelector(".btn-end");

  if (timerInterval) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    lapBtn.disabled = false;
    endBtn.disabled = false;
    resetBtn.disabled = true;
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
  }
}

/**
 * Avvia il cronometro. Se è già in corso una corsa precedente, la resetta.
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
 * Ferma il cronometro e aggiorna lo stato dei pulsanti.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  updateButtonStates();
}

/**
 * Reimposta il cronometro e la visualizzazione.
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
 * Salva il tempo del giro corrente e aggiorna la lista dei giri.
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
 * Termina la corsa, mostra il riepilogo e ferma il cronometro.
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
}

/**
 * Calcola i dati riepilogativi della corsa.
 * @returns {Object} Oggetto con totalLaps, totalTime, bestLap, worstLap, averageLap.
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
 * Aggiorna la visualizzazione del timer principale.
 * @param {number} ms - Millisecondi trascorsi.
 */
function updateTimer(ms) {
  document.getElementById("timer").textContent = formatTime(ms);
}

/**
 * Aggiorna la visualizzazione del timer del giro corrente.
 * @param {number} ms - Millisecondi del giro.
 */
function updateLapTimer(ms) {
  document.getElementById("lapTime").textContent = formatTime(ms);
}

/**
 * Aggiorna la lista dei giri e i dati riepilogativi.
 */
function renderLaps() {
  const lapsList = document.getElementById("lapsList");
  lapsList.innerHTML = "";

  if (laps.length === 0) return;

  const totalTime = laps.reduce((sum, t) => sum + t, 0);
  document.getElementById("totalTimeDisplay").textContent =
    formatTime(totalTime);

  const bestLap = Math.min(...laps);
  document.getElementById("bestLap").textContent = formatTime(bestLap);

  laps.forEach((lapTime, index) => {
    const formattedTime = formatTime(lapTime);
    const lapItem = document.createElement("div");
    lapItem.className = "lap-item";

    if (lapTime === bestLap) {
      lapItem.classList.add("best-lap");
    }

    lapItem.textContent = `Giro ${index + 1}: ${formattedTime}`;
    lapsList.appendChild(lapItem);
  });
}

/**
 * Formatta i millisecondi nel formato mm:ss:ms.
 * @param {number} ms - Millisecondi.
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
