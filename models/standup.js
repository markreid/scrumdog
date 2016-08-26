/**
 * standup.js
 * Standup model
 */

module.exports = function(sequelize, DataTypes){

    var Standup = sequelize.define('Standup', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        title: DataTypes.STRING
    });

    return Standup;
};
