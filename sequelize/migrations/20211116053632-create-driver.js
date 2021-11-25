'use strict';
module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('drivers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            contactNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            citizenshipNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            licenseNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            driverStatus: {
                type: DataTypes.ENUM,
                values: ['available', 'assigned', 'unavailable'],
                allowNull: false,
                defaultValue: 'available'
            },
            driverImage: {
                type: DataTypes.STRING,
                allowNull: true
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
        await queryInterface.dropTable('drivers');
    }
};