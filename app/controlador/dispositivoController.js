module.exports = () =>
    class DispositivoController{
        constructor(dispositivoService,dispositivoRepository,ssoService){
            this._dispositivoService = dispositivoService;
            this._ssoService = ssoService;
            this._dispositivoRepository = dispositivoRepository;
        }

        cadastrarPelaApi(req,res,next){

            let erros = this._validarDispositivoApi(req);

            if(erros){
                res.status(422)
                    .json(erros);
                return;
            }

            this._ssoService.autenticar(req.body.credenciais)
                    .then(authResult => this._ssoService.decodificarToken(authResult.IdentificacaoLogin))
                    .then(decoded => this._dispositivoService.cadastrar(req.body.dispositivo,decoded.idCliente))
                    .then(() => res.sendStatus(200))
                    .catch(erro => next(erro));
        }

        cadastrarPelaWeb(req,res,next){
            
            let erros = this._validarDispositivoWeb(req);

            if(erros){
                res.status(422)
                    .json(erros);
                return;
            }

            this._dispositivoService
                    .cadastrar(req.body,req.idCliente)
                    .then(() => res.sendStatus(200))
                    .catch(erro => next(erro));
        }

        obter(req,res,next){
            
            this._dispositivoRepository
                    .obter(req.idCliente,req.params.id)
                    .then(dispositivo => dispositivo ? res.json(dispositivo) : res.sendStatus(204))
                    .catch(erro => next(erro));
        }

        editar(req,res,next){   

            let dispositivo = req.body;          
            
            dispositivo.id = req.params.id;

            this._dispositivoRepository
                    .atualizar(dispositivo)
                    .then(() => res.sendStatus(204))
                    .catch(erro => next(erro));
        }

        alterarEstado(req,res,next){

            if(!req.query.ativo){
                res.status(400)
                    .send('É necessário informar o parametro ativo=true ou ativo=false na query string');
                return;
            }
            
            let ativo = req.query.ativo == 'true' ? 0:1

            this._dispositivoRepository
                    .excluir(req.idCliente,req.params.id,ativo)
                    .then(result => res.sendStatus(204))
                    .catch(erro => next(erro));
        }

        listar(req,res,next){
            
            this._dispositivoRepository
                    .listarDispositivosDoCliente(req.idCliente)
                    .then(dispositivos => {
                        if(dispositivos)
                            res.json(dispositivos);
                        else
                            res.sendStatus(204);
                    });
        }


        _validarDispositivoWeb(req){
            
            if("excluido" in req.body)
                delete req.body.excluido;
            
            if("id" in req.body)
                delete req.body.id;

            req.assert('imei','imei obrigatório').notEmpty();
            req.assert('descricao','descrição é obrigatória').notEmpty();

            return req.validationErrors();
        }

        _validarDispositivoApi(req){
            if(req.body.dispositivo){
                if("excluido" in req.body.dispositivo)
                    delete req.body.dispositivo.excluido;
                
                if("id" in req.body.dispositivo)
                    delete req.body.dispositivo.id;
            }
            
            req.assert('dispositivo.imei', 'imei obrigatório').notEmpty();
            req.assert('dispositivo.descricao', 'descrição é obrigatória').notEmpty();
            req.assert('credenciais.usuario','nome de usuário é obrigatório').notEmpty();
            req.assert('credenciais.senha','senha é obrigatória').notEmpty();
            return req.validationErrors(); 
        } 
    }



