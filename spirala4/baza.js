const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt2018', 'root', 'root', {host: 'localhost',dialect: 'mysql'});
module.exports = sequelize;