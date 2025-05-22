// Variabili globali
let timerInterval;
let startTime = null;
let lapStartTime = null;
let totalElapsedTime = 0;
let hasRunAtLeastOnce = false;

const laps = [];
let savedSessions = JSON.parse(localStorage.getItem("sessions")) || [];

let sortOrder = {}; // Tieni traccia dell'ordine corrente (ascendente/descendente)

/**
 * Formatta i millisecondi nel formato MM:SS:MMM.
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
 * Salva manualmente una sessione.
 */
function saveSessionManually() {
  const sessionName = prompt("Inserisci un nome per la sessione:");
  if (sessionName) {
    saveSessionToHistory(sessionName);
  }
}

/**
 * Salva una nuova sessione nel localStorage.
 */
function saveSessionToHistory(name) {
  const session = {
    name,
    date: new Date().toISOString(),
    totalTime: formatTime(totalElapsedTime), // Formattato come MM:SS:MMM
    totalTimeMs: totalElapsedTime, // Valore numerico in millisecondi per l'ordinamento
    laps: laps.map((lap) => formatTime(lap)),
    bestLap: formatTime(Math.min(...laps)),
    totalLaps: laps.length,
  };

  savedSessions.push(session);
  localStorage.setItem("sessions", JSON.stringify(savedSessions));
  renderSavedSessions();
}

/**
 * Renderizza le sessioni salvate in una tabella.
 */
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
                <button class="view" onclick="viewSessionDetails(${index})">Visualizza</button>
                <button class="delete" onclick="deleteSession(${index})">Elimina</button>
            </td>
        `;

    list.appendChild(row);
  });
}

/**
 * Ordina le sessioni in base alla colonna selezionata.
 */
function sortSessions(column) {
  let sortedSessions = [...savedSessions];

  // Cambia l'ordine (ascendente o discendente)
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

  // Rimuovi tutte le classi di ordinamento precedenti
  document.querySelectorAll("#sessionsTable th").forEach((th) => {
    th.classList.remove("asc", "desc");
  });

  // Aggiungi la classe di ordinamento corrente
  const clickedHeader = document.querySelector(
    `#sessionsTable th[onclick="sortSessions('${column}')"]`
  );
  clickedHeader.classList.add(sortOrder[column]);

  renderSavedSessions(sortedSessions);
}

/**
 * Gestisce la ricerca delle sessioni (solo per nome).
 */
document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = savedSessions.filter((session) =>
    session.name.toLowerCase().includes(query)
  );
  renderSavedSessions(filtered);
});

/**
 * Converte un tempo formattato in millisecondi.
 */
function parseTime(time) {
  const [minutes, seconds, milliseconds] = time.split(":").map(Number);
  return minutes * 60000 + seconds * 1000 + milliseconds;
}
/**
 * Visualizza i dettagli di una sessione.
 */
function viewSessionDetails(index) {
  const session = savedSessions[index];

  // Crea un elenco numerato per i tempi dei giri
  const lapsList = session.laps.map((lap, idx) => {
      return `Giro ${idx + 1}: ${lap} \n`;
  }).join("");

  alert(`
      Dettagli Sessione:
      Nome: ${session.name}
      Data: ${new Date(session.date).toLocaleString()}
      Tempo Totale: ${session.totalTime}
      Giri Totali: ${session.totalLaps}
      Miglior Giro: ${session.bestLap}

      Tempi Giri:
          ${lapsList}
  `);
}
// Inizializza la pagina
renderSavedSessions();
updateButtonStates();
/* 
La lista dei giri deve essere ordinata e facile da leggere, con i migliori giri evidenziati in modo chiaro. Il riepilogo della corsa e lo storico delle sessioni devono essere ben strutturati e facili da navigare. Di default sono ordinati per tempo migliore ma l'utente può scegliere di ordinarli per data o per nome o per giro migliore. Implementa anche un sistema di salvataggio delle sessioni in locale, in modo che l'utente possa visualizzare le sessioni salvate anche dopo aver chiuso il browser. ci deve essere anche un sistema di ricerca per nome o per data e un modo per eliminare le sessioni salvate.
Inoltre voglio un modo per scaricare un file con i dati della sessione salvata in formato JSON, in modo che l'utente possa importare i dati in un altro sistema o semplicemente conservarli per un uso futuro. ci deve essere anche un modo per caricare un file JSON con i dati di una sessione salvata, in modo che l'utente possa importare i dati in questo sistema. deve esserci anche un modo per visualizzare i dati della sessione salvata in un formato leggibile, in modo che l'utente possa vedere i dettagli della sessione senza dover aprire il file JSON.
ci deve essere anche un modo per eliminare una sessione salvata, in modo che l'utente possa rimuovere le sessioni che non gli servono più. 
il foglio di stile è in condivisione con il cronometro semplice, quindi non modificare le cose inutilizzate.
nello storico delle sessioni voglio che si veda il nome della sessione, la data e l'ora in cui è stata salvata, il tempo totale, il numero di giri e il miglior giro. nele esportazioni ci devono essere anche i giri salvati, in modo che l'utente possa vedere i dettagli della sessione senza dover aprire il file JSON.
mi piacerebbe anche un modo per visualizzare i dati della sessione salvata in un formato leggibile, in modo che l'utente possa vedere i dettagli della sessione senza dover aprire il file JSON.

Il bottone di avvio deve essere disabilitato quando il cronometro è in esecuzione e il pulsante di arresto deve essere disabilitato quando il cronometro è fermo. Il pulsante di reset deve essere disabilitato quando il cronometro è in esecuzione. Il pulsante di giro deve essere disabilitato quando il cronometro è fermo e il pulsante di fine deve essere disabilitato quando il cronometro è in esecuzione. il pulsante di salvataggio deve essere disabilitato quando il cronometro è in esecuzione e deve essere l'unico modo per salvare la sessione. il salvataggio non deve essere automatico, ma deve essere fatto manualmente dall'utente tramite il pulsante di salvataggio.
     */
