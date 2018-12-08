const mongoose = require('mongoose');

const Position = require('../models/position.model');
const Candidate = require('../models/candidate');

exports.checkPosition = async (req, res) => {
  try {
    const {
      title
    } = req.body;

    const count = await Position.find({
        title
      })
      .countDocuments();
    res.json(count);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createPosition = async (req, res) => {
  try {
    const {
      title,
      voteType
    } = req.body;

    const position = new Position({
      _id: mongoose.Types.ObjectId(),
      title,
      voteType
    });
    const doc = await position.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.getPositions = async (req, res) => {
  try {
    const positions = await Position.find({}).populate('candidates', '_id name class');
    res.json(positions);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    if (position) {
      const removed =  await Candidate.deleteMany({position});
      res.json(removed);
    }
  } catch (err) {
    res.status(500).json(err);
  }

}
