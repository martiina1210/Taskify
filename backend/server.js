const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const taskRoutes = require('./routes/tasks');

const app = express();
const port = process.env.PORT || 3000; // Use dynamic port for Render

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins

// Routes
app.use('/tasks', taskRoutes);

// Optional: Serve frontend only in local development
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('frontend')); // Serve static frontend files locally

  // Root route for frontend
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
