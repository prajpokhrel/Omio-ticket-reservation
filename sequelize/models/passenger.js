'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class Passenger extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User, Destination, Reservation }) {
            // define association here
            this.belongsTo(User, { foreignKey: 'mainAccountId', as: "mainUserDetails"});
            this.belongsTo(Destination, {foreignKey: 'forDestination', as: "destinationDetails"});
            this.belongsTo(Reservation, {foreignKey: 'reservationId', as: "reservationDetails"});
        }
    }
    Passenger.init({
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                checkMainPassenger(value) {
                    if (value === null && this.isMainPassenger === true) {
                        throw new Error("Main passenger should have email address.")
                    }
                }
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isMainPassenger: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        // passenger for a certain destination, foreign key
        // this destination will contains details of bus, routes, fares, and everything
        forDestination: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reservationId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // foreign key, user
        mainAccountId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'passengers',
        modelName: 'Passenger',
    });
    return Passenger;
};