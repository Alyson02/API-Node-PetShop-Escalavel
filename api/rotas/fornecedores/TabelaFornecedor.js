const NaoEncontrado = require('../../erros/NaoEncontrado');
const Modelo = require('./ModeloTabelaFornecedor')

//Arquivo com um objetos com metodos em portugues para executar o sequelise
module.exports = {
    listar (){
        return Modelo.findAll({raw: true});
    },
    inserir(fornecedor){
        return Modelo.create(fornecedor);
    },
    async getById(id){// tornando o metodo async para esperar o resutado da operação de findOne,
                      // assim possibilitando a tratativa de erro
        var encontrado = await Modelo.findOne({// pegando no banco de dados um fornecedor por id
            where: {
                id: id
            }
        });

        if(!encontrado){
            throw new NaoEncontrado("Fornecedor");//tratando um erro caso o fornecedor nao tenha sido encontrado
        }

        return encontrado;
    },
    update(id, fornecedor){
        return Modelo.update(fornecedor, {where: {id: id}})
    },
    delete(id){
        return Modelo.destroy({where:{id: id}})
    }
}