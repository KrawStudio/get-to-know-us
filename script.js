// Game state
const gameState = {
    phase: 'start',
    deckMoved: false,
    currentLocation: null,
    visitedLocations: new Set(),
    inventory: {
        doll: true,
        sword: false,
        amulet: false
    },
    monstersDefeated: 0,
    currentMonsterPower: 0,
    currentDiceRoll: 0,
    usedSword: false,
    
    // Новая система координат для карт
    cards: new Map(), // key: "x-y", value: card data
    currentCardPos: { x: 0, y: 0 }, // текущая позиция в сетке
    
    // Последовательность локаций
    locationSequence: [
        'start', 'about', 'monster1', 'purpose', 'monster2', 
        'cooperation', 'monster3', 'team'
    ],
    currentLocationIndex: 0
};

// DOM elements
const deck = document.getElementById('deck');
const gameBoard = document.getElementById('game-board');
const inventoryPanel = {
    doll: document.getElementById('doll-card'),
    sword: document.getElementById('sword-card'),
    amulet: document.getElementById('amulet-card')
};

// Game data
const locationData = {
    start: {
        name: 'Стартовая локация',
        image: 'assets/start.png',
        description: 'Солдат возвращается с русско-японской войны. Его сны становятся полем битвы с внутренними демонами...'
    },
    about: {
        name: 'Об игре',
        image: 'assets/card-about.png',
        description: `ЛОР\nСеттинг – временной период после русско-японской войны\nБэкграунд игрового цикла – солдат, вернувшийся с войны во снах видит кошмары, где сражается с японскими мифическими существами.\nТаким образом игра представляет собой борьбу с внутренними монстрами (ПТСР) и, в зависимости от исхода партии, исцеление или безумие героя\nФормат игры – один против всех. Герой против трех монстров`
    },
    monster1: {
        name: 'Встреча с Юрэй',
        image: 'assets/card-monster1.png',
        description: 'Призрак павшего воина. Его холодное прикосновение замораживает душу...'
    },
    purpose: {
        name: 'Для кого и зачем',
        image: 'assets/card-purpose.png',
        description: `Ядро нашей аудитории — «Игровой лидер». Это человек, который знакомит друзей с новыми играми, «заряжает» компанию, читает правила и является душой компании. Мы создаём игру, которая станет его новым козырем в коллекции.\n\nНаша игра идеально подойдёт для трёх сегментов игроков:\n\nСтратеги и тактики. Тем, кто любит выстраивать стратегии, комбинировать карты и наслаждаться чувством контроля над сложной системой.\n\nФанаты мифологии. Те, кто изучает культуру стран, любит погружаться в атмосферные сеттинги. Это люди, которые увлекаются русским и/или японским фольклором, а еще оценят их тонкое переплетение.\n\nВизуалы и эстеты. Те, для кого важен визуальный стиль. Мы создаем визуал, где старославянские узоры встречаются с лаконичной японской графикой.\n\nКому понравится? (Смежный игровой опыт):\nЕсли вы играли в: \n«Ярость дракулы», \n«Шепот за стеной»,\n«Нечто», \n«Тираны подземья», \n«Иниш», \n«Кто накормит кракена?». \nТо вероятнее всего, вам порекомендуют «Сон журавля».`
    },
    monster2: {
        name: 'Битва с Каппой',
        image: 'assets/card-monster2.png',
        description: 'Речной демон с чашей воды на голове. Опасайтесь его хватки...'
    },
    cooperation: {
        name: 'Сотрудничество',
        image: 'assets/card-coop.png',
        description: `Что мы предлагаем партнёру-издателю:\n\nГотовый, протестированный концепт\nМы предлагаем прототип настольной игры с продуманным дизайном карт, правилами и готовой визуальной концепцией. Весь предпродакшн — на нас.\n\nУникальное трансмедийное преимущество.\nПараллельно мы ведём разработку компьютерной игры «Сон журавля» — это трансмедийное расширение настольной, но более нарративно насыщенная и продолжительная игра, предназначенная для личного прохождения.\n\nС точки зрения маркетинга — это хорошая возможность для кросс-промоушена. Выход компьютерной игры подогреет интерес к настольной, и наоборот. Мы создаём целый мир для нашей аудитории.\n\nИнициативная и вовлечённая команда.\nМы горим своим проектом. Мы готовы активно участвовать на всех этапов: от доработки дизайна и организации тестирований до поддержки маркетинговых активностей. Будем рады стать вашими партнерами!\n\nЧто мы ищем от партнёра:\n\nЭкспертизу и поддержку в издании.\nМы хотим работать с профессионалами, которые помогут нам вывести игру на рынок и поддержать нас на этапах производстве продукции и дистрибуции.\n\nПартнёрство в маркетинге и продвижении.\nМы верим в наш продукт и готовы вкладывать силы, но нам нужна ваша мощь и опыт в том, чтобы громко заявить о себе и донести игру до нашей целевой аудитории.`
    },
    monster3: {
        name: 'Схватка с Они',
        image: 'assets/card-monster3.png',
        description: 'Свирепый огненный демон. Его ярость не знает границ...'
    },
    team: {
        name: 'О команде',
        image: 'assets/card-team.png',
        description: `Мы – KRAW Studio. Группа инициативных любителей настольных игр (и не только)\nИ да, мы достаточно амбициозны (или безумны), чтобы параллельно работать над компьютерной версией той же игровой вселенной. Мы верим в силу трансмедийности и хотим, чтобы наши игроки могли погрузиться в мир игры с любой стороны.\n\nНаша команда: \n\nНастольная игра: \nАнастасия Оглы, Павел Алексеев — гейм-дизайнеры\nАлександра Юрченко и Олеся Кан — графические дизайнеры\nАлександра Волкова — нарративный дизайнер\n\nКомпьютерная игра\nМаксим Усачев — автор идеи, разработчик.\nНикита Старков — саунд-дизайнер.\nДарья Горбунова — левел-дизайнер.\n\nРады познакомиться и надеемся, что вам было с нами весело! Предлагаем и дальше веселиться рука об руку, разрабатывая эту настольную игру!\nНаши контакты:\nПочта: contact@krawstudio.com\nНаши тг: @kraw_studio`
    }
};

