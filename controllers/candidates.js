const Candidate = require('../models/candidate');
const Position = require('../models/position.model');

const mongoose = require('mongoose');

exports.create = async (req, res) => {
  try {
    const {
      name,
      dob,
      room,
      house,
      position
    } = req.body;

    //find if position exists
    const findPos = await Position.findById(position);

    //if true save candidate
    const id = mongoose.Types.ObjectId();

    const candidate = new Candidate({
      _id: id,
      name,
      dob,
      room,
      position: findPos._id
    });

    const saved = await candidate.save();

    if (saved) {
      Position.findById(position, (err, pos) => {
        if (pos) {
          pos.candidates.push(saved._id);
          pos.save();
        }
      });
    }
    res.json(saved);

    // if candidate saved, push candidate id to the position
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  const candidates = await Candidate.find({});
  res.json(candidates);
};

exports.get = async (req, res) => {
  const id = req.params.id;

  const doc = await Candidate.findById(id);
  res.json(doc);
};

exports.update = async (req, res) => {
  const {
    candidateObj
  } = req.body;

  const updated = await Candidate.findByIdAndUpdate(candidateObj._id, {
    name: candidateObj.name,
    dob: candidateObj.dob,
    class: candidateObj.class,
    house: candidateObj.house,
    position: candidateObj.position
  });

  res.json(updated);
};

exports.deleteCandidate = async (req, res) => {
  try {
    const deletedDoc = await Candidate.findByIdAndDelete(req.params.id);
    if (deletedDoc) {
      Position.findById(deletedDoc.position, (err, position) => {
        if (!err) delete position.candidates[deletedDoc._id];
        position.save();
      })
    }
    res.json(deletedDoc);
  } catch (err) {
    res.status(500).json(err)
  }

};
