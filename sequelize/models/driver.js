'use strict';
const {Model, DataTypes} = require('sequelize');
module.exports = (sequelize) => {
  class Driver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Bus}) {
      // define association here
      this.hasOne(Bus, {foreignKey: "driverId"});
    }
  }

  Driver.init({
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
    driverImage: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    sequelize,
    tableName: 'drivers',
    modelName: 'Driver',
  });
  return Driver;
};