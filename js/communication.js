const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var needle = require('./compass');
var layer = require('./map');
var roverIcon = layer.getIcons('../images/rover.svg', 22, 'turnRover');
var host = '192.168.1.33';
var port = 3301;
var allowData = false;
var roverPoint = null;

var m = 0;

var setupServer = function (map, port) {
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (msg, rinfo) => {
        $("#rover").html(`${rinfo.address}:${rinfo.port}`);
        processMessage(map, msg, rinfo);
        // console.log(head);
        $("#down").html(` ${msg.length}b`);
        // return head;
    });
    server.on('listening', () => {
        const address = server.address();
        $("#station").html(`${address.address}:${address.port}`);
    });
    server.bind(port);

    // required listners
    $('#updStatus').click(function (event) {
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

var sendData = function (data, override) { // data should be string
    if (allowData || override) {
        var message = new Buffer(data);
        server.send(message, 0, message.length, port, host, function (err, bytes) {
            if (err) console.error(err);
            $("#up").html(` ${bytes}b`);
            // TODO create log
        });
        // console.log(data);
    }
}

var processMessage = function (map, msg, rinfo) {
    var data = new TextDecoder("ascii").decode(msg);
    if (data[0] == '$') {
        var dat = data.split(",");
        $('#heading').html(dat[1]);
        needle.compass(dat[1]);
        if (dat[2] == '%') {
            $('[id^=send]').prop('disabled', false);
            $('#autoStatus').removeClass('red').removeClass('green').addClass('yellow');
        }
        else if (dat[2].indexOf("destination:") !== -1) {
            $('#info').html(dat[2]);
            if (dat[3] == "~") {
                $('#send').prop('disabled', false);
                $('#autoStatus').removeClass('red').removeClass('green').addClass('yellow');
            }
        }
    }
    if (data[0] === '{')
        data = JSON.parse(data);
    if (data.class === 'TPV') {
        $('#latitude').html(data.lat);
        $('#longitude').html(data.lon);
        $('#speed').html(data.speed + ' m/s');
        if (!roverPoint) {
            roverPoint = L.marker([data.lat, data.lon], { icon: roverIcon });
            roverPoint = roverPoint.addTo(map);
        }
        roverPoint.setLatLng(L.latLng(data.lat, data.lon));
    }
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;
