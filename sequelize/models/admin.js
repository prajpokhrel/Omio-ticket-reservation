'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Destination, Driver, Bus, Passenger, Reservation}) {
            // define association here
            this.hasMany(Destination, { foreignKey: 'adminId' });
            this.hasMany(Driver, { foreignKey: 'adminId' });
            this.hasMany(Bus, { foreignKey: 'adminId' });
            this.hasMany(Passenger, { foreignKey: 'adminId' });
            this.hasMany(Reservation, { foreignKey: 'adminId' });
        }
    }
    Admin.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        displayPicture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isSuperAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'admins',
        modelName: 'Admin',
    });
    return Admin;
};