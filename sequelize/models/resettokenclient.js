'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class ResetTokenClient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ResetTokenClient.init({
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
        }
    }, {
        sequelize,
        tableName: 'resetTokenClients',
        modelName: 'ResetTokenClient',
    });
    return ResetTokenClient;
};