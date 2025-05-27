/**
 * Inizializzazione ID counter e liste
 */
let taskIdCounter =
  parseInt(localStorage.getItem("taskIdCounterAdvanced")) || 1;
let tasks = JSON.parse(localStorage.getItem("tasksAdvanced")) || [];
let deletedTasks =
  JSON.parse(localStorage.getItem("deletedTasksAdvanced")) || [];

/**
 * Salva lo stato corrente delle liste su localStorage.
 */
function saveToLocalStorage() {
  localStorage.setItem("tasksAdvanced", JSON.stringify(tasks));
  localStorage.setItem("deletedTasksAdvanced", JSON.stringify(deletedTasks));
  localStorage.setItem("taskIdCounterAdvanced", taskIdCounter);
}

/**
 * Aggiunge una nuova attività con stato "todo" se il nome è valido.
 */
function addTask() {
  const input = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput"); // Campo per la scadenza
  const prioritySelect = document.getElementById("prioritySelect"); // Campo per la priorità
  const name = input.value.trim();
  const deadline = deadlineInput.value || null; // Scadenza opzionale
  const priority = prioritySelect.value;

  if (!name) {
    alert("Inserisci un nome valido!");
    return;
  }

  tasks.push({
    id: taskIdCounter++,
    name,
    status: "todo",
    priority: priority,
    deadline: deadline,
  });

  filterTasks();
  saveToLocalStorage();
  input.value = "";
  deadlineInput.value = ""; // Resetta il campo della scadenza
}

/**
 * Trova una task per ID in un array di task.
 * @param {Array} taskArray - Array di task.
 * @param {number} taskId - ID della task da trovare.
 * @returns {Object|undefined} La task trovata o undefined.
 */
function findTaskById(taskArray, taskId) {
  return taskArray.find((task) => task.id === taskId);
}

/**
 * Modifica il nome di una attività.
 * @param {number} taskId - ID della task da modificare.
 * @param {string} newName - Nuovo nome della task.
 */
function updateTask(taskId, newName) {
  newName = newName?.trim();
  if (!newName) {
    alert("Il nuovo nome dell'attività non può essere vuoto!");
    return;
  }
  const task = findTaskById(tasks, taskId);
  if (task) {
    task.name = newName.trim();
    filterTasks();
    saveToLocalStorage();
  } else {
    console.error("Attività non trovata con ID:", taskId);
  }
}

/**
 * Cambia lo stato di una attività.
 * @param {number} taskId - ID della task.
 * @param {string} newStatus - Nuovo stato ("todo", "inprogress", "completed").
 */
function changeStatus(taskId, newStatus) {
  const task = findTaskById(tasks, taskId);
  if (task && ["todo", "inprogress", "completed"].includes(newStatus)) {
    task.status = newStatus;
    filterTasks();
    saveToLocalStorage();
  } else {
    console.error(
      "Stato non valido o attività non trovata:",
      taskId,
      newStatus
    );
  }
}

/**
 * Rimuove una attività e la sposta tra gli eliminati.
 * @param {number} taskId - ID della task da rimuovere.
 */
function removeTask(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const removedTask = tasks.splice(taskIndex, 1)[0];
    deletedTasks.push({
      ...removedTask,
      originalStatus: removedTask.status,
      status: "eliminato",
    });
    saveToLocalStorage();
    filterTasks();
  } else {
    console.error("Attività non trovata con ID:", taskId);
  }
}

/**
 * Ripristina una attività dagli eliminati.
 * @param {number} taskId - ID della task eliminata da ripristinare.
 */
function restoreTask(taskId) {
  const taskIndex = deletedTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const restoredTask = deletedTasks.splice(taskIndex, 1)[0];
    restoredTask.status = restoredTask.originalStatus;
    tasks.push(restoredTask);
    saveToLocalStorage();
    filterTasks();
  } else {
    console.error("Attività eliminata non trovata con ID:", taskId);
  }
}

/**
 * Elimina definitivamente una attività dagli eliminati dopo conferma.
 * @param {number} taskId - ID della task da eliminare definitivamente.
 */
