const sequelize = require('../Config/db');
const Survey = require('./Survey');
const User = require('./User');


User.hasMany(Survey, { foreignKey: 'userId', as: 'surveys' });
Survey.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Survey
};
