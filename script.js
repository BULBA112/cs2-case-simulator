// Игровые данные
let gameData = {
    balance: 1000,
    inventory: [],
    clickValue: 1,
    autoClickValue: 0,
    clickUpgradeLevel: 1,
    autoClickUpgradeLevel: 0,
    clickUpgradePrice: 10,
    autoClickUpgradePrice: 50,
    casesOpened: 0,
    playerName: null,
    referralCode: null,
    referralBonus: 0,
    referredBy: null,
    referralCount: 0,
    totalReferralBonus: 0
};

// Флаг для отслеживания состояния вращения
let isSpinning = false;

// Function to handle image loading with fallbacks
function loadSkinImage(skinName, primaryUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        const fallbackUrls = [
            primaryUrl,
            `https://community.cloudflare.steamstatic.com/economy/image/${getWeaponHash(skinName)}`,
            `https://steamcommunity-a.akamaihd.net/economy/image/${getWeaponHash(skinName)}`,
            `https://s1.cs.money/img/items/${skinName.toLowerCase().replace(/ \| /g, '_').replace(/ /g, '_')}.png`,
            getBaseWeaponImage(skinName.split(' | ')[0])
        ];

        function tryNextUrl(index) {
            if (index >= fallbackUrls.length) {
                resolve(getBaseWeaponImage(skinName.split(' | ')[0]));
                return;
            }

            img.onload = () => resolve(fallbackUrls[index]);
            img.onerror = () => tryNextUrl(index + 1);
            img.src = fallbackUrls[index];
        }

        tryNextUrl(0);
    });
}

// Helper function to generate a consistent hash for Steam CDN
function getWeaponHash(skinName) {
    // This would need to be populated with actual Steam CDN hashes
    const hashMap = {
        "AK-47 | Nightwish": "fWFc82js0fmoRAP-qOIPu5THSWqfwTYacU_jL_uz6QEHGcjFwUs",
        "M4A4 | Temukau": "fWFc82js0fmoRAP-qOIPu5THSWqfwTYacU_jL_uz6QEHGcjFwUs",
        // Add more mappings as needed
    };
    return hashMap[skinName] || '';
}

// Обновленный массив предметов с рабочими ссылками на изображения
const items = [
    // Dreams & Nightmares Case
    {
        name: "AK-47 | Nightwish",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "covert",
        price: 15000
    },
    {
        name: "M4A4 | Temukau",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "covert",
        price: 12000
    },
    {
        name: "USP-S | Printstream",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "classified",
        price: 8000
    },
    {
        name: "MAC-10 | Toybox",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "restricted",
        price: 2000
    },
    {
        name: "P250 | Re.built",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "mil-spec",
        price: 500
    },

    // Danger Zone Case
    {
        name: "Desert Eagle | Ocean Drive",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "covert",
        price: 14000
    },
    {
        name: "AWP | Chromatic Aberration",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "covert",
        price: 11000
    },
    {
        name: "Glock-18 | Neo-Noir",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "classified",
        price: 7500
    },
    {
        name: "MP9 | Featherweight",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "restricted",
        price: 1800
    },
    {
        name: "AWP | Atheris",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "mil-spec",
        price: 450
    },

    // Fracture Case
    {
        name: "M4A1-S | Printstream",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "covert",
        price: 16000
    },
    {
        name: "AK-47 | Legion of Anubis",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "covert",
        price: 13000
    },
    {
        name: "Desert Eagle | Trigger Discipline",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "classified",
        price: 6500
    },
    {
        name: "XM1014 | Entombed",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "restricted",
        price: 1600
    },
    {
        name: "MP5-SD | Kitbash",
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJH5dG0m5aYkuXLP7LWnn8u5MRjjeyP89T02gzkqkBtY2r3d4TFJw4_M1nX_lO3kO-5h5K-vJjJz3Y27HIl4SnZnhKzhUocTfYvZA",
        rarity: "mil-spec",
        price: 400
    }
];

// DOM элементы
const balanceElement = document.getElementById('balance');
const openButton = document.getElementById('openCase');
const showContentsButton = document.getElementById('showContents');
const rouletteContainer = document.querySelector('.roulette-container');
const itemsContainer = document.querySelector('.items-container');
const inventoryItems = document.getElementById('inventoryItems');
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
const clickerButton = document.getElementById('clickerButton');
const clickValueElement = document.getElementById('clickValue');
const autoClickValueElement = document.getElementById('autoClickValue');
const clickUpgradeButton = document.querySelector('#clickUpgrade .upgrade-button');
const autoClickUpgradeButton = document.querySelector('#autoClickUpgrade .upgrade-button');
const clickUpgradePriceElement = document.getElementById('clickUpgradePrice');
const autoClickUpgradePriceElement = document.getElementById('autoClickUpgradePrice');
const sellAllButton = document.getElementById('sellAll');

