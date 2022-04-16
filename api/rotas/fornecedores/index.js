const router = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const { SerializadorFornecedor } = require('../../Serializador');

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['empresa']);
    res.send(serializador.Serializar(resultados));
});

router.post('/', async (req, res, next) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.Criar();
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'), ['empresa']);
        res.status(201).send(serializador.Serializar(fornecedor));
    } catch (error) {
        next(error)
    }
});

router.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.get('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor; //pegando o id
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.Carregar();
        const serializador = new SerializadorFornecedor(
                res.getHeader('Content-Type'),
                ['email', 'dataCriacao', 'dataAtualizacao', 'versao', 'empresa']
            );
        res.send(serializador.Serializar(fornecedor));
    } catch (error) {
        next(error);
    }
});

router.put('/:idFornecedor', async (req, res, next) => {

    try {
        const id = req.params.idFornecedor;
        const dadosRecebidos = req.body;
        const dados = Object.assign({}, dadosRecebidos, {id: id});//juntando os objetos id com a req do body
        console.log(dados);
        const fornecedor = new Fornecedor(dados);
        await fornecedor.Update();
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'));
        res.status(204).send(serializador.Serializar(fornecedor));
    } catch (error) {
        next(error)
    }
})

router.delete('/:idFornecedor', async (req, res, next) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.Carregar();
        await fornecedor.Delete();
        res.status(204);
        res.end();
    } catch (error) {
        next(error);
    }
})

const routerProdutos = require('./produtos');

const verificarFornecedor = async (req, res, next) => {
    try {
        const idFornecedor = req.params.idFornecedor;
        const fornecedor = new Fornecedor({id: idFornecedor});
    
        await fornecedor.Carregar();
    
        req.fornecedor = fornecedor;
        next();
    } catch (error) {
        next(error);
    }
}

router.use('/:idFornecedor/produtos', verificarFornecedor, routerProdutos);

module.exports = router;