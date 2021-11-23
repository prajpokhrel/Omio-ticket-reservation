'use strict';
const {DataTypes} = require("sequelize");
module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('buses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
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
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable('buses');
    }
};