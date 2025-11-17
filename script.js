// Состояние игры
const gameState = {
    phase: 'start', // start, location, combat, chooseDirection
    deckMoved: false,
    currentLocation: null,
    inventory: {
        doll: false,
        sword: false,
        amulet: false
    },
    monstersDefeated: 0,
    currentMonsterPower: 0,
    currentDiceRoll: 0,
    usedSword: false,
    
    // Фиксированная последовательность карт
    locationSequence: [
        'start', 'about', 'monster1', 'purpose', 'monster2', 
        'cooperation', 'monster3', 'team'
    ],
    currentLocationIndex: 0,
    
    // Позиции для карт
    cardPositions: {
        'center': { x: 2, y: 2 },
        'top': { x: 2, y: 1 },
        'left': { x: 1, y: 2 },
        'right': { x: 3, y: 2 },
        'bottom': { x: 2, y: 3 }
    },
    
    // Данные о картах
    cardsData: {
        'start': {
            name: 'Стартовая локация',
            image: 'assets/start.png',
            description: 'Солдат возвращается с русско-японской войны. Его сны становятся полем битвы с внутренними демонами...'
        },
        'about': {
            name: 'Об игре',
            image: 'assets/card-about.png',
            description: `ЛОР\nСеттинг – временной период после русско-японской войны\nБэкграунд игрового цикла – солдат, вернувшийся с войны во снах видит кошмары, где сражается с японскими мифическими существами.\nТаким образом игра представляет собой борьбу с внутренними монстрами (ПТСР) и, в зависимости от исхода партии, исцеление или безумие героя\nФормат игры – один против всех. Герой против трех монстров`
        },
        'monster1': {
            name: 'Встреча с Юрэй',
            image: 'assets/card-monster1.png',
            description: 'Призрак павшего воина. Его холодное прикосновение замораживает душу...'
        },
        'purpose': {
            name: 'Для кого и зачем',
            image: 'assets/card-purpose.png',
            description: `Ядро нашей аудитории — «Игровой лидер». Это человек, который знакомит друзей с новыми играми, «заряжает» компанию, читает правила и является душой компании. Мы создаём игру, которая станет его новым козырем в коллекции.\n\nНаша игра идеально подойдёт для трёх сегментов игроков:\n\nСтратеги и тактики. Тем, кто любит выстраивать стратегии, комбинировать карты и наслаждаться чувством контроля над сложной системой.\n\nФанаты мифологии. Те, кто изучает культуру стран, любит погружаться в атмосферные сеттинги. Это люди, которые увлекаются русским и/или японским фольклором, а еще оценят их тонкое переплетение.\n\nВизуалы и эстеты. Те, для кого важен визуальный стиль. Мы создаем визуал, где старославянские узоры встречаются с лаконичной японской графикой.\n\nКому понравится? (Смежный игровой опыт):\nЕсли вы играли в: \n«Ярость дракулы», \n«Шепот за стеной»,\n«Нечто», \n«Тираны подземья», \n«Иниш», \n«Кто накормит кракена?». \nТо вероятнее всего, вам порекомендуют «Сон журавля».`
        },
        'monster2': {
            name: 'Битва с Каппой',
            image: 'assets/card-monster2.png',
            description: 'Речной демон с чашей воды на голове. Опасайтесь его хватки...'
        },
        'cooperation': {
            name: 'Сотрудничество',
            image: 'assets/card-coop.png',
            description: `Что мы предлагаем партнёру-издателю:\n\nГотовый, протестированный концепт\nМы предлагаем прототип настольной игры с продуманным дизайном карт, правилами и готовой визуальной концепцией. Весь предпродакшн — на нас.\n\nУникальное трансмедийное преимущество.\nПараллельно мы ведём разработку компьютерной игры «Сон журавля» — это трансмедийное расширение настольной, но более нарративно насыщенная и продолжительная игра, предназначенная для личного прохождения.\n\nС точки зрения маркетинга — это хорошая возможность для кросс-промоушена. Выход компьютерной игры подогреет интерес к настольной, и наоборот. Мы создаём целый мир для нашей аудитории.\n\nИнициативная и вовлечённая команда.\nМы горим своим проектом. Мы готовы активно участвовать на всех этапов: от доработки дизайна и организации тестирований до поддержки маркетинговых активностей. Будем рады стать вашими партнерами!\n\nЧто мы ищем от партнёра:\n\nЭкспертизу и поддержку в издании.\nМы хотим работать с профессионалами, которые помогут нам вывести игру на рынок и поддержать нас на этапах производстве продукции и дистрибуции.\n\nПартнёрство в маркетинге и продвижении.\nМы верим в наш продукт и готовы вкладывать силы, но нам нужна ваша мощь и опыт в том, чтобы громко заявить о себе и донести игру до нашей целевой аудитории.`
        },
        'monster3': {
            name: 'Схватка с Они',
            image: 'assets/card-monster3.png',
            description: 'Свирепый огненный демон. Его ярость не знает границ...'
        },
        'team': {
            name: 'О команде',
            image: 'assets/card-team.png',
            description: `Мы – KRAW Studio. Группа инициативных любителей настольных игр (и не только)\nИ да, мы достаточно амбициозны (или безумны), чтобы параллельно работать над компьютерной версией той же игровой вселенной. Мы верим в силу трансмедийности и хотим, чтобы наши игроки могли погрузиться в мир игры с любой стороны.\n\nНаша команда: \n\nНастольная игра: \nАнастасия Оглы, Павел Алексеев — гейм-дизайнеры\nАлександра Юрченко и Олеся Кан — графические дизайнеры\nАлександра Волкова — нарративный дизайнер\n\nКомпьютерная игра\nМаксим Усачев — автор идеи, разработчик.\nНикита Старков — саунд-дизайнер.\nДарья Горбунова — левел-дизайнер.\n\nРады познакомиться и надеемся, что вам было с нами весело! Предлагаем и дальше веселиться рука об руку, разрабатывая эту настольную игру!\nНаши контакты:\nПочта: contact@krawstudio.com\nНаши тг: @kraw_studio`
        }
    }
};

