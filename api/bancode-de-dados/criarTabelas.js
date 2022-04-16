const modelos = [
    require('../rotas/fornecedores/ModeloTabelaFornecedor'),
    require('../rotas/fornecedores/produtos/ModeloTabelaProduto')
];

async function criarTabelas(){
    for(let i = 0; i < modelos.length; i++){
        const modelo = modelos[i];
        console.log(`Posição: ${i} - ${modelo}`);
        await modelo.sync();
    }
}

criarTabelas();