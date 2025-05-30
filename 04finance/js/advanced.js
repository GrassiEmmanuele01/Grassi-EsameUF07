// Variabili globali con categorie di default garantite
const DEFAULT_CATEGORIES = [
  { name: "cibo", color: "#FF6384" },
  { name: "trasporti", color: "#36A2EB" },
  { name: "divertimento", color: "#FFCE56" },
  { name: "salario", color: "#4BC0C0" },
  { name: "affitto", color: "#9966FF" },
  { name: "altro", color: "#FF9F40" },
];

let transactions = [];
let categories = [...DEFAULT_CATEGORIES]; // Copia delle categorie di default
let chartInstance = null;
let selectedCategory = null;

// Funzioni di utilità per gestione dati
function loadData() {
  console.log("Caricamento dati...");

  try {
    // Carica le transazioni
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      transactions = JSON.parse(savedTransactions);
      console.log("Transazioni caricate:", transactions.length);
    }

    // Carica le categorie
    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        if (
          parsedCategories &&
          Array.isArray(parsedCategories) &&
          parsedCategories.length > 0
        ) {
          categories = parsedCategories;
          console.log(
            "Categorie caricate dal localStorage:",
            categories.length
          );
        } else {
          console.log("Categorie salvate non valide, uso quelle di default");
          categories = [...DEFAULT_CATEGORIES];
          saveCategories();
        }
      } catch (parseError) {
        console.error("Errore nel parsing delle categorie:", parseError);
        categories = [...DEFAULT_CATEGORIES];
        saveCategories();
      }
    } else {
      console.log("Nessuna categoria salvata, uso quelle di default");
      categories = [...DEFAULT_CATEGORIES];
      saveCategories();
    }
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
    categories = [...DEFAULT_CATEGORIES];
    transactions = [];
    saveCategories();
  }

  console.log("Categorie finali:", categories);
}

function saveTransactions() {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    console.log("Transazioni salvate");
  } catch (error) {
    console.error("Errore nel salvataggio delle transazioni:", error);
  }
}

function saveCategories() {
  try {
    localStorage.setItem("categories", JSON.stringify(categories));
    console.log("Categorie salvate:", categories);
  } catch (error) {
    console.error("Errore nel salvataggio delle categorie:", error);
  }
}

// Funzione per aggiungere una transazione
function addTransaction() {
  const description = document.getElementById("description");
  const amount = document.getElementById("amount");
  const type = document.getElementById("type");
  const category = document.getElementById("category");
  const date = document.getElementById("date");

  if (!description || !amount || !type || !category) {
    alert("Errore: alcuni elementi del form non sono stati trovati.");
    return;
  }

  const descriptionValue = description.value.trim();
  const amountValue = parseFloat(amount.value);
  const typeValue = type.value;
  let categoryValue = category.value;
  let dateValue = date.value;

  if (!descriptionValue) {
    alert("Inserisci una descrizione.");
    return;
  }

  if (isNaN(amountValue) || amountValue <= 0) {
    alert("Inserisci un importo valido.");
    return;
  }

  // Se non è selezionata una categoria, usa "altro"
  if (!categoryValue) {
    categoryValue = "altro";
    // Assicurati che esista la categoria "altro"
    if (!categories.find((cat) => cat.name === "altro")) {
      categories.push({ name: "altro", color: "#FF9F40" });
      saveCategories();
      updateCategoryDropdowns();
    }
  }

  if (!dateValue) {
    dateValue = new Date().toISOString().split("T")[0];
  }

  const transaction = {
    id: Date.now(),
    description: descriptionValue,
    amount:
      typeValue === "expense" ? -Math.abs(amountValue) : Math.abs(amountValue),
    type: typeValue,
    category: categoryValue,
    date: dateValue,
  };

  transactions.push(transaction);
  saveTransactions();
  updateUI();
  clearTransactionForm();
}

// Funzione per pulire il form delle transazioni
function clearTransactionForm() {
  const description = document.getElementById("description");
  const amount = document.getElementById("amount");
  const type = document.getElementById("type");
  const category = document.getElementById("category");
  const date = document.getElementById("date");

  if (description) description.value = "";
  if (amount) amount.value = "";
  if (type) type.selectedIndex = 0;
  if (category) category.selectedIndex = 0;
  if (date) date.value = new Date().toISOString().split("T")[0];
}