// DOM элементы
const deck = document.getElementById('deck');
const gameBoard = document.getElementById('gameBoard');
const inventoryPanel = document.getElementById('inventoryPanel');
const directionsPanel = document.getElementById('directionsPanel');
const gameModal = document.getElementById('gameModal');
const combatModal = document.getElementById('combatModal');

// Инициализация игры
function initGame() {
    // Назначаем обработчики событий
    deck.addEventListener('click', handleDeckClick);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('modalConfirm').addEventListener('click', closeModal);
    document.getElementById('rollDice').addEventListener('click', rollDice);
    document.getElementById('useBareHands').addEventListener('click', () => handleWeaponChoice(false));
    document.getElementById('useSwordCombat').addEventListener('click', () => handleWeaponChoice(true));
    document.getElementById('useDoll').addEventListener('click', useDoll);
    document.getElementById('useSword').addEventListener('click', useSword);
    document.getElementById('useAmulet').addEventListener('click', useAmulet);
    
    // Обработчики для карт направлений
    document.querySelectorAll('.direction-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('disabled')) {
                selectDirection(card.dataset.direction);
            }
        });
    });
    
    // Начальное состояние
    updateInventory();
}

// Обработчик клика по колоде
function handleDeckClick() {
    if (!gameState.deckMoved) {
        // Первый клик - перемещаем колоду и показываем стартовую локацию
        moveDeck();
        setTimeout(() => {
            revealStartLocation();
            showItemCard();
        }, 600);
    } else if (gameState.phase === 'location') {
        // Выкладываем карты вокруг текущей локации
        dealLocationCards();
    }
}

function moveDeck() {
    deck.classList.add('moved');
    gameState.deckMoved = true;
}

function revealStartLocation() {
    const locationKey = 'start';
    createLocationCard('center', locationKey, true);
    gameState.currentLocation = locationKey;
    gameState.phase = 'location';
    
    // Автоматически показываем информацию о стартовой локации
    setTimeout(() => {
        showLocationInfo(locationKey);
    }, 800);
}

