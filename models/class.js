const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    unique: true,
    uppercase: true
  },
  program: {
    type: String,
    required: true
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voter',
    required: true
  }],
  uploadDone: {
    type: Boolean,
    default: false
  }
},
 {
   timestamps: true
 });

module.exports = mongoose.model('Class', schema);
