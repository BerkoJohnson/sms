const candidates = require('../controllers/candidates');

module.exports = (app) => {
  app.post('/api/candidates', candidates.create);
  app.patch('/api/candidates', candidates.update);
  app.get('/api/candidates', candidates.getAll);
  app.get('/api/candidates/:id', candidates.get);
  app.delete('/api/candidates/:id', candidates.deleteCandidate);
};
