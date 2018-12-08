const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const Class = require('../models/class');
const Voter = require('../models/voter');
const mongoose = require('mongoose');

exports.upload_voters = (req, res) => {
  const {
    cls_id
  } = req.body;
  const ext = path.extname(req.file.originalname);
  const oldPath = './' + req.file.path;
  const newPath = oldPath + ext;

  var votersFromCl;
  fs.rename(oldPath, newPath, (err) => {
    if (err) return;
  });

  Class.findById(cls_id, (err, doc) => {
    if (err) console.log(err);
    if (doc.uploadDone) {
      return res.status(400).json({
        message: "This class has already being uploaded.",
        status: false
      });
    }
    setTimeout(() => {
      let results = [];
      var completed = [];

      fs.createReadStream(newPath).pipe(csv())
        .on('data', data =>
          results.push(data.NAME))
        .on('end', () => {
          results.forEach(name => {
            Class.findById(cls_id).then(cl => {
                const id = mongoose.Types.ObjectId();
                const voter = new Voter({
                  _id: id,
                  name: name,
                  class: cls_id
                });
                cl.voters.push(id);
                cl.save();
                return voter.save();
              }).then(c => completed.push(c))
              .catch(e => console.error(e));
          });
        });
      if (completed.length === results.length) {
        Class.findById(cls_id, (err, doc) => {
          doc.uploadDone = true;
          doc.save((err, doc) => {
            if (err) return;
          });
        });
        res.json({
          message: 'Upload completed',
          status: true
        });
      }
    }, 1000);
  });


};

exports.create_class = (req, res) => {
  const {
    title,
    program
  } = req.body;

  Class.findOne({
    title
  }, (err, doc) => {
    if (err) res.status(500).json({
      err
    });
    if (doc) {
      res.status(401).json({
        message: 'Class exists already',
        status: false
      });
    } else {
      const cls = new Class({
        _id: mongoose.Types.ObjectId(),
        title,
        program
      });

      cls.save()
        .then(doc => {
          res.json(doc);
        })
        .catch(error => res.status(500).json({
          error
        }));
    }
  });
};

exports.get_classes = (req, res) => {
  Class.find().select('title _id').exec().then(docs => res.json(docs)).catch(error => res.status(500).json({
    error
  }));
};

exports.get_class = (req, res) => {
  const {
    cls
  } = req.body;

  console.log(cls);
};

exports.get_imported_classes = (req, res) => {
  Class.find()
    .select('title voters createdAt')
    .populate('voters', 'name _id')
    .exec()
    .then(docs => {
      const rss = [];
      docs.map(doc => {
        if (doc.voters.length > 0) {
          rss.push(doc);
        }
      });
      res.json(rss);
    })
    .catch(err => res.status(500).json({
      err
    }));
};

exports.get_voters_by_class = (req, res) => {
  const classId = req.params.classId;
  Class.findById(classId)
    .select('title voters createdAt')
    .populate('voters', 'name _id')
    .exec()
    .then(docs => {
      res.json(docs);
    })
    .catch(err => res.status(500).json({
      err
    }));

}
