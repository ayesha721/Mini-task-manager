const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // allow requests from frontend
app.use(bodyParser.json());

// Path to JSON file
const dataPath = path.join(__dirname, 'data', 'tasks.json');

// Helper function to read tasks from JSON
function readTasks() {
  const jsonData = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(jsonData);
}

// Helper function to write tasks to JSON
function writeTasks(tasks) {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
}

// ====== Routes ======

// Get all tasks
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = req.body.task;

  if (!newTask || newTask.trim() === '') {
    return res.status(400).json({ message: 'Task cannot be empty' });
  }

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json({ message: 'Task added', tasks });
});

// Delete a task by index
app.delete('/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const tasks = readTasks();

  if (index < 0 || index >= tasks.length) {
    return res.status(400).json({ message: 'Invalid index' });
  }

  tasks.splice(index, 1);
  writeTasks(tasks);
  res.json({ message: 'Task deleted', tasks });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
