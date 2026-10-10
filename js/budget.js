(function () {
  const form = document.getElementById("budgetForm");
  if (!form) return;

  const income = document.getElementById("income");
  const expenseIds = ["food", "accommodation", "transport", "data", "academics", "other"];
  const fields = [income].concat(expenseIds.map((id) => document.getElementById(id)));

  function calculate() {
    const incomeValue = Number(income.value) || 0;
    let totalExpenses = 0;

    expenseIds.forEach((id) => {
      totalExpenses += Number(document.getElementById(id).value) || 0;
    });

    const remaining = incomeValue - totalExpenses;

    document.getElementById("totalIncome").textContent = formatCedis(incomeValue);
    document.getElementById("totalExpenses").textContent = formatCedis(totalExpenses);

    const remainingEl = document.getElementById("remaining");
    remainingEl.textContent = formatCedis(remaining);
    remainingEl.classList.toggle("negative", remaining < 0);

    const bar = document.getElementById("budgetBar");
    const percent = incomeValue > 0 ? Math.min((totalExpenses / incomeValue) * 100, 100) : 0;
    bar.style.width = percent + "%";
    bar.classList.toggle("over", remaining < 0);

    const note = document.getElementById("budgetNote");
    if (incomeValue === 0) {
      note.textContent = "Enter your monthly income to see your balance.";
    } else if (remaining < 0) {
      note.textContent = "Your expenses are higher than your income. Look for areas to trim.";
    } else if (remaining === 0) {
      note.textContent = "Your budget is perfectly balanced — try to add a savings line too.";
    } else {
      note.textContent = "You have " + formatCedis(remaining) + " left. Consider moving part of it into savings.";
    }
  }

  fields.forEach((field) => {
    if (field) field.addEventListener("input", calculate);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });

  calculate();
})();
