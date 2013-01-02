var webManager = require('./WebManager');

ControllerManager = {
    setup: function (app, host, pathPost, pathPut, pathDelete) {
        app.post('/create', function (req, res) { ControllerManager.insert(req, res, host, pathPost) });
        app.put('/create/:id', function (req, res) { ControllerManager.update(req, res, host, pathPut) });
        app.delete('/create/:id', function (req, res) { ControllerManager.delete(req, res, host, pathDelete) });
    },

    insert: function (req, res, host, path) {
        WebManager.send(req, res, host, path, 'POST', function (result) {
            res.json(result, 200);
        });
    },

    update: function (req, res, host, path) {
        WebManager.send(req, res, host, path.replace('[id]', req.params['id']), 'PUT', function (result) {
            res.json(result, 200);
        });
    },

    delete: function (req, res, host, path) {
        WebManager.send(req, res, host, path.replace('[id]', req.params['id']), 'DELETE', function (result) {
            res.json(result, 200);
        });
    }
};