function deletePermanently(taskId) {
  if (
    confirm("Sei sicuro di voler rimuovere definitivamente questa attività?")
  ) {
    const taskIndex = deletedTasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      deletedTasks.splice(taskIndex, 1);
      saveToLocalStorage();
      filterTasks();
    } else {
      console.error("Attività eliminata non trovata con ID:", taskId);
    }
  }
}

/**
 * Filtra le attività per stato e ricerca.
 */
function filterTasks() {
  const filterStatus = document.getElementById("filterStatus").value;
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  let filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });
  // Ordina le attività filtrate per priorità
  filteredTasks = sortTasksByPriority(filteredTasks);
  renderTasks(filteredTasks);
}

/**
 * Reimposta i filtri di stato e ricerca.
 */
function resetFilters() {
  document.getElementById("filterStatus").value = "all";
  document.getElementById("searchInput").value = "";
  filterTasks();
}

/**
 * Aggiorna la visualizzazione delle attività filtrate per stato e ricerca.
 * @param {Array} [filteredTasks=tasks] - Lista delle attività da visualizzare.
 */
function renderTasks(filteredTasks = tasks) {
  const todoList = document.getElementById("todoList");
  const inProgressList = document.getElementById("inProgressList");
  const completedList = document.getElementById("completedList");
  const deletedList = document.getElementById("deletedList");

  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  completedList.innerHTML = "";
  deletedList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = `status-${task.status} priority-${task.priority}`;

    // Controlla la scadenza
    const deadlineStatus = checkDeadline(task.deadline);
    let deadlineAlert = "";
    if (deadlineStatus === "near") {
      deadlineAlert = '<span class="deadline-near">❗ Scadenza vicina</span>';
    } else if (deadlineStatus === "overdue") {
      deadlineAlert =
        '<span class="deadline-overdue">⚠️ Scadenza superata</span>';
    }

    listItem.innerHTML = `
    <div class="task-header">
      <strong>${task.name}</strong>
      <span class="priority-label">${formatPriority(task.priority)}</span>
      ${
        task.deadline ? `<span class="deadline">📅 ${task.deadline}</span>` : ""
      }
      ${deadlineAlert}
    </div>
    <div class="button-container">
      <div class="status-buttons">
        ${
          task.status !== "todo"
            ? `<button class="todo" onclick="changeStatus(${task.id}, 'todo')">Da fare ⏳</button>`
            : `<button class="todo disabled" disabled>Da fare ⏳</button>`
        }
        ${
          task.status !== "inprogress"
            ? `<button class="inprogress" onclick="changeStatus(${task.id}, 'inprogress')">In corso 🚀</button>`
            : `<button class="inprogress disabled" disabled>In corso 🚀</button>`
        }
        ${
          task.status !== "completed"
            ? `<button class="completed" onclick="changeStatus(${task.id}, 'completed')">Completata ✅</button>`
            : `<button class="completed disabled" disabled>Completata ✅</button>`
        }
      </div>
      <hr class="separator">
      <div class="action-buttons">
        <div class="action-row">
          <button class="edit-task" onclick="promptUpdate(${
            task.id
          })">Modifica ✏️</button>
          <button class="remove-task" onclick="removeTask(${
            task.id
          })">Rimuovi ❌</button>
        </div>
        <div class="action-row">
          <button class="update-priority" onclick="promptUpdatePriority(${
            task.id
          })">Modifica Priorità ⚡</button>
          <button class="update-deadline" onclick="updateDeadline(${
            task.id
          })">Modifica Scadenza 📅</button>
        </div>
      </div>
    </div>
  `;

    switch (task.status) {
      case "todo":
        todoList.appendChild(listItem);
        break;
      case "inprogress":
        inProgressList.appendChild(listItem);
        break;
      case "completed":
        completedList.appendChild(listItem);
        break;
    }
  });

  // Mostra anche gli eliminati se necessario
  deletedTasks.forEach((task) => {
    const deletedItem = document.createElement("li");
    deletedItem.className = "status-eliminato";
    deletedItem.innerHTML = `
      <span>${task.name} (Eliminato da: ${formatStatus(
      task.originalStatus
    )})</span>
      <span class="priority-label">${formatPriority(task.priority)}</span>
      ${
        task.deadline ? `<span class="deadline">📅 ${task.deadline}</span>` : ""
      }
      <div class="button-row">
        <button class="restore-task" onclick="restoreTask(${
          task.id
        })">Ripristina 🔄</button>
        <button class="delete-permanently" onclick="deletePermanently(${
          task.id
        })">Rimuovi definitivamente 🗑️</button>
      </div>
    `;
    deletedList.appendChild(deletedItem);
  });
}

