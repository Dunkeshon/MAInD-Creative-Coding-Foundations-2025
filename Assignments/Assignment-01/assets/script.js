const addButton = document.getElementById('add-btn');
const emptyState = document.getElementById('empty-state');

const listButton = document.getElementById('list-view-switch');
console.log(listButton);
const cardButton = document.getElementById('card-view-switch');
console.log(cardButton);

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list-container');

const updateEmptyState = () => {
    if (taskList.children.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'flex';
    }
};

updateEmptyState();

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        addButton.click(); // Trigger the add button click
    }
});

function shakeTaskInput() {
  // visually indicate the error by shaking the input instead of using alert
        // remove class if already present to restart the animation
        taskInput.classList.remove('shake');
        // force reflow so the animation can be restarted immediately
        // eslint-disable-next-line no-unused-expressions
        void taskInput.offsetWidth;
        taskInput.classList.add('shake');
        taskInput.focus();

        // remove the class after animation ends to return to normal state
        const handler = () => {
            taskInput.classList.remove('shake');
            taskInput.removeEventListener('animationend', handler);
        };
        taskInput.addEventListener('animationend', handler);
}

function switchToListView() {
    taskList.classList.remove('card-view');
    taskList.classList.add('list-view');
    listButton.classList.add('active');
    cardButton.classList.remove('active');
}

function switchToCardView() {
    taskList.classList.remove('list-view');
    taskList.classList.add('card-view');
    cardButton.classList.add('active');
    listButton.classList.remove('active');
}

function makeListElementComponent(text){
   return  `
        <p>${text}</p>
        <button class="paint-btn">
                     <img src="assets/imgs/Brush.svg" alt="small fill icon">
            </button>
                <button class="delete-btn">
                     <img src="assets/imgs/Bin.svg" alt="small trashbin icon">
            </button>
           
    `;
}


if (listButton && listButton.matches('.switch-option.active')) {
    switchToListView();
}

listButton.addEventListener('click', switchToListView);

cardButton.addEventListener('click', switchToCardView);

addButton.addEventListener('click', () => {
    if (taskInput.value.trim() === '') {
        shakeTaskInput();
        return;
    }

    const inputValue = taskInput.value;
    const listElement = document.createElement('li');
    listElement.className = 'list-element-container';
    listElement.innerHTML = makeListElementComponent(inputValue);


    const deleteButton = listElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(listElement);
        updateEmptyState(); // Check if we need to show empty state message
    });

    // paint button logic
    const paintButton = listElement.querySelector('.paint-btn');
    // ensure popup can be positioned relative to the note
    listElement.style.position = 'relative';
    paintButton.addEventListener('click', (event) => {
        event.stopPropagation();

        // toggle: remove if already open
        const existingPopup = listElement.querySelector('.cp-popup');
        if (existingPopup) {
            existingPopup.remove();
            return;
        }

        const popup = document.createElement('div');
        popup.className = 'cp-popup';
        popup.innerHTML = `
            <div class="cp-body">
                <button type="button" class="cp-close" aria-label="Close color picker">✕</button>
                <input type="color" class="cp-color" value="#D2E0FB" aria-label="Pick color" />
                <input type="text" class="cp-hex" value="#D2E0FB" aria-label="Hex color" />
            </div>
        `;

        listElement.appendChild(popup);

        const colorInput = popup.querySelector('.cp-color');
        const hexInput = popup.querySelector('.cp-hex');
        const closeBtn = popup.querySelector('.cp-close');

        const applyColor = (hex) => {
            const normalized = hex.startsWith('#') ? hex : `#${hex}`;
            listElement.style.backgroundColor = normalized;
            hexInput.value = normalized.toUpperCase();
            colorInput.value = normalized;
        };

        // initialize with current background if set
        const currentBg = window.getComputedStyle(listElement).backgroundColor;
        // convert rgb to hex when possible
        const rgbMatch = currentBg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
        if (rgbMatch) {
            const toHex = (n) => Number(n).toString(16).padStart(2, '0');
            const hex = `#${toHex(rgbMatch[1])}${toHex(rgbMatch[2])}${toHex(rgbMatch[3])}`;
            colorInput.value = hex;
            hexInput.value = hex.toUpperCase();
        }

        colorInput.addEventListener('input', (e2) => {
            applyColor(e2.target.value);
        });

        hexInput.addEventListener('input', (e3) => {
            const raw = e3.target.value.trim();
            if (/^#?[0-9a-fA-F]{6}$/.test(raw)) {
                applyColor(raw);
            }
        });

        closeBtn.addEventListener('click', () => {
            popup.remove();
        });
    });

    taskList.appendChild(listElement);
    taskInput.value = '';
    updateEmptyState(); // Check if we need to hide empty state message

})
