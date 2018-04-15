const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var m = 0;

var setupServer = function(map, port) {
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (msg, rinfo) => {
        $("#rover").html(`${rinfo.address}:${rinfo.port}`);
        var data = new TextDecoder("ascii").decode(msg);
        if (data[0] === '{')
            data = JSON.parse(data);
        if (data.class === 'TPV')
        {
            console.log(data.lat + " , " + data.lon);
            document.getElementById("latitude").innerHTML = ""+data.lat;
            document.getElementById("longitude").innerHTML = ""+data.lon;
            document.getElementById("speed").innerHTML = ""+data.speed+"m/s";
            // console.log(map[1]);
            map[0].removeLayer(map[1]);     
            map[1] = L.marker([data.lat, data.lon]).addTo(map[0]);
            console.log(data);
        }
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
    server.send(message, 0, message.length, port, host, function(err, bytes) {
        if (err) console.error(err);
        $("#up").html(` ${bytes}b`);
        // TODO create log
    });
    console.log(data.length);
}

module.exports.setupServer = setupServer;
module.exports.sendData = sendData;