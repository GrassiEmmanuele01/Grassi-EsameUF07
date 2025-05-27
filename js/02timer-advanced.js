/**
 * Variabili globali per il Timer Personalizzato.
 */
let customTimerInterval;
let customTimerRemaining = 0;
let customTimerPaused = false;

/**
 * Variabili globali per la Modalità Pomodoro.
 */
let pomodoroInterval;
let isWorkTime = true;
let remainingTime = 0;
let pomodoroCycle = 0;
let pomodoroPaused = false;

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

/**
 * Mette in pausa o riprende il timer personalizzato.
 */
function toggleCustomPauseResume() {
  if (!customTimerInterval && !customTimerRemaining) return;

  if (customTimerPaused) {
    // Riprendi il timer
    customTimerInterval = setInterval(() => {
      if (customTimerRemaining <= 0) {
        clearInterval(customTimerInterval);
        alert("Tempo scaduto!"); // Puoi sostituire con un suono
        return;
      }
      customTimerRemaining--;
      updateCustomTimerDisplay();
    }, 1000);
    customTimerPaused = false;
  } else {
    // Metti in pausa il timer
    clearInterval(customTimerInterval);
    customTimerInterval = null;
    customTimerPaused = true;
  }
  updateCustomButtonStates();
}

/**
 * Resetta il timer personalizzato.
 */
function resetCustomTimer() {
  clearInterval(customTimerInterval);
  customTimerInterval = null;
  customTimerRemaining = 0;
  customTimerPaused = false;
  updateCustomTimerDisplay();
  updateCustomButtonStates();
}

/**
 * Aggiorna lo stato dei pulsanti del timer personalizzato.
 */
function updateCustomButtonStates() {
  const startBtn = document.querySelector(
    "#custom-timer-section button.btn-start"
  );
  const pauseBtn = document.querySelector(
    "#custom-timer-section button.btn-pause-resume"
  );
  const resetBtn = document.querySelector(
    "#custom-timer-section button.btn-reset"
  );

  if (customTimerInterval) {
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    pauseBtn.textContent = customTimerPaused ? "Riprendi" : "Pausa";
    resetBtn.disabled = false;
  } else {
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    resetBtn.disabled = customTimerRemaining === 0;
  }
}

/**
 * Avvia la modalità Pomodoro.
 */
function startPomodoro() {
  const workDuration = 25 * 60; // 25 minuti in secondi
  const breakDuration = 5 * 60; // 5 minuti in secondi

  remainingTime = workDuration;
  pomodoroCycle++;

  clearInterval(pomodoroInterval);
  pomodoroInterval = setInterval(() => {
    if (remainingTime <= 0) {
      if (isWorkTime) {
        alert("Tempo di pausa!"); // Puoi sostituire con un suono
        remainingTime = breakDuration;
      } else {
        alert("Ritorna al lavoro!"); // Puoi sostituire con un suono
        remainingTime = workDuration;
        pomodoroCycle++;
      }
      isWorkTime = !isWorkTime;
    }
    remainingTime--;
    updatePomodoroDisplay(remainingTime, isWorkTime);
  }, 1000);

  updatePomodoroDisplay(remainingTime, isWorkTime);
}

/**
 * Aggiorna il display della modalità Pomodoro.
 * @param {number} remainingTime - Tempo rimanente in secondi.
 * @param {boolean} isWorkTime - Indica se è tempo di lavoro o pausa.
 */
function updatePomodoroDisplay(remainingTime, isWorkTime) {
  const minutes = Math.floor(remainingTime / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingTime % 60).toString().padStart(2, "0");
  const status = isWorkTime ? "Lavoro" : "Pausa";
  document.getElementById("pomodoroStatus").innerHTML = `
        <strong>${status}</strong>: ${minutes}:${seconds} (Ciclo ${pomodoroCycle})
    `;
}

/**
 * Mette in pausa o riprende la modalità Pomodoro.
 */
function togglePomodoroPauseResume() {
  if (!pomodoroInterval) return;

  if (pomodoroPaused) {
    // Riprendi il timer
    pomodoroInterval = setInterval(() => {
      if (remainingTime <= 0) {
        if (isWorkTime) {
          alert("Tempo di pausa!"); // Puoi sostituire con un suono
          remainingTime = 5 * 60;
        } else {
          alert("Ritorna al lavoro!"); // Puoi sostituire con un suono
          remainingTime = 25 * 60;
          pomodoroCycle++;
        }
        isWorkTime = !isWorkTime;
      }
      remainingTime--;
      updatePomodoroDisplay(remainingTime, isWorkTime);
    }, 1000);
    pomodoroPaused = false;
  } else {
    // Metti in pausa il timer
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroPaused = true;
  }
  updatePomodoroButtonStates();
}

/**
 * Resetta la modalità Pomodoro.
 */
function resetPomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  isWorkTime = true;
  remainingTime = 0;
  pomodoroCycle = 0;
  pomodoroPaused = false;
  document.getElementById("pomodoroStatus").textContent = "In attesa...";
  updatePomodoroButtonStates();
}

/**
 * Aggiorna lo stato dei pulsanti della modalità Pomodoro.
 */
function updatePomodoroButtonStates() {
  const startBtn = document.querySelector("#pomodoro-section button.btn-start");
  const pauseBtn = document.querySelector(
    "#pomodoro-section button.btn-pause-resume"
  );
  const resetBtn = document.querySelector("#pomodoro-section button.btn-reset");

  if (pomodoroInterval) {
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    pauseBtn.textContent = pomodoroPaused ? "Riprendi" : "Pausa";
    resetBtn.disabled = false;
  } else {
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    resetBtn.disabled = true;
  }
}
