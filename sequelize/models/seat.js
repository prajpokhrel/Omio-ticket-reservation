'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Seat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Bus}) {
            // define association here
            this.belongsTo(Bus, {foreignKey: "seatOfBus"});
        }
    }
    Seat.init({
        seatSpecificPrice: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.isSociallyDistancedSeat ? this.sociallyDistancedSeatFare : this.isReservedSeat ? this.reservedSeatFare : 0;
            },
            set(value) {
                throw new Error('Seat specific price is auto calculated based on seat type.');
            }
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
        }
    }, {
        sequelize,
        tableName: 'seats',
        modelName: 'Seat',
    });
    return Seat;
};