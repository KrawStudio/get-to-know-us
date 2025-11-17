// Game state
const gameState = {
    phase: 'start',
    deckMoved: false,
    currentLocation: null,
    visitedLocations: new Set(),
    inventory: {
        doll: true,    // Куколка-оберег (начальный предмет)
        sword: false,  // Меч-кладенец
        amulet: false  // Защитный амулет
    },
    monstersDefeated: 0,
    currentMonsterPower: 0,
    usedSword: false,
    locationSequence: [
        'start', 'about', 'monster1', 'purpose', 'monster2', 
        'cooperation', 'monster3', 'team'
    ],
    currentLocationIndex: -1
};

// DOM elements
const deck = document.getElementById('deck');
const slots = {
    center: document.getElementById('center-slot'),
    top: document.getElementById('slot-top'),
    left: document.getElementById('slot-left'),
    right: document.getElementById('slot-right'),
    bottom: document.getElementById('slot-bottom')
};
const inventoryPanel = {
    doll: document.getElementById('doll-card'),
    sword: document.getElementById('sword-card'),
    amulet: document.getElementById('amulet-card')
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
        description: 'Солдат возвращается с русско-японской войны. Его сны становятся полем битвы с внутренними демонами... Вы получаете куколку-оберег для защиты в этом кошмарном путешествии.'
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
    monster1: { 
        power: 10, 
        requiredRoll: { min: 10, max: 12 },
        failureRoll: { min: 1, max: 9 }
    },
    monster2: { 
        power: 11, 
        requiredRoll: { 
            bareHands: { min: 11, max: 12 }, 
            sword: { min: 8, max: 10 } 
        }
    },
    monster3: { 
        power: 12, 
        requiredRoll: { 
            withSword: { min: 1, max: 8 }, 
            withoutSword: { min: 1, max: 11 } 
        }
    }
};

// Initialize game
function initGame() {
    updateInventory();
    locationInfo.classList.remove('hidden');
    
    // Event listeners
    deck.addEventListener('click', handleDeckClick);
    document.getElementById('modal-close').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('modal-confirm').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('roll-dice').addEventListener('click', rollDice);
    document.getElementById('use-bare-hands').addEventListener('click', () => handleWeaponChoice(false));
    document.getElementById('use-sword').addEventListener('click', () => handleWeaponChoice(true));
    document.getElementById('use-amulet').addEventListener('click', useAmulet);
    
    inventoryPanel.doll.addEventListener('click', useDollFromInventory);
    inventoryPanel.amulet.addEventListener('click', useAmuletFromInventory);
}

// Deck click handler
function handleDeckClick() {
    if (!gameState.deckMoved) {
        // First click - move deck and reveal start
        moveDeckToCorner();
        revealNextLocation();
        gameState.deckMoved = true;
    } else if (gameState.phase === 'location') {
        // Deal 4 cards around current location
        dealLocationCards();
        gameState.phase = 'chooseDirection';
        showDirectionsPanel();
    }
}

function moveDeckToCorner() {
    deck.classList.add('moved');
}

function revealNextLocation() {
    gameState.currentLocationIndex++;
    const locationKey = gameState.locationSequence[gameState.currentLocationIndex];
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
    
    // Handle different location types
    if (locationKey.includes('monster')) {
        startCombat(locationKey);
    } else if (['about', 'purpose', 'cooperation', 'team'].includes(locationKey)) {
        showLocationInfo(locationKey);
    }
    
    gameState.phase = 'location';
}

function dealLocationCards() {
    // Show empty slots around current location
    Object.values(slots).forEach(slot => {
        if (slot !== slots.center) {
            slot.classList.add('occupied');
            slot.innerHTML = '<div class="card-back"></div>';
        }
    });
}

function showDirectionsPanel() {
    directionsPanel.classList.remove('hidden');
    
    // Update available directions
    const directionCards = document.querySelectorAll('.dir-card');
    const availableDirections = ['up', 'left', 'right', 'down'];
    
    directionCards.forEach(card => {
        const direction = card.dataset.direction;
        const isAvailable = availableDirections.includes(direction);
        
        card.classList.toggle('disabled', !isAvailable);
        
        if (isAvailable) {
            card.onclick = () => selectDirection(direction);
        } else {
            card.onclick = null;
        }
    });
}

function selectDirection(direction) {
    directionsPanel.classList.add('hidden');
    clearSlots();
    revealNextLocation();
}

function clearSlots() {
    Object.values(slots).forEach(slot => {
        if (slot !== slots.center) {
            slot.classList.remove('occupied');
            slot.innerHTML = '';
        }
    });
}

