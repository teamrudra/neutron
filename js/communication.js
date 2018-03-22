const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var setupServer = function(port) {
    server.on('error', (err) => {
        console.err(`server error:\n${err.stack}`);
        server.close();
        $("#status").attr("class","icon icon-record disconnected");
    });
      
    server.on('message', (msg, rinfo) => {
        $("#rover").html(`${rinfo.address}:${rinfo.port}`);
        $("#status").attr("class","icon icon-record processing");
        $("#info").append(`<p>${msg}</p>`);
    });
    
    server.on('listening', () => {
        const address = server.address();
        $("#station").html(`${address.address}:${address.port}`);
        $("#status").attr("class","icon icon-record listening");
    });

    server.bind(port);
}

module.exports = setupServer;