// Цена кейса
const CASE_PRICE = 299;

// Определение кейсов и их содержимого
const cases = {
    dreams: {
        name: "Dreams & Nightmares Case",
        price: 499,
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUuh6qZJmlD7tiyl4OIlaGhYuLTzjhVupJ12urH89ii3lHlqEdoMDr2I5jVLFFSv_J2Rg/256fx256f",
        items: items.filter(item => 
            ["AK-47 | Nightwish", "M4A4 | Temukau", "USP-S | Printstream", 
             "MAC-10 | Toybox", "P250 | Re.built"].includes(item.name))
    },
    danger: {
        name: "Danger Zone Case",
        price: 399,
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUuh6qZJmlD7tiyl4OIlaGhYuLTzjhVupJ12urH89ii3lHlqEdoMDr2I5jVLFFSv_J2Rg/256fx256f",
        items: items.filter(item => 
            ["Desert Eagle | Ocean Drive", "AWP | Chromatic Aberration", "Glock-18 | Neo-Noir", 
             "MP9 | Featherweight", "AWP | Atheris"].includes(item.name))
    },
    fracture: {
        name: "Fracture Case",
        price: 449,
        image: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUuh6qZJmlD7tiyl4OIlaGhYuLTzjhVupJ12urH89ii3lHlqEdoMDr2I5jVLFFSv_J2Rg/256fx256f",
        items: items.filter(item => 
            ["M4A1-S | Printstream", "AK-47 | Legion of Anubis", "Desert Eagle | Trigger Discipline", 
             "XM1014 | Entombed", "MP5-SD | Kitbash"].includes(item.name))
    }
};

// Обновляем переменные DOM
const caseElements = document.querySelectorAll('.case');
const openButtons = document.querySelectorAll('.open-button');
const showContentsButtons = document.querySelectorAll('.show-contents-button');

let currentCase = 'dreams';

// Добавляем демо-игроков для таблицы рекордов
const demoPlayers = [
    { name: "Pro_Player", balance: 25000, inventoryValue: 45000, casesOpened: 85 },
    { name: "CaseKing", balance: 18500, inventoryValue: 65000, casesOpened: 120 },
    { name: "LuckyGamer", balance: 35000, inventoryValue: 28000, casesOpened: 45 },
    { name: "Knife_Hunter", balance: 12000, inventoryValue: 85000, casesOpened: 150 },
    { name: "SkinMaster", balance: 28000, inventoryValue: 38000, casesOpened: 95 }
];

// Загрузка сохранения
function loadGame() {
    if (gameData.playerName) {
        const savedData = localStorage.getItem(`cs2CaseGameData_${gameData.playerName}`);
        if (savedData) {
            gameData = { ...gameData, ...JSON.parse(savedData) };
            updateUI();
        }
    }
}

// Сохранение игры
function saveGame() {
    if (gameData.playerName) {
        localStorage.setItem(`cs2CaseGameData_${gameData.playerName}`, JSON.stringify(gameData));
    }
}

// Обновление интерфейса
function updateUI() {
    balanceElement.textContent = gameData.balance;
    clickValueElement.textContent = gameData.clickValue;
    autoClickValueElement.textContent = gameData.autoClickValue;
    clickUpgradePriceElement.textContent = gameData.clickUpgradePrice;
    autoClickUpgradePriceElement.textContent = gameData.autoClickUpgradePrice;
    
    // Обновляем состояние кнопок улучшений
    clickUpgradeButton.disabled = gameData.balance < gameData.clickUpgradePrice;
    autoClickUpgradeButton.disabled = gameData.balance < gameData.autoClickUpgradePrice;
    
    // Обновляем инвентарь
    updateInventory();
}

// Обновление баланса
function updateBalance() {
    gameData.balance = Math.floor(gameData.balance);
    balanceElement.textContent = gameData.balance;
    updateUI();
    saveGame();
}

// Клик по кнопке
function handleClick(event) {
    if (!event) return;
    
    // Добавляем деньги
    gameData.balance += gameData.clickValue;
    
    // Создаем эффект клика
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    effect.style.left = (x - 25) + 'px';
    effect.style.top = (y - 25) + 'px';
    effect.style.width = '50px';
    effect.style.height = '50px';
    event.target.appendChild(effect);
    
    // Удаляем эффект после анимации
    setTimeout(() => effect.remove(), 500);
    
    // Создаем летящий текст с суммой
    const moneyText = document.createElement('div');
    moneyText.className = 'money-text';
    moneyText.textContent = '+' + gameData.clickValue + '₽';
    moneyText.style.left = x + 'px';
    moneyText.style.top = y + 'px';
    event.target.appendChild(moneyText);
    
    // Удаляем текст после анимации
    setTimeout(() => moneyText.remove(), 1000);
    
    updateBalance();
    updateLeaderboard();
}

