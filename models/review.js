'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Beer);
    }
  };
  Review.init({
    beerId: DataTypes.INTEGER,
    judgeName: DataTypes.STRING,
    branding: DataTypes.INTEGER,
    aroma: DataTypes.INTEGER,
    appearance: DataTypes.INTEGER,
    flavor: DataTypes.INTEGER,
    mouthfeel: DataTypes.INTEGER,
    overall: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
