const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: DataTypes.STRING(35),
      email: DataTypes.STRING(35),
      password: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  )
  return User
}
