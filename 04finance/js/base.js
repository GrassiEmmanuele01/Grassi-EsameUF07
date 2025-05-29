let transactions = [];

function addTransaction() {
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Inserisci una descrizione valida e un importo positivo.");
    return;
  }

  transactions.push({ description, amount, type, category });
  updateUI();
  clearForm();
}

function updateUI() {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const balanceElement = document.getElementById("balance");
  balanceElement.textContent = `€${balance.toFixed(2)}`;
  balanceElement.className = balance >= 0 ? "positive" : "negative";

  renderTransactions();
}

function renderTransactions() {
  const incomeList = document.getElementById("incomeList");
  const expenseList = document.getElementById("expenseList");

  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.description} (${t.category})</span>
      <span class="amount">€${t.amount.toFixed(2)}</span>
    `;

    if (t.type === "income") {
      incomeList.appendChild(li);
    } else if (t.type === "expense") {
      expenseList.appendChild(li);
    }
  });
}

function clearForm() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("type").value = "income";
  document.getElementById("category").value = "cibo";
}
