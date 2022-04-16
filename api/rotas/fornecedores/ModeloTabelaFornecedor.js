const Sequelize = require('sequelize');
const instanciaBd = require('../../bancode-de-dados');

const colunas = {
    empresa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('ração', 'brinquedos'),
        allowNull: false
    }
};

const opcoes = {
    freezeTableName: true,
    tablename: 'fornecedores',
    timestamps: true,
    createdAt: 'dataCricacao',
    updateAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instanciaBd.define('fornecedor', colunas, opcoes)  //Exportando para usar em outros lugares