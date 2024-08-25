document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskPriority = document.getElementById('taskPriority');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage and display them
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const priority = task.priority || 'low'; // Default to 'low' if priority is undefined
            const priorityText = priority.charAt(0).toUpperCase() + priority.slice(1);

            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'completed' : ''}">
                    ${task.text} 
                    <small>(${task.category || 'No category'}, Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'})</small>
                </span>
                <span class="priority-${priority}">${priorityText}</span>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            `;
            li.querySelector('.edit').addEventListener('click', () => editTask(index));
            li.querySelector('.delete').addEventListener('click', () => deleteTask(index));
            li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => toggleTaskCompletion(index, e.target.checked));
            taskList.appendChild(li);
        });
    };

    // Save tasks to local storage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add a new task
    const addTask = () => {
        const text = taskInput.value.trim();
        const category = taskCategory.value.trim();
        const dueDate = taskDueDate.value;
        const priority = taskPriority.value;

        if (text === '') {
            alert('Task cannot be empty.');
            return;
        }

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text, category, dueDate, priority, completed: false });
        saveTasks(tasks);
        loadTasks();
        taskInput.value = '';
        taskCategory.value = '';
        taskDueDate.value = '';
        taskPriority.value = 'low';
    };

    // Edit a task
    const editTask = (index) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks[index];
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            const newCategory = prompt('Edit category:', task.category);
            const newDueDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate);
            const newPriority = prompt('Edit priority (low, medium, high):', task.priority);
            tasks[index] = {
                ...task,
                text: newText.trim(),
                category: newCategory !== null ? newCategory.trim() : task.category,
                dueDate: newDueDate !== null ? newDueDate : task.dueDate,
                priority: ['low', 'medium', 'high'].includes(newPriority) ? newPriority : task.priority
            };
            saveTasks(tasks);
            loadTasks();
        }
    };

    // Delete a task
    const deleteTask = (index) => {
        if (confirm('Are you sure you want to delete this task?')) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.splice(index, 1);
            saveTasks(tasks);
            loadTasks();
        }
    };

    // Toggle task completion status
    const toggleTaskCompletion = (index, completed) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks[index].completed = completed;
        saveTasks(tasks);
        loadTasks();
    };

    // Event listeners
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initial load of tasks
    loadTasks();
});
