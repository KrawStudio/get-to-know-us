// Простая игровая логика, последовательность раскрытия карт и визуальные анимации.
// Требование: все изображения положите в папку assets (back.png, start.png, item-amulet.png, dir1..dir4.png, card-about.png, card-monster.png, card-purpose.png, card-coop.png, card-team.png)

const deck = document.getElementById('deck');
const itemPanel = document.getElementById('item-panel');
const itemCard = document.getElementById('item-card');
const slots = {
  center: document.getElementById('center-slot'),
  top: document.getElementById('slot-top'),
  left: document.getElementById('slot-left'),
  right: document.getElementById('slot-right'),
  bottom: document.getElementById('slot-bottom'),
};
const directionsStrip = document.getElementById('directions');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const dicePanel = document.getElementById('dice-panel');
const rollBtn = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');

let state = {
  deckMoved: false,
  phase: 'start', // 'start', 'dealt4', 'chooseDir', 'moving'
  // sequence order on any chosen direction:
  revealOrder: ['about','monster','purpose','monster2','coop','monster3','team'],
  revealIndex: 0
};

// helper to create img element for a card
function makeCardImg(src, alt){
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  return img;
}

// Step 1: click deck -> move to bottom-left and reveal start
deck.addEventListener('click', async () => {
  if (!state.deckMoved){
    moveDeckToCorner();
    await delay(650);
    // Place start card in center slot
    revealCardInSlot(slots.center, 'assets/start.png', 'Стартовая локация', true);
    // show side item
    showItemPanel();
    // now enable next step (dealing 4)
    state.deckMoved = true;
    state.phase = 'start-dealt';
  } else if (state.deckMoved && (state.phase === 'start-dealt' || state.phase === 'chooseDir')){
    // second (or subsequent) click: deal 4 location backs around center (rubashka)
    dealFourAround();
    state.phase = 'dealt4';
    // show directions strip and make directions clickable
    directionsStrip.classList.remove('hidden');
  } else {
    // other states: ignore or log
    // allow repeated deals, but only when allowed
  }
});

function moveDeckToCorner(){
  deck.classList.add('moved');
}

function showItemPanel(){
  itemPanel.classList.remove('hidden');
  // item card already has image (item-amulet.png)
  // make it hover-enlarge via CSS (done)
}

/* revealCardInSlot(slot, imgSrc, title, openModalOnClick) */
function revealCardInSlot(slot, imgSrc, title, openOnClick){
  slot.innerHTML = '';
  const c = document.createElement('div');
  c.className = 'card visible-card';
  c.style.width = '100%';
  c.style.height = '100%';
  c.style.position = 'absolute';
  c.appendChild(makeCardImg(imgSrc, title));
  slot.appendChild(c);
  slot.classList.add('visible');
  if (openOnClick){
    c.style.cursor = 'pointer';
    c.addEventListener('click', () => {
      openModal(title, 'Это стартовая локация. Эффект: начать игру на знакомство. Полученные предметы: куколька-оберег.')
    });
  }
}

// deal 4 rubashka cards around center
function dealFourAround(){
  const backs = ['assets/back.png','assets/back.png','assets/back.png','assets/back.png'];
  const positions = ['top','left','right','bottom'];
  positions.forEach((pos,i) => {
    const slot = slots[pos];
    slot.innerHTML = '';
    // show back (face-down)
    const back = document.createElement('div');
    back.className = 'card back-face';
    back.style.width = '100%';
    back.style.height = '100%';
    back.appendChild(makeCardImg(backs[i], 'back'));
    slot.appendChild(back);
    slot.classList.add('visible');
  });
  // hide the item to the right (simulate it moved to right)
  // item card should be visually tucked; we'll keep visible but it can be hovered to enlarge
  itemPanel.style.top = '30%';
  // prepare directions interaction
  state.phase = 'chooseDir';
}

// Modal handling
function openModal(title, body){
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.classList.remove('hidden');
}
modalClose.addEventListener('click', ()=> modal.classList.add('hidden'));
modal.addEventListener('click', (e)=> { if (e.target===modal) modal.classList.add('hidden') });

// Directions: clicking on one triggers reveal sequence (fixed)
document.querySelectorAll('.dir-card').forEach(card=>{
  card.addEventListener('click', async (e) => {
    if (state.phase !== 'chooseDir' && state.phase !== 'dealt4') return;
    const idx = +card.dataset.index;
    // reveal sequence: in our demo, first show "about" card
    await revealSequence();
  });
});

// revealSequence opens cards in predefined order. We will place the revealed cards in center (replace)
async function revealSequence(){
  state.phase = 'moving';
  for (let i=0;i<state.revealOrder.length;i++){
    const key = state.revealOrder[i];
    await revealNamedCard(key);
    await delay(900);
  }
  // after sequence, return to choosing new deals
  state.phase = 'start-dealt';
  directionsStrip.classList.remove('hidden');
}

// map names to images and behavior
const cardDefs = {
  about: {img:'assets/card-about.png', title:'Об игре', body:'Информация об игре: правила, цель, кто мы.'},
  monster: {img:'assets/card-monster.png', title:'Монстр', body:'Вы встретили монстра! Можете бросить 2D6.'},
  purpose: {img:'assets/card-purpose.png', title:'Для кого и зачем', body:'Кому и для чего предназначена эта игра.'},
  monster2: {img:'assets/card-monster.png', title:'Монстр', body:'Вы встретили монстра! Можете бросить 2D6.'},
  coop: {img:'assets/card-coop.png', title:'Сотрудничество', body:'Задачи на совместную игру.'},
  monster3: {img:'assets/card-monster.png', title:'Монстр', body:'Вы встретили монстра! Можете бросить 2D6.'},
  team: {img:'assets/card-team.png', title:'О команде', body:'Информация о команде и авторах.'}
};

async function revealNamedCard(key){
  const def = cardDefs[key];
  // place it in center slot (simulate slide)
  slots.center.innerHTML = '';
  const c = document.createElement('div');
  c.style.width='100%';c.style.height='100%';
  c.appendChild(makeCardImg(def.img, def.title));
  slots.center.appendChild(c);
  slots.center.classList.add('visible');
  // if it's a monster - show dice control
  if (key.startsWith('monster')){
    showDicePanel();
    // wait for dice roll by user (or auto)
    await waitForDiceRoll();
    hideDicePanel();
  }
  // allow clicking to read text
  c.style.cursor='pointer';
  c.onclick = () => openModal(def.title, def.body);
  return;
}

function showDicePanel(){ dicePanel.classList.remove('hidden'); }
function hideDicePanel(){ dicePanel.classList.add('hidden'); }
function waitForDiceRoll(){
  return new Promise((resolve) => {
    // if already rolled, resolve
    function onRoll(){
      resolve();
      rollBtn.removeEventListener('click', onRoll);
    }
    rollBtn.addEventListener('click', onRoll);
  });
}
rollBtn.addEventListener('click', ()=>{
  const a = randInt(1,6), b = randInt(1,6);
  diceResult.textContent = `${a} + ${b} = ${a+b}`;
});

// utilities
function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
