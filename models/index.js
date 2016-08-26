/**
 * models.js
 * define our DB models and run their associations
 */

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var config    = require(__dirname + '/../config.json');
var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


/**
 * Model associations
 * I think without these we can't do include calls etc
 * But the associations are already covered in the model
 * definitions...
 */
db.Standup.hasMany(db.Entry, {
  onDelete: 'cascade'
});
db.Entry.belongsTo(db.User, {
  onDelete: 'cascade' // nuke entries when we delete users
});

module.exports = db;
