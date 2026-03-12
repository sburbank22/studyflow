// StudyFlow — main.js

const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const startBtn = document.getElementById('startBtn');

// --- localStorage helpers ---

function loadTasks() {
  return JSON.parse(localStorage.getItem('studyflow-tasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('studyflow-tasks', JSON.stringify(tasks));
}

// Scroll to demo when "Start Planning" is clicked
startBtn.addEventListener('click', () => {
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
});

// Format a date string (YYYY-MM-DD) into a readable label
function formatDueDate(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dateStr + 'T00:00:00');
  const diffMs = due - today;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due Today';
  if (diffDays === 1) return 'Due Tomorrow';
  return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
}

// Render a single task object as a list item
function renderTask(task) {
  emptyState.classList.add('hidden');

  const li = document.createElement('li');
  li.classList.add('task-list-item');
  if (task.completed) li.classList.add('completed');

  const dueLabelStr = formatDueDate(task.dueDate);
  const isOverdue = dueLabelStr === 'Overdue';
  const isUrgent = dueLabelStr === 'Due Today' || dueLabelStr === 'Due Tomorrow';

  li.innerHTML = `
    <div class="tl-left">
      <input type="checkbox" class="tl-check" aria-label="Mark complete" ${task.completed ? 'checked' : ''}>
      <div>
        <div class="tl-name">${escapeHtml(task.name)}</div>
        <div class="tl-meta" style="color: ${isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : ''}">
          ${dueLabelStr}
        </div>
      </div>
    </div>
    <div class="tl-right">
      <span class="tl-class-tag">${escapeHtml(task.className)}</span>
      <button class="tl-remove" aria-label="Remove task">&times;</button>
    </div>
  `;

  // Toggle completed state
  li.querySelector('.tl-check').addEventListener('change', (e) => {
    task.completed = e.target.checked;
    li.classList.toggle('completed', task.completed);
    const tasks = loadTasks();
    const t = tasks.find(t => t.id === task.id);
    if (t) t.completed = task.completed;
    saveTasks(tasks);
  });

  // Remove task
  li.querySelector('.tl-remove').addEventListener('click', () => {
    li.remove();
    const tasks = loadTasks().filter(t => t.id !== task.id);
    saveTasks(tasks);
    if (taskList.children.length === 0) emptyState.classList.remove('hidden');
  });

  taskList.appendChild(li);
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('taskName').value.trim();
  const className = document.getElementById('taskClass').value.trim();
  const dueDate = document.getElementById('taskDue').value;

  if (!name || !className || !dueDate) return;

  const task = { id: Date.now(), name, className, dueDate, completed: false };
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  renderAllTasks();

  form.reset();
  document.getElementById('taskName').focus();
});

// Clear the list and re-render all tasks sorted by due date
function renderAllTasks() {
  taskList.innerHTML = '';
  const tasks = loadTasks();
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  tasks
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .forEach(renderTask);
}

// Render all saved tasks on page load
renderAllTasks();

// Prevent XSS when inserting user input into the DOM
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