function startCombat(monsterKey) {
    gameState.phase = 'combat';
    const monster = monsterData[monsterKey];
    gameState.currentMonsterPower = monster.power;
    
    document.getElementById('monster-power').textContent = monster.power;
    document.getElementById('required-power').textContent = monster.power + '+';
    document.getElementById('dice-result').textContent = '—';
    
    // Show/hide weapon choice based on inventory and monster
    const weaponChoice = document.getElementById('weapon-choice');
    const escapePanel = document.getElementById('escape-panel');
    
    weaponChoice.classList.add('hidden');
    escapePanel.classList.add('hidden');
    
    if (monsterKey === 'monster2' && gameState.inventory.sword) {
        weaponChoice.classList.remove('hidden');
    }
    
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
    const currentMonsterKey = gameState.locationSequence[gameState.currentLocationIndex];
    const monster = monsterData[currentMonsterKey];
    
    let success = false;
    let usedItem = null;
    
    switch(currentMonsterKey) {
        case 'monster1':
            if (total >= monster.requiredRoll.min && total <= monster.requiredRoll.max) {
                success = true;
            } else if (total >= monster.failureRoll.min && total <= monster.failureRoll.max) {
                // Failure case for monster1 - suggest using doll
                showMessage('Ой-ой. Кажется богатырской силушки не хватило... Хорошо, что при начале игры вы получили кое-какой подарок. Попробуйте использовать его!');
                highlightItem('doll');
                return;
            }
            break;
            
        case 'monster2':
            if (gameState.usedSword) {
                success = total >= monster.requiredRoll.sword.min && total <= monster.requiredRoll.sword.max;
                usedItem = 'sword';
            } else {
                success = total >= monster.requiredRoll.bareHands.min && total <= monster.requiredRoll.bareHands.max;
            }
            break;
            
        case 'monster3':
            if (gameState.inventory.sword && gameState.usedSword) {
                success = total >= monster.requiredRoll.withSword.min && total <= monster.requiredRoll.withSword.max;
                usedItem = 'sword';
            } else {
                success = total >= monster.requiredRoll.withoutSword.min && total <= monster.requiredRoll.withoutSword.max;
            }
            break;
    }
    
    if (success) {
        handleCombatVictory(usedItem);
    } else {
        handleCombatDefeat();
    }
}

function handleWeaponChoice(useSword) {
    gameState.usedSword = useSword;
    document.getElementById('weapon-choice').classList.add('hidden');
    rollDice();
}

function handleCombatVictory(usedItem) {
    gameState.monstersDefeated++;
    
    let message = '';
    let itemChange = null;
    
    switch(gameState.monstersDefeated) {
        case 1:
            message = 'Другое дело! Видим, теперь вы размялись. За победу над монстром применяется эффект локации "Получить оружие".';
            itemChange = { remove: 'doll', add: 'sword' };
            break;
        case 2:
            if (usedItem === 'sword') {
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
    
    // Apply item changes
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
    combatPanel.classList.add('hidden');
    gameState.phase = 'location';
    gameState.usedSword = false;
}

function handleCombatDefeat() {
    if (gameState.monstersDefeated === 2) { // monster3
        showMessage('Ничего страшного! Каждый имеет право на маленькие неудачи. Иначе было бы не так захватывающе, верно? Используйте амулет, чтобы поскорее выбраться из этой скользкой ситуации');
        document.getElementById('escape-panel').classList.remove('hidden');
        highlightItem('amulet');
    } else {
        showMessage('Неудача! Попробуйте снова или используйте предмет для помощи.');
        // Allow retry
        document.getElementById('dice-result').textContent = '—';
    }
}

function useDollFromInventory() {
    if (gameState.phase === 'combat' && gameState.monstersDefeated === 0) {
        // Reroll with doll bonus
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2 + 2; // Doll gives +2 bonus
        
        document.getElementById('dice-result').textContent = `${dice1} + ${dice2} + 2 (амулет) = ${total}`;
        
        setTimeout(() => {
            if (total >= 10) {
                gameState.inventory.doll = false;
                updateInventory();
                handleCombatVictory();
            }
        }, 1000);
    }
}

function useAmulet() {
    combatPanel.classList.add('hidden');
    document.getElementById('escape-panel').classList.add('hidden');
    gameState.inventory.amulet = false;
    updateInventory();
    
    // Continue game (escape from combat)
    gameState.phase = 'location';
    revealNextLocation();
}

function useAmuletFromInventory() {
    if (gameState.phase === 'combat' && gameState.monstersDefeated === 2) {
        useAmulet();
    }
}

function highlightItem(itemType) {
    inventoryPanel[itemType].classList.add('highlight');
    // Remove highlight after 3 seconds
    setTimeout(() => {
        inventoryPanel[itemType].classList.remove('highlight');
    }, 3000);
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
    inventoryPanel.doll.classList.toggle('hidden', !gameState.inventory.doll);
    inventoryPanel.sword.classList.toggle('hidden', !gameState.inventory.sword);
    inventoryPanel.amulet.classList.toggle('hidden', !gameState.inventory.amulet
