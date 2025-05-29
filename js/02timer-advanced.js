// Variabili globali per il Timer Personalizzato
let customTimerInterval;
let customTimerRemaining = 0;
let customTimerPaused = false;

// Variabili globali per la Modalità Pomodoro
let pomodoroInterval;
let isWorkTime = true;
let remainingTime = 0;
let pomodoroCycle = 0;
let pomodoroPaused = false;
let upcomingCycles = [];

// Variabili per il Task Manager
const tasks = [];

/**
 * Aggiunge un task alla lista.
 */
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskName = taskInput.value.trim();
  if (!taskName) return;
  tasks.push({ name: taskName, completed: false });
  taskInput.value = "";
  renderTasks();
}

/**
 * Renderizza i task aggiunti.
 */
function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
          <span>${task.name}</span>
          <button onclick="completeTask(${index})">Completato</button>
        `;
    taskList.appendChild(li);
  });
}

/**
 * Contrassegna un task come completato.
 */
function completeTask(index) {
  tasks[index].completed = true;
  renderTasks();
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
      notifyUser("Tempo scaduto!");
      document.getElementById("customTimerDisplay").classList.remove("warning");
      return;
    }
    if (customTimerRemaining <= 10) {
      document.getElementById("customTimerDisplay").classList.add("warning");
    } else {
      document.getElementById("customTimerDisplay").classList.remove("warning");
    }
    customTimerRemaining--;
    updateCustomTimerDisplay();
  }, 1000);
  updateCustomButtonStates();
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
    customTimerInterval = setInterval(() => {
      if (customTimerRemaining <= 0) {
        clearInterval(customTimerInterval);
        notifyUser("Tempo scaduto!");
        document
          .getElementById("customTimerDisplay")
          .classList.remove("warning");
        return;
      }
      if (customTimerRemaining <= 10) {
        document.getElementById("customTimerDisplay").classList.add("warning");
      } else {
        document
          .getElementById("customTimerDisplay")
          .classList.remove("warning");
      }
      customTimerRemaining--;
      updateCustomTimerDisplay();
    }, 1000);
    customTimerPaused = false;
  } else {
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
  document.getElementById("customTimerDisplay").classList.remove("warning");
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
  const workDuration =
    parseInt(document.getElementById("workDuration").value, 10) * 60;
  const shortBreakDuration =
    parseInt(document.getElementById("shortBreakDuration").value, 10) * 60;
  const longBreakDuration =
    parseInt(document.getElementById("longBreakDuration").value, 10) * 60;
  const cyclesBeforeLongBreak = parseInt(
    document.getElementById("cyclesBeforeLongBreak").value,
    10
  );

  if (
    isNaN(workDuration) ||
    isNaN(shortBreakDuration) ||
    isNaN(longBreakDuration) ||
    workDuration <= 0 ||
    shortBreakDuration <= 0 ||
    longBreakDuration <= 0
  ) {
    alert("Inserisci durate valide per lavoro, pausa breve e pausa lunga.");
    return;
  }

  upcomingCycles = [];
  for (let i = 0; i < cyclesBeforeLongBreak; i++) {
    upcomingCycles.push({ type: "Lavoro", duration: workDuration });
    upcomingCycles.push({ type: "Pausa Breve", duration: shortBreakDuration });
  }
  upcomingCycles.push({ type: "Pausa Lunga", duration: longBreakDuration });
  renderUpcomingCycles();
  startNextPomodoroCycle();
}

/**
 * Avvia il prossimo ciclo Pomodoro.
 */
function startNextPomodoroCycle() {
  if (upcomingCycles.length === 0) {
    notifyUser("Hai completato tutti i cicli Pomodoro!");
    resetPomodoro();
    return;
  }
  const nextCycle = upcomingCycles.shift();
  isWorkTime = nextCycle.type === "Lavoro";
  remainingTime = nextCycle.duration;
  pomodoroCycle++;
  document.getElementById("pomodoroStatus").style.backgroundColor = isWorkTime
    ? "#ff4d4d"
    : nextCycle.type === "Pausa Breve"
    ? "#4da6ff"
    : "#2ecc71";
  clearInterval(pomodoroInterval);
  pomodoroInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(pomodoroInterval);
      notifyUser(`${isWorkTime ? "Tempo di pausa!" : "Ritorna al lavoro!"}`);
      startNextPomodoroCycle();
      return;
    }
    if (remainingTime <= 10) {
      document.getElementById("pomodoroStatus").classList.add("warning");
    } else {
      document.getElementById("pomodoroStatus").classList.remove("warning");
    }
    remainingTime--;
    updatePomodoroDisplay(remainingTime, isWorkTime);
    updateProgressIndicator(remainingTime, nextCycle.duration);
  }, 1000);
  updatePomodoroDisplay(remainingTime, isWorkTime);
  renderUpcomingCycles();
}

/**
 * Aggiorna il display della modalità Pomodoro.
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
 * Renderizza i prossimi cicli Pomodoro.
 */
function renderUpcomingCycles() {
  const cycleList = document.getElementById("cycleList");
  cycleList.innerHTML = "";
  upcomingCycles.forEach((cycle, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}: ${cycle.type} (${Math.ceil(
      cycle.duration / 60
    )} min)`;
    cycleList.appendChild(li);
  });
}

/**
 * Mette in pausa o riprende la modalità Pomodoro.
 */
function togglePomodoroPauseResume() {
  if (!pomodoroInterval) return;
  if (pomodoroPaused) {
    pomodoroInterval = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(pomodoroInterval);
        notifyUser(`${isWorkTime ? "Tempo di pausa!" : "Ritorna al lavoro!"}`);
        startNextPomodoroCycle();
        return;
      }
      if (remainingTime <= 10) {
        document.getElementById("pomodoroStatus").classList.add("warning");
      } else {
        document.getElementById("pomodoroStatus").classList.remove("warning");
      }
      remainingTime--;
      updatePomodoroDisplay(remainingTime, isWorkTime);
    }, 1000);
    pomodoroPaused = false;
  } else {
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
  upcomingCycles = [];
  document.getElementById("pomodoroStatus").textContent = "In attesa...";
  document.getElementById("cycleList").innerHTML = "";
  document.getElementById("pomodoroStatus").style.backgroundColor = "#ffffff";
  document.getElementById("pomodoroStatus").classList.remove("warning");
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

/**
 * Aggiorna l'indicatore visivo del progresso.
 */
function updateProgressIndicator(remainingTime, totalTime) {
  const progressCircle = document.getElementById("progress-circle");
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (remainingTime / totalTime) * circumference;
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${offset}`;
}

/**
 * Invia notifiche desktop all'utente.
 */
function notifyUser(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}