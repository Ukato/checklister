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

// load all Event Listeners
loadEventListeners();

function loadEventListeners() {
  // declare EventListeners
  clockIcon.addEventListener('click', timeDisplay);
  taskInput.addEventListener('focus', showTaskInput);
  taskInput.addEventListener('blur', hideTaskInput);
  priorityLevelLabel.addEventListener('click', showLevels);
  highPriority.addEventListener('click', setPriorityHigh);
  mediumPriority.addEventListener('click', setPriorityMedium);
  lowPriority.addEventListener('click', setPriorityLow);
  addArrow.addEventListener('click', addNewTask);

  // Listen for TTL events and set up TTL Array of options
  ttlLabel.addEventListener('click', showTTL);
  ttlLeft.addEventListener('click', shiftTTLLeft);
  ttlRight.addEventListener('click', shiftTTLRight);

  // allw user to add item by pressing enter
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
}

// -------------------------------------------------------------------------------
// Add new task/goal to the active list
function addNewTask() {
  const li = document.createElement('li');
  const taskDescript = taskInput.value;
  // getting value from priority input
  const priorityValue = unfoldSelect.value;
  const ttlArray = setTTL();
  const ttlValue = ttlArray[ttl.value];

  li.innerHTML = `
    <li class="${priorityValue} active-item">
    <div class="checkbox">
      <img class="checkbox-box" src="img/Shape-Square-100.png" alt="square checkbox">
      <img class="checkbox-check" src="img/Check-100.png" alt="lefthanded checkmark">
    </div>
    <p class="item-description">${taskDescript}</p>
    <span class="ttl-active">${ttlValue}</span>
    <div class="edit-icon">
      <img src="img/Editor-100.png" alt="pencil edit icon">
    </div>
    </li>
  `;

  if(taskDescript === '') {
    taskInput.classList = 'required';
    setTimeout(removeRequired, 1000);
  } else {
    itemList.appendChild(li);
    taskInput.value = '';
    hideArrow();
  }
  
}

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