// Авто-клик
function autoClick() {
    if (gameData.autoClickValue > 0) {
        gameData.balance += gameData.autoClickValue;
        updateBalance();
    }
}

// Улучшение клика
function upgradeClick() {
    if (gameData.balance >= gameData.clickUpgradePrice) {
        gameData.balance -= gameData.clickUpgradePrice;
        gameData.clickValue += 1;
        gameData.clickUpgradeLevel += 1;
        gameData.clickUpgradePrice = Math.floor(gameData.clickUpgradePrice * 1.5);
        updateUI();
        saveGame();
    }
}

// Улучшение авто-клика
function upgradeAutoClick() {
    if (gameData.balance >= gameData.autoClickUpgradePrice) {
        gameData.balance -= gameData.autoClickUpgradePrice;
        gameData.autoClickValue += 1;
        gameData.autoClickUpgradeLevel += 1;
        gameData.autoClickUpgradePrice = Math.floor(gameData.autoClickUpgradePrice * 1.8);
        updateUI();
        saveGame();
    }
}

// Продажа всех предметов
function sellAllItems() {
    if (gameData.inventory.length === 0) {
        return;
    }
    
    let totalValue = 0;
    gameData.inventory.forEach(item => {
        totalValue += item.price;
    });
    
    gameData.balance += totalValue;
    gameData.inventory = [];
    
    // Создаем уведомление о продаже
    const notification = document.createElement('div');
    notification.textContent = `Продано предметов на ${totalValue}₽`;
    notification.className = 'money-text';
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.fontSize = '24px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.padding = '15px 30px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
    
    updateBalance();
    updateInventory();
    updateLeaderboard();
}

// Создание элемента предмета с улучшенной обработкой ошибок
function createItemElement(item, showSellButton = true) {
    const itemElement = document.createElement('div');
    itemElement.className = `inventory-item ${item.rarity}`;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'item-image-container';
    
    const img = document.createElement('img');
    img.className = 'item-image';
    img.src = getBaseWeaponImage(item.name.split(' | ')[0]); // Set default image immediately
    
    // Try to load the actual skin image
    loadSkinImage(item.name, item.image).then(finalUrl => {
        img.src = finalUrl;
    });

    imageContainer.appendChild(img);
    
    const nameElement = document.createElement('div');
    nameElement.className = 'item-name';
    nameElement.textContent = item.name;
    
    const priceElement = document.createElement('div');
    priceElement.className = 'item-price';
    priceElement.textContent = item.price + '₽';
    
    itemElement.appendChild(imageContainer);
    itemElement.appendChild(nameElement);
    itemElement.appendChild(priceElement);
    
    if (showSellButton) {
        const sellButton = document.createElement('button');
        sellButton.className = 'sell-button';
        sellButton.textContent = 'Sell';
        sellButton.onclick = () => sellItem(item);
        itemElement.appendChild(sellButton);
    }
    
    return itemElement;
}

// Обновляем функцию для получения базового изображения оружия
function getBaseWeaponImage(weaponType) {
    const baseImages = {
        'ak-47': 'https://g.fp.ps.netease.com/market/file/63f5a2d7204538af9f5c0f68TvOiHhQw02',
        'm4a4': 'https://g.fp.ps.netease.com/market/file/63f5a2d797d9bdafd4491f68YKI3hxEw02',
        'awp': 'https://g.fp.ps.netease.com/market/file/63f5a2d797d9bdafd4491f68YKI3hxEw02',
        'usp-s': 'https://g.fp.ps.netease.com/market/file/63f5a2d797d9bdafd4491f68YKI3hxEw02',
        'mac-10': 'https://g.fp.ps.netease.com/market/file/63f5a2d797d9bdafd4491f68YKI3hxEw02',
        'p250': 'https://g.fp.ps.netease.com/market/file/63f5a2d797d9bdafd4491f68YKI3hxEw02',
        'mp9': 'https://g.fp.ps.netease.com/market/file/63f5a2d797d9bdafd4491f68YKI3hxEw02',
        'five-seven': 'https://g.fp.ps.netease.com/market/file/63f5a2d797d9bdafd4491f68YKI3hxEw02'
    };
    
    return baseImages[weaponType] || baseImages['ak-47'];
}

