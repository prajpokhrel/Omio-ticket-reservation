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
            midPlaceBetweenRoutes: {
                type: DataTypes.STRING,
                allowNull: true
            },
            routeFare: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            // serviceTax: {
            //     type: DataTypes.VIRTUAL,
            //     get() {
            //         // 14% service charge of each journey is applicable
            //         return Math.round(((0.14 * this.routeFare) * 100) / 100);
            //     },
            //     set(value) {
            //         throw new Error('Service charge is self calculated. Please do not set it.');
            //     }
            // },
            departureDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            departureTime: {
                type: DataTypes.TIME,
                // type: DataTypes.STRING, // if TIME data type does not exits
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
                // this is a foreign key, will be assigned above
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