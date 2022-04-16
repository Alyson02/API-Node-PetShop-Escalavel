const ValorNaoSuportado = require("./erros/ValorNaoSuportado");
const jsontoxml = require('jsontoxml');

class Serializador{
    Json(dados){
        return JSON.stringify(dados);
    }
    Xml(dados){
        let tag = this.tagSingular;

        if(Array.isArray(dados)){
            tag = this.tagPlural;
            dados = dados.map(item => {
                return {
                    [this.tagSingular]: item
                }
            })
        }

        return jsontoxml({[tag]: dados})
    }

    Serializar(dados){
        dados = this.filtrar(dados);
        if(this.contentType == 'application/json'){
            console.log(dados);
            return this.Json(dados);
        }

        if(this.contentType == 'application/xml'){
            console.log(dados);
            return this.Xml(dados);
        }

        throw new ValorNaoSuportado(this.contentType);
    }

    filtrarObjeto(dados){
        const novoObjeto = {};
         
        this.camposPublicos.forEach((campo) => {
            if(dados.hasOwnProperty(campo))
                novoObjeto[campo] = dados[campo]
        })

        return novoObjeto;
    }

    filtrar(dados){
        if(Array.isArray(dados)){
            dados = dados.map(item => {
                return this.filtrarObjeto(item)
            })
        }
        else
            dados = this.filtrarObjeto(dados)

        return dados
    }
}

class SerializadorFornecedor extends Serializador{ //Usando o pattern template method para especificar compotamento herdando de outro objeto
    constructor(contentType, camposExtras){
        super();
        this.contentType = contentType;
        this.camposPublicos = ['id', 'categoria'].concat(camposExtras || []);
        this.tagSingular = 'fornecedor';
        this.tagPlural = 'fornecedores';
    }
}

class SerializadorProduto extends Serializador{
    constructor(contentType, camposExtras){
        super();
        this.contentType = contentType;
        this.camposPublicos = ['id', 'titulo'].concat(camposExtras || []);
        this.tagSingular = 'produto';
        this.tagPlural = 'produtos';
    }
}

class SerializadorErro extends Serializador{
    constructor(contentType, camposExtras){
        super();
        this.contentType = contentType;
        this.camposPublicos = [
            'id',
            'mensagem'
        ].concat(camposExtras || []);
        this.tagSingular = 'erro';
        this.tagPlural = 'erros';
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorProduto: SerializadorProduto,
    SerializadorErro: SerializadorErro,
    formatosAceitos: ['application/json', 'application/xml']
}