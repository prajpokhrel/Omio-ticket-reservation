'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Passenger, Reservation}) {
      // define association here
      this.hasMany(Passenger, { foreignKey: 'mainAccountId', as: 'passengers' });
      this.hasMany(Reservation, { foreignKey: 'mainAccountId', as: 'reservations' });
    }
  }

  User.init({
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
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};