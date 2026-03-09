// StudyFlow — main.js

const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const startBtn = document.getElementById('startBtn');

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

// Add a task item to the list
function addTaskToList(name, className, dueDate) {
  emptyState.classList.add('hidden');

  const li = document.createElement('li');
  li.classList.add('task-list-item');

  const dueLabelStr = formatDueDate(dueDate);
  const isOverdue = dueLabelStr === 'Overdue';
  const isUrgent = dueLabelStr === 'Due Today' || dueLabelStr === 'Due Tomorrow';

  li.innerHTML = `
    <div>
      <div class="tl-name">${escapeHtml(name)}</div>
      <div class="tl-meta" style="color: ${isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : ''}">
        ${dueLabelStr}
      </div>
    </div>
    <div class="tl-right">
      <span class="tl-class-tag">${escapeHtml(className)}</span>
      <button class="tl-remove" aria-label="Remove task">&times;</button>
    </div>
  `;

  // Remove task on click
  li.querySelector('.tl-remove').addEventListener('click', () => {
    li.remove();
    if (taskList.children.length === 0) {
      emptyState.classList.remove('hidden');
    }
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

  addTaskToList(name, className, dueDate);
  form.reset();
  document.getElementById('taskName').focus();
});

// Prevent XSS when inserting user input into the DOM
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
