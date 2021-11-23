'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Bus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Driver, Seat, Destination}) {
            // define association here
            this.belongsTo(Driver, {foreignKey: "driverId", as: "driverDetails"});
            // this.hasOne(Destination, {foreignKey: "assignedBusId"});
            this.hasMany(Destination, {foreignKey: "assignedBusId", as: "destinations"});
            this.hasMany(Seat, {foreignKey: "seatOfBus", as: "seats"});
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
        seatCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // validate to avoid bus having more than 2 routes, when creating destinations
        assignedRoutesCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        // this will be enum
        busStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        // foreign key
        driverId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'buses',
        modelName: 'Bus',
    });
    return Bus;
};