const monsterData = {
    monster1: { power: 10 },
    monster2: { power: 11 },
    monster3: { power: 12 }
};

// Initialize game
function initGame() {
    updateInventory();
    
    // Event listeners
    deck.addEventListener('click', handleDeckClick);
    document.getElementById('modal-close').addEventListener('click', () => closeModal());
    document.getElementById('modal-confirm').addEventListener('click', () => closeModal());
    document.getElementById('roll-dice').addEventListener('click', rollDice);
    document.getElementById('use-bare-hands').addEventListener('click', () => handleWeaponChoice(false));
    document.getElementById('use-sword').addEventListener('click', () => handleWeaponChoice(true));
    document.getElementById('use-amulet-escape').addEventListener('click', useAmuletForEscape);
    document.getElementById('reroll-dice').addEventListener('click', rerollDiceWithDoll);
    
    // Item usage buttons
    document.getElementById('use-doll').addEventListener('click', useDoll);
    document.getElementById('use-sword-btn').addEventListener('click', useSword);
    document.getElementById('use-amulet-btn').addEventListener('click', useAmulet);
    
    // Inventory click handlers
    inventoryPanel.doll.addEventListener('click', useDollFromInventory);
    inventoryPanel.sword.addEventListener('click', useSwordFromInventory);
    inventoryPanel.amulet.addEventListener('click', useAmuletFromInventory);
    
    // Direction cards event delegation
    document.getElementById('directions-panel').addEventListener('click', (e) => {
        const dirCard = e.target.closest('.dir-card');
        if (dirCard && !dirCard.classList.contains('disabled')) {
            selectDirection(dirCard.dataset.direction);
        }
    });
}

function handleDeckClick() {
    if (!gameState.deckMoved) {
        // Первый клик - перемещаем колоду и показываем стартовую локацию
        moveDeckToCorner();
        revealStartLocation();
        gameState.deckMoved = true;
    } else if (gameState.phase === 'location') {
        // Последующие клики - выкладываем карты вокруг текущей локации
        dealLocationCards();
        gameState.phase = 'chooseDirection';
        showDirectionsPanel();
    }
}

