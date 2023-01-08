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
      userId: DataTypes.STRING(35),
      profileImgUrl: DataTypes.STRING(100),
      refreshToken: DataTypes.STRING(35),
      password: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  )
  return User
}
