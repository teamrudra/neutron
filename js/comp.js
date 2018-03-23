module.exports = {
	comp:function(dir){
		// var die=332.5;
		// document.getElementById("st3").innerHTML = Math.ceil(dir);
	    var compassDisc = document.getElementById("Needle");
	    compassDisc.style.webkitTransform = "rotate("+ (dir) +"deg)";
	    compassDisc.style.transform = "rotate("+ (dir) +"deg)";
	}
}	