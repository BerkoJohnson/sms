const users = require('../controllers/user');

const {
  check
} = require('express-validator/check');
const {
  environment
} = require('../config/env');

const jwt = require('express-jwt');

const auth = jwt({
  secret: environment.config.secret,
  userProperty: 'payload'
});

module.exports = (app) => {
  app.post('/api/users', users.create);
  app.get('/api/users', users.getAll);
  app.post('/api/user/checkmail', users.isAvailable);
  app.post('/api/user', users.getByEmail);
  app.post('/api/login', users.login);
};
