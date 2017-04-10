/**
 * API v1
 */

const express = require('express');

const db = require('../models');
const log = require('../lib/logger');


const router = new express.Router();

// fetch the team's last standup
router.get('/teams/:teamId/laststandup', (req, res) => {
  db.Standup.findOne({
    where: {
      TeamId: req.params.teamId,
    },
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
    log.error(err);
    res.status(500).send(err);
  });
});


// a team's standups
// don't include any other models
router.get('/teams/:teamId/standuptitles', (req, res) => {
  db.Standup.findAll({
    where: {
      TeamId: req.params.teamId,
    },
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
    log.error(err);
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
    log.error(err);
    res.status(500).send(err);
  });
});


// all users
router.get('/users', (req, res) => {
  db.User.findAll()
  .then(response => res.send(response))
  .catch((err) => {
    res.status(500).send(err);
  });
});

// create a user
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

// delete a user
router.delete('/users/:userId', (req, res) => {
  db.User.findById(req.params.userId)
  .then(userModel => userModel.destroy())
  .then(response => res.send(response))
  .catch((err) => {
    log.error(err);
    res.status(500).send(err);
  });
});


// Create a new entry
// todo - put this behind /teams/x/standups/y/ ?
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
  .then(data => db.Entry.findById(data.id, {
    include: db.User,
  }))
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
    log.error(err);
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
    log.error(err);
    res.status(500).send(err);
  });
});


// create a standup
router.post('/teams/:teamId/standups', (req, res) => {
  db.Standup.create({
    TeamId: req.params.teamId,
  })
  .then(data => db.Standup.findById(data.id, {
    include: [{
      model: db.Entry,
      include: db.User,
    }],
  }))
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
    log.error(err);
    res.status(500).send(err);
  });
});


router.get('/teams', (req, res) => {
  db.Team.findAll({
    include: db.User,
  })
  .then(response => res.send(response))
  .catch(err => res.status(500).send(err));
});

router.get('/teams/:teamId', (req, res) => {
  db.Team.findById(req.params.teamId, {
    include: db.User,
  })
  .then(response => res.send(response))
  .catch(err => res.status(500).send(err));
});

router.delete('/teams/:teamId', (req, res) => {
  db.Team.findById(req.params.teamId)
  .then((team) => {
    if (!team) {
      return res.status(404).send({});
    }
    return team.destroy().then(() => res.status(200).send({}));
  })
  .catch(err => res.status(500).send(err));
});

router.post('/teams', (req, res) => {
  db.Team.create(req.body)
  .then(data => res.status(201).send(data))
  .catch((err) => {
    log.error(err);
    if (err.name === 'SequelizeValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  });
});

// update a team
router.put('/teams/:teamId', (req, res) => {
  db.Team.findById(req.params.teamId)
  .then((team) => {
    if (!team) {
      return res.status(404).send({});
    }

    // can mutate name only
    const { name } = req.body;
    return team.updateAttributes({
      name,
    })
    .then(() => db.Team.findById(req.params.teamId, {
      include: db.Usere,
    })
    .then(updatedTeam => res.status(200).send(updatedTeam)));
  })
  .catch((error) => {
    log.error(error);
    res.status(500).send(error);
  });
});

router.get('/teams/:teamId/users', (req, res) => {
  db.Team.findById(req.params.teamId, {
    include: db.User,
  })
  .then(response => res.send(response.Users))
  .catch(err => res.status(500).send(err));
});

router.get('/teams/:teamId/standuptitles', (req, res) => {
  db.Team.findById(req.params.teamId, {
    include: {
      model: db.Standup,
      order: [
        ['id', 'DESC'],
      ],
    },
  })
  .then(response => res.send(response.Standups))
  .catch(err => res.status(500).send(err));
});

router.put('/teams/:teamId/users/:userId', (req, res) => {
  db.Team.findById(req.params.teamId)
  .then(team => team.addUser(req.params.userId))
  .then(() => db.Team.findById(req.params.teamId, {
    include: db.User,
  }))
  .then(response => res.status(201).send(response))
  .catch(err => res.status(500).send(err));
});

router.delete('/teams/:teamId/users/:userId', (req, res) => {
  db.Team.findById(req.params.teamId)
  .then(team => team.removeUser(req.params.userId))
  .then(() => db.Team.findById(req.params.teamId, {
    include: db.User,
  }))
  .then(response => res.status(201).send(response))
  .catch(err => res.status(500).send(err));
});


// i haven't really decided how notes work properly yet, so
// what we'll do is have a single Notes row. there's an endpoint
// to create that will only create if it doesn't exist (fresh installs)
// and the GET and PUT always just return the single row.

router.post('/notes', (req, res) => {
  // this will get or create the single note row.
  db.Notes.findById(1)
  .then((row) => {
    if (!row) return db.Notes.create();
    return row;
  })
  .then((row) => {
    res.status(201).send(row);
  })
  .catch(err => res.status(500).send(err));
});

router.get('/notes', (req, res) => {
  db.Notes.findById(1)
  .then((row) => {
    res.send(row);
  })
  .catch((err) => {
    log.error(err);
    res.status(500).send(err);
  });
});

router.put('/notes', (req, res) => {
  db.Notes.update({
    notes: req.body.notes,
  }, {
    where: {
      id: 1,
    },
  })
  .then(() => db.Notes.findById(1))
  .then((row) => {
    res.send(row);
  })
  .catch((err) => {
    log.error(err);
    res.status(500).send(err);
  });
});

module.exports = router;
