/*jslint node:true*/
/*globals define, now*/

(function () {
    'use strict';

    var http = require("http"),
        url = require("url"),
        path = require("path"),
        fs = require("fs"),
        nowjs = require("now"),
        util = require("util"),
        port = process.argv[2] || 8888,
        httpServer,
        everyone,
        contentType;

    httpServer = http.createServer(function (request, response) {

        var uri = url.parse(request.url).pathname,
            filename = path.join(process.cwd(), uri);

        path.exists(filename, function (exists) {
            if (!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }

            if (fs.statSync(filename).isDirectory()) {
                filename += '/index.html';
            }

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                switch (path.extname(filename)) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.html':
                    contentType = 'text/html';
                    break;
                default:
                    contentType = 'text/plain';
                }

                console.log('transfering with content-type: ', path.extname(filename), contentType);

                response.writeHead(200, {"Content-Type": contentType});
                response.write(file, "binary");
                response.end();
            });
        });
    }).listen(parseInt(port, 10));

    console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

})();