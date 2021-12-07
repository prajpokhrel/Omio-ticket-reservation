'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Bus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Driver, Seat, Destination, Admin}) {
            // define association here
            this.belongsTo(Driver, {foreignKey: "driverId", as: "driverDetails"});
            // this.hasOne(Destination, {foreignKey: "assignedBusId"});
            this.hasMany(Destination, {foreignKey: "assignedBusId", as: "destinations"});
            this.hasMany(Seat, {foreignKey: "seatOfBus", as: "seats"});
            this.belongsTo(Admin, {foreignKey: "adminId"});
        }
    }
    Bus.init({
        busServiceName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        busNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        busServiceLogo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        assignedSeats: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        assignedRoutesCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        busStatus: {
            type: DataTypes.ENUM,
            values: ['available', 'en route' ,'unavailable'],
            allowNull: false,
            defaultValue: 'available',
            validate: {
                isIn: [['available', 'en route', 'unavailable']]
            }
        },
        driverId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'buses',
        modelName: 'Bus',
    });
    return Bus;
};