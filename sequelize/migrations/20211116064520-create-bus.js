'use strict';
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
                defaultValue: 'available'
            },
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