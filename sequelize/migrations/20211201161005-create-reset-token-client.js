'use strict';
module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('resetTokenClients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            clientId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tokenExpires: {
                type: DataTypes.DATE,
                defaultValue: new Date(Date.now() + 3600000)
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
        await queryInterface.dropTable('resetTokenClients');
    }
};