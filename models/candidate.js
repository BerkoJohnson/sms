const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  dob: String,
  room: String,
  house: String,
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  },
  photoUrl: {
    type: String,
    default: ''
  },
  votes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Candidate', schema);
