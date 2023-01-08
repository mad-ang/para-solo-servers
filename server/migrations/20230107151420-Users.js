'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: Sequelize.STRING(35),
      userId: DataTypes.STRING(35),
      profileImgUrl: DataTypes.STRING(100),
      refreshToken: Sequelize.STRING(35),
      password: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('Users')
  },
}
