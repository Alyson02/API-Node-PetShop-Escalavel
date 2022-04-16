const Sequelize = require('sequelize');
const instanciaBd = require('../../../bancode-de-dados');

const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fornecedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: require('../ModeloTabelaFornecedor'),
            key: 'id'
        }
    }
}

const opcoes = {
    freezeTableName: true,
    tablename: 'produtos',
    timestamps: true,
    createdAt: 'dataCricacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instanciaBd.define('produto', colunas, opcoes);