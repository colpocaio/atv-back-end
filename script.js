const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const taskFilters = document.getElementById('task-filters');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn" onclick="editTask(${task.id})">Editar</button>
            <button class="remove-btn" onclick="removeTask(${task.id})">Remover</button>
        `;
        taskList.appendChild(li);
    });

    updateTaskCount();
}

function updateTaskCount() {
    const pendingCount = tasks.filter(task => !task.completed).length;
    const completedCount = tasks.length - pendingCount;
    taskCount.textContent = `Tarefas não feitas: ${pendingCount} | Tarefas concluídas: ${completedCount}`;
}

function addTask(taskText) {
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date()
    };
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const li = event.target.closest('li');
        const taskText = li.querySelector('.task-text');
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = task.text;
        editInput.classList.add('edit-input');
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Salvar';
        saveBtn.onclick = () => {
            task.text = editInput.value;
            saveTasks();
            renderTasks();
        };

        li.innerHTML = '';
        li.appendChild(editInput);
        li.appendChild(saveBtn);
        editInput.focus();
    }
}

function removeTask(taskId) {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';
});

taskFilters.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        currentFilter = e.target.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTasks();
    }
});

renderTasks();