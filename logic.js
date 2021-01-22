// declare UI Variables
const currentDate = document.querySelector('#current-date');
const currentTime = document.querySelector('#current-time');
const clockIcon = document.querySelector('#header-clock');
const inputArea = document.querySelector('#input-area');
const taskInput = document.querySelector('#task-input');
const taskInputLabel = document.querySelector('[for=task-input]');
const unfoldSelect = document.querySelector('#unfold-select');
const highPriority = document.querySelector('#highp-btn');
const mediumPriority = document.querySelector('#mediump-btn');
const lowPriority = document.querySelector('#lowp-btn');
const priorityLevelLabel = document.querySelector('[for=priority-level]');
const ttlLabel = document.querySelector('[for=ttl]');
const ttl = document.querySelector('#ttl');
const ttlLeft = document.querySelector('#ttl-left');
const ttlRight = document.querySelector('#ttl-right');
const addArrow = document.querySelector('#add-arrow');
const itemList = document.querySelector('#active-tasks');
const archive = document.querySelector('#archive');

// load all Event Listeners
loadEventListeners();

function loadEventListeners() {
  // DOM Load event
  document.addEventListener('DOMContentLoaded', getStoredTasks);
  // Show/Hide Time
  clockIcon.addEventListener('click', timeDisplay);
  // react to user input at task input
  taskInput.addEventListener('focus', showTaskInput);
  taskInput.addEventListener('blur', hideTaskInput);
  // react to user input on priority selector
  priorityLevelLabel.addEventListener('click', showLevels);
  highPriority.addEventListener('click', setPriorityHigh);
  mediumPriority.addEventListener('click', setPriorityMedium);
  lowPriority.addEventListener('click', setPriorityLow);
  // allow user to click arrow to add new goal/task
  addArrow.addEventListener('click', addNewTask);

  // Listen for TTL events and set up TTL Array of options
  ttlLabel.addEventListener('click', showTTL);
  ttlLeft.addEventListener('click', shiftTTLLeft);
  ttlRight.addEventListener('click', shiftTTLRight);

  // allow user to add item by pressing enter
  taskInput.addEventListener('keydown', function(event) {
    // call addNewTask if user hits enter
    if(event.keyCode === 13) {
      event.preventDefault();
      addNewTask();
    } else if(taskInput.value.length > 1) {
      showArrow();
    } else {
      hideArrow();
    }
  });

  // listen for user to click inside the active items list
  itemList.addEventListener('click', function(event) {

    // remove item from active when checked and place in archive
    if(event.target.parentElement.classList.contains('checkbox')) {
      // animate the checking action
      event.target.parentElement.parentElement.classList += ' blip-out';
      event.target.classList += ' checked';
      // wait for checking animation to complete and then remove and add item to archive
      setTimeout(function() {archiveTask(event.target.parentElement.nextElementSibling.innerHTML)}, 2000);
      setTimeout(function() {event.target.parentElement.parentElement.remove()}, 2000);
      // remove item from local storage
      flushLocalStorage(event.target.parentElement.nextElementSibling.innerHTML);
    }

    // listen for user to click the edit icon
    if(event.target.classList.contains('pencil-icon')) {
      enterEditMode(event.target.parentElement.parentElement);
      flushLocalStorage(event.target.parentElement.parentElement.children[1].value);
    }

    // listen for the user to click the delete icon
    if(event.target.classList.contains('delete-icon')) {
      // remove item from local storage
      flushLocalStorage(event.target.parentElement.parentElement.children[1].value);
      event.target.parentElement.parentElement.remove();
    }

    // listen for the user to click the save icon
    if(event.target.classList.contains('save-icon')) {
      saveChanges(event.target.parentElement.parentElement);
    }

    // listen for user to change priority to high
    if(event.target.classList.contains('change-high')) {
      event.target.parentElement.parentElement.classList = 'high-p active-item';
    }

    // listen for user to change priority to normal
    if(event.target.classList.contains('change-normal')) {
      event.target.parentElement.parentElement.classList = 'medium-p active-item';
    }

    // listen for user to change priority to low
    if(event.target.classList.contains('change-low')) {
      event.target.parentElement.parentElement.classList = 'low-p active-item';
    }

    // listen for user to click ttl up arrow
    if(event.target.classList.contains('item-ttl-up')) {
      setItemTTL(-1, event.target.parentElement.children[1])
    }

    // listen for user to click ttl down arrow
    if(event.target.classList.contains('item-ttl-down')) {
      setItemTTL(1, event.target.parentElement.children[1])
    }
  });
  
}

