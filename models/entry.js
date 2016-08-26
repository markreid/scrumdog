/**
 * entry.js
 * Entry model
 */

module.exports = function(sequelize, DataTypes){

    var Entry = sequelize.define('Entry', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },

        lastDayTasks: DataTypes.STRING,
        todayTasks: DataTypes.STRING,
        blockers: DataTypes.STRING,

        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false
        },
        StandupId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Standups',
                key: 'id'
            },
            allowNull: false
        }
    });

    return Entry;
};
