const CampoInvalido = require('../../../erros/CampoInvalido');
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos');
const produtoDao = require('./ProdutoDao');

class Produto{
    constructor({id,
                titulo, 
                preco, 
                estoque, 
                fornecedor, 
                dataCricacao, 
                dataAtualizacao, 
                versao}){
        this.id = id;
        this.titulo = titulo;
        this.preco = preco;
        this.estoque = estoque;
        this.fornecedor = fornecedor;
        this.dataCricacao = dataCricacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }

    validar(){
        if(typeof this.titulo != 'string' || this.titulo.length == 0)
            throw new CampoInvalido('título');
        if(typeof this.preco != 'number' || this.preco <= 0)
            throw new CampoInvalido('preço');
    }

    async Criar(){
        this.validar();
        const resultado = await produtoDao.insert({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })

        this.id = resultado.id;
        this.dataCricacao = resultado.dataCricacao;
        this.dataAtualizacao = resultado.dataAtualizacao;
        this.versao = resultado.versao;
    }

    async Atualizar(){
        await produtoDao.getById(this.id, this.fornecedor)
        const campos = ['titulo', 'preco', 'estoque'];
        const dadosParaAtualizar = {};

        campos.forEach(campo => { //percorrendo o array de campos e para cada campo encontrando o valor e validando
            const valor = this[campo];
            console.log('valor do campo é ' + valor);
            console.log(this[campo]);
            if((typeof valor === 'string' && valor.length > 0) || (typeof valor === 'number' && valor > 0) || (typeof valor == 'number'))
                dadosParaAtualizar[campo] = valor;
        })

        if(Object.keys(dadosParaAtualizar).length == 0){
            throw new DadosNaoFornecidos();
        }

        await produtoDao.update(dadosParaAtualizar, {
            id: this.id,
            fornecedor: this.fornecedor
        });
    }

    excluir(){
        return produtoDao.delete(this.id, this.fornecedor)
    }

    async carregar(){
        const produto = await produtoDao.getById(this.id, this.fornecedor); 
        console.log(produto);
        this.titulo = produto.titulo;
        this.preco = produto.preco;
        this.estoque = produto.estoque;
        console.log("Qualtidade atual " + this.estoque)
        this.dataCricacao = produto.dataCricacao;
        this.dataAtualizacao = produto.dataAtualizacao;
        this.versao = produto.versao;
    }

    diminuirEstoque(){
        console.log("Quantidade após diminuição " + this.estoque)
        return produtoDao.diminuir(this.id, this.fornecedor, 'estoque', this.estoque);
    }
}

module.exports = Produto;