function moveDeckToCorner() {
    deck.classList.add('moved');
}

function revealStartLocation() {
    const locationKey = 'start';
    createLocationCard(0, 0, locationKey, true);
    gameState.currentLocation = locationKey;
    gameState.visitedLocations.add(locationKey);
    showLocationInfo(locationKey);
    gameState.phase = 'location';
}

function createLocationCard(x, y, locationKey, isOpen = false) {
    const location = locationData[locationKey];
    if (!location) return null;

    const card = document.createElement('div');
    card.className = `location-card ${isOpen ? 'active' : 'back'}`;
    card.dataset.pos = `${x}-${y}`;
    card.dataset.location = locationKey;
    
    if (isOpen) {
        card.innerHTML = `<img src="${location.image}" alt="${location.name}" />`;
        card.addEventListener('click', () => showLocationInfo(locationKey));
    } else {
        card.innerHTML = `<img src="assets/back.png" alt="Карта локации" />`;
    }
    
    gameBoard.appendChild(card);
    gameState.cards.set(`${x}-${y}`, { x, y, locationKey, isOpen });
    
    return card;
}

function dealLocationCards() {
    const directions = [
        { x: 0, y: -1, pos: '0-1' },    // top
        { x: -1, y: 0, pos: '-1-0' },   // left
        { x: 1, y: 0, pos: '1-0' },     // right
        { x: 0, y: 1, pos: '0--1' }     // bottom
    ];
    
    directions.forEach(dir => {
        if (!gameState.cards.has(dir.pos)) {
            createLocationCard(dir.x, dir.y, 'back', false);
        }
    });
}

function showDirectionsPanel() {
    document.getElementById('directions-panel').classList.remove('hidden');
}

function selectDirection(direction) {
    const directionMap = {
        'up': { x: 0, y: -1 },
        'left': { x: -1, y: 0 },
        'right': { x: 1, y: 0 },
        'down': { x: 0, y: 1 }
    };
    
    const targetPos = directionMap[direction];
    const posKey = `${targetPos.x}-${targetPos.y}`;
    
    // Проверяем, есть ли карта в выбранном направлении
    if (gameState.cards.has(posKey)) {
        const card = gameState.cards.get(posKey);
        if (!card.isOpen) {
            // Открываем следующую локацию в последовательности
            gameState.currentLocationIndex++;
            const nextLocation = gameState.locationSequence[gameState.currentLocationIndex];
            
            if (nextLocation) {
                openLocationCard(targetPos.x, targetPos.y, nextLocation);
                document.getElementById('directions-panel').classList.add('hidden');
                gameState.phase = 'location';
            }
        }
    }
}

function openLocationCard(x, y, locationKey) {
    const posKey = `${x}-${y}`;
    const cardElement = document.querySelector(`[data-pos="${posKey}"]`);
    
    if (cardElement) {
        const location = locationData[locationKey];
        cardElement.classList.remove('back');
        cardElement.classList.add('active');
        cardElement.innerHTML = `<img src="${location.image}" alt="${location.name}" />`;
        cardElement.addEventListener('click', () => showLocationInfo(locationKey));
        
        // Обновляем состояние
        gameState.cards.set(posKey, { x, y, locationKey, isOpen: true });
        gameState.currentLocation = locationKey;
        gameState.visitedLocations.add(locationKey);
        gameState.currentCardPos = { x, y };
        
        // Снимаем активность с предыдущей карты
        document.querySelectorAll('.location-card.active').forEach(card => {
            if (card !== cardElement) {
                card.classList.remove('active');
            }
        });
        
        // Если это монстр - начинаем бой
        if (locationKey.includes('monster')) {
            startCombat(locationKey);
        } else if (['about', 'purpose', 'cooperation', 'team'].includes(locationKey)) {
            showLocationInfo(locationKey);
        }
    }
}