// Funzione per eliminare una transazione
function deleteTransaction(id) {
  if (confirm("Sei sicuro di voler eliminare questa transazione?")) {
    transactions = transactions.filter((t) => t.id !== id);
    saveTransactions();
    updateUI();
    filterTransactions();
  }
}

// Funzione per filtrare le transazioni
function filterTransactions() {
  const nameFilter = document.getElementById("filterByName");
  const categoryFilter = document.getElementById("filterByCategory");
  const dateFilter = document.getElementById("filterByDate");

  if (!nameFilter || !categoryFilter || !dateFilter) {
    renderTransactions(transactions);
    updateChart(transactions);
    return;
  }

  const nameValue = nameFilter.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const dateValue = dateFilter.value;

  let filtered = transactions.filter((transaction) => {
    const nameMatch =
      !nameValue || transaction.description.toLowerCase().includes(nameValue);
    const categoryMatch =
      categoryValue === "all" || transaction.category === categoryValue;
    const dateMatch = !dateValue || transaction.date === dateValue;

    return nameMatch && categoryMatch && dateMatch;
  });

  renderTransactions(filtered);
  updateChart(filtered);
}

// Gestione delle categorie
function toggleCategoryManager() {
  const categoryManager = document.getElementById("categoryManager");
  const toggleButton = document.getElementById("toggleCategoryManager");

  if (!categoryManager || !toggleButton) return;

  if (categoryManager.classList.contains("hidden")) {
    categoryManager.classList.remove("hidden");
    categoryManager.classList.add("visible");
    toggleButton.textContent = "Chiudi Gestione Categorie ▲";
  } else {
    categoryManager.classList.remove("visible");
    categoryManager.classList.add("hidden");
    toggleButton.textContent = "Gestisci Categorie ▼";
  }
}

function saveCategory() {
  const nameInput = document.getElementById("newCategoryName");
  const colorInput = document.getElementById("newCategoryColor");

  if (!nameInput || !colorInput) {
    alert("Errore: elementi del form categorie non trovati.");
    return;
  }

  const categoryName = nameInput.value.trim().toLowerCase();
  const categoryColor = colorInput.value;

  if (!categoryName) {
    alert("Inserisci un nome valido per la categoria.");
    return;
  }

  if (selectedCategory) {
    // Modifica categoria esistente
    const index = categories.findIndex((cat) => cat.name === selectedCategory);
    if (index !== -1) {
      const oldName = categories[index].name;
      categories[index] = { name: categoryName, color: categoryColor };

      // Aggiorna le transazioni che usano questa categoria
      transactions.forEach((transaction) => {
        if (transaction.category === oldName) {
          transaction.category = categoryName;
        }
      });
      saveTransactions();
    }
    selectedCategory = null;
  } else {
    // Nuova categoria
    if (categories.some((cat) => cat.name === categoryName)) {
      alert("La categoria esiste già.");
      return;
    }
    categories.push({ name: categoryName, color: categoryColor });
  }

  saveCategories();
  clearCategoryForm();
  updateCategoryDropdowns();
  renderCategoriesList();
  updateCategoryLegend();
  updateUI();
}

function editCategory(categoryName) {
  const nameInput = document.getElementById("newCategoryName");
  const colorInput = document.getElementById("newCategoryColor");

  if (!nameInput || !colorInput) return;

  const category = categories.find((cat) => cat.name === categoryName);
  if (category) {
    nameInput.value = category.name;
    colorInput.value = category.color;
    selectedCategory = categoryName;
  }
}

function deleteCategory(categoryName) {
  if (
    !confirm(`Sei sicuro di voler eliminare la categoria "${categoryName}"?`)
  ) {
    return;
  }

  // Non permettere di eliminare tutte le categorie
  if (categories.length <= 1) {
    alert("Non puoi eliminare tutte le categorie. Deve rimanerne almeno una.");
    return;
  }

  categories = categories.filter((cat) => cat.name !== categoryName);

  // Sposta le transazioni della categoria eliminata in "altro"
  const altroCategory = categories.find((cat) => cat.name === "altro");
  if (!altroCategory) {
    categories.push({ name: "altro", color: "#FF9F40" });
  }

  transactions.forEach((transaction) => {
    if (transaction.category === categoryName) {
      transaction.category = "altro";
    }
  });

  saveCategories();
  saveTransactions();
  updateCategoryDropdowns();
  renderCategoriesList();
  updateCategoryLegend();
  updateUI();
}

