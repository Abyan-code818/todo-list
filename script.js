// ============================================================
// script.js — To-Do List Logic
// Handles adding, completing, deleting tasks and persisting
// them to localStorage so data survives page refreshes.
// ============================================================

// ---------- DOM References ----------
const taskInput    = document.getElementById('taskInput');
const addBtn       = document.getElementById('addBtn');
const taskList     = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const taskCounter  = document.getElementById('taskCounter');

// ---------- State ----------
// Load tasks from localStorage on startup, or start with an empty array.
let tasks = loadTasksFromStorage();

// ---------- Initialise ----------
// Render all saved tasks when the page first loads.
renderAll();

// ---------- Event Listeners ----------

// Click the "Add Task" button
addBtn.addEventListener('click', handleAddTask);

// Press Enter inside the input field
taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    handleAddTask();
  }
});

// ============================================================
// FUNCTIONS
// ============================================================

/**
 * handleAddTask
 * Reads the input value, validates it, creates a task object,
 * saves it, and re-renders the list.
 */
function handleAddTask() {
  // Trim whitespace from both ends
  const text = taskInput.value.trim();

  // Do nothing if the input is empty
  if (text === '') {
    taskInput.focus();
    return;
  }

  // Build a new task object
  const newTask = {
    id:        Date.now(),   // unique ID based on timestamp
    text:      text,
    completed: false
  };

  // Add to our tasks array
  tasks.push(newTask);

  // Persist to localStorage
  saveTasksToStorage();

  // Clear the input and return focus so users can keep typing
  taskInput.value = '';
  taskInput.focus();

  // Re-render the entire list
  renderAll();
}

/**
 * handleToggleTask
 * Flips the completed state of a task when its checkbox is clicked.
 *
 * @param {number} id - The task's unique ID
 */
function handleToggleTask(id) {
  // Find the task and flip its completed flag
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasksToStorage();
  renderAll();
}

/**
 * handleDeleteTask
 * Removes a task from the array permanently.
 *
 * @param {number} id - The task's unique ID
 */
function handleDeleteTask(id) {
  // Keep every task except the one being deleted
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasksToStorage();
  renderAll();
}

/**
 * renderAll
 * Clears the task list in the DOM and rebuilds it from the tasks array.
 * Also updates the counter and the empty-state message.
 */
function renderAll() {
  // Clear the current list
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    // Show the empty-state message and hide the list
    emptyMessage.style.display = 'block';
    taskList.style.display     = 'none';
  } else {
    // Hide the empty-state message and show the list
    emptyMessage.style.display = 'none';
    taskList.style.display     = 'flex';

    // Create an <li> element for each task
    tasks.forEach(function (task) {
      const li = createTaskElement(task);
      taskList.appendChild(li);
    });
  }

  // Always update the counter
  updateCounter();
}

/**
 * createTaskElement
 * Builds and returns a single <li> DOM element for the given task.
 *
 * @param   {object} task - A task object { id, text, completed }
 * @returns {HTMLElement}
 */
function createTaskElement(task) {
  // <li class="task-item [completed]">
  const li = document.createElement('li');
  li.classList.add('task-item');
  if (task.completed) {
    li.classList.add('completed');
  }

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', 'Mark task as completed');

  // Toggle task when checkbox changes
  checkbox.addEventListener('change', function () {
    handleToggleTask(task.id);
  });

  // Task name
  const span = document.createElement('span');
  span.classList.add('task-name');
  span.textContent = task.text;

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('btn', 'btn-delete');
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('aria-label', 'Delete task: ' + task.text);

  // Remove task when delete button is clicked
  deleteBtn.addEventListener('click', function () {
    handleDeleteTask(task.id);
  });

  // Assemble the list item
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

/**
 * updateCounter
 * Counts incomplete tasks and updates the counter text in the header.
 */
function updateCounter() {
  const remaining = tasks.filter(function (task) {
    return !task.completed;
  }).length;

  if (remaining === 0 && tasks.length > 0) {
    taskCounter.textContent = 'All tasks completed!';
  } else if (remaining === 1) {
    taskCounter.textContent = '1 task remaining';
  } else {
    taskCounter.textContent = remaining + ' tasks remaining';
  }
}

/**
 * saveTasksToStorage
 * Serialises the tasks array to a JSON string and stores it in localStorage.
 */
function saveTasksToStorage() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

/**
 * loadTasksFromStorage
 * Retrieves and parses tasks from localStorage.
 * Returns an empty array if nothing is stored yet.
 *
 * @returns {Array}
 */
function loadTasksFromStorage() {
  const stored = localStorage.getItem('todoTasks');
  // Parse the JSON string, or return [] if the key doesn't exist
  return stored ? JSON.parse(stored) : [];
}
