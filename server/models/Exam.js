const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Subject',
  },
  name: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  obtainedMarks: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

examSchema.virtual('percentage').get(function() {
  if (this.totalMarks === 0) return 0;
  return ((this.obtainedMarks / this.totalMarks) * 100).toFixed(2);
});

examSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Exam', examSchema);
