const tasks = [];

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

function renderTasks() {
  const taskItems = document.getElementById("taskItems");

  taskItems.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
        <span>${task}</span>
        <button class="remove-task" onclick="removeTask(${index})">Rimuovi ❌</button>
      `;
    taskItems.appendChild(taskItem);
  });
}