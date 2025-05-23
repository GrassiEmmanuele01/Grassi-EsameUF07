let timerInterval;
let startTime = null;
let lapStartTime = null;
let totalElapsedTime = 0;
let hasRunAtLeastOnce = false;
const laps = [];
let savedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
let sortOrder = {};

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

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  updateButtonStates();
}

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

function saveLap() {
  const now = Date.now();
  const lapTime = now - lapStartTime;
  if (lapTime <= 0) return;
  laps.push(lapTime);
  lapStartTime = now;
  renderLaps();
}

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

function calculateRaceSummary() {
  if (laps.length === 0) return {};
  const totalLaps = laps.length;
  const totalTime = laps.reduce((sum, t) => sum + t, 0);
  const bestLap = Math.min(...laps);
  const worstLap = Math.max(...laps);
  const averageLap = totalTime / totalLaps;
  return { totalLaps, totalTime, bestLap, worstLap, averageLap };
}

function updateTimer(ms) {
  document.getElementById("timer").textContent = formatTime(ms);
}

function updateLapTimer(ms) {
  document.getElementById("lapTime").textContent = formatTime(ms);
}

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

function saveSessionManually() {
  let sessionName = prompt("Inserisci un nome per la sessione:", "Sessione");
  if (!sessionName || sessionName.trim() === "") {
    sessionName = "Senza Nome";
  }
  saveSessionToHistory(sessionName);
}

function saveSessionToHistory(name) {
  const session = {
    name,
    date: new Date().toISOString(),
    totalTime: formatTime(totalElapsedTime),
    totalTimeMs: totalElapsedTime,
    laps: laps.map((lap) => formatTime(lap)),
    bestLap: formatTime(Math.min(...laps)),
    totalLaps: laps.length,
  };
  savedSessions.push(session);
  localStorage.setItem("sessions", JSON.stringify(savedSessions));
  renderSavedSessions();
}

function renderSavedSessions(sessions = savedSessions) {
  const list = document.getElementById("savedSessionsList");
  list.innerHTML = "";
  sessions.forEach((session, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${session.name}</td>
            <td>${new Date(session.date).toLocaleString()}</td>
            <td>${session.totalTime}</td>
            <td>${session.totalLaps}</td>
            <td>${session.bestLap}</td>
            <td class="actions">
                <button class="view" onclick="viewSessionDetails(${index})"><i class="fas fa-eye"></i> Visualizza</button>
                <button class="edit" onclick="editSessionName(${index})"><i class="fas fa-edit"></i> Modifica</button><br>
                <button class="delete" onclick="deleteSession(${index})"><i class="fas fa-trash-alt"></i> Elimina</button>
                <button class="download" onclick="downloadSingleSession(${index})"><i class="fas fa-download"></i> Scarica</button>
            </td>
        `;
    list.appendChild(row);
  });
}

function sortSessions(column) {
  let sortedSessions = [...savedSessions];
  if (sortOrder[column] === "asc") {
    sortOrder[column] = "desc";
  } else {
    sortOrder[column] = "asc";
  }
  switch (column) {
    case "name":
      sortedSessions.sort((a, b) =>
        sortOrder[column] === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
      break;
    case "date":
      sortedSessions.sort((a, b) =>
        sortOrder[column] === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
      break;
    case "totalTime":
      sortedSessions.sort((a, b) =>
        sortOrder[column] === "asc"
          ? a.totalTimeMs - b.totalTimeMs
          : b.totalTimeMs - a.totalTimeMs
      );
      break;
    case "totalLaps":
      sortedSessions.sort((a, b) =>
        sortOrder[column] === "asc"
          ? a.totalLaps - b.totalLaps
          : b.totalLaps - a.totalLaps
      );
      break;
    case "bestLap":
      sortedSessions.sort((a, b) =>
        sortOrder[column] === "asc"
          ? parseTime(a.bestLap) - parseTime(b.bestLap)
          : parseTime(b.bestLap) - parseTime(a.bestLap)
      );
      break;
  }
  document.querySelectorAll("#sessionsTable th").forEach((th) => {
    th.classList.remove("asc", "desc");
  });
  const clickedHeader = document.querySelector(
    `#sessionsTable th[onclick="sortSessions('${column}')"]`
  );
  clickedHeader.classList.add(sortOrder[column]);
  renderSavedSessions(sortedSessions);
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = savedSessions.filter((session) =>
    session.name.toLowerCase().includes(query)
  );
  renderSavedSessions(filtered);
});

function parseTime(time) {
  const [minutes, seconds, milliseconds] = time.split(":").map(Number);
  return minutes * 60000 + seconds * 1000 + milliseconds;
}

function viewSessionDetails(index) {
  const session = savedSessions[index];
  const lapsList = session.laps
    .map((lap, idx) => `Giro ${idx + 1}: ${lap}`)
    .join("\n");
  alert(`Dettagli Sessione:
Nome: ${session.name}
Data: ${new Date(session.date).toLocaleString()}
Tempo Totale: ${session.totalTime}
Giri Totali: ${session.totalLaps}
Miglior Giro: ${session.bestLap}
Tempi Giri:\n${lapsList}`);
}

function exportAllSessions() {
  if (savedSessions.length === 0) {
    alert("Non ci sono sessioni salvate da esportare.");
    return;
  }
  const dataStr = JSON.stringify(savedSessions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "session_history.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function deleteSession(index) {
  const isConfirmed = confirm("Sei sicuro di voler eliminare questa sessione?");
  if (isConfirmed) {
    savedSessions.splice(index, 1);
    localStorage.setItem("sessions", JSON.stringify(savedSessions));
    renderSavedSessions();
  }
}

function editSessionName(index) {
  const newName = prompt(
    "Inserisci il nuovo nome per questa sessione:",
    savedSessions[index].name
  );
  if (!newName || newName.trim() === "") {
    savedSessions[index].name = "Senza Nome";
  } else {
    savedSessions[index].name = newName.trim();
  }
  localStorage.setItem("sessions", JSON.stringify(savedSessions));
  renderSavedSessions();
}

function downloadSingleSession(index) {
  const session = savedSessions[index];
  const fileName = `${session.name}_${
    session.date.replace(/[:T]/g, "-").split(".")[0]
  }.json`;
  const blob = new Blob([JSON.stringify(session, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("importSession").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      const importedSessions = Array.isArray(importedData)
        ? importedData
        : [importedData];
      savedSessions = [...savedSessions, ...importedSessions];
      localStorage.setItem("sessions", JSON.stringify(savedSessions));
      renderSavedSessions();
    } catch (error) {
      alert("Errore durante l'importazione del file.");
      console.error("Errore:", error);
    }
  };
  reader.readAsText(file);
});

function handleFileUpload() {
  document.getElementById("importSession").click();
}
