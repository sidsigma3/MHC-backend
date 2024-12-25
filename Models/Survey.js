const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const Survey = sequelize.define('Survey', {
  surveyId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  hq: { type: DataTypes.STRING, allowNull: false },
  numDaysFieldWorks: { type: DataTypes.INTEGER, allowNull: false },
  numDoctorsList: { type: DataTypes.INTEGER, allowNull: false },
  numDoctorsVisited: { type: DataTypes.INTEGER, allowNull: false },
  numDoctorsCall: { type: DataTypes.INTEGER, allowNull: false },
  doctorsCallAvg: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  numDoctorsMissed: { type: DataTypes.INTEGER, allowNull: false },
  numChemistsVisited: { type: DataTypes.INTEGER, allowNull: false },
  chemistCallAvg: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  monthlyPrimarySale: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  secondarySales: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  nextMonthSalesPlan: { type: DataTypes.TEXT, allowNull: false },
  closingStockValue: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  totalPOB: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  paymentCollection: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  nextMonthCollectionPlan: { type: DataTypes.TEXT, allowNull: false },
  paymentReceivedFromHQ: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  paymentReceivedFromManager: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Name of the table in the database
      key: 'userId',      // Primary key of the Users table
    }}
}, {
  timestamps: true, // automatically manages createdAt and updatedAt fields
});

module.exports = Survey;
