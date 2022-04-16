const NaoEncontrado = require('../../../erros/NaoEncontrado');
const Modelo = require('./ModeloTabelaProduto');
const instanciaBd = require('../../../bancode-de-dados')

module.exports = {
    listar(idFornecedor){
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw: true
        });
    },
    insert(fornecedor){
        return Modelo.create(fornecedor);
    },
    delete(id, idFornecedor){
        return Modelo.destroy({
            where:{
                id: id,
                fornecedor: idFornecedor
            }
        })
    },
    async getById(idProduto, idFornecedor){
        const produto =  await Modelo.findOne({
            where:{
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true
        })

        if(!produto)
            throw new NaoEncontrado("Produto");

        return produto;
    },
    async update(produto, condicoes){
        return Modelo.update(produto, {
            where: condicoes
        })
    },
    async diminuir(idProduto, idFornecedor, campo, quantidade){
        //usando transações do sql para evitar problemas com multiplas requisições
        return instanciaBd.transaction(async transacao => {
            const produto = await Modelo.findOne({
                where:{
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })

            produto[campo] = quantidade;

            await produto.save();

            return produto;
        })
    }
}