// Allow user to edit an active item
function enterEditMode(activeItem) {
  // fill the edit ttl section with 'off' if item has no current ttl
  if(activeItem.children[2].innerHTML === '<br>') {
    activeItem.children[2].innerHTML = 'Off'
  }

  const li = document.createElement('li');
  li.classList = activeItem.classList;
  li.innerHTML = `
    <div class="priority-change">
      <img class="change-high" src="img/changeHigh-100.png" alt="red arrow" title="Change priority to high">
      <img class="change-normal" src="img/changeNormal-100.png" alt="white arrow" title="Change priority to normal">
      <img class="change-low" src="img/changeLow-100.png" alt="green arrow" title="Change priority to low">
    </div>
    <textarea type="text" class="description-edit">${activeItem.children[1].innerHTML}</textarea>
    <span class="ttl-edit">
      <img class="item-ttl-up" src="img/Arrowhead-Down-100.png" alt="up-arrow">
      <div class="active-item-ttl" name="ttl">${activeItem.children[2].innerHTML}</div>
      <img class="item-ttl-down" src="img/Arrowhead-Down-100.png" alt="down-arrow">
    </span>
    <div class="edit-icon">
      <img class="save-icon" src="img/Save-100.png" alt="floppy save icon" title="Save Goal">
      <img class="delete-icon" src="img/Garbage-100.png" alt="garbage can icon" title="Delete Goal">
    </div>
  `;

  // store values in newly made elements
  li.children[1].value = activeItem.children[1].value;
  li.children[2].children[1].value = activeItem.children[2].value;

  activeItem.parentElement.replaceChild(li, activeItem);

}

// -------------------------------------------------------------------------------
// remove active entries from local storage
function flushLocalStorage(removeItem) {
  let active;
  if(localStorage.getItem('active') === null) {
    active = [];
  } else {
    active = JSON.parse(localStorage.getItem('active'));
  }

  active.forEach(function(item, index) {
    if(item.description === removeItem) {
      active.splice(index, 1);
    }
  });

  localStorage.setItem('active', JSON.stringify(active));
}

// -------------------------------------------------------------------------------
// Allow user to archive an active item/task
function archiveTask(task) {
  const li = document.createElement('li');
  li.classList = 'archive-item';
  const timestamp = setDateTime();
  const variables = {
    description: task,
    time: timestamp
  };

  li.innerHTML = `
    <p class="item-description">${task}</p>
    <div class="time-completed">${timestamp}</div>
    <div class="completed-flag">
      <img src="img/Race-Flag-100.png" alt="green waving race flag">
    </div>
  `;

  if(archive.childNodes) {
    archive.insertBefore(li, archive.childNodes[0]);
  } else {
    archive.appendChild(li);
  }

  // persist archived item to local storage
  storeArchived(variables);
}

// -------------------------------------------------------------------------------
// Allow user to save currently editing item
function saveChanges(item) {
  li = document.createElement('li');
  const taskDescript = item.children[1].value;
  // getting value from priority input
  let priorityValue;
  if(item.classList.contains('high-p')) {
    priorityValue = 'high-p';
  } else if(item.classList.contains('medium-p')) {
    priorityValue = 'medium-p';
  } else if(item.classList.contains('low-p')) {
    priorityValue = 'low-p';
  }

  console.log(item.children[2].children[1].value);

  const ttlArray = setTTL();
  let ttlValue;
  let dueText;
  if(item.children[2].children[1].value !== 1) {
    ttlValue = ttlArray[item.children[2].children[1].value];
    if(item.children[2].children[1].value < 5) {
      dueText = 'Due in ';
    } else {
      dueText = 'Due by ';
    }
  } else {
    ttlValue = '';
    dueText = '';
  }

  const attributes = {
    priority: priorityValue,
    description: taskDescript,
    due: dueText,
    ttl: ttlValue,
    index: item.children[2].children[1].value
  };

  li.classList = `${priorityValue} active-item`;
  

  li.innerHTML = `
    <div class="checkbox">
      <img class="checkbox-box" src="img/Shape-Square-100.png" alt="square checkbox">
      <img class="checkbox-check" src="img/Check-100.png" alt="lefthanded checkmark">
    </div>
    <p class="item-description">${taskDescript}</p>
    <span class="ttl-active">${dueText}<br>${ttlValue}</span>
    <div class="edit-icon">
      <img class="pencil-icon" src="img/Editor-100.png" alt="pencil edit icon" title="Edit Goal">
    </div>
  `;

  // store values in elements so edit state can use them
  li.children[1].value = taskDescript;
  li.children[2].value = item.children[2].children[1].value;

  // persist new item to local storage
  storeActive(attributes);

  item.parentElement.replaceChild(li, item);
}

