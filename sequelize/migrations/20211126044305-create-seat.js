'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('seats', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            row: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            col: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            isSeat: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            sociallyDistancedSeatFare: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: 5
            },
            reservedSeatFare: {
                type: DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: 2
            },
            isSociallyDistancedSeat: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isBlockedSeat: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isReservedSeat: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isGeneralSeat: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isBookedSeat: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            seatOfBus: {
                // seat of a bus as a foreign key
                type: DataTypes.INTEGER,
                allowNull: false,
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
        await queryInterface.dropTable('seats');
    }
};