// Продажа отдельного предмета
function sellItem(item) {
    const index = gameData.inventory.findIndex(i => i === item);
    if (index !== -1) {
        gameData.inventory.splice(index, 1);
        gameData.balance += item.price;
        updateBalance();
        updateInventory();
        
        // Создаем уведомление о продаже
        const notification = document.createElement('div');
        notification.textContent = `Продан ${item.name} за ${item.price}₽`;
        notification.className = 'money-text';
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2000);
    }
}

// Инициализация содержимого кейса
function initializeCaseContents() {
    const covertItems = document.querySelector('.covert-items');
    const classifiedItems = document.querySelector('.classified-items');
    const restrictedItems = document.querySelector('.restricted-items');
    const milspecItems = document.querySelector('.milspec-items');

    items.forEach(item => {
        const itemElement = createItemElement(item);
        switch(item.rarity) {
            case 'covert':
                covertItems.appendChild(itemElement.cloneNode(true));
                break;
            case 'classified':
                classifiedItems.appendChild(itemElement.cloneNode(true));
                break;
            case 'restricted':
                restrictedItems.appendChild(itemElement.cloneNode(true));
                break;
            case 'mil-spec':
                milspecItems.appendChild(itemElement.cloneNode(true));
                break;
        }
    });
}

// Генерация случайного предмета с учетом вероятностей
function getRandomItem() {
    const caseData = cases[currentCase];
    if (!caseData) return null;

    const rand = Math.random() * 100;
    const caseItems = caseData.items;

    if (rand < 2) { // 2% шанс на Covert
        const covertItems = caseItems.filter(item => item.rarity === 'covert');
        return covertItems[Math.floor(Math.random() * covertItems.length)];
    } else if (rand < 7) { // 5% шанс на Classified
        const classifiedItems = caseItems.filter(item => item.rarity === 'classified');
        return classifiedItems[Math.floor(Math.random() * classifiedItems.length)];
    } else if (rand < 20) { // 13% шанс на Restricted
        const restrictedItems = caseItems.filter(item => item.rarity === 'restricted');
        return restrictedItems[Math.floor(Math.random() * restrictedItems.length)];
    } else { // 80% шанс на Mil-spec
        const milspecItems = caseItems.filter(item => item.rarity === 'mil-spec');
        return milspecItems[Math.floor(Math.random() * milspecItems.length)];
    }
}

// Добавление предмета в инвентарь
function addToInventory(item) {
    gameData.inventory.push(item);
    const itemElement = createItemElement(item);
    itemElement.classList.add('new-item');
    inventoryItems.prepend(itemElement);
    saveGame();
}

// Обновление инвентаря
function updateInventory() {
    inventoryItems.innerHTML = '';
    gameData.inventory.forEach(item => {
        const itemElement = createItemElement(item);
        inventoryItems.appendChild(itemElement);
    });
}

// Функция для инициализации таблицы рекордов с демо-игроками
function initializeLeaderboard() {
    const leaderboard = getLeaderboard();
    if (!leaderboard.initialized) {
        demoPlayers.forEach(player => {
            ['balance', 'inventory', 'cases'].forEach(category => {
                const value = category === 'balance' ? player.balance :
                             category === 'inventory' ? player.inventoryValue :
                             player.casesOpened;
                leaderboard[category].push({ name: player.name, value: value });
            });
        });
        leaderboard.initialized = true;
        localStorage.setItem('cs2CaseLeaderboard', JSON.stringify(leaderboard));
    }
}

// Обновленная функция получения таблицы рекордов
function getLeaderboard() {
    const defaultLeaderboard = {
        balance: [],
        inventory: [],
        cases: [],
        initialized: false
    };
    return JSON.parse(localStorage.getItem('cs2CaseLeaderboard')) || defaultLeaderboard;
}

// Обновленная функция обновления таблицы рекордов
function updateLeaderboard() {
    if (!gameData.playerName) return;

    const leaderboard = getLeaderboard();
    const inventoryValue = gameData.inventory.reduce((sum, item) => sum + item.price, 0);
    
    ['balance', 'inventory', 'cases'].forEach(category => {
        const value = category === 'balance' ? gameData.balance :
                     category === 'inventory' ? inventoryValue :
                     gameData.casesOpened;

        // Находим существующую запись игрока
        const existingIndex = leaderboard[category].findIndex(p => p.name === gameData.playerName);
        
        if (existingIndex !== -1) {
            // Обновляем значение только если оно больше предыдущего
            if (value > leaderboard[category][existingIndex].value) {
                leaderboard[category][existingIndex].value = value;
            }
        } else {
            // Добавляем нового игрока
            leaderboard[category].push({ name: gameData.playerName, value: value });
        }

        // Сортируем по убыванию и оставляем только топ-10
        leaderboard[category].sort((a, b) => b.value - a.value);
        leaderboard[category] = leaderboard[category].slice(0, 10);
    });

    localStorage.setItem('cs2CaseLeaderboard', JSON.stringify(leaderboard));
    displayLeaderboard(document.querySelector('.category-button.active').dataset.category);
}