function createLocationCard(position, locationKey, isOpen = false) {
    const card = document.createElement('div');
    card.className = `location-card ${isOpen ? '' : 'back'}`;
    card.dataset.position = position;
    card.dataset.location = locationKey;
    
    if (isOpen) {
        const locationData = gameState.cardsData[locationKey];
        card.innerHTML = `<img src="${locationData.image}" alt="${locationData.name}">`;
        card.addEventListener('click', () => showLocationInfo(locationKey));
    } else {
        card.innerHTML = `<img src="assets/back.png" alt="Карта локации">`;
    }
    
    gameBoard.appendChild(card);
    return card;
}

function showItemCard() {
    // Даем игроку куколку-оберег
    gameState.inventory.doll = true;
    updateInventory();
    
    // Показываем панель предметов
    inventoryPanel.classList.remove('hidden');
}

function dealLocationCards() {
    // Убираем предыдущие карты (кроме центральной)
    document.querySelectorAll('.location-card').forEach(card => {
        if (card.dataset.position !== 'center') {
            card.remove();
        }
    });
    
    // Создаем 4 новые карты вокруг
    const positions = ['top', 'left', 'right', 'bottom'];
    positions.forEach(position => {
        createLocationCard(position, 'back', false);
    });
    
    // Прячем панель предметов
    inventoryPanel.classList.add('hidden');
    
    // Показываем панель направлений
    showDirectionsPanel();
}

function showDirectionsPanel() {
    directionsPanel.classList.remove('hidden');
    gameState.phase = 'chooseDirection';
}

function selectDirection(direction) {
    directionsPanel.classList.add('hidden');
    
    // Открываем следующую карту в последовательности
    gameState.currentLocationIndex++;
    const nextLocation = gameState.locationSequence[gameState.currentLocationIndex];
    
    if (nextLocation) {
        openLocationCard(direction, nextLocation);
    }
}

function openLocationCard(position, locationKey) {
    // Убираем все карты кроме центральной
    document.querySelectorAll('.location-card').forEach(card => {
        if (card.dataset.position !== 'center') {
            card.remove();
        }
    });
    
    // Создаем новую карту в выбранной позиции
    createLocationCard(position, locationKey, true);
    
    // Обновляем текущую локацию
    gameState.currentLocation = locationKey;
    gameState.phase = 'location';
    
    // Обрабатываем специальные случаи
    if (locationKey.includes('monster')) {
        startCombat(locationKey);
    } else {
        showLocationInfo(locationKey);
    }
}

function startCombat(monsterKey) {
    gameState.phase = 'combat';
    
    // Устанавливаем силу монстра
    const monsterNumber = parseInt(monsterKey.replace('monster', ''));
    gameState.currentMonsterPower = 10 + monsterNumber - 1;
    
    document.getElementById('monsterPower').textContent = gameState.currentMonsterPower;
    document.getElementById('requiredPower').textContent = gameState.currentMonsterPower + '+';
    document.getElementById('diceResult').textContent = '—';
    
    // Сбрасываем UI
    document.getElementById('combatChoices').classList.add('hidden');
    document.getElementById('weaponChoice').classList.add('hidden');
    
    // Для второго монстра показываем выбор оружия
    if (monsterKey === 'monster2' && gameState.inventory.sword) {
        document.getElementById('weaponChoice').classList.remove('hidden');
    }
    
    combatModal.classList.remove('hidden');
}

function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    gameState.currentDiceRoll = total;
    document.getElementById('diceResult').textContent = `${dice1} + ${dice2} = ${total}`;
    
    setTimeout(() => checkCombatResult(total), 1000);
}

