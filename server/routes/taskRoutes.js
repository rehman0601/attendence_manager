const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

// --- TASKS ---

// @desc    Get all tasks
// @route   GET /api/tasks
router.get('/tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a task
// @route   POST /api/tasks
router.post('/tasks', protect, async (req, res) => {
  const { title, dueDate } = req.body;
  try {
    const task = new Task({ user: req.user.id, title, dueDate });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update task (toggle completion or edit details)
// @route   PUT /api/tasks/:id
router.put('/tasks/:id', protect, async (req, res) => {
  const { title, dueDate, completed } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      if (completed !== undefined) task.completed = completed;
      
      if (title) task.title = title;
      if (dueDate) task.dueDate = dueDate;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
router.delete('/tasks/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- NOTES ---

// @desc    Get notes for a subject
// @route   GET /api/notes
router.get('/notes', protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a note
// @route   POST /api/notes
router.post('/notes', protect, async (req, res) => {
  const { content, subject } = req.body;
  try {
    const note = new Note({ user: req.user.id, content, subject });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update note
// @route   PUT /api/notes/:id
router.put('/notes/:id', protect, async (req, res) => {
  const { content } = req.body;

  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      if (note.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      note.content = content || note.content;
      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
router.delete('/notes/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      if (note.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      await note.deleteOne();
      res.json({ message: 'Note removed' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
