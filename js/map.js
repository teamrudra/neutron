var sendData = require('./communication').sendData;

var tilesDb = {
    getItem: function (key) {
        return localforage.getItem(key);
    },
    saveTiles: function (tileUrls) {
        var self = this;
        var promises = [];
        for (var i = 0; i < tileUrls.length; i++) {
            var tileUrl = tileUrls[i];
            (function (i, tileUrl) {
                promises[i] = new Promise(function (resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open('GET', tileUrl.url, true);
                    request.responseType = 'blob';
                    request.onreadystatechange = function () {
                        if (request.readyState === XMLHttpRequest.DONE) {
                            if (request.status === 200) {
                                resolve(self._saveTile(tileUrl.key, request.response));
                            } else {
                                reject({
                                    status: request.status,
                                    statusText: request.statusText
                                });
                            }
                        }
                    };
                    request.send();
                });
            })(i, tileUrl);
        }
        return Promise.all(promises);
    },
    clear: function () {
        return localforage.clear();
    },
    _saveTile: function (key, value) {
        return this._removeItem(key).then(function () {
            return localforage.setItem(key, value);
        });
    },
    _removeItem: function (key) {
        return localforage.removeItem(key);
    }
}

var offlineLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tilesDb, {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    minZoom: 1,
    maxZoom: 19,
    crossOrigin: true
});

var offlineControl = L.control.offline(offlineLayer, tilesDb, {
    confirmSavingCallback: function (nTilesToSave, continueSaveTiles) {
        if (window.confirm('Save ' + nTilesToSave + '?')) {
            continueSaveTiles();
        }
    },
    confirmRemovalCallback: function (continueRemoveTiles) {
        if (window.confirm('Remove all the tiles?')) {
            continueRemoveTiles();
        }
    },
    minZoom: 1,
    maxZoom: 19
});

var initMap = function (latitude, longitude) {
    var map = L.map('map');
    var m = L.marker([latitude, longitude]).addTo(map);
    var popup = L.popup();
    var position = L.control.mousePosition();
    var coordinates = L.control.coordinates({
                position:"topright",
                useDMS:true,
                labelTemplateLat:"N {y}",
                labelTemplateLng:"E {x}",
                useLatLngOrder:true
            });
    offlineControl.addTo(map);
    offlineLayer.addTo(map);
    position.addTo(map);
    coordinates.addTo(map);
    map.setView({
        lat: latitude,
        lng: longitude
    }, 50);

    
    lat = ["lat1","lat2","lat3","lat4","lat5"];
    lon = ["lon1","lon2","lon3","lon4","lon5"];
    point = [0, 0, 0, 0, 0];
    count = 0;

    map.on('click', function(e) {
        if (point[count] != 0)
            map.removeLayer(point[count]);
        point[count] = L.marker(e.latlng);
        point[count].addTo(map);
        document.getElementById(lat[count]).value = e.latlng.lat.toFixed(6);
        document.getElementById(lon[count]).value = e.latlng.lng.toFixed(6);
        count++;
        if (count > 4)
            count = 0;
    });

    $('#remove').click(function() {
        for (var i = 0; i < 5; i++) {
            document.getElementById(lat[i]).value = null;
            document.getElementById(lon[i]).value = null;
            if (point[i] != 0)
                map.removeLayer(point[i]);
        }
        count = 0;
        sendData('$#', 1);
    });

    $('#send').click(function() {
        var data = '#';
        for (var i = 0; i<5;i++) {
            if ($('#' + lat[i]).val() && $('#' + lon[i]).val() )
                data += $('#' + lat[i]).val() + ',' + $('#' + lon[i]).val() + '!' ;
        }
        data = data.slice(0, -1) + '$';
        sendData(data, 1);
    });
    
}

module.exports = initMap;
