class NaoEncontrado extends Error{
    constructor(campo){
        super(`${campo} não encotrado`);
        this.name = 'NaoEncontrado';
        this.idErro = 0
    }
}

module.exports = NaoEncontrado;