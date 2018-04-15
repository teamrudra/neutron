var sendData = require('./communication').sendData;
var host = "0.0.0.0";
var port = 3301;
var keyMap = { "w":false , "a": false, "s":false, "d":false ,
               "q":false , "e":false , "t":false , "Control":false , 
               "ArrowLeft":false , "ArrowRight":false , "ArrowDown":false , "ArrowUp":false ,
               "j":false , "k":false , "l": false, "Shift":false, "i": false, "o": false };
var allowData = false;

var initKeyboard = function() {
    $('body').keydown(function(event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = true;
    });
    $('body').keyup(function(event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = false;
    });
    $('#updStatus').click(function(event) {
        host = $("#roverip").val().split(":")[0];
        port = $("#roverip").val().split(":")[1];
        if ($(this).hasClass('btn-warning')) {
            $(this).removeClass('btn-warning').addClass('btn-positive').html('Stop');
            allowData = true;
        } else if ($(this).hasClass('btn-positive')) {
            $(this).removeClass('btn-positive').addClass('btn-warning').html('Start');
            allowData = false;
        }
    })
    setInterval(processKeys, 1);
}

var processKeys = function() {
    var output = "";
    Object.keys(keyMap).forEach(function(key) {
        output += (keyMap[key] ? "1" : "0");
    });
    if (keyMap['i'])
        output = output.substring(0, 8) + "11110000";
    if (keyMap['o'])
        output = output.substring(0, 8) + "00001111";
    var drive = parseInt(output.substring(0, 8), 2);
    var arm = parseInt(output.substring(8, 16), 2);
    if (allowData) {
        // console.log(drive + " " + arm);
        sendData(host, port, "<" + drive + "," + arm + ">");
    }
}

module.exports = initKeyboard;
