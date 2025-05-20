let taskIdCounter = 1;

const tasks = [];
const deletedTasks = [];

/**
 * Aggiunge una nuova attività con stato "todo" se il nome è valido.
 */
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskName = taskInput.value.trim();

  if (taskName === "") {
    alert("Inserisci un nome valido per l'attività!");
    return;
  }

  tasks.push({ id: taskIdCounter++, name: taskName, status: "todo" });
  filterTasks();
  taskInput.value = "";
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
  if (!newName || newName.trim() === "") {
    alert("Il nuovo nome dell'attività non può essere vuoto!");
    return;
  }

  const task = findTaskById(tasks, taskId);
  if (task) {
    task.name = newName.trim();
    filterTasks();
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
  if (task) {
    task.status = newStatus;
    filterTasks();
  } else {
    console.error("Attività non trovata con ID:", taskId);
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

  if (searchQuery !== "") {
    const filteredDeletedTasks = deletedTasks.filter((task) =>
      task.name.toLowerCase().includes(searchQuery)
    );
    filteredTasks = [...filteredTasks, ...filteredDeletedTasks];
  }

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
    listItem.className = `status-${task.status}`;
    listItem.innerHTML = `
      <div class="task-content">
        <span>${task.name}</span>
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
        <button class="edit-task" onclick="updateTask(${
          task.id
        }, prompt('Nuovo nome:', '${task.name}'))">Modifica ✏️</button>
        <button class="remove-task" onclick="removeTask(${
          task.id
        })">Rimuovi ❌</button>
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
      default:
        console.error("Stato dell'attività non riconosciuto:", task.status);
    }
  });

  const filterStatus = document.getElementById("filterStatus").value;
  const searchQuery = document.getElementById("searchInput").value.trim();

  if (
    filterStatus === "eliminato" ||
    (filterStatus === "all" && searchQuery === "") ||
    searchQuery !== ""
  ) {
    deletedTasks.forEach((task) => {
      const deletedItem = document.createElement("li");
      deletedItem.className = "status-eliminato";
      deletedItem.innerHTML = `
        <span>${task.name} (Eliminato da: ${formatStatus(
        task.originalStatus
      )})</span>
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
