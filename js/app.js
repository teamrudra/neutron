var initMap = require('./map');
var setupServer = require('./communication').setupServer;
var initKeyboard = require('./keyboard');
var compass = require('./compass');

var map = initMap();
setupServer(map, 23907); // Groud Station server listning on 23907 never change!!!!
initKeyboard();
