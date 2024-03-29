module.exports = function (app) {

    let controlador = app.beans.factory.dispositivoController;

    app.route('/api/v1/dispositivos')
        .post(controlador.cadastrarPelaApi.bind(controlador));

    app.route('/web/v1/dispositivos')
        .post(controlador.cadastrarPelaWeb.bind(controlador))
        .get(controlador.listar.bind(controlador));

    app.route('/web/v1/dispositivos/:id')
        .get(controlador.obter.bind(controlador))
        .patch(controlador.editar.bind(controlador));

    app.patch('/web/v1/dispositivos/:id/estado', controlador.alterarEstado.bind(controlador));
};