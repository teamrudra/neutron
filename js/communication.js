const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var host = '0.0.0.0';
var port = 3301;
var allowData = false;

var setupServer = function(port) {
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
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

    // required listners
    $('#updStatus').click(function(event) {
        host = $("#roverip").val().split(":")[0];
        port = $("#roverip").val().split(":")[1];
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-positive').html('Stop');
            allowData = true;
        } else if ($(this).hasClass('btn-positive')) {
            $(this).removeClass('btn-positive').addClass('btn-warning').html('Start');
            allowData = false;
        }
    });
}

var sendData = function(data, override) { // data should be string
    if (allowData || override) {
        var message = new Buffer(data);
        server.send(message, 0, message.length, port, host, function(err, bytes) {
            if (err) console.error(err);
            $("#up").html(` ${bytes}b`);
            // TODO create log
        });
        console.log(data);
    }
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;