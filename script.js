const itemRowsContainer = document.getElementById('item-rows');
const rowTemplate = document.getElementById('row-template');
const addRowBtn = document.getElementById('add-row-btn');
const calculateBtn = document.getElementById('calculate-btn');
const resultsDiv = document.getElementById('results');
const resultsBody = document.getElementById('results-body');

// --- Daily Calorie Goal Tracking ---
const goalInput = document.getElementById('goal-input');
const saveGoalBtn = document.getElementById('save-goal-btn');
const goalStatus = document.getElementById('goal-status');
const goalProgressCard = document.getElementById('goal-progress-card');
const progressBarInner = document.getElementById('progress-bar-inner');
const progressText = document.getElementById('progress-text');

let dailyGoal = null; // kept in memory for this session

function loadSavedGoal() {
  // Restore goal from this session (in-memory, no browser storage used)
  if (dailyGoal) {
    goalInput.value = dailyGoal;
    goalStatus.textContent = `Current goal: ${dailyGoal} kcal/day`;
  }
}

saveGoalBtn.addEventListener('click', () => {
  const val = parseFloat(goalInput.value);
  if (!val || val <= 0) {
    goalStatus.textContent = 'Enter a valid calorie goal (e.g. 2000).';
    return;
  }
  dailyGoal = val;
  goalStatus.textContent = `Goal set: ${dailyGoal} kcal/day ✅`;
});

function buildFoodOptions(selectEl) {
  FOODS.forEach(food => {
    const opt = document.createElement('option');
    opt.value = food;
    opt.textContent = food;
    selectEl.appendChild(opt);
  });
}

function addRow() {
  const clone = rowTemplate.content.cloneNode(true);
  const select = clone.querySelector('.food-select');
  buildFoodOptions(select);

  clone.querySelector('.remove-btn').addEventListener('click', (e) => {
    e.target.closest('.item-row').remove();
  });

  itemRowsContainer.appendChild(clone);
}

addRowBtn.addEventListener('click', addRow);

// Start with one row by default
addRow();

calculateBtn.addEventListener('click', async () => {
  const rows = document.querySelectorAll('.item-row');
  const items = [];

  rows.forEach(row => {
    const food = row.querySelector('.food-select').value;
    const quantity = row.querySelector('.qty-input').value;
    if (food && quantity) {
      items.push({ food, quantity });
    }
  });

  if (items.length === 0) {
    alert('Add at least one food item with quantity.');
    return;
  }

  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });

  const data = await response.json();
  renderResults(data);
});

function renderResults(data) {
  resultsBody.innerHTML = '';

  data.items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.food}</td>
      <td>${item.quantity}</td>
      <td>${item.calories}</td>
      <td>${item.protein}</td>
      <td>${item.carbs}</td>
      <td>${item.fat}</td>
    `;
    resultsBody.appendChild(tr);
  });

  document.getElementById('total-calories').textContent = data.total.calories;
  document.getElementById('total-protein').textContent = data.total.protein;
  document.getElementById('total-carbs').textContent = data.total.carbs;
  document.getElementById('total-fat').textContent = data.total.fat;

  resultsDiv.classList.remove('hidden');

  updateGoalProgress(data.total.calories);
}

function updateGoalProgress(mealCalories) {
  if (!dailyGoal) {
    goalProgressCard.classList.add('hidden');
    return;
  }

  const percent = Math.min((mealCalories / dailyGoal) * 100, 100);
  const isOver = mealCalories > dailyGoal;

  progressBarInner.style.width = `${percent}%`;
  progressBarInner.classList.toggle('over-limit', isOver);

  const remaining = Math.round(dailyGoal - mealCalories);
  if (isOver) {
    progressText.textContent =
      `This meal (${mealCalories} kcal) exceeds your goal of ${dailyGoal} kcal by ${Math.abs(remaining)} kcal.`;
  } else {
    progressText.textContent =
      `This meal (${mealCalories} kcal) uses ${percent.toFixed(1)}% of your ${dailyGoal} kcal goal. ${remaining} kcal remaining.`;
  }

  goalProgressCard.classList.remove('hidden');
}

loadSavedGoal();
