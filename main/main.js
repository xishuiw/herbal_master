// 获取 DOM
const inventoryList = document.getElementById('inventory-list');
const putInList = document.getElementById('put-in-list');
const coinCountEl = document.getElementById('coin-count');

// 草药列表 & 背包读取
const herbs = ['人参', '黄芪', '当归', '枸杞', '甘草'];
let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
let putIn = [];

// 草药图标映射
const herbIcons = {
  '人参': 'herb1.png',
  '黄芪': 'herb2.png',
  '当归': 'herb3.png',
  '枸杞': 'herb4.png',
  '甘草': 'herb5.png'
};

// 金币读取
let coinCount = parseInt(localStorage.getItem('coinCount')) || 180;
coinCountEl.textContent = coinCount;

// 渲染背包
function renderInventory() {
  inventoryList.innerHTML = '';
  for (let herb in inventory) {
    if (inventory[herb] > 0) {
      const div = document.createElement('div');
      div.className = 'herb-item';

      // 创建草药图标
      const img = document.createElement('img');
      img.src = `../images/${herbIcons[herb]}`;  // 使用图标路径
      img.alt = herb;
      img.className = 'herb-icon';  // 可自定义样式

      // 创建草药名称文本
      const text = document.createElement('span');
      text.textContent = `${herb} × ${inventory[herb]}`;

      // 将图标和名称添加到 div 中
      div.appendChild(img);
      div.appendChild(text);

      div.addEventListener('click', () => {
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
}

// 渲染已放入
function renderPutIn() {
  putInList.innerHTML = '';
  putIn.forEach((herb, index) => {
    const div = document.createElement('div');
    div.className = 'herb-item';

    // 创建草药图标
    const img = document.createElement('img');
    img.src = `../images/${herbIcons[herb]}`;  // 使用图标路径
    img.alt = herb;
    img.className = 'herb-icon';  // 可自定义样式

    // 创建草药名称文本
    const text = document.createElement('span');
    text.textContent = herb;

    // 将图标和名称添加到 div 中
    div.appendChild(img);
    div.appendChild(text);

    div.addEventListener('click', () => {
      putIn.splice(index, 1);
      inventory[herb] = (inventory[herb] || 0) + 1;
      save();
      renderAll();
    });
    putInList.appendChild(div);
  });
}

// 保存到本地
function save() {
  localStorage.setItem('inventory', JSON.stringify(inventory));
  localStorage.setItem('coinCount', coinCount);
}

// 确认炼药
document.getElementById('confirm-btn').addEventListener('click', () => {
  if (putIn.length === 0) return;

  const recipeKey = putIn.sort().join(',');
  const recipes = {
    '人参,当归': '补气丹',
    '枸杞,黄芪,人参': '养血丸'
  };

  const result = recipes[recipeKey] || '废药';

  alert(`你炼出了：${result}`);
  putIn = [];
  save();
  renderAll();
});

// 取消炼药
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
