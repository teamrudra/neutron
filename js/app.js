var initMap = require('./map');
var link = require('./communication');
var control = require('./keyboard');
var compass = require('./compass');

var DATA_RATE = 1; //ms

initMap(12.821260, 80.038329);
link.setupServer(23907); // Groud Station server listning on 23907 never change!!!!
control.initKeyboard();

setInterval(function() {
    var data = control.processKeys();
    link.sendData("<" + data[0] + "," + data[1] + ">", 0);    
}, DATA_RATE);
