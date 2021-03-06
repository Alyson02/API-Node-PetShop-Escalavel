const router = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const { SerializadorFornecedor } = require('../../Serializador');

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'));
    res.send(serializador.Serializar(resultados));
});

module.exports = router;