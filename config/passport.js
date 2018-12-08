const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (username, password, done) => {
  User.findOne({
    email: username
  }, (err, user) => {
    // if error
    if (err) return done(err);

    // if user not found
    if (!user) return done(null, false, {
      message: 'User Not Found'
    });

    // if found
    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

    // return if password is wrong
    if (user.hash !== hash) return done(null, false, {
      message: 'Password is wrong'
    });

    // if everything is correct
    return done(null, user);
  });
}));
