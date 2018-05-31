//Oui pour l'instant c'est du copier coller d'internet, j'essaie de comprendre plus en détail la logique du load balancing
var net = require('net');
var fs = require('fs');
var util = require('util');
var server = net.createServer(function (c) { //'connection' listener
    console.log('client connected');
    c.on('end', function () {
        console.log('client disconnected');
    });
    c.on('data', function (data) {

        var json = JSON.parse(data.toString());
        if (json.heartbeat) {
            if (json.first_fetch === "1") {
                c.write("{\"config_changed\":\"true\",\"config\":\"This is some config\"}"); // JSON Message here
            }
            else {
                c.write("{\"config_changed\":\"false\"}");
            }
        }
        else if (json.message) {
            c.write("{\"success\":\"true\"}");
        }
        else if (json.app) {
            fs.exists('apps/' + json.app + ".dll", function (exists) {
                util.debug(exists ? "it's there" : "Its not there");
            });
            var stats = fs.statSync('apps/' + json.app + ".dll")
            var fileSizeInBytes = stats["size"]
            var message = json.app + "\n" + fileSizeInBytes + "\n";
            c.write(message);
            fs.open('apps/' + json.app + ".dll", "r", function (status, fd) {
                console.log(fd);
                var read_bytes = 0;
                var fileStream = fs.createReadStream('apps/' + json.app + ".dll");
                fileStream.on('data', function (chunk) {
                    c.write(chunk);

                });
            })

        }
        else {
            c.write("{\"some\":\"error\"}");
        }
    });

    c.on('error', function (e) {
        console.log(e);
    });

    // c.pipe(c);
});
server.listen(1936, function () { //'listening' listener
    console.log('server bound');
});