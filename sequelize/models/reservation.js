'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Reservation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User, Destination, Passenger, Admin}) {
            // define association here
            this.hasMany(Passenger, {foreignKey: "reservationId", as: "passengers"});
            this.belongsTo(User, {foreignKey: 'mainAccountId', as: "mainUserDetails"});
            this.belongsTo(Destination, {foreignKey: 'forDestination', as: "destinationDetails"});
            this.belongsTo(Admin, {foreignKey: 'adminId'});
        }
    }
    Reservation.init({
        //fromSource, toDestination, date, time, onBus will come from destination table
        // this will be decimal
        bookingCode: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV1
        },
        seatsNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        totalTravelAmount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        // enum: paid, not paid, cancelled/refunded
        paymentStatus: {
            type: DataTypes.ENUM,
            values: ['paid', 'refunded'],
            allowNull: false,
            defaultValue: 'paid',
            validate: {
                isIn: [['paid', 'refunded']]
            }
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
            defaultValue: 'active',
            validate: {
                isIn: [['active', 'cancelled']]
            }
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
        adminId: {
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