function startCombat(monsterKey) {
    gameState.phase = 'combat';
    const monster = monsterData[monsterKey];
    gameState.currentMonsterPower = monster.power;
    
    document.getElementById('monster-power').textContent = monster.power;
    document.getElementById('required-power').textContent = monster.power + '+';
    document.getElementById('dice-result').textContent = '—';
    
    // Reset UI panels
    document.getElementById('item-choices').classList.add('hidden');
    document.getElementById('weapon-choice').classList.add('hidden');
    document.getElementById('escape-panel').classList.add('hidden');
    document.getElementById('reroll-panel').classList.add('hidden');
    
    // Show weapon choice for monster2 if sword available
    if (monsterKey === 'monster2' && gameState.inventory.sword) {
        document.getElementById('weapon-choice').classList.remove('hidden');
    }
    
    document.getElementById('combat-panel').classList.remove('hidden');
}

function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    gameState.currentDiceRoll = total;
    document.getElementById('dice-result').textContent = `${dice1} + ${dice2} = ${total}`;
    
    setTimeout(() => checkCombatResult(total), 1000);
}

function checkCombatResult(total) {
    const success = total >= gameState.currentMonsterPower;
    
    if (success) {
        handleCombatVictory();
    } else {
        handleCombatDefeat();
    }
}

function handleWeaponChoice(useSword) {
    gameState.usedSword = useSword;
    document.getElementById('weapon-choice').classList.add('hidden');
    rollDice();
}

function handleCombatVictory() {
    gameState.monstersDefeated++;
    
    let message = '';
    let itemChange = null;
    
    switch(gameState.monstersDefeated) {
        case 1:
            message = 'Другое дело! Видим, теперь вы размялись. За победу над монстром применяется эффект локации "Получить оружие".';
            itemChange = { remove: 'doll', add: 'sword' };
            break;
        case 2:
            if (gameState.usedSword) {
                message = 'Всегда важно грамотно рассчитать силы. Хорошо, что у вас в ножнах оказалось такое оружие! И вновь применяем эффект карты локации – за победу над монстром получите предмет.';
                itemChange = { remove: 'sword', add: 'amulet' };
            } else {
                message = 'Вау! Да вы опытный боец! Поспешим в путь! И вновь применяем эффект карты локации – за победу над монстром получите предмет. Хотя, наверное, такому силачу уже никакие предметы не нужны';
                itemChange = { add: 'amulet' };
            }
            break;
        case 3:
            message = 'Потрясающе! Вы победили всех монстров! Герой находит душевный покой...';
            break;
    }
    
    if (itemChange) {
        if (itemChange.remove) {
            gameState.inventory[itemChange.remove] = false;
        }
        if (itemChange.add) {
            gameState.inventory[itemChange.add] = true;
        }
        updateInventory();
    }
    
    showMessage(message);
    closeCombat();
    gameState.phase = 'location';
    gameState.usedSword = false;
}

function handleCombatDefeat() {
    // Show item choices after failure
    showItemChoices();
}

function showItemChoices() {
    const itemChoices = document.getElementById('item-choices');
    itemChoices.innerHTML = '<p>Использовать предмет:</p>';
    
    if (gameState.inventory.doll) {
        const dollBtn = document.createElement('button');
        dollBtn.className = 'btn item-btn';
        dollBtn.textContent = 'Куколка-оберег (переброс)';
        dollBtn.onclick = useDoll;
        itemChoices.appendChild(dollBtn);
    }
    
    if (gameState.inventory.sword && !gameState.usedSword) {
        const swordBtn = document.createElement('button');
        swordBtn.className = 'btn item-btn';
        swordBtn.textContent = 'Меч-кладенец (+3 к броску)';
        swordBtn.onclick = useSword;
        itemChoices.appendChild(swordBtn);
    }
    
    if (gameState.inventory.amulet) {
        const amuletBtn = document.createElement('button');
        amuletBtn.className = 'btn item-btn';
        amuletBtn.textContent = 'Амулет (сбежать)';
        amuletBtn.onclick = useAmulet;
        itemChoices.appendChild(amuletBtn);
    }
    
    if (itemChoices.children.length > 1) {
        itemChoices.classList.remove('hidden');
    } else {
        // No items available, show failure message
        showMessage('Неудача! Попробуйте в следующий раз.');
        setTimeout(() => closeCombat(), 2000);
    }
}

