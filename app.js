// declare var
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');

// LocalStorage functions
function saveTasks() {
    const tasks = [];
    const taskItems = taskList.querySelectorAll('li:not(#emptyState)');
    
    taskItems.forEach(item => {
        const text = item.querySelector('span').textContent;
        const isCompleted = item.querySelector('input[type="checkbox"]').checked;
        
        tasks.push({
            text: text,
            completed: isCompleted
        });
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        
        if (tasks.length > 0) {
            emptyState.style.display = 'none';
        }
        
        tasks.forEach(task => {
            // Create task element
            const taskItem = document.createElement('li');
            taskItem.className = 'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors';
            
            taskItem.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400">
                <span class="flex-1 text-gray-700 ${task.completed ? 'opacity-50' : ''}">${task.text}</span>
                <button class="delete-btn text-red-500 hover:text-red-700 font-medium text-sm">
                    Delete
                </button>
            `;
            
            taskList.appendChild(taskItem);
        });
    }
}

// Add function
function addTask() {
    const taskText = taskInput.value.trim();

    // Check if the inptut is empty
    if(taskText == ''){
        alert('Please enter a Task!')
        return;
    }

    // Hide element
    emptyState.style.display = 'none';

    // Create task element
    const taskItem = document.createElement('li');
    taskItem.className = 'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors';
        
    taskItem.innerHTML = `
        <input type="checkbox" class="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400">
        <span class="flex-1 text-gray-700">${taskText}</span>
        <button class="delete-btn text-red-500 hover:text-red-700 font-medium text-sm">
            Delete
        </button>
    `;

    // Add the task to the list
    taskList.appendChild(taskItem);

    // Clear input
    taskInput.value = '';
    taskInput.focus();
    
    // Save to localStorage
    saveTasks();
}

addButton.addEventListener('click', addTask);

// Allow adding task with Enter key
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Checkbox function
function toggleTask(checkbox) {
    const taskSpan = checkbox.nextElementSibling;
    
    if (checkbox.checked) {
        taskSpan.classList.add('opacity-50');
    } else {
        taskSpan.classList.remove('opacity-50');
    }
}

// Delete function
function deleteTask(deleteBtn) {
    const taskItem = deleteBtn.closest('li');
    taskItem.remove();
    
    // Show empty state if no tasks left
    if (taskList.children.length === 1) {  // because "no tasks message still there it is just hidden"
        emptyState.style.display = 'block';
    }
}

taskList.addEventListener('click', function(e) {
    // Check if clicked element is a checkbox
    if (e.target.type === 'checkbox') {
        toggleTask(e.target);
        saveTasks(); // Save after toggling
    }
    
    // Check if clicked element is delete button
    if (e.target.classList.contains('delete-btn')) {
        deleteTask(e.target);
        saveTasks(); // Save after deleting
    }
});

// Filter functionality
let currentFilter = 'all'; 

// Get all
const filterButtons = document.querySelectorAll('.filter-btn');

// Function to filter tasks
function filterTasks(filterType) {
    currentFilter = filterType;
    
    // Get all task items (except empty state)
    const allTasks = taskList.querySelectorAll('li:not(#emptyState)');
    
    allTasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        
        switch(filterType) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'active':
                task.style.display = checkbox.checked ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = checkbox.checked ? 'flex' : 'none';
                break;
        }
    });
    
    // Update button styles
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filterType) {
            btn.className = 'filter-btn flex-1 sm:flex-none px-3 sm:px-3 py-1 text-xs sm:text-sm font-medium text-white bg-blue-500 rounded-lg transition-colors';
        } else {
            btn.className = 'filter-btn flex-1 sm:flex-none px-3 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors';
        }
    });
}

// Add click listeners to filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterTasks(button.dataset.filter);
    });
});

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);
