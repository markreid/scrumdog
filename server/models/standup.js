/**
 * standup.js
 * Standup model
 * Represents a daily standup.
 */

module.exports = (sequelize, DataTypes) => {
  const Standup = sequelize.define('Standup', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    title: DataTypes.STRING,
    TeamId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Teams',
        key: 'id',
      },
      allowNull: false,
    },
  });

  return Standup;
};
