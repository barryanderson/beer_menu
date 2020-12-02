'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      beerId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      judgeName: {
        type: Sequelize.STRING
      },
      branding: {
        type: Sequelize.INTEGER
      },
      aroma: {
        type: Sequelize.INTEGER
      },
      appearance: {
        type: Sequelize.INTEGER
      },
      flavor: {
        type: Sequelize.INTEGER
      },
      mouthfeel: {
        type: Sequelize.INTEGER
      },
      overall: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reviews');
  }
};
