const tabela = require('./TabelaFornecedor');
const CampoInvalido = require('../../erros/CampoInvalido');
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos');


class Fornecedor{
    constructor({id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao}){// criando um construtor com um objeto que representa cada propriedade
        this.id = id;
        this.empresa = empresa;
        this.email = email;
        this.categoria = categoria;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }

    async Criar(){
        this.Validar();
        const resultado = await tabela.inserir({
            empresa: this.empresa,
            email: this.email,         // não coloca todas as informações pois o id, data e versao são gerados após a inserção mno bd
            categoria: this.categoria
        })

        this.id = resultado.id;
        this.dataCriacao = resultado.dataCriacao;
        this.dataAtualizacao = resultado.dataAtualizacao;
        this.versao = resultado.versao;
    }

    async Carregar(){
        const encontrado = await tabela.getById(this.id);
        console.log(encontrado)
        this.empresa = encontrado.empresa;
        this.email = encontrado.email;
        this.categoria = encontrado.categoria;
        this.dataCriacao = encontrado.dataCricacao;
        this.dataAtualizacao = encontrado.updatedAt;
        this.versao = encontrado.versao;
    }

    async Update(){
        await tabela.getById(this.id);
        const campos = ['empresa', 'email', 'categoria'];
        const dadosParaAtualizar = {};

        campos.forEach(campo => { //percorrendo o array de campos e para da campo encontrando o valor e validando
            const valor = this[campo];
            console.log(this[campo]);
            if(typeof valor === 'string' && valor.length > 0)
                dadosParaAtualizar[campo] = valor;
        })

        if(Object.keys(dadosParaAtualizar).length == 0){
            throw new DadosNaoFornecidos();
        }

        await tabela.update(this.id, dadosParaAtualizar);
    }

    Validar(){
        const campos = ['empresa', 'email', 'categoria'];

        campos.forEach(campo => {
            const valor = this[campo]; 

            console.log(valor)

            if(typeof valor !== 'string' || valor.length == 0)
                throw new CampoInvalido(campo);
        });
    }

    async Delete(){
        console.log(this.id);
        await tabela.delete(this.id);
    }


}
module.exports = Fornecedor