// Обновленная функция отображения таблицы рекордов
function displayLeaderboard(category) {
    const leaderboard = getLeaderboard();
    const leaderboardList = document.querySelector('.leaderboard-list');
    leaderboardList.innerHTML = '';

    leaderboard[category].forEach((player, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'leaderboard-item';
        
        // Добавляем классы для стилизации топ-3 игроков
        if (index < 3) {
            itemElement.classList.add(`top-${index + 1}`);
        }
        
        // Добавляем класс для текущего игрока
        if (player.name === gameData.playerName) {
            itemElement.classList.add('current-player');
        }

        itemElement.innerHTML = `
            <div class="leaderboard-position">
                ${index + 1}
                ${index < 3 ? '<i class="fas fa-crown"></i>' : ''}
            </div>
            <div class="leaderboard-name">${player.name}</div>
            <div class="leaderboard-value">
                ${category === 'cases' ? 
                    `${player.value} кейсов` : 
                    `${player.value.toLocaleString()}₽`}
            </div>
        `;
        leaderboardList.appendChild(itemElement);
    });
}

// Добавляем стили для таблицы рекордов
const leaderboardStyles = document.createElement('style');
leaderboardStyles.textContent = `
    .leaderboard-item {
        display: flex;
        align-items: center;
        padding: 15px;
        margin: 10px 0;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        transition: transform 0.2s ease;
    }

    .leaderboard-item:hover {
        transform: translateX(10px);
        background: rgba(255, 255, 255, 0.15);
    }

    .leaderboard-position {
        width: 40px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .leaderboard-name {
        flex: 1;
        margin: 0 15px;
    }

    .leaderboard-value {
        font-weight: bold;
        color: #4CAF50;
    }

    .top-1 {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
        border: 1px solid rgba(255, 215, 0, 0.3);
    }

    .top-2 {
        background: linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(192, 192, 192, 0.1));
        border: 1px solid rgba(192, 192, 192, 0.3);
    }

    .top-3 {
        background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(205, 127, 50, 0.1));
        border: 1px solid rgba(205, 127, 50, 0.3);
    }

    .current-player {
        border: 1px solid #4CAF50;
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
    }

    .fa-crown {
        color: #FFD700;
        font-size: 14px;
    }

    .category-button {
        padding: 10px 20px;
        margin: 0 5px;
        border: none;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .category-button:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .category-button.active {
        background: #4CAF50;
    }
`;
document.head.appendChild(leaderboardStyles);

// Обработчики событий для таблицы рекордов
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('.category-button').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        displayLeaderboard(e.target.dataset.category);
    });
});

// Обработчики событий для кейсов
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initializePlayer();
    updateUI();
    initializeCaseContents();
    initializeLeaderboard();
    displayLeaderboard('balance');
    
    // Добавляем обработчики для кейсов
    document.querySelectorAll('.case').forEach(caseElement => {
        const caseId = caseElement.dataset.case;
        const openButton = caseElement.querySelector('.open-button');
        const showContentsButton = caseElement.querySelector('.show-contents-button');

        openButton.addEventListener('click', () => {
            if (gameData.balance >= cases[caseId].price) {
                currentCase = caseId;
                // Обновляем информацию о выбранном кейсе
                document.getElementById('selected-case-image').src = caseElement.querySelector('img').src;
                document.getElementById('selected-case-name').textContent = cases[caseId].name;
                document.getElementById('selected-case-price').textContent = cases[caseId].price;
                
                // Показываем рулетку
                document.querySelector('.roulette-container').style.display = 'block';
                document.querySelector('.case-opening-header').style.display = 'block';
                document.getElementById('case-contents').style.display = 'none';
                document.querySelector('.cases-grid').style.display = 'none';
                
                // Запускаем рулетку
                spinRoulette();
            } else {
                alert('Недостаточно средств для открытия кейса!');
            }
        });

        showContentsButton.addEventListener('click', () => {
            currentCase = caseId;
            // Скрываем рулетку и показываем содержимое
            document.querySelector('.roulette-container').style.display = 'none';
            document.querySelector('.case-opening-header').style.display = 'none';
            document.getElementById('case-contents').style.display = 'block';
            document.querySelector('.cases-grid').style.display = 'block';
            updateCaseContents();
        });
    });
});

