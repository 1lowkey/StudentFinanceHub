(function () {
  const form = document.getElementById("savingsForm");
  if (!form) return;

  const goal = document.getElementById("goalAmount");
  const current = document.getElementById("currentSavings");
  const monthly = document.getElementById("monthlySaving");

  function calculate() {
    const goalValue = Number(goal.value) || 0;
    const currentValue = Number(current.value) || 0;
    const monthlyValue = Number(monthly.value) || 0;

    const stillNeeded = Math.max(goalValue - currentValue, 0);
    const months = monthlyValue > 0 ? Math.ceil(stillNeeded / monthlyValue) : 0;

    document.getElementById("stillNeeded").textContent = formatCedis(stillNeeded);

    const monthsEl = document.getElementById("monthsNeeded");
    const dateEl = document.getElementById("targetDate");
    const note = document.getElementById("savingsNote");

    if (goalValue === 0) {
      monthsEl.textContent = "—";
      dateEl.textContent = "—";
      note.textContent = "Enter your savings goal to estimate a timeline.";
    } else if (stillNeeded === 0) {
      monthsEl.textContent = "Reached";
      dateEl.textContent = "—";
      note.textContent = "Well done — you have already reached this goal!";
    } else if (monthlyValue === 0) {
      monthsEl.textContent = "—";
      dateEl.textContent = "—";
      note.textContent = "Enter how much you can save each month.";
    } else {
      monthsEl.textContent = months === 1 ? "1 month" : months + " months";
      const target = new Date();
      target.setMonth(target.getMonth() + months);
      dateEl.textContent = target.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
      note.textContent =
        "At " + formatCedis(monthlyValue) + " per month you will reach your goal in about " +
        (months === 1 ? "1 month" : months + " months") + ".";
    }

    const bar = document.getElementById("savingsBar");
    const percent = goalValue > 0 ? Math.min((currentValue / goalValue) * 100, 100) : 0;
    bar.style.width = percent + "%";
  }

  [goal, current, monthly].forEach((field) => field.addEventListener("input", calculate));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });

  calculate();
})();
