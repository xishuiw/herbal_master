const inventoryList = document.getElementById('inventory-list');
const putInList = document.getElementById('put-in-list');
const coinCountEl = document.getElementById('coin-count');

// 草药与丹药名称
const herbs = ['人参', '黄芪', '当归', '枸杞', '甘草'];
const herbIcons = {
  '人参': 'herb1.png',
  '黄芪': 'herb2.png',
  '当归': 'herb3.png',
  '枸杞': 'herb4.png',
  '甘草': 'herb5.png'
};

const pillIcons = {
  '补气丹': 'pill1.png',
  '养血丸': 'pill2.png',
  '废药': 'pill0.png'
};

// 本地存储数据
let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
let pills = JSON.parse(localStorage.getItem('pills')) || {};
let putIn = [];
let coinCount = parseInt(localStorage.getItem('coinCount')) || 180;
coinCountEl.textContent = coinCount;

// 当前背包选项卡：'herb' 或 'pill'
let currentTab = 'herb';

// 初始化切换事件
document.getElementById('herb-tab').addEventListener('click', () => {
  currentTab = 'herb';
  updateTabUI();
  renderInventory();
});
document.getElementById('pill-tab').addEventListener('click', () => {
  currentTab = 'pill';
  updateTabUI();
  renderInventory();
});

function updateTabUI() {
  document.getElementById('herb-tab').classList.toggle('active', currentTab === 'herb');
  document.getElementById('pill-tab').classList.toggle('active', currentTab === 'pill');
}

// 渲染背包
function renderInventory() {
  inventoryList.innerHTML = '';
  if (currentTab === 'herb') {
    for (let herb in inventory) {
      if (inventory[herb] > 0) {
        const div = createItemDiv(herb, inventory[herb], herbIcons[herb], () => {
          if (putIn.length < 3) {
            putIn.push(herb);
            inventory[herb]--;
            save();
            renderAll();
          }
        });
        inventoryList.appendChild(div);
      }
    }
  } else {
    for (let pill in pills) {
      if (pills[pill] > 0) {
        const div = createItemDiv(pill, pills[pill], pillIcons[pill]);
        inventoryList.appendChild(div);
      }
    }
  }
}

// 渲染已放入
function renderPutIn() {
  putInList.innerHTML = '';
  putIn.forEach((herb, index) => {
    const div = createItemDiv(herb, '', herbIcons[herb], () => {
      putIn.splice(index, 1);
      inventory[herb] = (inventory[herb] || 0) + 1;
      save();
      renderAll();
    });
    inventoryList.appendChild(div);
    putInList.appendChild(div);
  });
}

// 创建带图标的 item 元素
function createItemDiv(name, count, icon, clickHandler) {
  const div = document.createElement('div');
  div.className = 'herb-item';

  const img = document.createElement('img');
  img.src = `../images/${currentTab === 'pill' ? 'pills' : 'herbs'}/${icon}`;
  img.alt = name;
  img.className = 'herb-icon';

  const text = document.createElement('span');
  text.textContent = count ? `${name} × ${count}` : name;

  div.appendChild(img);
  div.appendChild(text);
  if (clickHandler) div.addEventListener('click', clickHandler);

  return div;
}

// 保存状态
function save() {
  localStorage.setItem('inventory', JSON.stringify(inventory));
  localStorage.setItem('pills', JSON.stringify(pills));
  localStorage.setItem('coinCount', coinCount);
}

// 确认炼药动画 + 丹药加入
document.getElementById('confirm-btn').addEventListener('click', () => {
  if (putIn.length === 0) return;

  const dingImg = document.getElementById('ding-img');
  const alchemizingText = document.getElementById('alchemizing-text');
  dingImg.classList.add('animating');
  alchemizingText.style.display = 'block';

  setTimeout(() => {
    const recipeKey = putIn.sort().join(',');
    const recipes = {
      '人参,当归,甘草': '补气丹',
      '枸杞,黄芪,人参': '养血丸'
    };
    const result = recipes[recipeKey] || '废药';

    // 存入丹药
    pills[result] = (pills[result] || 0) + 1;

    // 清理
    putIn = [];
    dingImg.classList.remove('animating');
    alchemizingText.style.display = 'none';
    alert(`你炼出了：${result}`);
    save();
    renderAll();
  }, 2000);
});

// 取消
document.getElementById('cancel-btn').addEventListener('click', () => {
  putIn.forEach(h => {
    inventory[h] = (inventory[h] || 0) + 1;
  });
  putIn = [];
  save();
  renderAll();
});

// 初始渲染
function renderAll() {
  renderInventory();
  renderPutIn();
}
renderAll();
