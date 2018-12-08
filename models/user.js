const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  email: String,
  hash: String,
  salt: String,
  type: String
});

module.exports = mongoose.model('User', schema);
