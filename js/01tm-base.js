let tasks = JSON.parse(localStorage.getItem("tasksBase")) || [];
let deletedTasks = JSON.parse(localStorage.getItem("deletedTasksBase")) || [];

/**
 * Salva le liste nel localStorage
 */
function saveToLocalStorage() {
  localStorage.setItem("tasksBase", JSON.stringify(tasks));
  localStorage.setItem("deletedTasksBase", JSON.stringify(deletedTasks));
}

/**
 * Aggiunge una nuova attività alla lista principale se il nome è valido.
 */
function addTask() {
  const input = document.getElementById("inputTask");
  const name = input.value.trim();
  if (!name) {
    alert("Inserisci un nome valido!");
    return;
  }
  tasks.push(name);
  saveToLocalStorage();
  renderTasks();
  input.value = "";
}

/**
 * Rimuove un'attività dalla lista principale e la aggiunge a quella delle eliminate.
 * @param {number} index - Indice dell'attività da rimuovere.
 */
function removeTask(index) {
  const removedTask = tasks.splice(index, 1)[0];
  deletedTasks.push(removedTask);
  saveToLocalStorage();
  renderTasks();
}

/**
 * Ripristina un'attività dalla lista delle eliminate a quella principale.
 * @param {number} deletedIndex - Indice dell'attività da ripristinare.
 */
function restoreTask(deletedIndex) {
  const restoredTask = deletedTasks.splice(deletedIndex, 1)[0];
  tasks.push(restoredTask);
  saveToLocalStorage();
  renderTasks();
}

/**
 * Elimina definitivamente un'attività dalla lista delle eliminate dopo conferma.
 * @param {number} deletedIndex - Indice dell'attività da eliminare definitivamente.
 */
function deletePermanently(deletedIndex) {
  if (
    confirm("Sei sicuro di voler rimuovere definitivamente questa attività?")
  ) {
    deletedTasks.splice(deletedIndex, 1);
    renderTasks();
  }
}

/**
 * Aggiorna la visualizzazione delle attività attive e di quelle eliminate.
 */
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

/**
 * Inizializza la pagina al caricamento del DOM, 
 * richiamando la funzione che aggiorna la visualizzazione delle attività.
 * 
 * @listens document:DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});