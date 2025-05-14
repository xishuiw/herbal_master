const fields = document.querySelectorAll('.field');
const tools = document.querySelectorAll('.tool');
let selectedTool = null;

const plantTypes = ['人参', '黄芪', '当归', '枸杞', '甘草'];
let coinCount = parseInt(localStorage.getItem('coinCount')) || 180;
document.getElementById('coin-count').textContent = coinCount;

let fieldStates = JSON.parse(localStorage.getItem('fieldStates')) || {};
let inventory = JSON.parse(localStorage.getItem('inventory')) || {};

function saveState() {
  localStorage.setItem('fieldStates', JSON.stringify(fieldStates));
  localStorage.setItem('coinCount', coinCount);
  localStorage.setItem('inventory', JSON.stringify(inventory));
}

function setFieldText(field, state) {
  if (!state.plant) {
    field.textContent = '空地';
  } else if (state.readyToHarvest) {
    field.textContent = `${state.plant} (可收获)`;
  } else if (state.watered && state.plantTime) {
    updateTimer(field, field.dataset.id);
  } else {
    field.textContent = `${state.plant}`;
  }
}

function updateTimer(fieldEl, fieldId) {
  const state = fieldStates[fieldId];
  if (!state || !state.watered || !state.plantTime || state.readyToHarvest) return;

  const elapsed = Date.now() - state.plantTime;
  const remaining = 1000 - elapsed;

  if (remaining > 0) {
    fieldEl.textContent = `${state.plant} (${Math.ceil(remaining / 1000)}s)`;
    console.log(remaining);
    setTimeout(() => updateTimer(fieldEl, fieldId), 1000);
  } else {
    state.readyToHarvest = true;
    fieldEl.textContent = `${state.plant} (可收获)`;
    saveState();
  }
}

tools.forEach(tool => {
  tool.addEventListener('click', () => {
    tools.forEach(t => t.classList.remove('selected'));
    tool.classList.add('selected');
    selectedTool = tool.dataset.action;
  });
});

fields.forEach(field => {
  const fieldId = field.dataset.id;

  // 初始化状态
  if (!fieldStates[fieldId]) {
    fieldStates[fieldId] = {};
  }
  setFieldText(field, fieldStates[fieldId]);

  field.addEventListener('click', () => {
    let state = fieldStates[fieldId];

    // 收获逻辑
    if (state.readyToHarvest) {
      const herb = state.plant;
      if (herb) {
        inventory[herb] = (inventory[herb] || 0) + 1;
      }
      fieldStates[fieldId] = {}; // 清空状态
      setFieldText(field, {});
      saveState();
      return;
    }

    switch (selectedTool) {
      case 'dig':
        state.tilled = true;
        field.textContent = '已松土';
        break;

      case 'seed':
        if (!state.tilled) {
          alert('请先松土！');
          return;
        }
        if (coinCount < 10) {
          alert('金币不足');
          return;
        }
        coinCount -= 10;
        document.getElementById('coin-count').textContent = coinCount;

        state.plant = plantTypes[Math.floor(Math.random() * plantTypes.length)];
        state.watered = false;
        state.readyToHarvest = false;
        state.plantTime = null;
        field.textContent = state.plant;
        break;

      case 'water':
        if (!state.plant || state.watered || state.readyToHarvest) return;

        state.watered = true;
        state.plantTime = Date.now();
        updateTimer(field, fieldId);
        break;
    }

    fieldStates[fieldId] = state;
    saveState();
  });
});
function resetGame() {
  if (confirm('确认要重置所有田地和金币吗？')) {
    localStorage.removeItem('fieldStates');
    localStorage.removeItem('coinCount');
    localStorage.removeItem('inventory');
    location.reload(); // 刷新页面重新加载状态
  }
}

