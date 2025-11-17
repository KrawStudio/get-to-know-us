// Game state
const gameState = {
    phase: 'start',
    deckMoved: false,
    currentLocation: 'start',
    visitedLocations: new Set(['start']),
    inventory: {
        amulet: true,
        sword: false
    },
    monstersDefeated: 0,
    currentMonsterPower: 0,
    availableDirections: ['up', 'left', 'right', 'down'],
    locationSequence: [
        'start', 'about', 'monster1', 'purpose', 'monster2', 
        'cooperation', 'monster3', 'team'
    ],
    currentLocationIndex: 0
};

// DOM elements
const deck = document.getElementById('deck');
const playArea = document.getElementById('play-area');
const slots = {
    center: document.getElementById('center-slot'),
    top: document.getElementById('slot-top'),
    left: document.getElementById('slot-left'),
    right: document.getElementById('slot-right'),
    bottom: document.getElementById('slot-bottom')
};
const inventoryPanel = {
    amulet: document.getElementById('amulet-card'),
    sword: document.getElementById('sword-card')
};
const directionsPanel = document.getElementById('directions-panel');
const modal = document.getElementById('modal');
const combatPanel = document.getElementById('combat-panel');
const locationInfo = document.getElementById('current-location');
const locationName = document.getElementById('location-name');

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
        description: `ЛОР
Сеттинг – временной период после русско-японской войны
Бэкграунд игрового цикла – солдат, вернувшийся с войны во снах видит кошмары, где сражается с японскими мифическими существами.
Таким образом игра представляет собой борьбу с внутренними монстрами (ПТСР) и, в зависимости от исхода партии, исцеление или безумие героя
Формат игры – один против всех. Герой против трех монстров`
    },
    purpose: {
        name: 'Для кого и зачем',
        image: 'assets/card-purpose.png',
        description: `Ядро нашей аудитории — «Игровой лидер». Это человек, который знакомит друзей с новыми играми, «заряжает» компанию, читает правила и является душой компании. Мы создаём игру, которая станет его новым козырем в коллекции.

Наша игра идеально подойдёт для трёх сегментов игроков:

Стратеги и тактики. Тем, кто любит выстраивать стратегии, комбинировать карты и наслаждаться чувством контроля над сложной системой.

Фанаты мифологии. Те, кто изучает культуру стран, любит погружаться в атмосферные сеттинги. Это люди, которые увлекаются русским и/или японским фольклором, а еще оценят их тонкое переплетение.

Визуалы и эстеты. Те, для кого важен визуальный стиль. Мы создаем визуал, где старославянские узоры встречаются с лаконичной японской графикой.

Кому понравится? (Смежный игровой опыт):
Если вы играли в: 
«Ярость дракулы», 
«Шепот за стеной»,
«Нечто», 
«Тираны подземья», 
«Иниш», 
«Кто накормит кракена?». 
То вероятнее всего, вам порекомендуют «Сон журавля».`
    },
    cooperation: {
        name: 'Сотрудничество',
        image: 'assets/card-coop.png',
        description: `Что мы предлагаем партнёру-издателю:

Готовый, протестированный концепт
Мы предлагаем прототип настольной игры с продуманным дизайном карт, правилами и готовой визуальной концепцией. Весь предпродакшн — на нас.

Уникальное трансмедийное преимущество.
Параллельно мы ведём разработку компьютерной игры «Сон журавля» — это трансмедийное расширение настольной, но более нарративно насыщенная и продолжительная игра, предназначенная для личного прохождения.

С точки зрения маркетинга — это хорошая возможность для кросс-промоушена. Выход компьютерной игры подогреет интерес к настольной, и наоборот. Мы создаём целый мир для нашей аудитории.

Инициативная и вовлечённая команда.
Мы горим своим проектом. Мы готовы активно участвовать на всех этапов: от доработки дизайна и организации тестирований до поддержки маркетинговых активностей. Будем рады стать вашими партнерами!

Что мы ищем от партнёра:

Экспертизу и поддержку в издании.
Мы хотим работать с профессионалами, которые помогут нам вывести игру на рынок и поддержать нас на этапах производстве продукции и дистрибуции.

Партнёрство в маркетинге и продвижении.
Мы верим в наш продукт и готовы вкладывать силы, но нам нужна ваша мощь и опыт в том, чтобы громко заявить о себе и донести игру до нашей целевой аудитории.`
    },
    team: {
        name: 'О команде',
        image: 'assets/card-team.png',
        description: `Мы – KRAW Studio. Группа инициативных любителей настольных игр (и не только)
И да, мы достаточно амбициозны (или безумны), чтобы параллельно работать над компьютерной версией той же игровой вселенной. Мы верим в силу трансмедийности и хотим, чтобы наши игроки могли погрузиться в мир игры с любой стороны.

Наша команда: 

Настольная игра: 
Анастасия Оглы, Павел Алексеев — гейм-дизайнеры
Александра Юрченко и Олеся Кан — графические дизайнеры
Александра Волкова — нарративный дизайнер

Компьютерная игра
Максим Усачев — автор идеи, разработчик.
Никита Старков — саунд-дизайнер.
Дарья Горбунова — левел-дизайнер.

Рады познакомиться и надеемся, что вам было с нами весело! Предлагаем и дальше веселиться рука об руку, разрабатывая эту настольную игру!
Наши контакты:
Почта: contact@krawstudio.com
Наши тг: @kraw_studio`
    }
};

