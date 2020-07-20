const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
    .authenticate()
    .then(() => {
        console.log("conexão realizada.");
    })
    .catch((msgErro) => {
        console.log("Erro de conexão " + msgErro);
    })

app.set('view engine', 'ejs');

//Carrega a pasta onde ficam os arquivos estáticos (css,js de frontend, imagens e etc)
//Por padrão essa pasta tem o nome de public (podendo ser qualquer nome)
app.use(express.static('public'));

//Decodifica os dados enviados do formulário para uma estrutura Javascript
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (request, response) => {
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC']
    ]}).then(perguntas => {
        response.render("index", {
            perguntas: perguntas
        });  
    });      
});

app.get("/perguntar", (request, response) => {
    response.render("perguntar");
});

app.get("/pergunta/:id", (request, response) => {
    var id = request.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined) {

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [ ['id', 'DESC'] ]
            }).then(respostas => {
                response.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas                 
                }); 
            });                       
        } else {
            response.redirect("/");
        }
    });
});

app.post("/salvarpergunta", (request, response) => {
    var titulo = request.body.titulo;
    var descricao = request.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        response.redirect("/");
    });    
});

app.post("/responder", (request, response) => {
    var corpo = request.body.corpo;
    var perguntaId = request.body.perguntaId;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        response.redirect("/pergunta/" + perguntaId);
    });    
});

app.listen("3000");