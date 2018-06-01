var net = require('net');

var port = 5002;
var server = net.createServer(function (c) {
    console.log('Je suis le server 1 sur le port:' + port + '\n');
    c.on('end', function () {
        console.log('server disconnected');
    });
});
server.listen(port);