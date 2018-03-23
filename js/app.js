var initMap = require('./map');
var setupServer = require('./communication').setupServer;
var keyboard = require('./keyboard');

initMap();
setupServer(23907);
keyboard.initKeyboard();
keyboard.processKeys();