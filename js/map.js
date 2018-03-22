var initMap = function() {
    var mymap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoidnNoZWxrZSIsImEiOiJjamYydHA4OGswc2NjMzNsbnJ6N2Jhb2l6In0.Zt_78qmQF6WDcE6MtvPQjA'
    }).addTo(mymap);
}

module.exports = initMap;