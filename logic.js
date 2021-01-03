// declare UI Variables
const currentDay = document.querySelector('#current-day');
currentDay.innerHTML = new Date().toLocaleDateString();
const taskForm = document.querySelector('.task-form');
const taskInput = document.querySelector('#task-input');
const taskSubmit = document.querySelector('#task-submit');
const taskFilter = document.querySelector('#filter');
const tasksActive = document.querySelector('#active-tasks');
const tasksCompleted = document.querySelector('#completed-tasks');
const tasksClear = document.querySelector('.clear-tasks');

// load all event listeners
loadEventListeners();

function loadEventListeners() {

  //DOM Load event
  document.addEventListener('DOMContentLoaded', getTasks);

  //add task submit event
  taskForm.addEventListener('submit', addTask);

  // remove selected task from active tasks
  tasksActive.addEventListener('click', removeTask);

  // Clear completed tasks 
  tasksClear.addEventListener('click', clearCompleted);

  // Filter tasks event
  taskFilter.addEventListener('keyup', filterTasks);
}

function getTasks() {

  let tasks;

  // check to see if there are any locally stored tasks
  if(localStorage.getItem('tasks') !== null) {

    // pull them out if there are any
    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function(task) {

      // create li element
      const li = document.createElement('li');

      // add class
      li.className = 'active-task';

      // create checkbox and append to li
      // const checkBox = document.createElement('input');
      // checkBox.type = 'checkbox';
      // li.appendChild(checkBox);

      // create text node and append to li
      li.appendChild(document.createTextNode(task));

      // create new link element
      const link = document.createElement('a');
      link.className = 'delete-btn';
      link.innerHTML = 'remove';

      // append link to li inner html
      li.appendChild(link);

      // append li to the ul
      tasksActive.appendChild(li);

    })

  }
}

function addTask(e) {
  if(taskInput.value === '') {

    alert('You haven\'t typed anything. Describe your task to add it to the list.');

  } else {

    // create li element
    const li = document.createElement('li');

    // add class
    li.className = 'active-task';

    // create checkbox and append to li
    // const checkBox = document.createElement('input');
    // checkBox.type = 'checkbox';
    // li.appendChild(checkBox);

    // create text node and append to li
    li.appendChild(document.createTextNode(taskInput.value));

    // create new link element
    const link = document.createElement('a');
    link.className = 'delete-btn';
    link.innerHTML = 'remove';

    // append link to li inner html
    li.appendChild(link);

    // append li to the ul
    tasksActive.appendChild(li);

    // Store in local storage
    storeTaskLocally(taskInput.value);

    // clear input
    taskInput.value = '';
  }

  e.preventDefault();
}

function storeTaskLocally(task) {

  // create tasks array;
  let tasks;

  // check to see if any tasks are stored locally
  if(localStorage.getItem('tasks') === null) {

    tasks = [];

  } else {

    tasks = JSON.parse(localStorage.getItem('tasks'));

  }

  // add inputted task to the tasks array
  tasks.push(task);

  // store array back into local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove selected task
function removeTask(e) {
  if(e.target.classList.contains('delete-btn')) {
    if(confirm('Are you sure?')) {
      e.target.parentElement.remove();

      // remove from local storage as well
      removeTaskFromLocalStorage(e.target.parentElement);
    }
  }
}

// remove from local storage function
function removeTaskFromLocalStorage(taskItem) {

  let tasks;

  if(localStorage.getItem('tasks') !== null) {

    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function(task, index) {

      if(taskItem.firstChild.textContent === task) {

        tasks.splice(index, 1);

      }

    });

    localStorage.setItem('tasks', JSON.stringify(tasks));

  } 
}

// clear completed tasks when user clicks clear
function clearCompleted(e) {

  // slower method apparently
  tasksActive.innerHTML = '';

  // faster method
  while(tasksActive.firstChild) {
    tasksActive.removeChild(tasksActive.firstChild);
  }

  //clear all tasks from local storage
  clearTasksFromLocalStorage();
}

// clear all stored tasks from storage
function clearTasksFromLocalStorage() {

  localStorage.clear();

}

// Filter tasks by search bar
function filterTasks(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.active-task').forEach(function(task) {

    const item = task.firstChild.textContent;

    if(item.toLowerCase().indexOf(text) != -1) {

      task.style.display = 'flex';

    } else {

      task.style.display = 'none';

    }
  });
}