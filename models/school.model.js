const mongoose = require('mongoose');
const electionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  academicYear: {
    type: String,
    default: `${new Date().getFullYear()}-${new Date().getFullYear() + 1 }`
  },
  positions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Election', electionSchema);
