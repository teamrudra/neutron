

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
  //saveButtonHtml: '<i class="fa fa-download" aria-hidden="true"></i>',
  //removeButtonHtml: '<i class="fa fa-trash" aria-hidden="true"></i>',
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



var initMap =function(){
  var map=L.map('map');

  var m = L.marker([12.821260, 80.038329]).addTo(map);


  offlineControl.addTo(map);
  offlineLayer.addTo(map);

  map.setView({
    lat: 12.821260,
    lng: 80.038329
  }, 18);

}

module.exports=initMap;


/*var initMap = function() {
    var mymap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoidnNoZWxrZSIsImEiOiJjamYydHA4OGswc2NjMzNsbnJ6N2Jhb2l6In0.Zt_78qmQF6WDcE6MtvPQjA'
    }).addTo(mymap);
    L.marker([51.505, -0.09]).addTo(mymap);
}

module.exports = initMap;*/
