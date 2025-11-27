const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Subject',
  },
  room: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Schedule', scheduleSchema);
