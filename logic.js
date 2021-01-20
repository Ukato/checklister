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

  // remove item from active when checked and place in archive
  itemList.addEventListener('click', function(event) {
    //only fire if user is clicking on the checkbox
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
  });

  // listen for user to click the edit item button
  itemList.addEventListener('click', function(event) {
    if(event.target.parentElement.classList.contains('edit-icon')) {
      alert('Edit Functionality Coming Soon!');
    }
  });
  // listen for user to try and change the priority level in edit mode
  itemList.addEventListener('click', function(event) {
    if(event.target.parentElement.classList.contains('changeHigh')) {
      console.log('You clicked a priority change button.');
    }
  });
  itemList.addEventListener('click', function(event) {
    if(event.target.parentElement.classList.contains('changeNormal')) {
      console.log('You clicked a priority change button.');
    }
  });
  itemList.addEventListener('click', function(event) {
    if(event.target.parentElement.classList.contains('changeLow')) {
      console.log('You clicked a priority change button.');
    }
  });
}

// Allow user to edit an active item
function enterEditMode(activeItem) {
  console.log(activeItem.parentElement.parentElement);
  const li = document.createElement('li');
  li.classList = `edit-item`;
  li.innerHTML = `
    <div class="priority-change">
      <img class="change-high" src="img/changeHigh-100.png" alt="red arrow">
      <img class="change-normal" src="img/changeNormal-100.png" alt="white arrow">
      <img class="change-low" src="img/changeLow-100.png" alt="green arrow">
    </div>
    <input type="text" class="description-edit" value="${activeItem.parentElement.parentElement.children[1].innerHTML}" />
    <span class="ttl-edit">
      <img class="ttl-left" src="img/Arrowhead-Down-100.png" alt="left-arrow">
      <div class="ttl" name="ttl">${activeItem.parentElement.parentElement.children[2].innerHTML}</div>
      <img class="ttl-right" src="img/Arrowhead-Down-100.png" alt="right-arrow">
    </span>
    <div class="edit-icon">
      <img class="save-icon" src="img/Save-100.png" alt="floppy save icon">
      <img class="delete-icon" src="img/Garbage-Open-100.png" alt="garbage can icon">
    </div>
  `;

  activeItem.parentElement.parentElement.parentElement.replaceChild(li, activeItem.parentElement.parentElement);

}

// -------------------------------------------------------------------------------
// remove entries or entire library from local storage
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
// Allow user to edit an active item/task


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
    ttl: ttlValue
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
      <img src="img/Editor-100.png" alt="pencil edit icon">
    </div>
  `;

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
  console.log(item);
  console.log(archive);

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
          <img src="img/Editor-100.png" alt="pencil edit icon">
        </div>
      `;
  
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
function shiftTTLLeft() {
  console.log("You pressed left!");
  setTTL(-1);
  if(ttl.value === 1) {
    setTimeout(closeTTL, 3000);
  }
}

function shiftTTLRight() {
  console.log("You pressed right!");
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