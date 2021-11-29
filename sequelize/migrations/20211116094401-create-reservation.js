'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('reservations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            //fromSource, toDestination, date, time, onBus will come from destination table
            totalTravelAmount: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            // enum: paid, not paid, cancelled/refunded
            paymentStatus: {
                type: DataTypes.ENUM,
                values: ['paid', 'refunded'],
                allowNull: false,
                defaultValue: 'paid'
            },
            bookingTime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            // enum: booked, cancelled
            // validate, it can only be cancelled 3 4 hours before departure
            // set seats to isBooked false if status is cancelled
            reservationStatus: {
                type: DataTypes.ENUM,
                values: ['active', 'cancelled'],
                allowNull: false,
                defaultValue: 'active'
            },
            totalPassenger: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // foreign key of currently logged in user
            mainAccountId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // foreign key of reserved journey destination details
            forDestination: {
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
        await queryInterface.dropTable('reservations');
    }
};