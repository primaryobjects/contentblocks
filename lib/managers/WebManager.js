var http = require('http'),
    easypost = require('easypost');

WebManager = {
    send: function (req, res, host, path, method, callback) {
        easypost.get(req, res, function (data) {
            // Set options.
            var options = {
                host: host,
                port: process.env.PORT || 80,
                path: path,
                method: method
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
            request.write(typeof(data) == 'object' ? JSON.stringify(data) : data);
            request.end();
        });
    }
};