const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get schedule
// @route   GET /api/schedule
router.get('/', protect, async (req, res) => {
  try {
    const schedule = await Schedule.find({ user: req.user.id });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add class to schedule
// @route   POST /api/schedule
router.post('/', protect, async (req, res) => {
  const { day, startTime, endTime, subject, room } = req.body;

  try {
    const schedule = new Schedule({
      user: req.user.id,
      day,
      startTime,
      endTime,
      subject,
      room
    });

    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete class
// @route   DELETE /api/schedule/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (schedule) {
      if (schedule.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      await schedule.deleteOne();
      res.json({ message: 'Class removed' });
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
