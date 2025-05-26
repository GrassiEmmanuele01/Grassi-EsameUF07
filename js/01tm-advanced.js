// Inizializzazione ID counter e liste
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
 * Aggiunge una nuova attività con stato "todo" e priorità "medium" se il nome è valido.
 */
function addTask() {
  const input = document.getElementById("taskInput");
  const name = input.value.trim();
  if (!name) {
    alert("Inserisci un nome valido!");
    return;
  }
  tasks.push({ id: taskIdCounter++, name, status: "todo", priority: "medium" });
  filterTasks();
  saveToLocalStorage();
  input.value = "";
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
 * Filtra le attività per stato e ricerca, e le ordina per priorità.
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
    listItem.innerHTML = `
      <div class="task-content">
        <span>${task.name}</span>
        <span class="priority-label">${formatPriority(task.priority)}</span>
      </div>
      <div class="button-row">
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
      <div class="button-row">
        <button class="edit-task" onclick="promptUpdate(${
          task.id
        })">Modifica ✏️</button>
        <button class="remove-task" onclick="removeTask(${
          task.id
        })">Rimuovi ❌</button>
        <button class="update-priority" onclick="promptUpdatePriority(${
          task.id
        })">Cambia Priorità ⚡</button>
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
    deletedItem.className = `status-eliminato priority-${task.priority}`;
    deletedItem.innerHTML = `
      <span>${task.name} (Eliminato da: ${formatStatus(
      task.originalStatus
    )})</span>
      <span class="priority-label">${formatPriority(task.priority)}</span>
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
 * Aggiorna la priorità di una attività.
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
    const newPriorityIndex = parseInt(
      prompt(
        `Seleziona la nuova priorità:\n1. Alta 🟩\n2. Media 🟨\n3. Bassa 🟥`,
        currentPriorityIndex + 1
      )
    );
    if (newPriorityIndex >= 1 && newPriorityIndex <= 3) {
      const selectedPriority = priorities[newPriorityIndex - 1];
      updatePriority(taskId, selectedPriority);
    } else {
      alert("Inserisci un valore valido (1, 2 o 3).");
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