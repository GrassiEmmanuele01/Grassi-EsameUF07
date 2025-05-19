const tasks = [];
const deletedTasks = [];

function addTask() {
  const taskInput = document.getElementById("inputTask");
  const taskName = taskInput.value.trim();

  if (taskName === "") {
    alert("Inserisci un nome valido per l'attività!");
    return;
  }

  tasks.push(taskName);
  renderTasks();
  taskInput.value = "";
}

function removeTask(index) {
  const removedTask = tasks.splice(index, 1)[0];
  deletedTasks.push(removedTask);
  renderTasks();
}

function restoreTask(deletedIndex) {
  const restoredTask = deletedTasks.splice(deletedIndex, 1)[0];
  tasks.push(restoredTask);
  renderTasks();
}

function deletePermanently(deletedIndex) {
  if (
    confirm("Sei sicuro di voler rimuovere definitivamente questa attività?")
  ) {
    deletedTasks.splice(deletedIndex, 1);
    renderTasks();
  }
}

function renderTasks() {
  const taskItems = document.getElementById("taskItems");

  const deletedList = document.getElementById("deletedList");

  taskItems.innerHTML = "";
  deletedList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
        <span>${task}</span>
        <button class="remove-task" onclick="removeTask(${index})">Rimuovi ❌</button>
      `;
    taskItems.appendChild(taskItem);
  });

  deletedTasks.forEach((task, index) => {
    const deletedItem = document.createElement("li");
    deletedItem.innerHTML = `
        <span>${task}</span>
        <div>
          <button class="restore-task" onclick="restoreTask(${index})">Ripristina 🔄</button>
          <button class="delete-permanently" onclick="deletePermanently(${index})">Rimuovi definitivamente 🗑️</button>
        </div>
      `;
    deletedList.appendChild(deletedItem);
  });
}
