const positions = require('../controllers/positions.controller');

module.exports = (app) => {
  app.post('/api/positions', positions.createPosition);
  app.get('/api/positions', positions.getPositions);
  app.delete('/api/positions/:id', positions.deletePosition);
  app.post('/api/positions/check', positions.checkPosition);
};
