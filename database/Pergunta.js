const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define('pergunta', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// force: false garante que a tabela não seja recriada caso exista
Pergunta.sync({force: false}).then(() => {
    console.log("Tabela criada.");
});

module.exports = Pergunta;