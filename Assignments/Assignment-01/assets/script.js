const addButton = document.getElementById('add-btn');

const listButton = document.getElementById('list-view-switch');
console.log(listButton);
const cardButton = document.getElementById('card-view-switch');
console.log(cardButton);

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list-container');

listButton.addEventListener('click', () => {
    console.log('List button pressed!');

    taskList.classList.remove('list-view');
    taskList.classList.add('card-view');
    listButton.classList.add('active');
    cardButton.classList.remove('active');


})


cardButton.addEventListener('click', () => {
    console.log('Card button pressed!');


    taskList.classList.remove('card-view');
    taskList.classList.add('list-view');


    cardButton.classList.add('active');
    listButton.classList.remove('active');



})

addButton.addEventListener('click', () => {
    if (taskInput.value === '') {
        alert('Please enter a task before adding.');
        return;
    }

    console.log('Add button pressed!');
    const inputValue = taskInput.value;
    const listElement = document.createElement('li');
    listElement.className = 'list-element-container';
    listElement.innerHTML = `
        <p>${inputValue}</p>
        <button class="paint-btn">
            <img src="assets/imgs/Paint.svg" alt="small fill icon">
        </button>
        <button class="delete-btn">
            <img src="assets/imgs/Trashbin.svg" alt="small trashbin icon">
        </button>
    `;


    const deleteButton = listElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(listElement);
    });

    // const paintButton = listElement.querySelector('.paint-btn');
    // paintButton.addEventListener('click', () => {
    //     listElement.style.backgroundColor = '#FFD700'; // Change to desired color
    // });

    taskList.appendChild(listElement);
    taskInput.value = '';

})
