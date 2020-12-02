'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Beer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Beer.hasMany(models.Review);
    }
  };
  Beer.init({
    name: DataTypes.STRING,
    company: DataTypes.STRING,
    abv: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Beer',
  });
  return Beer;
};
