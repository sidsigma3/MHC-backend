const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Survey = sequelize.define(
  'Survey',
  {
    surveyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    hq: { type: DataTypes.STRING, allowNull: false },
    // date: { type: DataTypes.DATE, allowNull: false },
    placeOfWork: { type: DataTypes.STRING, allowNull: true },
    doctorsInfo: { type: DataTypes.JSON, allowNull: true }, // Array of doctor objects
    chemistsInfo: { type: DataTypes.JSON, allowNull: true }, // Array of chemist objects
    monthlyPrimarySale: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    secondarySales: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    closingStockValue: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    totalPOB: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    productInfo: { type: DataTypes.TEXT, allowNull: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = Survey;