// Обновление содержимого кейса
function updateCaseContents() {
    const caseData = cases[currentCase];
    if (!caseData) return;

    const covertItems = document.querySelector('.covert-items');
    const classifiedItems = document.querySelector('.classified-items');
    const restrictedItems = document.querySelector('.restricted-items');
    const milspecItems = document.querySelector('.milspec-items');

    // Очищаем предыдущее содержимое
    covertItems.innerHTML = '';
    classifiedItems.innerHTML = '';
    restrictedItems.innerHTML = '';
    milspecItems.innerHTML = '';

    // Заполняем новым содержимым
    caseData.items.forEach(item => {
        const itemElement = createItemElement(item, false);
        switch(item.rarity) {
            case 'covert':
                covertItems.appendChild(itemElement);
                break;
            case 'classified':
                classifiedItems.appendChild(itemElement);
                break;
            case 'restricted':
                restrictedItems.appendChild(itemElement);
                break;
            case 'mil-spec':
                milspecItems.appendChild(itemElement);
                break;
        }
    });
}

// Функция для запуска рулетки
function spinRoulette() {
    if (isSpinning) return;
    
    const caseData = cases[currentCase];
    if (!caseData || gameData.balance < caseData.price) return;
    
    isSpinning = true;
    gameData.balance -= caseData.price;
    gameData.casesOpened++;
    updateBalance();
    
    // Очищаем предыдущие предметы
    const itemsContainer = document.querySelector('.items-container');
    itemsContainer.innerHTML = '';
    itemsContainer.style.transform = 'translateX(0)';
    
    // Добавляем индикатор выбора, если его нет
    if (!document.querySelector('.roulette-pointer')) {
        const pointer = document.createElement('div');
        pointer.className = 'roulette-pointer';
        document.querySelector('.roulette-container').appendChild(pointer);
    }
    
    // Генерируем случайные предметы для анимации
    const displayItems = [];
    // Добавляем предметы перед выигрышным
    for (let i = 0; i < 30; i++) {
        const randomItem = getRandomItem();
        displayItems.push({...randomItem, id: `item-${i}`});
    }
    
    // Выбираем выигрышный предмет
    const winningItem = getRandomItem();
    displayItems.push({...winningItem, id: 'winning-item'});
    
    // Добавляем предметы после выигрышного
    for (let i = 0; i < 30; i++) {
        const randomItem = getRandomItem();
        displayItems.push({...randomItem, id: `item-after-${i}`});
    }
    
    // Создаем элементы для рулетки
    displayItems.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.className = `weapon-item ${item.rarity}`;
        itemElement.id = item.id;
        
        // Создаем контейнер для изображения
        const imageContainer = document.createElement('div');
        imageContainer.className = 'weapon-image-container';
        
        // Создаем изображение
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.name;
        image.onerror = function() {
            // Используем соответствующее базовое изображение оружия в зависимости от типа
            const weaponType = item.name.split('|')[0].trim().toLowerCase();
            let fallbackImage = '';
            switch(weaponType) {
                case 'ak-47':
                    fallbackImage = 'weapon_ak47';
                    break;
                case 'm4a4':
                    fallbackImage = 'weapon_m4a1';
                    break;
                case 'awp':
                    fallbackImage = 'weapon_awp';
                    break;
                case 'usp-s':
                    fallbackImage = 'weapon_usp_silencer';
                    break;
                case 'mac-10':
                    fallbackImage = 'weapon_mac10';
                    break;
                case 'p250':
                    fallbackImage = 'weapon_p250';
                    break;
                case 'mp9':
                    fallbackImage = 'weapon_mp9';
                    break;
                case 'five-seven':
                    fallbackImage = 'weapon_fiveseven';
                    break;
                default:
                    fallbackImage = 'weapon_ak47';
            }
            this.src = `https://g.fp.ps.netease.com/market/file/63f5a2d7204538af9f5c0f68TvOiHhQw02`;
        };
        
        // Добавляем изображение в контейнер
        imageContainer.appendChild(image);
        
        // Создаем название предмета
        const nameElement = document.createElement('div');
        nameElement.className = 'name';
        nameElement.textContent = item.name;
        
        // Добавляем элементы в itemElement
        itemElement.appendChild(imageContainer);
        itemElement.appendChild(nameElement);
        
        itemsContainer.appendChild(itemElement);
    });
    
    // Вычисляем смещение для центрирования выигрышного предмета
    const itemWidth = 200; // Ширина элемента + отступы
    const offset = (30 * itemWidth) - (window.innerWidth / 2) + (itemWidth / 2);
    
    // Запускаем анимацию с задержкой
    setTimeout(() => {
        // Добавляем звук прокрутки
        playSpinSound();
        
        // Анимация прокрутки
        itemsContainer.style.transform = `translateX(-${offset}px)`;
        
        setTimeout(() => {
            // Находим выигрышный элемент и добавляем эффект
            const winningElement = document.getElementById('winning-item');
            winningElement.classList.add('winning');
            
            // Звук выигрыша
            playWinSound();
            
            // Добавляем предмет в инвентарь
            addToInventory(winningItem);
            isSpinning = false;
            updateLeaderboard();
            
            // Показываем уведомление о выигрыше
            showWinNotification(winningItem);
            
            // Возвращаем отображение сетки кейсов через 3 секунды
            setTimeout(() => {
                document.querySelector('.roulette-container').style.display = 'none';
                document.querySelector('.case-opening-header').style.display = 'none';
                document.querySelector('.cases-grid').style.display = 'block';
            }, 3000);
        }, 8000);
    }, 100);
}

