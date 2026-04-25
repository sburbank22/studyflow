// StudyFlow — main.js

const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const startBtn = document.getElementById('startBtn');
const thisWeekList = document.getElementById('thisWeekList');
const thisWeekBadge = document.getElementById('thisWeekBadge');
const thisWeekEmpty = document.getElementById('thisWeekEmpty');

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

// Update the progress summary stats and progress bar
function updateProgress() {
  const tasks = loadTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statCompleted').textContent = completed;
  document.getElementById('statRemaining').textContent = remaining;
  document.getElementById('progressBar').style.width = pct + '%';

  const summary = document.getElementById('progressSummary');
  summary.classList.toggle('hidden', total === 0);
}

// Return the Sunday-to-Saturday date strings for the current week (YYYY-MM-DD, local time)
function getWeekRange() {
  const today = new Date();
  const day = today.getDay();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - day);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const fmt = d =>
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

  return { startStr: fmt(startDate), endStr: fmt(endDate) };
}

// Update the "This Week" hero card from current localStorage state
function renderThisWeek() {
  const { startStr, endStr } = getWeekRange();
  const weekTasks = loadTasks()
    .filter(t => !!t.dueDate && t.dueDate >= startStr && t.dueDate <= endStr)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  thisWeekBadge.textContent = weekTasks.length + ' due';
  thisWeekList.innerHTML = '';

  if (weekTasks.length === 0) {
    thisWeekEmpty.classList.remove('hidden');
    return;
  }

  thisWeekEmpty.classList.add('hidden');
  weekTasks.slice(0, 4).forEach(task => {
    const dueLabelStr = formatDueDate(task.dueDate);
    const isUrgent = dueLabelStr === 'Due Today' || dueLabelStr === 'Due Tomorrow' || dueLabelStr === 'Overdue';
    const div = document.createElement('div');
    div.classList.add('task-item');
    if (isUrgent) div.classList.add('urgent');
    if (task.completed) div.style.opacity = '0.5';
    div.innerHTML = `
      <span class="task-dot"></span>
      <div class="task-info">
        <span class="task-name">${escapeHtml(task.name)}</span>
        <span class="task-due">${dueLabelStr}</span>
      </div>
      <span class="task-class">${escapeHtml(task.className)}</span>
    `;
    thisWeekList.appendChild(div);
  });
}

// Render a single task object as a list item
function renderTask(task) {
  emptyState.classList.add('hidden');

  const li = document.createElement('li');
  const priority = task.priority || 'medium';
  li.classList.add('task-list-item', `border-${priority}`);
  if (task.completed) li.classList.add('completed');

  const dueLabelStr = formatDueDate(task.dueDate);
  const isOverdue = dueLabelStr === 'Overdue';
  const isUrgent = dueLabelStr === 'Due Today' || dueLabelStr === 'Due Tomorrow';
  const priorityLabels = { low: 'Low', medium: 'Med', high: 'High' };
  const dueColor = isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : 'var(--color-muted)';

  li.innerHTML = `
    <div class="tl-left">
      <input type="checkbox" class="tl-check" aria-label="Mark complete" ${task.completed ? 'checked' : ''}>
      <div>
        <div class="tl-name">${escapeHtml(task.name)}</div>
        <div class="tl-meta">
          <span class="tl-class-tag">${escapeHtml(task.className)}</span>
          <span style="color: ${dueColor}">${dueLabelStr}</span>
        </div>
      </div>
    </div>
    <div class="tl-right">
      <span class="priority-badge priority-${priority}">${priorityLabels[priority]}</span>
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
    updateProgress();
    renderThisWeek();
  });

  // Remove task
  li.querySelector('.tl-remove').addEventListener('click', () => {
    li.remove();
    const tasks = loadTasks().filter(t => t.id !== task.id);
    saveTasks(tasks);
    updateProgress();
    renderThisWeek();
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
  const priority = document.getElementById('taskPriority').value;

  if (!name || !className || !dueDate) return;

  const task = { id: Date.now(), name, className, dueDate, priority, completed: false };
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  renderAllTasks();

  form.reset();
  // Restore priority default after reset clears the select
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskName').focus();
});

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// Clear the list and re-render all tasks sorted by priority then due date
function renderAllTasks() {
  taskList.innerHTML = '';
  const tasks = loadTasks();
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    updateProgress();
    renderThisWeek();
    return;
  }
  tasks
    .slice()
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pa = PRIORITY_ORDER[a.priority || 'medium'];
      const pb = PRIORITY_ORDER[b.priority || 'medium'];
      if (pa !== pb) return pa - pb;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .forEach(renderTask);
  updateProgress();
  renderThisWeek();
}

// Render all saved tasks on page load
renderAllTasks();

// Prevent XSS when inserting user input into the DOM
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
