const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all subjects
// @route   GET /api/subjects
router.get('/', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a subject
// @route   POST /api/subjects
router.post('/', protect, async (req, res) => {
  const { name, targetPercentage } = req.body;

  try {
    const subject = new Subject({
      user: req.user.id,
      name,
      targetPercentage,
      totalClasses: 0,
      attendedClasses: 0,
      currentPercentage: 0
    });

    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update attendance or details
// @route   PUT /api/subjects/:id
router.put('/:id', protect, async (req, res) => {
  const { present, name, targetPercentage, totalClasses, attendedClasses } = req.body;

  try {
    const subject = await Subject.findById(req.params.id);

    if (subject) {
      // Check user
      if (subject.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }

      if (name) subject.name = name;
      if (targetPercentage) subject.targetPercentage = targetPercentage;
      
      if (totalClasses !== undefined && attendedClasses !== undefined) {
          subject.totalClasses = totalClasses;
          subject.attendedClasses = attendedClasses;
      } else if (present !== undefined) {
          subject.totalClasses += 1;
          if (present) {
              subject.attendedClasses += 1;
          }
      }

      if (subject.totalClasses > 0) {
        subject.currentPercentage = ((subject.attendedClasses / subject.totalClasses) * 100).toFixed(2);
      } else {
        subject.currentPercentage = 0;
      }

      const updatedSubject = await subject.save();
      res.json(updatedSubject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (subject) {
      if (subject.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      await subject.deleteOne();
      res.json({ message: 'Subject removed' });
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
