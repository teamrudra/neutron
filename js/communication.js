const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const rover = dgram.createSocket('udp4');

var setupServer = function(port) {
    server.on('error', (err) => {
        console.err(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (msg, rinfo) => {
        $("#rover").html(`${rinfo.address}:${rinfo.port}`);
        $("#info").append(`<p>${msg}</p>`);
        $("#down").html(` ${msg.length}b`);
    });
    server.on('listening', () => {
        const address = server.address();
        $("#station").html(`${address.address}:${address.port}`);
    });
    server.bind(port);
}

var sendData = function(host, port, data) { // data should be string
    var message = new Buffer(data);
    rover.send(message, 0, message.length, port, host, function(err, bytes) {
        if (err) console.err(err);
        $("#up").html(` ${bytes}b`);
        // TODO create log
    });
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;