// Item mechanics
function useDoll() {
    gameState.inventory.doll = false;
    updateInventory();
    document.getElementById('item-choices').classList.add('hidden');
    document.getElementById('reroll-panel').classList.remove('hidden');
}

function useSword() {
    const newTotal = gameState.currentDiceRoll + 3;
    gameState.inventory.sword = false;
    updateInventory();
    document.getElementById('dice-result').textContent = 
        `${gameState.currentDiceRoll} + 3 (меч) = ${newTotal}`;
    document.getElementById('item-choices').classList.add('hidden');
    
    setTimeout(() => {
        if (newTotal >= gameState.currentMonsterPower) {
            handleCombatVictory();
        } else {
            showMessage('Даже с мечом не хватило сил...');
            setTimeout(() => closeCombat(), 2000);
        }
    }, 1000);
}

function useAmulet() {
    gameState.inventory.amulet = false;
    updateInventory();
    showMessage('Вы успешно сбежали с помощью амулета!');
    closeCombat();
    gameState.phase = 'location';
}

function rerollDiceWithDoll() {
    document.getElementById('reroll-panel').classList.add('hidden');
    
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    document.getElementById('dice-result').textContent = `${dice1} + ${dice2} = ${total}`;
    
    setTimeout(() => {
        if (total >= gameState.currentMonsterPower) {
            handleCombatVictory();
        } else {
            showMessage('Переброс не помог... Попробуйте другие предметы!');
            showItemChoices();
        }
    }, 1000);
}

function useAmuletForEscape() {
    gameState.inventory.amulet = false;
    updateInventory();
    showMessage('Вы использовали амулет для побега!');
    closeCombat();
    gameState.phase = 'location';
}

// Inventory click handlers
function useDollFromInventory() {
    if (gameState.phase === 'combat' && gameState.inventory.doll) {
        useDoll();
    }
}

function useSwordFromInventory() {
    if (gameState.phase === 'combat' && gameState.inventory.sword && !gameState.usedSword) {
        useSword();
    }
}

function useAmuletFromInventory() {
    if (gameState.phase === 'combat' && gameState.inventory.amulet) {
        useAmulet();
    }
}

function highlightItem(itemType) {
    inventoryPanel[itemType].classList.add('highlight');
    setTimeout(() => {
        inventoryPanel[itemType].classList.remove('highlight');
    }, 3000);
}

function showLocationInfo(locationKey) {
    const location = locationData[locationKey];
    document.getElementById('modal-title').textContent = location.name;
    document.getElementById('modal-body').innerHTML = `<p>${location.description.replace(/\n/g, '</p><p>')}</p>`;
    document.getElementById('modal-confirm').classList.remove('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function showMessage(message) {
    document.getElementById('modal-title').textContent = 'Сон Журавля';
    document.getElementById('modal-body').innerHTML = `<p>${message}</p>`;
    document.getElementById('modal-confirm').classList.remove('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function updateInventory() {
    inventoryPanel.doll.classList.toggle('hidden', !gameState.inventory.doll);
    inventoryPanel.sword.classList.toggle('hidden', !gameState.inventory.sword);
    inventoryPanel.amulet.classList.toggle('hidden', !gameState.inventory.amulet);
}

function updateLocationInfo() {
    const location = locationData[gameState.currentLocation];
    if (location) {
        document.getElementById('location-name').textContent = location.name;
        document.getElementById('current-location').classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function closeCombat() {
    document.getElementById('combat-panel').classList.add('hidden');
}

// Direction cards event delegation
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('directions-panel').addEventListener('click', function(e) {
        if (e.target.classList.contains('dir-card') && !e.target.classList.contains('disabled')) {
            selectDirection(e.target.dataset.direction);
        }
    });
});

// Initialize game when loaded
document.addEventListener('DOMContentLoaded', initGame);
