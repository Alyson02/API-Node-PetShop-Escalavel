class ValorNaoSuportado extends Error{
    constructor(contentType){   //Erro para tipos de conteudo realizados pela requisição
        super(`O tipo de conteudo ${contentType} não é suportado`);
        this.name = 'ValorNaoSuportado';
        this.idErro = 3
    }
}

module.exports = ValorNaoSuportado;