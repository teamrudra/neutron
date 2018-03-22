var initMap = require('./map');
var setupServer = require('./communication');

initMap();
setupServer(3301);