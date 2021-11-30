'use strict';
const {DataTypes} = require("sequelize");
module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('passengers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
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
        await queryInterface.dropTable('passengers');
    }
};