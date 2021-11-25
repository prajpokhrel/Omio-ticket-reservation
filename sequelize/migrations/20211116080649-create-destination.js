'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('destinations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            fromSource: {
                type: DataTypes.STRING,
                allowNull: false
            },
            toDestination: {
                type: DataTypes.STRING,
                allowNull: false
            },
            routeFare: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            departureDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            departureTime: {
                type: DataTypes.TIME,
                allowNull: false
            },
            arrivalDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            estimatedArrivalTime: {
                type: DataTypes.TIME,
                allowNull: false
            },
            assignedBusId: {
                type: DataTypes.INTEGER,
                allowNull: false
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
        await queryInterface.dropTable('destinations');
    }
};