function clearCategoryForm() {
  const nameInput = document.getElementById("newCategoryName");
  const colorInput = document.getElementById("newCategoryColor");

  if (nameInput) nameInput.value = "";
  if (colorInput) colorInput.value = "#FF6384";
  selectedCategory = null;
}

// Funzioni di rendering
function updateCategoryDropdowns() {
  console.log("Aggiornamento dropdown categorie...");

  const categoryDropdown = document.getElementById("category");
  const filterDropdown = document.getElementById("filterByCategory");

  // Aggiorna dropdown principale per inserimento transazioni
  if (categoryDropdown) {
    const currentValue = categoryDropdown.value;
    categoryDropdown.innerHTML = "";

    // Aggiungi opzione "altro" come default se non selezionata
    const defaultOption = document.createElement("option");
    defaultOption.value = "altro";
    defaultOption.textContent = "Altro (default)";
    categoryDropdown.appendChild(defaultOption);

    categories.forEach((cat) => {
      if (cat.name !== "altro") {
        // "altro" è già stato aggiunto come primo
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent =
          cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
        categoryDropdown.appendChild(option);
      }
    });

    // Ripristina la selezione se era valida
    if (currentValue && categories.some((cat) => cat.name === currentValue)) {
      categoryDropdown.value = currentValue;
    } else {
      categoryDropdown.value = "altro"; // Default ad "altro"
    }

    console.log(
      "Dropdown principale aggiornato con",
      categoryDropdown.options.length,
      "opzioni"
    );
  }

  // Aggiorna dropdown per filtri
  if (filterDropdown) {
    const currentValue = filterDropdown.value;
    filterDropdown.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "Tutte le categorie";
    filterDropdown.appendChild(allOption);

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
      filterDropdown.appendChild(option);
    });

    // Ripristina la selezione se era valida
    if (
      currentValue &&
      (currentValue === "all" ||
        categories.some((cat) => cat.name === currentValue))
    ) {
      filterDropdown.value = currentValue;
    }

    console.log(
      "Dropdown filtri aggiornato con",
      filterDropdown.options.length,
      "opzioni"
    );
  }
}

function renderCategoriesList() {
  const list = document.getElementById("categoriesList");
  if (!list) return;

  list.innerHTML = "";

  if (categories.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nessuna categoria trovata.";
    li.style.fontStyle = "italic";
    li.style.color = "#666";
    list.appendChild(li);
    return;
  }

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "8px";
    li.style.marginBottom = "5px";
    li.style.backgroundColor = "#f5f5f5";
    li.style.borderRadius = "4px";

    li.innerHTML = `
        <span style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 16px; height: 16px; background-color: ${
            cat.color
          }; margin-right: 10px; border-radius: 3px;"></span>
          ${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
        </span>
        <div>
          <button onclick="editCategory('${
            cat.name
          }')" style="margin-right: 5px; padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Modifica</button>
          <button onclick="deleteCategory('${
            cat.name
          }')" style="padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Elimina</button>
        </div>
      `;
    list.appendChild(li);
  });

  console.log(
    "Lista categorie renderizzata con",
    categories.length,
    "elementi"
  );
}

function updateCategoryLegend() {
  const legend = document.getElementById("categoryLegend");
  if (!legend) return;

  legend.innerHTML = "";

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.marginBottom = "5px";

    li.innerHTML = `
        <span style="display: inline-block; width: 16px; height: 16px; background-color: ${
          cat.color
        }; margin-right: 10px; border-radius: 3px;"></span>
        ${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
      `;
    legend.appendChild(li);
  });
}

function renderTransactions(transactionsToRender) {
  const list = document.getElementById("transactionsList");
  if (!list) return;

  list.innerHTML = "";

  if (transactionsToRender.length === 0) {
    const li = document.createElement("li");
    li.style.textAlign = "center";
    li.style.fontStyle = "italic";
    li.style.color = "#666";
    li.style.padding = "20px";
    li.textContent = "Nessuna transazione trovata.";
    list.appendChild(li);
    return;
  }

  const sorted = [...transactionsToRender].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sorted.forEach((transaction) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "10px";
    li.style.marginBottom = "5px";
    li.style.backgroundColor = "#f9f9f9";
    li.style.borderRadius = "5px";
    li.style.border = "1px solid #e0e0e0";

    const category = categories.find(
      (cat) => cat.name === transaction.category
    );
    const categoryColor = category ? category.color : "#ccc";

    li.innerHTML = `
        <span style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 12px; height: 12px; background-color: ${categoryColor}; margin-right: 10px; border-radius: 50%;"></span>
          <div>
            <strong>${transaction.description}</strong><br>
            <small style="color: #666;">${
              transaction.category.charAt(0).toUpperCase() +
              transaction.category.slice(1)
            } • ${transaction.date}</small>
          </div>
        </span>
        <span style="display: flex; align-items: center; gap: 15px;">
          <span style="font-weight: bold; color: ${
            transaction.amount >= 0 ? "#28a745" : "#dc3545"
          };">
            ${transaction.amount >= 0 ? "+" : ""}€${Math.abs(
      transaction.amount
    ).toFixed(2)}
          </span>
          <button onclick="deleteTransaction(${
            transaction.id
          })" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">Elimina</button>
        </span>
      `;
    list.appendChild(li);
  });
}

