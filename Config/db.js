const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  socketPath: process.env.CC_MYSQL_PROXYSQL_SOCKET_PATH || null,
  pool: {
    max: process.env.CC_MYSQL_PROXYSQL_MAX_CONNECTIONS || 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  ssl: process.env.CC_MYSQL_PROXYSQL_USE_TLS === 'true',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
