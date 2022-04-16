const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const NaoEncontrado = require('./erros/NaoEncontrado');
const CampoInvalido = require('./erros/CampoInvalido');
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos');
const ValorNaoSuportado = require('./erros/ValorNaoSuportado');
const { SerializadorErro } = require('./Serializador');
const formatosAceitos = require('./Serializador').formatosAceitos; //Pegando o array com formatos aceitos da classe Serializador

const app = express();
const porta = config.get('api.porta');

app.use(bodyParser.json());

app.use((req, res, next) => {
    let formatoRequisitado = req.header('Accept');
    console.log(formatoRequisitado);

    //Como a requisição como padrao coloca um valor no formato "*/*" vamos definir que quando houver isso, retornaremos em json
    if(formatoRequisitado == '*/*')
        formatoRequisitado = 'application/json';

    if(formatosAceitos.indexOf(formatoRequisitado) == -1){
        res.status(406);
        res.end();
        return
    }

    res.setHeader('Content-Type', formatoRequisitado);
    next();

});

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Security-Policy', "script-src 'self'");
    next();
});

const router = require('./rotas/fornecedores');
app.use("/api/fornecedores", router);

const routerV2 = require('./rotas/fornecedores/rotas.v2');
app.use("/api/v2/fornecedores", routerV2);

app.use((erro, req, res, next) => {
    let status = 500;

    if(erro instanceof NaoEncontrado)
        status = 404;
    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos)
        status = 400;
    if(erro instanceof ValorNaoSuportado)
        status = 406;

    console.log(`O id do erro é ${erro.idErro} e seu código: ${status}`)

    const serializador = new SerializadorErro(res.getHeader('Content-Type'))
    res.status(status).send(
        serializador.Serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.listen(porta, () => console.log(`Servidor ovindo na porta ${porta}`));