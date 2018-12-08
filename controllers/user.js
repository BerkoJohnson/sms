const passport = require('passport');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {
  ValidationResult
} = require('express-validator');
const {
  environment
} = require('../config/env');

const User = require('../models/user');

exports.login = (req, res) => {
  passport.authenticate('local', (error, user, info) => {
    let token;

    // if passport catches error
    if (error) {
      res.status(404).json(error);
      return;
    }

    if (user) {
      token = generateToken(user);
      res.status(200).json({
        token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

exports.create = (req, res) => {
  const {
    name,
    email,
    password,
    type
  } = req.body;

  const user = new User({
    name,
    email,
    type
  });

  user.salt = crypto.randomBytes(16).toString('hex');
  user.hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');


  user.save().then(() => {
    let token;

    token = generateToken(user);
    res.status(200);
    res.json({
      token
    });

  }).catch(err => {
    // res.status(500).json(err);
    if (err.name === 'MongoError' && err.code == '11000') {
      res.status(401).json({
        message: 'User is already saved'
      });
    } else if (err.name === 'ValidatorError') {
      res.status(401).json({
        message: err.message
      });
    } else {
      res.status(500).json({
        message: 'There was an error'
      });
    }
  });
};

exports.getAll = (req, res) => {
  User.find().exec().then(docs => res.json(docs)).catch(err => res.status(500).json(err));
};

const generateToken = (user) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    type: user.type,
    exp: parseInt(expiry.getTime() / 1000)
  }, environment.config.secret);
};


exports.getByEmail = (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .select('name email _id type')
    .exec()
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json(null);
      }
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });
};
exports.isAvailable = (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .exec()
    .then(user => {
      let response = false;
      if (user) response = true;
      res.json(response);
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });
};
