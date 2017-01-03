module.exports = app =>
    class WebTokenInterceptor extends app.middleware.GenericTokenInterceptor{
        constructor(ssoService){
            super();
            this._ssoService = ssoService;
        }

        intercept(req,res,next){

            if(this.recursoLiberado(req)){
                next();
                return;
            }

            let token = this.obterToken(req);

            if(!token){
                res.status(401)
                    .send('O recurso exige autenticação');
                return;
            }

            this._ssoService.decodificarWebToken(token)
                                .then(decoded => req.idCliente = decoded.idCliente)
                                .then(() => next())
                                .catch(erro => res.status(401).send('Token inválido. O recurso requisitado exige autenticação.')); 

        }
    }