// -------------------------------------------------------------------------------
// Add new task/goal to the active list
function addNewTask() {
  const li = document.createElement('li');
  const taskDescript = taskInput.value;
  // getting value from priority input
  const priorityValue = unfoldSelect.value;
  const ttlArray = setTTL();
  let ttlValue;
  let dueText;
  if(ttl.value !== 1) {
    ttlValue = ttlArray[ttl.value];
    if(ttl.value < 5) {
      dueText = 'Due in ';
    } else {
      dueText = 'Due by ';
    }
  } else {
    ttlValue = '';
    dueText = '';
  }

  const attributes = {
    priority: priorityValue,
    description: taskDescript,
    due: dueText,
    ttl: ttlValue,
    index: ttl.value
  };

  li.classList = `${priorityValue} active-item`;
  

  li.innerHTML = `
    <div class="checkbox">
      <img class="checkbox-box" src="img/Shape-Square-100.png" alt="square checkbox">
      <img class="checkbox-check" src="img/Check-100.png" alt="lefthanded checkmark">
    </div>
    <p class="item-description">${taskDescript}</p>
    <span class="ttl-active">${dueText}<br>${ttlValue}</span>
    <div class="edit-icon">
      <img class="pencil-icon" src="img/Editor-100.png" alt="pencil edit icon" title="Edit Goal">
    </div>
  `;

  // store values in elements so edit state can use them
  li.children[1].value = taskDescript;
  li.children[2].value = ttl.value;

  if(taskDescript === '') {
    taskInput.classList = 'required';
    setTimeout(removeRequired, 1000);
  } else {
    itemList.appendChild(li);
    taskInput.value = '';
    hideArrow();
  }

  // persist new item to local storage
  storeActive(attributes);
  
}

// Store task in local storage
function storeActive(item) {
  let active;
  if(localStorage.getItem('active') === null) {
    active = [];
  } else {
    active = JSON.parse(localStorage.getItem('active'));
  }

  active.push(item);

  localStorage.setItem('active', JSON.stringify(active));
}

// Store archived item to local storage
function storeArchived(item) {
  let archive;
  if(localStorage.getItem('archive') === null) {
    archive = [];
  } else {
    archive = JSON.parse(localStorage.getItem('archive'));
  }

  archive.push(item);

  localStorage.setItem('archive', JSON.stringify(archive));
}

// load all locally stored data
function getStoredTasks() {
  getStoredActive();
  getStoredArchive();
}

// Retrieve tasks from local storage and place them in UI
function getStoredActive() {
  let active;
  if(localStorage.getItem('active') === null) {
    active = [];
  } else {
    active = JSON.parse(localStorage.getItem('active'));

    active.forEach(function(item) {
      const li = document.createElement('li');
      li.classList = `${item.priority} active-item`;
  
      li.innerHTML = `
        <div class="checkbox">
          <img class="checkbox-box" src="img/Shape-Square-100.png" alt="square checkbox">
          <img class="checkbox-check" src="img/Check-100.png" alt="lefthanded checkmark">
        </div>
        <p class="item-description">${item.description}</p>
        <span class="ttl-active">${item.due}<br>${item.ttl}</span>
        <div class="edit-icon">
          <img class="pencil-icon" src="img/Editor-100.png" alt="pencil edit icon" title="Edit Goal">
        </div>
      `;

      // store values in elements so edit state can use them
      li.children[1].value = item.description;
      li.children[2].value = item.index;
  
      itemList.appendChild(li);
  
    });
  }
}

