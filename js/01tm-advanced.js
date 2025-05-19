const tasks = [];
const deletedTasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskName = taskInput.value.trim();

  if (taskName === "") {
    alert("Inserisci un nome valido per l'attività!");
    return;
  }

  tasks.push({ name: taskName, status: "todo" });
  renderTasks();
  taskInput.value = "";
}

function renderTasks(filteredTasks = tasks) {
  const todoList = document.getElementById("todoList");
  const inProgressList = document.getElementById("inProgressList");
  const completedList = document.getElementById("completedList");
  const deletedList = document.getElementById("deletedList");

  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  completedList.innerHTML = "";
  deletedList.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.className = `status-${task.status}`;
    listItem.innerHTML = `
      <div class="task-content">
        <span>${task.name}</span>
      </div>
      <div class="button-row">
        ${
          task.status !== "todo"
            ? `<button class="todo" onclick="changeStatus(${index}, 'todo')">Da fare ⏳</button>`
            : `<button class="todo disabled" disabled>Da fare ⏳</button>`
        }
        ${
          task.status !== "inprogress"
            ? `<button class="inprogress" onclick="changeStatus(${index}, 'inprogress')">In corso 🚀</button>`
            : `<button class="inprogress disabled" disabled>In corso 🚀</button>`
        }
        ${
          task.status !== "completed"
            ? `<button class="completed" onclick="changeStatus(${index}, 'completed')">Completata ✅</button>`
            : `<button class="completed disabled" disabled>Completata ✅</button>`
        }
      </div>
      <div class="button-row">
        <button class="edit-task" onclick="updateTask(${index}, prompt('Nuovo nome:', '${
      task.name
    }'))">Modifica ✏️</button>
        <button class="remove-task" onclick="removeTask(${index})">Rimuovi ❌</button>
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

  deletedTasks.forEach((task, index) => {
    const deletedItem = document.createElement("li");
    deletedItem.className = "status-deleted";
    deletedItem.innerHTML = `
      <span>${task.name}</span>
      <div class="button-row">
        <button class="restore-task" onclick="restoreTask(${index})">Ripristina 🔄</button>
        <button class="delete-permanently" onclick="deletePermanently(${index})">Rimuovi definitivamente 🗑️</button>
      </div>
    `;
    deletedList.appendChild(deletedItem);
  });
}

function removeTask(originalIndex) {
  if (originalIndex >= 0 && originalIndex < tasks.length) {
    const removedTask = tasks.splice(originalIndex, 1)[0];
    deletedTasks.push(removedTask);
    renderTasks();
  } else {
    console.error("Indice dell'attività non valido:", originalIndex);
  }
}

function restoreTask(deletedIndex) {
  if (deletedIndex >= 0 && deletedIndex < deletedTasks.length) {
    const restoredTask = deletedTasks.splice(deletedIndex, 1)[0];
    tasks.push(restoredTask);
    renderTasks();
  } else {
    console.error("Indice dell'attività eliminata non valido:", deletedIndex);
  }
}

function deletePermanently(deletedIndex) {
  if (
    confirm("Sei sicuro di voler rimuovere definitivamente questa attività?")
  ) {
    if (deletedIndex >= 0 && deletedIndex < deletedTasks.length) {
      deletedTasks.splice(deletedIndex, 1);
      renderTasks();
    } else {
      console.error("Indice dell'attività eliminata non valido:", deletedIndex);
    }
  }
}

function filterTasks() {
  const filterStatus = document.getElementById("filterStatus").value;
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  renderTasks(filteredTasks);
}

function resetFilters() {
  document.getElementById("filterStatus").value = "all";
  document.getElementById("searchInput").value = "";
  filterTasks();
}