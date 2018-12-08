const voters = require('../controllers/voters');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');


const upload = multer({dest: 'uploads/'});
// const upload = multer({ storage: storage});

module.exports = (app) => {
  app.post('/api/voters', upload.single('file'), voters.upload_voters);
  app.get('/api/voters/classes/:classId', voters.get_voters_by_class);
  app.post('/api/voters/classes', voters.create_class);
  app.get('/api/voters/classes', voters.get_classes);
  app.post('/api/voters/class', voters.get_class);
  app.get('/api/voters/importedclasses', voters.get_imported_classes);
};