// Retrieve archived tasks/goals that have been checked off the active list
function getStoredArchive() {
  let storedArchive;
  if(localStorage.getItem('archive') === null) {
    storedArchive = [];
  } else {
    storedArchive = JSON.parse(localStorage.getItem('archive'));

    storedArchive.forEach(function(item) {
      const li = document.createElement('li');
      li.classList = 'archive-item';
      const timestamp = item.time;

      li.innerHTML = `
        <p class="item-description">${item.description}</p>
        <div class="time-completed">${timestamp}</div>
        <div class="completed-flag">
          <img src="img/Race-Flag-100.png" alt="green waving race flag">
        </div>
      `;

      if(archive.childNodes) {
        archive.insertBefore(li, archive.childNodes[0]);
      } else {
        archive.appendChild(li);
      }
    });
  }
}

// remove required class from input
function removeRequired() {
  taskInput.classList = '';
}

// -------------------------------------------------------------------------------
// Allow user to cycle through TTL Options

// Top TTL Input
function shiftTTLLeft() {
  setTTL(-1);
  if(ttl.value === 1) {
    setTimeout(closeTTL, 3000);
  }
}

function shiftTTLRight() {
  setTTL(1);
  if(ttl.value === 1) {
    setTimeout(closeTTL, 3000);
  }
}

function showTTL() {
  ttlLabel.classList = 'form-label show-ttl';
  ttl.classList = 'fade-in';
  ttlLeft.classList = 'fade-in';
  ttlRight.classList = 'fade-in';
  setTimeout(closeTTL, 5000);
}

function closeTTL() {
  if(ttl.value === 1) {
    ttlLabel.classList = 'form-label close-ttl';
    ttl.classList = 'fade-out';
    ttlLeft.classList = 'fade-out';
    ttlRight.classList = 'fade-out';
  }
}

function setTTL(ttlShift) {
  const ttlOptions = {
    1: 'Off',
    2: '24 Hours',
    3: '7 Days',
    4: '30 Days',
    5: 'End of Day',
    6: 'End of Week',
    7: 'End of Month'
  };

  if(ttl.innerHTML === '') {
    ttl.innerHTML = ttlOptions[ttlShift];
    ttl.value = ttlShift;
  } else {
    if(ttlShift === 1) {
      if(ttl.value === Object.keys(ttlOptions).length) {
        ttl.innerHTML = ttlOptions[ttlShift];
        ttl.value = ttlShift;
      } else {
        ttl.innerHTML = ttlOptions[ttl.value + ttlShift];
        ttl.value++;
      }
    } else if(ttlShift === -1) {
      if(ttl.value === 1) {
        ttl.innerHTML = ttlOptions[Object.keys(ttlOptions).length];
        ttl.value = Object.keys(ttlOptions).length;
      } else {
        ttl.innerHTML = ttlOptions[ttl.value + ttlShift];
        ttl.value--;
      }
    }
  }
  return ttlOptions;
}

setTTL(1);

// active item edit mode TTL
function setItemTTL(ttlShift, ttlElement) {
  const ttlOptions = {
    1: 'Off',
    2: '24 Hours',
    3: '7 Days',
    4: '30 Days',
    5: 'End of Day',
    6: 'End of Week',
    7: 'End of Month'
  };

  if(ttlShift === 1) {
    if(ttlElement.value === Object.keys(ttlOptions).length) {
      ttlElement.innerHTML = ttlOptions[ttlShift];
      ttlElement.value = ttlShift;
    } else {
      ttlElement.innerHTML = ttlOptions[ttlElement.value + ttlShift];
      ttlElement.value++;
    }
  } else if(ttlShift === -1) {
    if(ttlElement.value === 1) {
      ttlElement.innerHTML = ttlOptions[Object.keys(ttlOptions).length];
      ttlElement.value = Object.keys(ttlOptions).length;
    } else {
      ttlElement.innerHTML = ttlOptions[ttlElement.value + ttlShift];
      ttlElement.value--;
    }
  }
}

// -------------------------------------------------------------------------------
// grab current date and set it in the UI
function setDateTime() {
  const d = new Date();
  const date = formatDate(d);
  const time = formatTime(d);

  if(currentDate.innerHTML !== date) {
    currentDate.innerHTML = date;
  }
  if(currentTime.innerHTML !== time) {
    currentTime.innerHTML = time;
  }

  return `${date} ${time}`;
}

// set initial date
setDateTime();
// set date and time every second to keep time on track
setInterval(setDateTime, 1000);