function updateChart(transactionsToChart) {
  const canvas = document.getElementById("spendingChart");
  if (!canvas) {
    console.log("Canvas non trovato");
    return;
  }

  // Distruggi il grafico precedente se esiste
  if (chartInstance && typeof chartInstance.destroy === "function") {
    try {
      chartInstance.destroy();
    } catch (error) {
      console.warn("Errore nella distruzione del grafico:", error);
    }
    chartInstance = null;
  }

  // Verifica che Chart.js sia disponibile
  if (typeof Chart === "undefined") {
    console.error("Chart.js non è disponibile");
    return;
  }

  const ctx = canvas.getContext("2d");

  // Calcola i totali per categoria
  const categoryData = {};
  categories.forEach((cat) => {
    categoryData[cat.name] = {
      income: 0,
      expense: 0,
      color: cat.color,
    };
  });

  transactionsToChart.forEach((transaction) => {
    if (categoryData[transaction.category]) {
      if (transaction.amount >= 0) {
        categoryData[transaction.category].income += transaction.amount;
      } else {
        categoryData[transaction.category].expense += Math.abs(
          transaction.amount
        );
      }
    }
  });

  // Prepara i dati per Chart.js
  const labels = [];
  const incomeData = [];
  const expenseData = [];
  const backgroundColors = [];

  Object.keys(categoryData).forEach((categoryName) => {
    const data = categoryData[categoryName];
    if (data.income > 0 || data.expense > 0) {
      labels.push(categoryName.charAt(0).toUpperCase() + categoryName.slice(1));
      incomeData.push(data.income);
      expenseData.push(-data.expense);
      backgroundColors.push(data.color);
    }
  });

  try {
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Entrate",
            data: incomeData,
            backgroundColor: backgroundColors.map((color) => color + "80"),
            borderColor: backgroundColors,
            borderWidth: 1,
          },
          {
            label: "Uscite",
            data: expenseData,
            backgroundColor: backgroundColors.map((color) => color + "40"),
            borderColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "€" + Math.abs(value).toFixed(2);
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = Math.abs(context.parsed.y);
                return context.dataset.label + ": €" + value.toFixed(2);
              },
            },
          },
        },
      },
    });
    console.log("Grafico creato con successo");
  } catch (error) {
    console.error("Errore nella creazione del grafico:", error);
  }
}

function updateUI() {
  console.log("Aggiornamento UI...");

  // Calcola il saldo
  const totalIncome = transactions
    .filter((t) => t.amount >= 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const balanceElement = document.getElementById("balance");
  if (balanceElement) {
    balanceElement.textContent = `€${balance.toFixed(2)}`;
    balanceElement.style.color = balance >= 0 ? "#28a745" : "#dc3545";
  }

  renderTransactions(transactions);
  updateChart(transactions);

  console.log("UI aggiornata - Saldo:", balance);
}

// Inizializzazione
function initializeApp() {
  console.log("=== INIZIALIZZAZIONE APP ===");

  // Carica i dati
  loadData();

  // Aggiorna tutti i componenti dell'interfaccia
  updateCategoryDropdowns();
  renderCategoriesList();
  updateCategoryLegend();
  updateUI();

  // Imposta la data di oggi come default
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  console.log("=== APP INIZIALIZZATA ===");
  console.log("Categorie finali:", categories.length);
  console.log("Transazioni:", transactions.length);
}

// Avvia l'app quando la pagina è caricata
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM caricato, inizializzo app...");
  initializeApp();
});

// Backup per compatibilità
window.addEventListener("load", function () {
  console.log("Window load, backup inizializzazione...");
  if (categories.length === 0) {
    initializeApp();
  }
});
