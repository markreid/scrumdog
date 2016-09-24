/**
 * API v1
 */

const db = require('../models');
const _ = require('lodash');

const express = require('express');


const router = new express.Router();

router.get('/entries', (req, res) => {
  db.Entry.findAll({
    include: db.User,
  })
  .then(response => res.send(response))
  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
});

router.get('/laststandup', (req, res) => {
  db.Standup.findOne({
    include: [{
      model: db.Entry,
      include: db.User,
    }],
    order: [
      ['id', 'DESC'],
    ],
  })
  .then(response => res.send(response || {}))
  .catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});


router.get('/entries', (req, res) => {
  db.Entry.findAll({
    include: db.User,
  })
  .then(response => res.send(response))
  .catch((err) => {
    console.log(err);
    res.status(500).send(err);
  });
});

// standuptitles
// standups with no related data
router.get('/standuptitles', (req, res) => {
  db.Standup.findAll({
    order: [
    ['id', 'DESC'],
    ],
  })
  .then(response => res.send(response))
  .catch((err) => {
    res.status(500).send(err);
  });
});


// Get the most recent standup, with everything included
router.get('/laststandup', (req, res) => {
  db.Standup.findOne({
    include: [{
      model: db.Entry,
      include: db.User,
    }],
    order: [
      ['id', 'DESC'],
    ],
  })
  .then(response => res.send(response || {}))
  .catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.get('/standups/:id', (req, res) => {
  db.Standup.findById(req.params.id, {
    include: [{
      model: db.Entry,
      include: db.User,
    }],
  }).then((response) => {
    if (!response) return res.status(404).send();
    return res.status(200).send(response);
  }).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});


router.get('/users', (req, res) => {
  db.User.findAll()
  .then(response => res.send(response))
  .catch((err) => {
    res.status(500).send(err);
  });
});


router.post('/users', (req, res) => {
  // todo - need more validation? relying on Sequelize here...
  db.User.create(req.body)
  .then(data => res.status(201).send(data))
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  });
});

// modify a user
router.put('/users/:userId', (req, res) => {
  db.User.findById(req.params.userId)
  .then(user => user.updateAttributes(req.body))
  .then(data => res.send(data))
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  });
});

router.delete('/users/:userId', (req, res) => {
  db.User.findById(req.params.userId)
  .then(userModel => userModel.destroy())
  .then(response => res.send(response))
  .catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});


// Create a new entry
router.post('/entries', (req, res) => {
  // start by finding the most recent entry by this user
  db.Entry.findOne({
    where: {
      UserId: req.body.UserId,
    },
    order: [
      ['id', 'DESC'],
    ],
  })
  .then((entry) => {
    const props = entry ? {
      lastDayTasks: entry.todayTasks,
      blockers: entry.blockers,
    } : {};

    return db.Entry.create(Object.assign({}, req.body, props));
  })
  .then(data => res.send(data))
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  });
});

router.put('/entries/:entryId', (req, res) => {
  db.Entry.findById(req.params.entryId, {
    include: [{
      model: db.User,
    }],
  })
  .then(entry => entry.updateAttributes(req.body))
  .then(data => res.send(data))
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  });
});

router.delete('/entries/:entryId', (req, res) => {
  db.Entry.destroy({
    where: {
      id: req.params.entryId,
    },
  })
  .then(() => res.status(200).send())
  .catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});


router.post('/standups', (req, res) => {
  db.Standup.create(req.body)
  .then(data => res.status(201).send(data))
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  });
});

router.put('/standups/:standupId', (req, res) => {
  db.Standup.findById(req.params.standupId)
  .then(standup => standup.updateAttribues(req.body))
  .then(data => res.send(data))
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  });
});

router.delete('/standups/:standupId', (req, res) => {
  db.Standup.destroy({
    where: {
      id: req.params.standupId,
    },
  }).then(destroyedCount => res.status(200).send({
    destroyedCount,
  })).catch((err) => {
    console.error(err);
    res.status(500).send(err);
  });
});


module.exports = router;
