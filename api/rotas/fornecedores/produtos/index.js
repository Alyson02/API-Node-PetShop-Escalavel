const ProdutoDao = require('./ProdutoDao');
const router = require('express').Router({ mergeParams: true });
const Produto = require('./Produto');
const Serializador = require('../../../Serializador').SerializadorProduto;

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.get('/', async (req, res, next) => {
    try {
        const produtos = await ProdutoDao.listar(req.fornecedor.id)
        const serializador = new Serializador(res.getHeader('Content-Type'));

        res.set('X-Powered-By', 'Alyson');

        res.send(serializador.Serializar(produtos));
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const idFornecedor = req.fornecedor.id;
        const corpo = req.body;
        const dados = Object.assign({}, corpo, {fornecedor: idFornecedor});

        const produto = new Produto(dados)
        await produto.Criar();
        const serializador = new Serializador(res.getHeader('Content-Type'));

        res.set('ETag', produto.versao)//Definindo a versao do documento
        const timestamps = (new Date(produto.dataAtualizacao)).getTime(); //convertendo a data para timestamp
        res.set('Last-Modified', timestamps);
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`); //Definindo a url de acesso do objeto criado
        res.set('X-Powered-By', 'Alyson');

        res.status(201).send(serializador.Serializar(produto));      
    } catch (error) {
        next(error);
    }
});

router.options('/:idProduto', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.get('/:idProduto', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produto(dados);
        await produto.carregar();

        const serializador = new Serializador(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'dataCricacao', 'dataAtualizacao', 'versao']);

        res.set('ETag', produto.versao)//Definindo a versao do documento
        const timestamps = (new Date(produto.dataAtualizacao)).getTime(); //convertendo a data para timestamp
        res.set('Last-Modified', timestamps);
        res.set('X-Powered-By', 'Alyson');

        res.send(serializador.Serializar(produto));
    } catch (error) {
        next(error)
    }
})

//rota para pegar apenas o cabeçalho da requisição
router.head('/:idProduto', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }

        const produto = new Produto(dados);
        await produto.carregar();

        res.set('ETag', produto.versao)//Definindo a versao do documento
        const timestamps = (new Date(produto.dataAtualizacao)).getTime(); //convertendo a data para timestamp
        res.set('Last-Modified', timestamps);
        res.set('X-Powered-By', 'Alyson');

        res.end();
    } catch (error) {
        next(error)
    }
})

router.put('/:idProduto', async (req, res, next) => {
    try {
        const dados = Object.assign({}, req.body, {id: req.params.idProduto, fornecedor: req.fornecedor.id});

        const produto = new Produto(dados);
        await produto.Atualizar();
        await produto.carregar();

        res.set('ETag', produto.versao)//Definindo a versao do documento
        const timestamps = (new Date(produto.dataAtualizacao)).getTime(); //convertendo a data para timestamp
        res.set('Last-Modified', timestamps);
        res.set('X-Powered-By', 'Alyson');

        res.status(204).end();
    } catch (error) {
        next(error)
    }
});

router.delete('/:idProduto', async (req, res, next) => {
    try {
        const dados = {
            id: req.fornecedor.id,
            fornecedor: req.params.idFornecedor
        }

        const produto = new Produto(dados);
        await produto.carregar();
        await produto.excluir();

        res.set('X-Powered-By', 'Alyson');

        res.status(204).end();    
    } catch (error) {
        next(error)
    }

});

router.options('/:idProduto/diminuir-estoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.post('/:idProduto/diminuir-estoque', async (req, res, next) => {
    try {
        const produto = new Produto({
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id,
        });
    
        await produto.carregar();
        produto.estoque -= req.body.quantidade;
        await produto.diminuirEstoque();
        await produto.carregar();

        res.set('ETag', produto.versao)//Definindo a versao do documento
        const timestamps = (new Date(produto.dataAtualizacao)).getTime(); //convertendo a data para timestamp
        res.set('Last-Modified', timestamps);
        res.set('X-Powered-By', 'Alyson');

        res.status(204).end();   
    } catch (error) {
        next(error);
    }
});

module.exports = router;