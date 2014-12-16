var sliderPromociones = {
	nextSlide: function() {
		var images = document.getElementsByName("slide-mini");
		var lastId;

		for (var i = images.length - 1; i > 0; i--) {
			if (images[i].className != "hidden") {
				lastId = images[i].id;
				break;
			}
		}

		lastId = parseInt(lastId.split("-")[2]) + 1;
		var nextImage = document.getElementById("slide-mini-" + lastId);
		//console.log("slide-mini-" + lastId + "," + nextImage);

		if (nextImage == undefined) {
			//console.log("No hay siguiente");
		}
		else {
			var tempImage = document.getElementById("slide-mini-" + (lastId - 4));
			tempImage.className = "hidden";
			nextImage.className = "slide-mini";
			//console.log("Siguiente " + nextImage.id);
		}
	},

	previousSlide: function() {
		var images = document.getElementsByName("slide-mini");
		var lastId;

		for (var i = 0; i < images.length - 1; i++) {
			if (images[i].className != "hidden") {
				lastId = images[i].id;
				break;
			}
		}

		lastId = parseInt(lastId.split("-")[2]) - 1;
		var previousImage = document.getElementById("slide-mini-" + lastId);
		//console.log("slide-mini-" + lastId + "," + previousImage);

		if (previousImage == undefined) {
			//console.log("No hay anterior");
		}
		else {
			var tempImage = document.getElementById("slide-mini-" + (lastId + 4));
			tempImage.className = "hidden";
			previousImage.className = "slide-mini";
			//console.log("Siguiente " + previousImage.id);
		}
	}
}