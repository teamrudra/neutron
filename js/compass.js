
var compass = function(dir) {
	var compassDisc = document.getElementById("Needle");
	compassDisc.style.webkitTransform = "rotate("+ (dir) +"deg)";
	compassDisc.style.transform = "rotate("+ (dir) +"deg)";
}

module.exports = compass