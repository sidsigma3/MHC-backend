const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: true },
      whatsapp: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
      birthday: { type: DataTypes.DATE, allowNull: true },
      nationality: { type: DataTypes.STRING, allowNull: true },
      jobProfile:{type:DataTypes.STRING , allowNull:true},
      profilePicture: {
        type: DataTypes.BLOB('long'), 
        allowNull: true,
    },
}, { timestamps: true });

module.exports = User;
