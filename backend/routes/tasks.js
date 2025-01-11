const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new task
router.post('/', (req, res) => {
  const { title, details, due_date, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    `INSERT INTO tasks (title, details, due_date, priority) VALUES (?, ?, ?, ?)`,
    [title, details, due_date, priority],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// Update a task
router.put('/:id', (req, res) => {
  const { title, details, due_date, priority, status } = req.body;
  db.run(
    `UPDATE tasks SET title = ?, details = ?, due_date = ?, priority = ?, status = ? WHERE id = ?`,
    [title, details, due_date, priority, status, req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: 'Task updated successfully' });
      }
    }
  );
});

// Delete a task
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

// Toggle task status (PATCH)
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;

  // Get current status of the task
  db.get('SELECT status FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle the status
    const newStatus = row.status === 'pending' ? 'completed' : 'pending';

    // Update the status in the database
    db.run('UPDATE tasks SET status = ? WHERE id = ?', [newStatus, id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Task status updated to ${newStatus}`, status: newStatus });
    });
  });
});

module.exports = router;
