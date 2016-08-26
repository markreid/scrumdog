/**
 * api routes
 */

var db = require('../models');
var _ = require('lodash');


module.exports = function(app){

    app.get('/api/v1/entries', function(req, res, next){
        db.Entry.findAll({
            include: db.User
        }).then(function(response){
            res.status(200).send(response);
        }).catch(function(err){
            console.log(err);
            res.status(500).send(err);
        });
    });

    // standuptitles
    // standups with no related data
    app.get('/api/v1/standuptitles', function(req, res, next){
        db.Standup.findAll({
            order: [
                ['id', 'DESC']
            ]
        }).then(function(response){
            res.status(200).send(response);
        }).catch(function(err){
            res.status(500).send(err);
        });
    });


    // Get the most recent standup, with everything included
    app.get('/api/v1/laststandup', function(req, res, next){
        db.Standup.findOne({
            include: [{
                model: db.Entry,
                include: db.User
            }],
            order: [
                ['id', 'DESC']
            ]
        }).then(function(response){
            return res.status(200).send(response || {});
        }).catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    });

    app.get('/api/v1/standups/:id', function(req, res, next){
        db.Standup.findById(req.params.id, {
            include: [{
                model: db.Entry,
                include: db.User
            }]
        }).then(function(response){
            if(!response) return res.status(404).send();
            return res.status(200).send(response);
        }).catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    });


    app.get('/api/v1/users', function(req, res, next){
        db.User.findAll().then(function(response){
            res.status(200).send(response);
        }).catch(function(err){
            res.status(500).send(err);
        });
    });


    app.post('/api/v1/users', function(req, res, next){
        // todo - need more validation? relying on Sequelize here...
        db.User.create(req.body).then(function(data){
            res.status(201).send(data);
        }).catch(function(err){
            if(err.name === 'SequelizeValidationError'){
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }
        });
    });

    // modify a user
    app.put('/api/v1/users/:userId', function(req, res, next){
        db.User.findById(req.params.userId)
        .then(function(user){
            console.log(req.body);
            return user.updateAttributes(req.body);
        }).then(function(data){
            res.status(200).send(data);
        }).catch(function(err){
            if(err.name === 'SequelizeValidationError'){
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.delete('/api/v1/users/:userId', function(req, res, next){
        db.User.findById(req.params.userId)
        .then(function(userModel){
            return userModel.destroy();
        }).then(function(response){
            res.status(200).send(response);
        }).catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    });


    // Create a new entry
    app.post('/api/v1/entries', function(req, res, next){
        // start by finding the most recent entry by this user
        db.Entry.findOne({
            where: {
                UserId: req.body.UserId
            },
            order: [
                ['id', 'DESC']
            ]
        }).then(function(entry){
            var props = entry ? {
                lastDayTasks: entry.todayTasks,
                blockers: entry.blockers
            } : {};

            return db.Entry.create(_.extend(req.body, props));
        })
        .then(function(data){
            res.status(201).send(data);
        }).catch(function(err){
            if(err.name === 'SequelizeValidationError'){
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.put('/api/v1/entries/:entryId', function(req, res, next){
        db.Entry.findById(req.params.entryId, {
            include: [{
                model: db.User
            }]
        })
        .then(function(entry){
            // todo - validation, should it be left to sequelize models?
            return entry.updateAttributes(req.body);
        }).then(function(data){
            res.status(200).send(data);
        }).catch(function(err){
            if(err.name === 'SequelizeValidationError'){
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.delete('/api/v1/entries/:entryId', function(req, res, next){
        db.Entry.destroy({
            where: {
                id: req.params.entryId
            }
        })
        .then(function(numOperations){
            res.status(200).send();
        }).catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    });


    app.post('/api/v1/standups', function(req, res, next){
        db.Standup.create(req.body).then(function(data){
            res.status(201).send(data);
        }).catch(function(err){
            if(err.name === 'SequelizeValidationError'){
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.put('/api/v1/standups/:standupId', function(req, res, next){
        db.Standup.findById(req.params.standupId)
        .then(function(standup){
            return standup.updateAttributes(req.body);
        }).then(function(data){
            res.status(200).send(data);
        }).catch(function(err){
            if(err.name === 'SequelizeValidationError'){
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.delete('/api/v1/standups/:standupId', function(req, res, next){
        db.Standup.destroy({
            where: {
                id: req.params.standupId
            }
        }).then(function(destroyedCount){
            res.status(200).send({
                destroyedCount: destroyedCount
            });
        }).catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    });


    app.post('/api/v1/mailer/:standupId', function(req, res, next){
        db.Standup.findById(req.params.standupId, {
            include: [{
                model: db.Entry,
                include: db.User
            }]
        }).then(mailer.render)
        .then(function(template){
            return mailer.mail(template);
        }).then(function(){
            res.status(200).send();
        }).catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    });

    app.get('/api/v1/mailer/:standupId', function(req, res, next){
        db.Standup.findById(req.params.standupId, {
            include: [{
                model: db.Entry,
                include: db.User
            }]
        }).then(mailer.render)
        .then(function(template){
            res.status(200).send(template);
        }).catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });
    });


};
