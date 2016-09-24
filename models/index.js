/**
 * models.js
 * define our DB models and run their associations
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require(`${__dirname}/../config.json`);

const basename = path.basename(module.filename);

const { database, username, password } = config.db;
const sequelize = new Sequelize(database, username, password, config.db);
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
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
  onDelete: 'cascade',
});
db.Entry.belongsTo(db.User, {
  onDelete: 'cascade', // nuke entries when we delete users
});
db.Team.belongsToMany(db.User, {
  through: db.TeamUser,
});
db.User.belongsToMany(db.Team, {
  through: db.TeamUser,
});


module.exports = db;
