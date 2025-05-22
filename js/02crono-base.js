let timerInterval;
let seconds = 0;

let savedTimes = JSON.parse(localStorage.getItem("savedTimesBase")) || [];
let deletedTimes = JSON.parse(localStorage.getItem("deletedTimesBase")) || [];

const startBtn = document.querySelector(".btn-start");
const stopBtn = document.querySelector(".btn-stop");
const resetBtn = document.querySelector(".btn-reset");
const saveBtn = document.querySelector(".btn-lap");

/**
 * Salva i dati dei tempi salvati e dei tempi eliminati nel localStorage.
 */
function saveToLocalStorage() {
  localStorage.setItem("savedTimesBase", JSON.stringify(savedTimes));
  localStorage.setItem("deletedTimesBase", JSON.stringify(deletedTimes));
}

/**
 * Aggiorna lo stato dei pulsanti Start, Stop, Reset e Salva tempo
 * in base allo stato attuale del cronometro.
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
    saveBtn.disabled = seconds === 0;
  }
}

/**
 * Avvia il cronometro incrementando i secondi ogni secondo.
 * Aggiorna la visualizzazione e lo stato dei pulsanti.
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
 * Reimposta il cronometro a zero, aggiorna la visualizzazione
 * e lo stato dei pulsanti.
 */
function resetTimer() {
  stopTimer();
  seconds = 0;
  updateTimer();

  updateButtonStates();
}

/**
 * Salva il tempo corrente del cronometro con un nome e la data.
 * Chiede all'utente un nome per il tempo salvato.
 * Aggiorna la lista dei tempi salvati e il localStorage.
 */
function saveTime() {
  if (seconds === 0) return;

  const currentTime = formatTime(seconds);
  const name = prompt("Inserisci un nome per questo tempo:", "Sessione");

  const displayName = name && name.trim() !== "" ? name.trim() : "Senza nome";

  const currentDate = new Date().toLocaleString();

  const savedEntry = {
    name: displayName,
    time: currentTime,
    date: currentDate,
  };
  savedTimes.push(savedEntry);

  saveToLocalStorage();

  updateSavedTimesList();

  document.getElementById("savedTimesContainer").classList.remove("hidden");

  saveBtn.disabled = true;
}

/**
 * Converte un numero di secondi nel formato mm:ss.
 * @param {number} totalSeconds - Numero totale di secondi.
 * @returns {string} Il tempo formattato come mm:ss.
 */
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

/**
 * Aggiorna la lista degli storici tempi salvati nella pagina,
 * mostrando nome, tempo, data e pulsante di eliminazione.
 */
function updateSavedTimesList() {
  const list = document.getElementById("savedTimesList");
  list.innerHTML = "";

  savedTimes.forEach((entry, index) => {
    const listItem = document.createElement("li");

    const nameColumn = document.createElement("span");
    nameColumn.className = "column name";
    nameColumn.textContent = entry.name;

    const timeColumn = document.createElement("span");
    timeColumn.className = "column time";
    timeColumn.textContent = entry.time;

    const dateColumn = document.createElement("span");
    dateColumn.className = "column date";
    dateColumn.textContent = entry.date;

    const actionsColumn = document.createElement("span");
    actionsColumn.className = "column actions";
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Elimina";
    deleteButton.onclick = () => deleteSavedTime(index);
    actionsColumn.appendChild(deleteButton);

    listItem.appendChild(nameColumn);
    listItem.appendChild(timeColumn);
    listItem.appendChild(dateColumn);
    listItem.appendChild(actionsColumn);

    list.appendChild(listItem);
  });
}

/**
 * Elimina un tempo salvato dalla lista e lo aggiunge alla lista dei tempi eliminati.
 * Aggiorna il localStorage e la visualizzazione della lista.
 * @param {number} index - Indice del tempo da eliminare.
 */
function deleteSavedTime(index) {
  if (index >= 0 && index < savedTimes.length) {
    const [deletedEntry] = savedTimes.splice(index, 1);
    deletedTimes.push(deletedEntry);

    saveToLocalStorage();

    updateSavedTimesList();
  }
}

updateSavedTimesList();

/**
 * Aggiorna la visualizzazione del timer nel formato mm:ss,
 * mostrando i minuti e i secondi correnti nell'elemento con id "timer".
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
