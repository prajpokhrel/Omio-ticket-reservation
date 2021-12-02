'use strict';
const {Model, DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    class Driver extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Bus, Admin}) {
            // define association here
            this.hasOne(Bus, {foreignKey: "driverId"});
            this.belongsTo(Admin, {foreignKey: "adminId"});
        }
    }

    Driver.init({
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        citizenshipNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        licenseNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        driverStatus: {
            type: DataTypes.ENUM,
            values: ['available', 'assigned', 'unavailable'],
            allowNull: false,
            defaultValue: 'available',
            validate: {
                isIn: [['available', 'assigned', 'unavailable']]
            }
        },
        driverImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'drivers',
        modelName: 'Driver',
    });
    return Driver;
};