(function () {
  const form = document.getElementById("expenseForm");
  if (!form) return;

  const STORAGE_KEY = "sfh-expense-tracker";
  const budgetInput = document.getElementById("trackerBudget");
  const descInput = document.getElementById("expenseDesc");
  const amountInput = document.getElementById("expenseAmount");
  const categoryInput = document.getElementById("expenseCategory");
  const list = document.getElementById("expenseList");
  const empty = document.getElementById("expenseEmpty");

  let state = load();

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.expenses)) return saved;
    } catch (error) {
      console.warn("Could not load saved expenses.");
    }
    return { budget: 0, expenses: [] };
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHtml(text) {
    return String(text).replace(
      /[&<>"']/g,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])
    );
  }

  function render() {
    list.innerHTML = "";

    state.expenses.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" + escapeHtml(item.desc) + "</td>" +
        "<td>" + escapeHtml(item.category) + "</td>" +
        "<td>" + escapeHtml(item.date) + "</td>" +
        '<td class="num">' + formatCedis(item.amount) + "</td>" +
        '<td class="num"><button class="icon-btn" data-id="' + item.id + '" aria-label="Delete expense">✕</button></td>';
      list.appendChild(row);
    });

    empty.style.display = state.expenses.length ? "none" : "block";

    const total = state.expenses.reduce((sum, item) => sum + item.amount, 0);
    const remaining = state.budget - total;

    document.getElementById("trackerBudgetView").textContent = formatCedis(state.budget);
    document.getElementById("totalSpent").textContent = formatCedis(total);

    const remainingEl = document.getElementById("trackerRemaining");
    remainingEl.textContent = formatCedis(remaining);
    remainingEl.classList.toggle("negative", remaining < 0);

    const bar = document.getElementById("trackerBar");
    const percent = state.budget > 0 ? Math.min((total / state.budget) * 100, 100) : 0;
    bar.style.width = percent + "%";
    bar.classList.toggle("over", remaining < 0);
  }

  budgetInput.addEventListener("input", () => {
    state.budget = Number(budgetInput.value) || 0;
    save();
    render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const desc = descInput.value.trim();
    const amount = Number(amountInput.value);

    if (!desc || amount <= 0) {
      alert("Please enter a description and an amount greater than zero.");
      return;
    }

    state.expenses.push({
      id: Date.now(),
      desc: desc,
      category: categoryInput.value,
      amount: amount,
      date: new Date().toLocaleDateString("en-GB"),
    });

    descInput.value = "";
    amountInput.value = "";
    descInput.focus();
    save();
    render();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest(".icon-btn");
    if (!button) return;

    const id = Number(button.dataset.id);
    state.expenses = state.expenses.filter((item) => item.id !== id);
    save();
    render();
  });

  document.getElementById("clearExpenses").addEventListener("click", () => {
    if (state.expenses.length && confirm("Remove all recorded expenses? This cannot be undone.")) {
      state.expenses = [];
      save();
      render();
    }
  });

  budgetInput.value = state.budget || "";
  render();
})();
