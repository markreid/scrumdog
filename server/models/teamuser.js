/**
 * teamuser.js
 * Join table for Team <--> User
 */

module.exports = (sequelize, DataTypes) => sequelize.define('TeamUser', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
});
