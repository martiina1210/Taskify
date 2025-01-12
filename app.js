document.addEventListener('DOMContentLoaded', () => {
  const homeLink = document.getElementById('home-link');
  const tasksLink = document.getElementById('tasks-link');
  const homepageSection = document.getElementById('homepage');
  const taskPageSection = document.getElementById('task-page');

  // Show Homepage
  homeLink.addEventListener('click', () => {
    homepageSection.classList.remove('hidden');
    taskPageSection.classList.add('hidden');
  });

  // Show Task Page
  tasksLink.addEventListener('click', () => {
    homepageSection.classList.add('hidden');
    taskPageSection.classList.remove('hidden');
  });

  // Your existing task management code
  const tasksContainer = document.getElementById('tasks-container');
  const addTaskBtn = document.getElementById('add-task-btn');
  const BASE_URL = 'https://taskify-backend-1j1r.onrender.com';

  async function fetchTasks() {
    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const tasks = await response.json();
      displayTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  function displayTasks(tasks) {
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');
      taskItem.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.details}</p>
        <small>Due: ${task.due_date}</small>
        <button class="delete-btn" data-task-id="${task.id}"> Delete </button> 
      `;
      const deleteBtn = taskItem.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => deleteTask(task.id)); 
      tasksContainer.appendChild(taskItem);
    });
  }
  
  async function deleteTask(taskId) {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',  // Koristimo DELETE metodu
      });

      if (response.ok) {
        console.log(`Task with ID: ${taskId} deleted`);
        fetchTasks();  // Ponovno dohvatiti zadatke i ažurirati prikaz
      } else {
        console.error(`Failed to delete task with ID: ${taskId}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  addTaskBtn.addEventListener('click', async () => {
    const title = document.getElementById('task-title').value;
    const details = document.getElementById('task-details').value;
    const dueDate = document.getElementById('task-due-date').value;
    

    if (!title) {
      alert('Task title is required!');
      return;
    }

    try {
      await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, details, due_date: dueDate})
      });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  });

  fetchTasks();
});
