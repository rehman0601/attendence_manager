const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get exams for a subject
// @route   GET /api/exams/:subjectId
router.get('/:subjectId', protect, async (req, res) => {
  try {
    const exams = await Exam.find({ subject: req.params.subjectId, user: req.user.id }).sort({ date: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add an exam
// @route   POST /api/exams
router.post('/', protect, async (req, res) => {
  const { subjectId, name, totalMarks, obtainedMarks, date } = req.body;

  try {
    const exam = new Exam({
      user: req.user.id,
      subject: subjectId,
      name,
      totalMarks,
      obtainedMarks,
      date,
    });

    const createdExam = await exam.save();
    res.status(201).json(createdExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update exam
// @route   PUT /api/exams/:id
router.put('/:id', protect, async (req, res) => {
  const { name, totalMarks, obtainedMarks, date } = req.body;

  try {
    const exam = await Exam.findById(req.params.id);

    if (exam) {
      if (exam.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      exam.name = name || exam.name;
      if (totalMarks !== undefined) exam.totalMarks = totalMarks;
      if (obtainedMarks !== undefined) exam.obtainedMarks = obtainedMarks;
      exam.date = date || exam.date;

      const updatedExam = await exam.save();
      res.json(updatedExam);
    } else {
      res.status(404).json({ message: 'Exam not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete exam
// @route   DELETE /api/exams/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (exam) {
      if (exam.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
      }
      await exam.deleteOne();
      res.json({ message: 'Exam removed' });
    } else {
      res.status(404).json({ message: 'Exam not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
