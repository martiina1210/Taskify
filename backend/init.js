const db = require('./config/db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      details TEXT,
      due_date DATE,
      priority TEXT,
      status TEXT DEFAULT 'pending'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Tasks table created successfully.');
    }
  });
});

db.close();
