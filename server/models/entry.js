/**
 * entry.js
 * Entry model.
 * Represents a user's yesterday/today/blockers for a standup.
 */

module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define('Entry', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },

    lastDayTasks: DataTypes.STRING,
    todayTasks: DataTypes.STRING,
    blockers: DataTypes.STRING,

    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: false,
    },
    StandupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Standups',
        key: 'id',
      },
      allowNull: false,
    },
  });

  return Entry;
};
