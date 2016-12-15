let moment = require('moment');

class MotoristaController{
    constructor(app){
        this._MysqlConnectionFactory = app.database.mysqlConnectionFactory;
        this._MotoristaRepository = app.repositorio.motoristaRepository;
        this._validadorDeData = app.util.validadorDeData;
        this._cliente = 209;
    }

    obter(req,res,next){
        
        let cpf = req.query.cpf;
        let dataAtualizacao = req.query.dataAtualizacao;

        if(dataAtualizacao && !this._dataValida(dataAtualizacao)){
            res.sendStatus(204);
            return;
        }

        let connection = new this._MysqlConnectionFactory();
        let motoristaRepository = new this._MotoristaRepository(connection);

        motoristaRepository
                .filtrarMotoristas(this._cliente,cpf,dataAtualizacao)
                    .then(data => {
                        if(!data){
                            res.sendStatus(204);
                            return;
                        }
                        
                        let dataBusca = moment().format('DD-MM-YYYY');
                        let motoristas = JSON.parse(JSON.stringify(data));
                        let arrayMotorista = [];
                        let objMotorista = {};

                        motoristas.forEach(mot => {
                            arrayMotorista.push(mot);
                        });

                        objMotorista = {
                            data: dataBusca,
                            motoristas: arrayMotorista
                        }

                        res.json(objMotorista);
                    })
                    .catch(erro => next(erro));
    }

    _dataValida(dataAtualizacao){
        return this._validadorDeData.validar(dataAtualizacao);
    }
}

module.exports = app => new MotoristaController(app); 
