const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var host = '0.0.0.0';
var port = 3301;
var allowData = false;
var oldPoint = 0;

var m = 0;

var setupServer = function(map, port) {
    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });
    server.on('message', (msg, rinfo) => {
        $("#rover").html(`${rinfo.address}:${rinfo.port}`);
        // console.log(msg);
        //decode compass and update the compass in status html and compass.
        //try 'windows-1251' format instead of ascii to decode for compass and acknowladgement values.        
        //check for ackmowladgment and enable the send button.
        //if(acknowladgement)
        //  $('#send').prop('disabled', false);
        //change the pan(autoStatus) to green.
        var data = new TextDecoder("ascii").decode(msg);
        if (data[0] === '{')
            data = JSON.parse(data);
        if (data.class === 'TPV')
        {
            console.log(data.lat + " , " + data.lon);
            document.getElementById("latitude").innerHTML = ""+data.lat;
            document.getElementById("longitude").innerHTML = ""+data.lon;
            document.getElementById("speed").innerHTML = ""+data.speed+"m/s";
            console.log(oldPoint);
            if(oldPoint != 0)
                map.removeLayer(oldPoint);     
            oldPoint = L.marker([data.lat, data.lon])
            oldPoint = oldPoint.addTo(map);
            // console.log(data);
        }
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