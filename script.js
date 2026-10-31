const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');
const currentDateEl = document.getElementById('current-date');

const STORAGE_KEY = 'taskflow.tasks';

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function formatCurrentDate() {
  const now = new Date();
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  currentDateEl.textContent = now.toLocaleDateString('pt-BR', options);
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.done).length;
  const pending = total - completed;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;

  emptyMessage.classList.toggle('visible', total === 0);
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item ${task.done ? 'done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Marcar tarefa como concluída: ${task.text}`);
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
      updateSummary();
    });

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.setAttribute('aria-label', `Excluir tarefa: ${task.text}`);
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((itemTask) => itemTask.id !== task.id);
      saveTasks();
      renderTasks();
      updateSummary();
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteBtn);
    taskList.appendChild(item);
  });

  updateSummary();
}

function addTask(event) {
  event.preventDefault();

  const description = taskInput.value.trim();
  if (!description) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: description,
    done: false,
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
}

function initialize() {
  formatCurrentDate();
  taskForm.addEventListener('submit', addTask);
  renderTasks();
}

initialize();
