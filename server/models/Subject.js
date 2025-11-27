const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
  },
  targetPercentage: {
    type: Number,
    default: 75,
  },
  totalClasses: {
    type: Number,
    default: 0,
  },
  attendedClasses: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

subjectSchema.virtual('currentPercentage').get(function() {
  if (this.totalClasses === 0) return 0;
  return ((this.attendedClasses / this.totalClasses) * 100).toFixed(2);
});

subjectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Subject', subjectSchema);