const monsterData = {
    monster1: { power: 10, requiredRoll: { min: 1, max: 9 } },
    monster2: { power: 11, requiredRoll: { bareHands: { min: 11, max: 12 }, sword: { min: 8, max: 10 } } },
    monster3: { power: 12, requiredRoll: { withSword: { min: 1, max: 8 }, withoutSword: { min: 1, max: 11 } } }
};

// Initialize game
function initGame() {
    updateInventory();
    locationInfo.classList.remove('hidden');
    updateLocationInfo();
    
    // Event listeners
    deck.addEventListener('click', handleDeckClick);
    document.getElementById('modal-close').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('modal-confirm').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('roll-dice').addEventListener('click', rollDice);
    document.getElementById('use-bare-hands').addEventListener('click', () => handleWeaponChoice(false));
    document.getElementById('use-sword').addEventListener('click', () => handleWeaponChoice(true));
    document.getElementById('use-amulet').addEventListener('click', useAmulet);
    
    inventoryPanel.amulet.addEventListener('click', useAmuletFromInventory);
}

// Deck click handler
function handleDeckClick() {
    if (!gameState.deckMoved) {
        // First click - move deck and reveal start
        moveDeckToCorner();
        revealLocation('start');
        gameState.deckMoved = true;
    } else if (gameState.phase === 'start' || gameState.phase === 'location') {
        // Deal 4 cards around current location
        dealLocationCards();
        gameState.phase = 'chooseDirection';
        showDirectionsPanel();
    }
}

function moveDeckToCorner() {
    deck.classList.add('moved');
}

function revealLocation(locationKey) {
    const location = locationData[locationKey];
    if (!location) return;

    // Clear center slot
    slots.center.innerHTML = '';
    
    // Create location card
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${location.image}" alt="${location.name}" />`;
    card.addEventListener('click', () => showLocationInfo(locationKey));
    
    slots.center.appendChild(card);
    slots.center.classList.add('occupied');
    
    gameState.currentLocation = locationKey;
    gameState.visitedLocations.add(locationKey);
    updateLocationInfo();
    
    // Auto-show info for story locations
    if (['about', 'purpose', 'cooperation', 'team'].includes(locationKey)) {
        showLocationInfo(locationKey);
    }
}

function dealLocationCards() {
    // Show empty slots around current location
    Object.values(slots).forEach(slot => {
        if (slot !== slots.center) {
            slot.classList.add('occupied');
        }
    });
}

function showDirectionsPanel() {
    directionsPanel.classList.remove('hidden');
    
    // Update available directions (prevent going back to visited locations)
    const directionCards = document.querySelectorAll('.dir-card');
    directionCards.forEach(card => {
        const direction = card.dataset.direction;
        // Simple logic to prevent immediate backtracking
        const isDisabled = gameState.visitedLocations.has(direction);
        card.classList.toggle('disabled', isDisabled);
        
        if (!isDisabled) {
            card.onclick = () => selectDirection(direction);
        } else {
            card.onclick = null;
        }
    });
}

function selectDirection(direction) {
    directionsPanel.classList.add('hidden');
    
    // Move to next location in sequence
    gameState.currentLocationIndex++;
    const nextLocation = gameState.locationSequence[gameState.currentLocationIndex];
    
    if (nextLocation.includes('monster')) {
        startCombat(nextLocation);
    } else {
        revealLocation(nextLocation);
        gameState.phase = 'location';
    }
}

function startCombat(monsterKey) {
    gameState.phase = 'combat';
    const monster = monsterData[monsterKey];
    gameState.currentMonsterPower = monster.power;
    
    document.getElementById('monster-power').textContent = monster.power;
    document.getElementById('required-power').textContent = monster.power + '+';
    document.getElementById('dice-result').textContent = '—';
    
    // Show/hide weapon choice based on inventory
    const weaponChoice = document.getElementById('weapon-choice');
    if (monsterKey === 'monster2' && gameState.inventory.sword) {
        weaponChoice.classList.remove('hidden');
    } else {
        weaponChoice.classList.add('hidden');
    }
    
    document.getElementById('escape-panel').classList.add('hidden');
    combatPanel.classList.remove('hidden');
}

