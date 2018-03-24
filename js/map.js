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

var initMap = function () {
    var map = L.map('map');

    lat = ["tf1","tf3","tf5","tf7","tf9"];
    lon = ["tf2","tf4","tf6","tf8","tf0"];

    point = [0,0,0,0,0];
    count = 0;

    var m = L.marker([12.821260, 80.038329]).addTo(map);

    var popup = L.popup();

    offlineControl.addTo(map);
    offlineLayer.addTo(map);

    map.setView({
        lat: 12.821260,
        lng: 80.038329
    }, 18);

    function mapclick(e) {
    if(point[count]!=0)
        map.removeLayer(point[count]);
    point[count]=L.marker(e.latlng);
    point[count].addTo(map);

    var str=e.latlng.toString().split("(");
    str=str[1].split(", ");
    var str1=str[1].split(")");
    // console.log(str1);

    document.getElementById(lat[count]).value = str[0];
    document.getElementById(lon[count]).value = str1[0];


    count++;
    if(count>4)
        count=0;

    }
    map.on('click', mapclick );

    function remove(){
        for(var i = 0; i<5; i++)
        {
            document.getElementById(lat[i]).value = null;
            document.getElementById(lon[i]).value = null;
            if(point[i]!=0)
                map.removeLayer(point[i]);
        }
        count = 0;
    }

    document.getElementById("remove").addEventListener('click', remove);

}

module.exports = initMap;