// -------------------------------------------------------------------------------
// convert date to custom format
function formatDate(date) {

  // define object for converting weekdays to names
  const weekDays = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  };

  // formatting for day of the month
  const monthDays = {
    1: `<sup>st</sup>`,
    2: `<sup>nd</sup>`,
    3: `<sup>rd</sup>`,
    4: `<sup>th</sup>`,
  };

  // applying the proper superscript based on the day
  let day = date.getDate();

  if(day === 1 || day === 21 || day === 31) {
    day += monthDays[1];
  } else if( day === 2 || day === 22) {
    day += monthDays[2];
  } else if( day === 3 || day === 23) {
    day += monthDays[3];
  } else {
  day += monthDays[4];
  }

  // Months of the year
  const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  };

  return `${weekDays[date.getDay()]}, 
          ${months[date.getMonth()]} 
          ${day} 
          ${date.getFullYear()} 
         `;
}

function formatTime(date) {
  // make certain a zero is added before single digits
  const hour = date.getHours();
  const minutes = date.getMinutes();

  if(hour < 10) {
    if(minutes < 10) {
      return `0${hour}:0${minutes}`;
    } else {
      return `0${hour}:${minutes}`;
    }
  } else {
    if(minutes < 10) {
      return `${hour}:0${minutes}`;
    } else {
      return `${hour}:${minutes}`;
    }
  }
  
}

function timeDisplay() {
  if(clockIcon.className === '') {
    revealTime();
  } else {
    hideTime();
  }
}

function revealTime() {
  clockIcon.className = 'rotate';
  currentTime.className = 'reveal-time';
}

function hideTime() {
  clockIcon.className = '';
  currentTime.className = 'hide-time';
}

function showTaskInput() {
  taskInputLabel.classList = 'form-label hide-task-label';

  // show add arrow
  showArrow();

  // if user hasn't set a priority autoselect normal
  if(unfoldSelect.value === undefined) {
    showLevels();
    setTimeout(setPriorityMedium, 2000);
  }
}

function showArrow() {
  if(taskInput.value !== '') {
    addArrow.classList = 'add-arrow show-arrow';
  }
}

function hideArrow() {
  addArrow.classList = 'add-arrow';
}

function hideTaskInput() {
  if(taskInput.value === '') {

    taskInputLabel.classList = 'form-label show-task-label';

    // hide add arrow
    hideArrow();

    // hide priority levels if user hasn't selected one
    setTimeout(hideLevels, 100)

  } else {

    taskInputLabel.classList = 'form-label hide-task-label';

    // show add arrow
    showArrow();

    if(unfoldSelect.value === undefined) {
      showLevels();
      setTimeout(setPriorityMedium, 1000);
    }
  }
}

function showLevels() {
  priorityLevelLabel.classList = 'form-label fade-out push-back';
  highPriority.classList = 'priority-option high-priority reveal-high';
  mediumPriority.classList = 'priority-option medium-priority reveal-medium';
  lowPriority.classList = 'priority-option low-priority reveal-low';
}

function hideLevels() {
  if(taskInput.value === '' && unfoldSelect.value === undefined) {
    priorityLevelLabel.classList = 'form-label fade-in';
    highPriority.classList = 'priority-option high-priority hide-high';
    mediumPriority.classList = 'priority-option medium-priority hide-medium';
    lowPriority.classList = 'priority-option low-priority hide-low';
  }
}

function setPriorityHigh() {
  highPriority.classList = 'priority-option high-priority reveal-high set-high';
  mediumPriority.classList = 'priority-option medium-priority hide-medium';
  lowPriority.classList = 'priority-option low-priority hide-low';
  priorityLevelLabel.classList = 'form-label pull-forward';
  unfoldSelect.value = 'high-p';
}

function setPriorityMedium() {
  highPriority.classList = 'priority-option high-priority hide-high';
  mediumPriority.classList = 'priority-option medium-priority reveal-medium set-medium';
  lowPriority.classList = 'priority-option low-priority hide-low';
  priorityLevelLabel.classList = 'form-label pull-forward';
  unfoldSelect.value = 'medium-p';
}

function setPriorityLow() {
  highPriority.classList = 'priority-option high-priority hide-high';
  mediumPriority.classList = 'priority-option medium-priority hide-medium';
  lowPriority.classList = 'priority-option low-priority reveal-low set-low';
  priorityLevelLabel.classList = 'form-label pull-forward';
  unfoldSelect.value = 'low-p';
}