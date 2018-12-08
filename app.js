const express = require('express'),
  path = require('path'),
  passport = require('passport'),
  logger = require('morgan'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');



mongoose.connect('mongodb://localhost:27017/elecvotedb', {
    useCreateIndex: true,
    useNewUrlParser: true,
  }).then(() => console.log('Mongodb connected...'))
  .catch(err =>{ console.error('Connecting to MongoDB failed. Check Service');});

// mongoose.set('debug', true);
require('./models/user');
require('./config/passport');

const app = express();

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(logger('dev'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

require('./routes/candidates')(app);
require('./routes/users')(app);
require('./routes/voters')(app);
require('./routes/positions.route')(app);

app.use(express.static(__dirname + '/dist/elecvote'));

app.all('*', (req, res) => {
  res.sendFile(__dirname + '/dist/elecvote/index.html');
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      message: err.name + ': ' + err.message
    });
  }
});


app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
const port = 8000;
app.listen(port, () => {
  console.log('Server started on port: '+ port);
});
