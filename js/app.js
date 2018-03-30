var initMap = require('./map');
var setupServer = require('./communication').setupServer;
var initKeyboard = require('./keyboard');
var compass = require('./compass');

initMap();
setupServer(23907);
initKeyboard();
