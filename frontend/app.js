document.addEventListener('DOMContentLoaded', () => {
  const tasksContainer = document.getElementById('tasks-container');
  const addTaskBtn = document.getElementById('add-task-btn');

  // Set your backend URL
  const BASE_URL = 'https://taskify-backend-1j1r.onrender.com';

  // Fetch and display tasks
  async function fetchTasks() {
    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const tasks = await response.json();
      displayTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Please check your backend connection.');
    }
  }

  // Display tasks in the list
  function displayTasks(tasks) {
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');
      if (task.status === 'completed') {
        taskItem.classList.add('completed');
      }
      taskItem.innerHTML = `
        <span>${task.title}</span>
        <div>
          <button onclick="toggleStatus(${task.id}, '${task.status}')">${task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}</button>
          <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
      tasksContainer.appendChild(taskItem);
    });
  }

  // Add a new task
  addTaskBtn.addEventListener('click', async () => {
    const title = document.getElementById('task-title').value;
    const details = document.getElementById('task-details').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;

    if (!title) {
      alert('Task title is required!');
      return;
    }

    try {
      await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, details, due_date: dueDate, priority })
      });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  });

  // Toggle task status
  window.toggleStatus = async (id, currentStatus) => {
    try {
      await fetch(`${BASE_URL}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle task status. Please try again.');
    }
  };

  // Delete a task
  window.deleteTask = async (id) => {
    try {
      await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Initial fetch
  fetchTasks();
});