function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    document.getElementById('dice-result').textContent = `${dice1} + ${dice2} = ${total}`;
    
    // Check result based on current monster and conditions
    setTimeout(() => checkCombatResult(total), 1000);
}

function checkCombatResult(total) {
    const currentMonster = Object.keys(monsterData)[gameState.monstersDefeated];
    const monster = monsterData[currentMonster];
    
    let success = false;
    
    switch(currentMonster) {
        case 'monster1':
            success = total >= 10;
            if (!success) {
                showMessage('Ой-ой. Кажется богатырской силушки не хватило... Хорошо, что при начале игры вы получили кое-какой подерок. Попробуйте использовать его!');
                highlightItem('amulet');
                return;
            }
            break;
            
        case 'monster2':
            if (gameState.usedSword) {
                success = total >= monster.requiredRoll.sword.min && total <= monster.requiredRoll.sword.max;
            } else {
                success = total >= monster.requiredRoll.bareHands.min;
            }
            break;
            
        case 'monster3':
            if (gameState.inventory.sword && gameState.usedSword) {
                success = total >= monster.requiredRoll.withSword.min && total <= monster.requiredRoll.withSword.max;
            } else {
                success = total >= monster.requiredRoll.withoutSword.min && total <= monster.requiredRoll.withoutSword.max;
            }
            break;
    }
    
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
    switch(gameState.monstersDefeated) {
        case 1:
            message = 'Другое дело! Видим, теперь вы размялись. За победу над монстром применяется эффект локации "Получить оружие".';
            gameState.inventory.amulet = false;
            gameState.inventory.sword = true;
            updateInventory();
            break;
        case 2:
            if (gameState.usedSword) {
                message = 'Всегда важно грамотно рассчитать силы. Хорошо, что у вас в ножнах оказалось такое оружие! И вновь применяем эффект карты локации – за победу над монстром получите предмет.';
                gameState.inventory.sword = false;
                gameState.inventory.amulet = true;
            } else {
                message = 'Вау! Да вы опытный боец! Поспешим в путь! И вновь применяем эффект карты локации – за победу над монстром получите предмет. Хотя, наверное, такому силачу уже никакие предметы не нужны';
                gameState.inventory.amulet = true;
            }
            updateInventory();
            break;
    }
    
    showMessage(message);
    combatPanel.classList.add('hidden');
    gameState.phase = 'location';
    
    // Continue to next location
    setTimeout(() => {
        gameState.currentLocationIndex++;
        const nextLocation = gameState.locationSequence[gameState.currentLocationIndex];
        revealLocation(nextLocation);
    }, 2000);
}

function handleCombatDefeat() {
    if (gameState.monstersDefeated === 2) { // monster3
        showMessage('Ничего страшного! Каждый имеет право на маленькие неудачи. Иначе было бы не так захватывающе, верно? Используйте амулет, чтобы поскорее выбраться из этой скользкой ситуации');
        document.getElementById('escape-panel').classList.remove('hidden');
        highlightItem('amulet');
    }
}

function useAmulet() {
    combatPanel.classList.add('hidden');
    document.getElementById('escape-panel').classList.add('hidden');
    gameState.inventory.amulet = false;
    updateInventory();
    
    // Continue game
    gameState.phase = 'location';
    gameState.currentLocationIndex++;
    const nextLocation = gameState.locationSequence[gameState.currentLocationIndex];
    revealLocation(nextLocation);
}

function useAmuletFromInventory() {
    if (gameState.phase === 'combat' && gameState.monstersDefeated === 2) {
        useAmulet();
    }
}

function highlightItem(itemType) {
    inventoryPanel[itemType].classList.add('highlight');
}

function showLocationInfo(locationKey) {
    const location = locationData[locationKey];
    if (!location) return;
    
    document.getElementById('modal-title').textContent = location.name;
    document.getElementById('modal-body').innerHTML = `<p>${location.description.replace(/\n/g, '</p><p>')}</p>`;
    document.getElementById('modal-confirm').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function showMessage(message) {
    document.getElementById('modal-title').textContent = 'Сон Журавля';
    document.getElementById('modal-body').innerHTML = `<p>${message}</p>`;
    document.getElementById('modal-confirm').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function updateInventory() {
    inventoryPanel.amulet.classList.toggle('hidden', !gameState.inventory.amulet);
    inventoryPanel.sword.classList.toggle('hidden', !gameState.inventory.sword);
}

function updateLocationInfo() {
    const location = locationData[gameState.currentLocation];
    if (location) {
        locationName.textContent = location.name;
    }
}

// Utility functions
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize game when loaded
document.addEventListener('DOMContentLoaded', initGame);
