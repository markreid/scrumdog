/**
 * notes.js
 * Notes model
 * I can't really decide how to handle this yet; whether they should be
 * associated with a standup or whether there's just one row. So for now
 * the API is going to just return and let you update a single row.
 */

module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define('Notes', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    notes: DataTypes.STRING,
  });

  return Notes;
};
