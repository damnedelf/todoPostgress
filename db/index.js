const  Sequelize  = require('sequelize');
module.exports = new Sequelize('todos', 'damnedelf', 'killmenot', {
  host: 'localhost',
  dialect: `postgres`
});