/**
 * Prompt personalizzato per la modifica del nome di una task.
 * @param {number} taskId - ID della task da modificare.
 */
function promptUpdate(taskId) {
  const task = findTaskById(tasks, taskId);
  if (task) {
    const newName = prompt("Nuovo nome:", task.name);
    if (newName) updateTask(taskId, newName);
  }
}

/**
 * Restituisce la stringa leggibile per lo stato di una task.
 * @param {string} status - Stato della task.
 * @returns {string} Stato leggibile.
 */
function formatStatus(status) {
  switch (status) {
    case "todo":
      return "Da fare";
    case "inprogress":
      return "In corso";
    case "completed":
      return "Completata";
    default:
      return "Sconosciuto";
  }
}

/**
 * Restituisce la stringa leggibile per la priorità di una task.
 * @param {string} priority - Priorità della task.
 * @returns {string} Priorità leggibile.
 */
function formatPriority(priority) {
  switch (priority) {
    case "high":
      return "Alta 🟩";
    case "medium":
      return "Media 🟨";
    case "low":
      return "Bassa 🟥";
    default:
      return "Sconosciuta";
  }
}

/**
 * Controlla lo stato della scadenza di una task.
 * @param {string|null} deadline - Data di scadenza della task.
 * @returns {string} Stato della scadenza ("ok", "near", "overdue").
 */
function checkDeadline(deadline) {
  if (!deadline) return "ok"; // Nessuna scadenza impostata

  const today = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate - today;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24); // Differenza in giorni

  if (daysDiff < 0) return "overdue"; // Scadenza superata
  if (daysDiff <= 3) return "near"; // Scadenza vicina (entro 3 giorni)
  return "ok"; // Scadenza OK
}

/**
 * Ordina le attività in base alla priorità.
 * @param {Array} tasks - Array di task da ordinare.
 * @returns {Array} Array ordinato per priorità.
 */
function sortTasksByPriority(tasks) {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return tasks.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

/**
 * Modifica la priorità di una attività.
 * @param {number} taskId - ID della task da modificare.
 * @param {string} newPriority - Nuova priorità ("high", "medium", "low").
 */
function updatePriority(taskId, newPriority) {
  const task = findTaskById(tasks, taskId);
  if (task && ["high", "medium", "low"].includes(newPriority)) {
    task.priority = newPriority;
    filterTasks();
    saveToLocalStorage();
  } else {
    console.error(
      "Priorità non valida o attività non trovata:",
      taskId,
      newPriority
    );
  }
}

/**
 * Prompt personalizzato per la modifica della priorità di una task.
 * @param {number} taskId - ID della task da modificare.
 */
function promptUpdatePriority(taskId) {
  const task = findTaskById(tasks, taskId);
  if (task) {
    const priorities = ["high", "medium", "low"];
    const priorityNames = ["Alta 🟩", "Media 🟨", "Bassa 🟥"];
    const currentPriorityIndex = priorities.indexOf(task.priority);
    const newPriorityIndex = prompt(
      "Seleziona la nuova priorità:\n1. Alta 🟩\n2. Media 🟨\n3. Bassa 🟥",
      currentPriorityIndex + 1
    );
    const selectedPriority = priorities[newPriorityIndex - 1];
    if (selectedPriority) updatePriority(taskId, selectedPriority);
  }
}

/**
 * Modifica la scadenza di una attività.
 * @param {number} taskId - ID della task da modificare.
 */
function updateDeadline(taskId) {
  const task = findTaskById(tasks, taskId);
  if (task) {
    const newDeadline = prompt(
      "Nuova scadenza (YYYY-MM-DD):",
      task.deadline || ""
    );
    if (newDeadline) {
      task.deadline = newDeadline;
      filterTasks();
      saveToLocalStorage();
    }
  }
}

/**
 * Inizializza la pagina al caricamento del DOM,
 * richiamando la funzione che filtra e visualizza le attività.
 *
 * @listens document:DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  filterTasks();
});
