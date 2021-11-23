'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class ResetToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResetToken.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tokenExpires: {
      type: DataTypes.DATE,
      defaultValue: Date.now() + 3600
    }
  }, {
    sequelize,
    tableName: 'resetTokens',
    modelName: 'ResetToken',
  });
  return ResetToken;
};