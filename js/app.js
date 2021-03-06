var MapLayer = require('./map');
var link = require('./communication');
var control = require('./keyboard');
var needle = require('./compass');

var point = [0, 0, 0, 0, 0];
var count = 0;

var DATA_RATE = 1; //ms

var map = MapLayer.initMap(12.821260, 80.038329);//12.821260, 80.038329
var testicon=MapLayer.getIcons("../images/Black_dot.png");
link.setupServer(map, 23907); // Groud Station server listning on 23907 never change!!!!
control.initKeyboard();

// setting up required listners
setInterval(function() {
    var data = control.processKeys();
    link.sendData("<" + data[0] + "," + data[1] + ">", 0);
}, DATA_RATE);



map.on('click', function(e) {
    if (point[count])
        map.removeLayer(point[count]);
    point[count] =  L.marker(e.latlng, {icon:testicon});//L.marker(e.latlng);
    point[count].addTo(map);
    $('#lat' + count).val(e.latlng.lat.toFixed(6));
    $('#lon' + count).val(e.latlng.lng.toFixed(6));
    count = (count + 1) % 5;
});

$('#remove').click(function() {
    for (var i = 0; i < 5; i++) {
        $('#lat' + i ).val(null);
        $('#lon' + i ).val(null);
        if (point[i])
            map.removeLayer(point[i]);
    }
    count = 0;
    link.sendData('$#', 1);
    $('[id^=send]').prop('disabled', true);
    $('#autoStatus').removeClass('yellow').removeClass('green').addClass('red');
});

$('#send').click(function() {
    link.sendData('@', 1);
    $('#autoStatus').removeClass('yellow').removeClass('red').addClass('green');
    $('[id^=send]').prop('disabled', true);
});

$('#sendall').click(function() {
    link.sendData('*', 1);
    $('#autoStatus').removeClass('yellow').removeClass('red').addClass('green');
    $('[id^=send]').prop('disabled', true);
});

$('#show').click(function() {
    for (var i = 0; i<5;i++) {
        if ($('#lat' + i ).val() && $('#lon' + i ).val() ) {
            if (point[i])
                map.removeLayer(point[i]);
            point[i] = L.marker([$('#lat' + i ).val(), $('#lon' + i).val()]);
            point[i].addTo(map);
        }
    }
});

$('#load').click(function() {
    var data = '#';
    for (var i = 0; i<5;i++) {
        if ($('#lat' + i ).val() && $('#lon' + i ).val() ) {
            data += $('#lat' + i ).val() + ',' + $('#lon' + i ).val() + '!' ;
        }
    }
    data = data.slice(0, -1) + '$';
    link.sendData(data, 1);
});
