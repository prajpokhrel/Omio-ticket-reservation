'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Destination extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Bus, Passenger, Reservation, RouteSpecificSeat, Admin}) {
            // define association here
            this.belongsTo(Bus, {foreignKey: "assignedBusId", as: "buses"});
            this.hasMany(Passenger, {foreignKey: "forDestination", as: "passengers"});
            this.hasMany(Reservation, {foreignKey: "forDestination", as: "reservations"});
            this.hasMany(RouteSpecificSeat, {foreignKey: "seatOfDestination", as: "routeSeats"});
            this.belongsTo(Admin, {foreignKey: "adminId"});
        }
    }
    Destination.init({
        fromSource: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        toDestination: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        routeFare: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true
            }
        },
        serviceTax: {
            type: DataTypes.VIRTUAL,
            get() {
                // 14% service charge of each journey is applicable
                return (((0.14 * this.routeFare) * 100) / 100).toFixed(2);
                // return Math.round(((0.14 * this.routeFare) * 100) / 100);
            },
            set(value) {
                throw new Error('Service charge is self calculated. Please do not set it.');
            }
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
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'destinations',
        modelName: 'Destination',
    });
    return Destination;
};