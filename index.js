const express = require("express"); /* importando o module express*/
const app = express(); /*criando uma copia da variavel express para a variavel app   */
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/pergunta");
const resposta = require("./database/resposta");
//database 
connection
.authenticate()
.then(() => {
    console.log("successfully connected!!!")

})
.catch((msgErro) => {
    console.log(msgErro);

})





/*estou dizendo ao express para usar o ejs como view engine*/
app.set('view engine', 'ejs'); 

/*diz ao express onde esta os arquivos estaticos para usar */
app.use(express.static('public'));
/* body-parser */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



/* Criando uma rota */
app.get("/",(req,res) => {

    Pergunta.findAll({raw:true, order:[

        ['id', 'DESC'] //ASC = crescente e DESC = decrescente

    ]}) .then(pergunta => {
        res.render("index", {
          pergunta:pergunta

        });

    });
    
    /* a resposta estara na pasta views pois usou o render. */


});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");


});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao

    } ).then(() => {
        res.redirect("/");

    });


});

app.get("/pergunta/:id", (req,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where:{id: id}

    }).then(pergunta =>{
        if(pergunta != undefined){

            resposta.findAll({raw:true, order:[

                ['id', 'DESC'] //ASC = crescente e DESC = decrescente
        
            ]},
            {
                where: {perguntaId: pergunta.id}

            }).then(respostas => {

                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
            });


           

            });
        }else{
            res.redirect("/");
        }

    })

});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    resposta.create({
        corpo: corpo,
        perguntaId: perguntaId

    } ).then(() => {
        res.redirect("/pergunta/"+perguntaId);

    });

});

/* colocando o servidor p rodar  */
app.listen(8080,()=>{console.log("App rodando");});

/*comando para iniciar o servidor e restartar sempre que alterar algo  */
/* nodemon + nome da pagina */