function checkCombatResult(total) {
    const currentMonster = gameState.locationSequence[gameState.currentLocationIndex];
    let success = false;
    
    switch(currentMonster) {
        case 'monster1':
            // Для первого монстра специальная логика - первый бросок должен провалиться
            if (total >= 10) {
                success = true;
            } else {
                showCombatMessage('Ой-ой. Кажется богатырской силушки не хватило... Хорошо, что при начале игры вы получили кое-какой подарок. Попробуйте использовать его!');
                highlightItem('doll');
                document.getElementById('combatChoices').classList.remove('hidden');
                return;
            }
            break;
            
        case 'monster2':
            if (gameState.usedSword) {
                success = total >= 8 && total <= 10;
            } else {
                success = total >= 11;
            }
            break;
            
        case 'monster3':
            if (gameState.usedSword) {
                success = total <= 8;
            } else {
                success = total <= 11;
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
    document.getElementById('weaponChoice').classList.add('hidden');
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
    
    // Применяем изменения в инвентаре
    if (itemChange) {
        if (itemChange.remove) {
            gameState.inventory[itemChange.remove] = false;
        }
        if (itemChange.add) {
            gameState.inventory[itemChange.add] = true;
        }
        updateInventory();
    }
    
    showCombatMessage(message);
    setTimeout(() => {
        closeCombat();
        gameState.phase = 'location';
        gameState.usedSword = false;
    }, 3000);
}

function handleCombatDefeat() {
    if (gameState.monstersDefeated === 2) { // monster3
        showCombatMessage('Ничего страшного! Каждый имеет право на маленькие неудачи. Иначе было бы не так захватывающе, верно? Используйте амулет, чтобы поскорее выбраться из этой скользкой ситуации');
        highlightItem('amulet');
        document.getElementById('combatChoices').classList.remove('hidden');
    } else {
        showCombatMessage('Неудача! Попробуйте еще раз.');
        document.getElementById('diceResult').textContent = '—';
    }
}

function useDoll() {
    gameState.inventory.doll = false;
    updateInventory();
    document.getElementById('combatChoices').classList.add('hidden');
    
    // Перебрасываем кубики с гарантированным успехом
    const guaranteedRoll = 10 + Math.floor(Math.random() * 3); // 10-12
    document.getElementById('diceResult').textContent = `${guaranteedRoll} (переброс)`;
    
    setTimeout(() => {
        handleCombatVictory();
    }, 1000);
}

function useSword() {
    const newTotal = gameState.currentDiceRoll + 3;
    gameState.inventory.sword = false;
    updateInventory();
    document.getElementById('diceResult').textContent = `${gameState.currentDiceRoll} + 3 = ${newTotal}`;
    document.getElementById('combatChoices').classList.add('hidden');
    
    setTimeout(() => {
        if (newTotal >= gameState.currentMonsterPower) {
            handleCombatVictory();
        } else {
            showCombatMessage('Даже с мечом не хватило сил...');
        }
    }, 1000);
}

function useAmulet() {
    gameState.inventory.amulet = false;
    updateInventory();
    showCombatMessage('Вы успешно сбежали с помощью амулета!');
    setTimeout(() => {
        closeCombat();
        gameState.phase = 'location';
    }, 2000);
}

function highlightItem(itemType) {
    const itemCard = document.getElementById(itemType + 'Card');
    itemCard.classList.add('highlight');
    setTimeout(() => {
        itemCard.classList.remove('highlight');
    }, 3000);
}

function showLocationInfo(locationKey) {
    const location = gameState.cardsData[locationKey];
    document.getElementById('modalTitle').textContent = location.name;
    document.getElementById('modalContent').innerHTML = `<p>${location.description.replace(/\n/g, '</p><p>')}</p>`;
    gameModal.classList.remove('hidden');
}

function showCombatMessage(message) {
    document.getElementById('combatTitle').textContent = message;
}

function updateInventory() {
    document.getElementById('dollCard').classList.toggle('hidden', !gameState.inventory.doll);
    document.getElementById('swordCard').classList.toggle('hidden', !gameState.inventory.sword);
    document.getElementById('amuletCard').classList.toggle('hidden', !gameState.inventory.amulet);
}

function closeModal() {
    gameModal.classList.add('hidden');
}

function closeCombat() {
    combatModal.classList.add('hidden');
}

// Запускаем игру при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);
