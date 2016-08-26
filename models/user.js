/**
 * user.js
 * User model
 */

module.exports = function(sequelize, DataTypes){

    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
    return User;
};
