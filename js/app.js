var initMap = require('./map');
var setupServer = require('./communication').setupServer;
var keyboard = require('./keyboard');
var compass = require('./compass');

initMap();
setupServer(23907);
keyboard.initKeyboard();
keyboard.processKeys();
window.compass = compass;
