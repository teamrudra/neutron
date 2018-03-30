var sendData = require('./communication').sendData;
var host = "0.0.0.0";
var keyMap = { "w":false , "a": false, "s":false, "d":false ,
               "q":false , "e":false , "t":false , "Control":false , 
               "ArrowLeft":false , "ArrowRight":false , "ArrowDown":false , "ArrowUp":false ,
               "j":false , "k":false , "l": false, "Shift":false };

var initKeyboard = function() {
    $('body').keydown(function(event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = true;
    });
    $('body').keyup(function(event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = false;
    });
    $("#roverip").keypress(function(event) {
        if (event.key === "Enter")
            host = $("#roverip").val();
    });
    setInterval(processKeys, 1);
}

var processKeys = function() {
    var output = "";
    Object.keys(keyMap).forEach(function(key) {
        output += (keyMap[key] ? "1" : "0");
    });
    var drive = parseInt(output.substring(0, 8), 2);
    var arm = parseInt(output.substring(8), 2);
    sendData(host, 3301, "<" + drive + "," + arm + ">");
}

module.exports = initKeyboard;
