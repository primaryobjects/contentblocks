var webManager = require('./WebManager'),
    cache = require('memory-cache');

ControllerManager = {
    setup: function (app, host, port, pathPost, pathPut, pathDelete) {
        app.post('/create', function (req, res) { ControllerManager.insert(req, res, host, port, pathPost) });
        app.put('/create/:id', function (req, res) { ControllerManager.update(req, res, host, port, pathPut) });
        app.delete('/create/:id', function (req, res) { ControllerManager.delete(req, res, host, port, pathDelete) });
    },

    insert: function (req, res, host, port, path) {
        WebManager.send(req, res, host, port, path, 'POST', function (result) {
            res.status(200).json(result);
        });
    },

    update: function (req, res, host, port, path) {
        WebManager.send(req, res, host, port, path.replace('[id]', req.params['id']), 'PUT', function (result) {
            // Clear the cache for this block.
            cache.del(result.document['@subject']);

            res.status(200).json(result);
        });
    },

    delete: function (req, res, host, port, path) {
        WebManager.send(req, res, host, port, path.replace('[id]', req.params['id']), 'DELETE', function (result) {
            res.status(200).json(result);
        });
    }
};