function showWinNotification(item) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
            <div class="notification-text">
                <div>Вы получили</div>
                <div class="item-name">${item.name}</div>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        // Переключаемся на вкладку инвентаря
        document.querySelectorAll('.tab-button').forEach(button => {
            if (button.dataset.tab === 'inventory') {
                button.click();
            }
        });
    }, 3000);
}

// Функции для звуков
function playSpinSound() {
    // Здесь можно добавить звук прокрутки
}

function playWinSound() {
    // Здесь можно добавить звук выигрыша
}

// Обработка переключения вкладок
function switchTab(event) {
    const targetTab = event.target.dataset.tab;
    
    // Обновляем активную кнопку
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Обновляем активную панель
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(targetTab).classList.add('active');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initializePlayer();
    updateUI();
    initializeCaseContents();
    displayLeaderboard('balance');
    
    // Добавляем обработчики событий для вкладок
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', switchTab);
    });
    
    // Добавляем остальные обработчики событий
    clickerButton.addEventListener('click', handleClick);
    clickUpgradeButton.addEventListener('click', upgradeClick);
    autoClickUpgradeButton.addEventListener('click', upgradeAutoClick);
    sellAllButton.addEventListener('click', sellAllItems);
    
    // Запускаем авто-клик каждую секунду
    setInterval(autoClick, 1000);
    
    // Автосохранение каждые 30 секунд
    setInterval(saveGame, 30000);
    
    // Добавляем кнопку поделиться в верхнюю часть интерфейса
    addShareButton();
});

// Запрашиваем имя игрока при первом запуске
function initializePlayer() {
    if (!gameData.playerName) {
        const name = prompt('Введите ваше имя для таблицы рекордов:');
        if (name) {
            gameData.playerName = name;
            gameData.referralCode = generateReferralCode();
            saveGame();
            initializeReferralSystem();
        }
    } else {
        initializeReferralSystem();
    }
}

