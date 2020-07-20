const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "root", "root201125", {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;