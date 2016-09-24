/**
 * team.js
 * Team model
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