// Обновляем стили
const updatedStyles = document.createElement('style');
updatedStyles.textContent = `
    .weapon-image-container {
        width: 140px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
    }
    
    .weapon-image-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
        z-index: 1;
    }
    
    .weapon-image-container img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        transition: transform 0.3s ease;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    }
    
    .weapon-item:hover .weapon-image-container img {
        transform: scale(1.1);
    }
    
    .weapon-item {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        border-radius: 12px;
        padding: 15px;
        transition: all 0.3s ease;
    }
    
    .weapon-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .weapon-item .name {
        margin-top: 10px;
        color: white;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    .sell-button {
        width: 100%;
        margin-top: 10px;
        padding: 8px;
        border: none;
        border-radius: 6px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .sell-button:hover {
        background: linear-gradient(135deg, #45a049, #4CAF50);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(updatedStyles);

// Добавляем кнопку поделиться в верхнюю часть интерфейса
function addShareButton() {
    const shareButton = document.createElement('button');
    shareButton.className = 'share-button';
    shareButton.innerHTML = `
        <i class="fas fa-share-alt"></i>
        Поделиться
    `;
    shareButton.onclick = shareWebsite;
    
    // Добавляем кнопку в header или другой подходящий контейнер
    const header = document.querySelector('.header') || document.querySelector('.container');
    if (header) {
        header.appendChild(shareButton);
    }
}

// Функция для копирования ссылки и отображения уведомления
function shareWebsite() {
    const currentUrl = window.location.href;
    
    // Создаем временный input для копирования
    const tempInput = document.createElement('input');
    tempInput.value = currentUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Создаем и показываем уведомление
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = 'Ссылка скопирована в буфер обмена!';
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 2 секунды
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Добавляем стили для кнопки поделиться и уведомления
const shareStyles = document.createElement('style');
shareStyles.textContent = `
    .share-button {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .share-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background: linear-gradient(135deg, #45a049, #4CAF50);
    }
    
    .share-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(shareStyles);

// Обновляем стили для отображения оружия
const weaponStyles = document.createElement('style');
weaponStyles.textContent = `
    .weapon-item {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3));
        border-radius: 12px;
        padding: 20px;
        margin: 10px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .weapon-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        z-index: 1;
        pointer-events: none;
    }

    .weapon-item:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .weapon-image-container {
        width: 200px;
        height: 150px;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .weapon-image-container::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
        pointer-events: none;
    }

    .weapon-image-container img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
        transition: all 0.3s ease;
    }

    .weapon-item:hover .weapon-image-container img {
        transform: scale(1.1);
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
    }

    .weapon-item .name {
        margin-top: 15px;
        color: white;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .weapon-item.covert {
        background: linear-gradient(135deg, rgba(235, 75, 75, 0.2), rgba(235, 75, 75, 0.1));
        border: 1px solid rgba(235, 75, 75, 0.3);
    }

    .weapon-item.classified {
        background: linear-gradient(135deg, rgba(211, 44, 230, 0.2), rgba(211, 44, 230, 0.1));
        border: 1px solid rgba(211, 44, 230, 0.3);
    }

    .weapon-item.restricted {
        background: linear-gradient(135deg, rgba(136, 71, 255, 0.2), rgba(136, 71, 255, 0.1));
        border: 1px solid rgba(136, 71, 255, 0.3);
    }

    .weapon-item.mil-spec {
        background: linear-gradient(135deg, rgba(75, 105, 255, 0.2), rgba(75, 105, 255, 0.1));
        border: 1px solid rgba(75, 105, 255, 0.3);
    }

    .roulette-container {
        background: rgba(0, 0, 0, 0.5);
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .items-container {
        display: flex;
        gap: 15px;
        padding: 10px;
    }

    .roulette-pointer {
        width: 4px;
        background: linear-gradient(to bottom, 
            rgba(76, 175, 80, 0) 0%,
            rgba(76, 175, 80, 1) 50%,
            rgba(76, 175, 80, 0) 100%
        );
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
    }

    .sell-button {
        width: 100%;
        margin-top: 15px;
        padding: 10px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .sell-button:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, #45a049, #4CAF50);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .inventory-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .rarity-section {
        margin: 30px 0;
        padding: 20px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 15px;
    }

    .rarity-section h3 {
        color: white;
        margin-bottom: 20px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .covert-items, .classified-items, .restricted-items, .milspec-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        padding: 10px;
    }
`;

document.head.appendChild(weaponStyles);

// Функция для генерации реферального кода
function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Обновляем функцию инициализации реферальной системы
function initializeReferralSystem() {
    if (!gameData.referralCode) {
        gameData.referralCode = generateReferralCode();
        saveGame();
    }
    
    // Обновляем элементы интерфейса реферальной системы
    document.getElementById('referralCode').textContent = gameData.referralCode;
    document.getElementById('referralCount').textContent = gameData.referralCount;
    document.getElementById('referralEarnings').textContent = gameData.totalReferralBonus + '₽';
    
    // Обработчик для копирования кода
    const copyButton = document.getElementById('copyCode');
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(gameData.referralCode);
        showNotification('Реферальный код скопирован!');
    });
    
    // Обработчик для активации реферального кода
    const activateButton = document.getElementById('activateReferral');
    const referralInput = document.getElementById('referralInput');
    
    activateButton.addEventListener('click', () => {
        const code = referralInput.value.trim().toUpperCase();
        if (code === gameData.referralCode) {
            showNotification('Вы не можете использовать свой собственный код!', 'error');
            return;
        }
        if (gameData.referredBy) {
            showNotification('Вы уже активировали реферальный код!', 'error');
            return;
        }
        
        // Проверяем код в localStorage
        const allSaves = getAllSaves();
        const referrer = Object.values(allSaves).find(save => save.referralCode === code);
        
        if (referrer) {
            gameData.referredBy = code;
            gameData.balance += 500; // Бонус новому игроку
            
            // Обновляем данные реферера
            referrer.referralCount++;
            referrer.totalReferralBonus += 250;
            referrer.balance += 250; // Бонус пригласившему
            
            // Сохраняем обновленные данные
            saveGame();
            localStorage.setItem(`cs2CaseGameData_${referrer.playerName}`, JSON.stringify(referrer));
            
            showNotification('Реферальный код активирован! Вы получили 500₽!', 'success');
            updateUI();
        } else {
            showNotification('Неверный реферальный код!', 'error');
        }
    });
}

// Обновляем функцию показа уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для разных типов уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 30px;
        border-radius: 8px;
        color: white;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease;
    }
    
    .notification.success {
        background: rgba(76, 175, 80, 0.9);
    }
    
    .notification.error {
        background: rgba(244, 67, 54, 0.9);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Функция для получения всех сохранений
function getAllSaves() {
    const saves = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cs2CaseGameData_')) {
            saves[key] = JSON.parse(localStorage.getItem(key));
        }
    }
    return saves;
} 