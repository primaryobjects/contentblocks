var http = require('http'),
    easypost = require('easypost');

WebManager = {
    send: function (req, res, host, port, path, method, callback) {
        easypost.get(req, res, function (data) {
            var payload = (typeof(data) == 'object' ? JSON.stringify(data) : data);

            // Set options.
            var options = {
                host: host,
                port: port || process.env.PORT || 80,
                path: path,
                method: method,
                headers: { 'content-length': Buffer.byteLength(payload) }
            };

            // Setup http method.
            var request = http.request(options, function (clientRequest) {
                // Read result.
                easypost.get(clientRequest, res, function (result) {
                    var resultObj = JSON.parse(result);
                    callback(resultObj);
                });
            });

            // Send http call.
            request.write(payload);
            request.end();
        });
    }
};