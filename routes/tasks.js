// backend/routes/tasks.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // JWT authentication middleware
const Task = require('../models/Task'); // Sequelize Task model

// ==============================
// ✅ Create a new task
// ==============================
router.post('/', auth, async (req, res) => {
  try {
    const { title, completed, description, dueDate, category, status } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      title,
      completed: completed || false,
      description: description || null,
      dueDate: dueDate || null,
      category: category || 'general',
      status: status || 'todo',
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ==============================
// ✅ Get all tasks for logged-in user
// ==============================
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(tasks);
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ==============================
// ✅ Update a task by ID
// ==============================
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId.toString() !== req.user.id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    const allowedFields = ['title', 'status', 'description', 'dueDate', 'category', 'completed'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ message: 'No valid fields to update' });

    const updatedTask = await task.update(updates);
    res.json(updatedTask);
  } catch (err) {
    console.error('PUT /tasks/:id error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ==============================
// ✅ Delete a task by ID
// ==============================
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId.toString() !== req.user.id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    await task.destroy();
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error('DELETE /tasks/:id error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
