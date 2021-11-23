'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Reservation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User, Destination}) {
            // define association here
            this.belongsTo(User, {foreignKey: 'mainAccountId', as: "mainUserDetails"});
            this.belongsTo(Destination, {foreignKey: 'forDestination', as: "destinationDetails"});
        }
    }
    Reservation.init({
        //fromSource, toDestination, date, time, onBus will come from destination table
        totalTravelAmount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // enum: paid, not paid, cancelled/refunded
        paymentStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        bookingTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        // enum: booked, cancelled
        // validate, it can only be cancelled 3 4 hours before departure
        reservationStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        }
    }, {
        sequelize,
        tableName: 'reservations',
        modelName: 'Reservation',
    });
    return Reservation;
};