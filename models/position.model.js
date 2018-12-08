const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    unique: true
  },
  voteType: {
    type: String,
    default: 'Normal'
  },
  candidates:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    }
  ],
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  school: {
    type: String,
    default: 'Atebubu Senior High'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Position', positionSchema);
