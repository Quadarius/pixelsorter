var PixelSorter3 = function() {
	var self = this;

	this.draw = function(){
		setup();
	}
	this.init = function(){
		_init();
	}
	this.chooseFile = function(){
		document.getElementById('filepicker').click();
	}

	this.threshold = 128;
	this.source = 'flowerface.png';
	this.mode = '0';


	var img = new Image(),
		ogImg = new Image(),
		height, width,
		source,
		red, blue, green,
		range;

	var canvas = document.createElement('canvas'),
		og = canvas.getContext('2d');

	var sdCanvas = document.createElement('canvas'),
		sd = sdCanvas.getContext('2d');

	var pixels = [], imageData;
	var bitmap = [];

	//// sorting setup
	var currentRow = 0, currentColumn = 0,
		imageData, pixels, mode, sortValue,
		sortRange, avgColor;

	function _init(){
		currentRow = 0;
		currentColumn = 0;
		setup();
		document.getElementById('canvas').appendChild(canvas);
	}

	function setup(){
		img.onload = function(){
			height = img.height;
			width = img.width;

			canvas.height = sdCanvas.height = height;
			canvas.width = sdCanvas.width = width;
			setAverageColor();
			draw(this);
		}

		img.src = self.source || 'flowerface.png';
	}

	function draw(img){
		og.drawImage(img, 0, 0);
		imageData = og.getImageData(0, 0, width, height);
		pixels = imageData.data;
		switch (self.mode){
			case '0':
				sortPixels();
				break;
			case '1':
				sortColumns();
				break;
			case '2':
				sortRows();
				break;
			case '3':
				smearPixels();
				break;
			case '4':
				smearColumns();
				break;
			case '5':
				smearRows();
				break;
		}
	}

	function sortAllPixels(){
		var pxNum = width * height;
		var unsorted = new Array(pxNum);
		var sorted = new Array(pxNum);

		var count = 0;
		for(var i = 0; i < pixels.length; i+= 4){
			unsorted[count] = getPixelValue(i);
			count++;
		}
		sorted = unsorted.sort();

		var j = 0;
		for(var l = 0; l < pixels.length; l+=4){
			setPixelValue(l, sorted[j]);
			j++;
		}

		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

	function reverseAllPixels(){
		var pxNum = width * height;
		var unsorted = new Array(pxNum);
		var sorted = new Array(pxNum);

		var count = 0;
		for(var i = 0; i < pixels.length; i+= 4){
			unsorted[count] = getPixelValue(i);
			count++;
		}
		sorted = unsorted.reverse();

		var j = 0;
		for(var l = 0; l < pixels.length; l+=4){
			setPixelValue(l, sorted[j]);
			j++;
		}

		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

	function sortPixels() {
		while(currentColumn < width-1){
			sortColumn();
			currentColumn+=1;
		}
		while(currentRow < height-1){
			sortRow();
			currentRow+=1;
		}
		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

	function sortRows() {
		while(currentRow < height-1){
			sortRow();
			currentRow+=1;
		}
		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

	function sortColumns() {
		while(currentColumn < width-1){
			sortColumn();
			currentColumn+=1;
		}
		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

	function smearPixels() {
		while(currentColumn < width-1){
			smearColumn();
			currentColumn+=1;
		}
		while(currentRow < height-1){
			smearRow();
			currentRow+=1;
		}
		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

	function smearRows() {
		while(currentRow < height-1){
			smearRow();
			currentRow+=1;
		}
		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

	function smearColumns() {
		while(currentColumn < width-1){
			smearColumn();
			currentColumn+=1;
		}
		imageData.data = pixels;
		og.putImageData(imageData, 0, 0);
	}

////////////////////////////////////////////////////////////////////////////////
	function sortRow() {
		var x = 0;
		var y = currentRow;
		var xend = 0;

		while (xend < width-1) {
			x = getFirstNotBlackX(x, y);
			xend = getNextBlackX(x, y);
			if (x < 0) break;

			var sortLength = xend-x;

			var unsorted = new Array(sortLength);
			var sorted = new Array(sortLength);

			for(var i=0; i<sortLength; i++) {
				unsorted[i] = getPixelValue(x + i, y);
			}
			sorted = unsorted.sort();
			sorted = sorted.reverse();

			for(var i=0; i<sortLength; i++) {
				setPixelValue(x + i, y, sorted[i]);
			}

			x = xend+1;
		}
	}

	function sortColumn(){
		var x = currentColumn,
			y = 0,
			yend = 0;

		while (yend < height-1) {
			y = getFirstNotBlackY(x, y);
			yend = getNextBlackY(x, y);
			if (y < 0) break;

			var sortLength = yend-y;

			var unsorted = new Array(sortLength);
			var sorted = new Array(sortLength);

			for(var i=0; i<sortLength; i++) {
				unsorted[i] = getPixelValue(x, y+i);
			}

			sorted = unsorted.sort();
			sorted = sorted.reverse();

			for(var i=0; i<sortLength; i++) {
				setPixelValue(x, y+i, sorted[i]);
			}

			y = yend+1;
		}
	}
////////////////////////////////////////////////////////////////////////////////
	function smearRow() {
		var x = 0;
		var y = currentRow;
		var xend = 0;

		while (xend < width-1) {
			x = getFirstNotBlackX(x, y);
			xend = getNextBlackX(x, y);
			if (x < 0) break;

			var sortLength = xend-x;
			var c = getPixelValue(x, y);

			//var unsorted = new Array(sortLength);
			// var sorted = new Array(sortLength);

			// for(var i=0; i<sortLength; i++) {
			// 	unsorted[i] = getPixelValue(x + i, y);
			// }
			// sorted = unsorted.sort();

			for(var i=0; i<sortLength; i++) {
				setPixelValue(x + i, y, c);
			}

			x = xend+1;
		}
	}

	function smearColumn(){
		var x = currentColumn,
			y = 0,
			yend = 0;

		while (yend < height-1) {
			y = getFirstNotBlackY(x, y);
			yend = getNextBlackY(x, y);
			if (y < 0) break;

			var sortLength = yend-y;
			var c = getPixelValue(x, y);

			// var unsorted = new Array(sortLength);
			// var sorted = new Array(sortLength);

			// for(var i=0; i<sortLength; i++) {
			// 	unsorted[i] = getPixelValue(x, y+i);
			// }

			// sorted = unsorted.sort();

			for(var i=0; i<sortLength; i++) {
				setPixelValue(x, y+i, c);
			}

			y = yend+1;
		}
	}
////////////////////////////////////////////////////////////////////////////////
	function avgRow() {
		var x = 0;
		var y = currentRow;
		var xend = 0;

		while (xend < width-1) {
			x = getFirstNotBlackX(x, y);
			xend = getNextBlackX(x, y);
			if (x < 0) break;

			var sortLength = xend-x;

			for(var i = 0; i < sortLength; i++) {
				setPixelValue(x + i, y, avgColor);
			}

			x = xend+1;
		}
	}

	function avgColumn(){
		var x = currentColumn,
			y = 0,
			yend = 0;

		while (yend < height-1) {
			y = getFirstNotBlackY(x, y);
			yend = getNextBlackY(x, y);
			if (y < 0) break;

			var sortLength = yend-y;

			for(var i = 0; i < sortLength; i++) {
				setPixelValue(x, y+i, avgColor);
			}

			y = yend+1;
		}
	}
////////////////////////////////////////////////////////////////////////////////
	function threshold(px, threshold){
		 var d = px.data;
		for (var i=0; i<d.length; i+=4) {
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
			d[i] = d[i+1] = d[i+2] = v
		}

		return px;
	}

	function isBlack(x, y) {
		var base = (Math.floor(y) * width + Math.floor(x)) * 4;
		return bitmap[base] == 255;
	};

	function getColor(x, y) {
		var base = (Math.floor(y) * width + Math.floor(x)) * 4;
		var c = {
			r: bitmap[base + 0],
			g: bitmap[base + 1],
			b: bitmap[base + 2],
			a: bitmap[base + 3]
		};

		return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
	};
////////////////////////////////////////////////////////////////////////////////

	function getPixelValue(offset){
		// var offset = ( x + y * width) *4;
		var r = pixels[offset];
		var g = pixels[offset + 1];
		var b = pixels[offset + 2];
		return (((255 << 8) | r) << 8 | g) << 8 | b;
	}

	function setPixelValue(offset, val) {
		var r = (val >> 16) & 255;
		var g = (val >> 8) & 255;
		var b = val & 255;
		pixels[offset] = r;
		pixels[offset+1] = g;
		pixels[offset+2] = b;
	}


	function getPixelValue(x, y){
		var offset = ( x + y * width) *4;
		var r = pixels[offset];
		var g = pixels[offset + 1];
		var b = pixels[offset + 2];
		return (((255 << 8) | r) << 8 | g) << 8 | b;
	}

	function getPixelThreshold(x, y){
		var offset = ( x + y * width) *4;
		var r = pixels[offset];
		var g = pixels[offset + 1];
		var b = pixels[offset + 2];
		return 0.2126*r + 0.7152*g + 0.0722*b;
	}

	function setPixelValue(x, y, val) {
		var offset = (x + y * width) * 4;
		var r = (val >> 16) & 255;
		var g = (val >> 8) & 255;
		var b = val & 255;
		pixels[offset] = r;
		pixels[offset+1] = g;
		pixels[offset+2] = b;
	}
	////////////////////////////////////////////////////////////////////////////
	function getFirstNotBlackX(xval, yval){
		let x = xval,
			y = yval;

		while(getPixelThreshold(x, y) < self.threshold){
			x++;
			if(x >= width) return -1;
		}
		return x;
	}
	function getNextBlackX(xval, yval){
		let x = xval+1,
			y = yval;

		while(getPixelThreshold(x, y) > self.threshold){
			x++;
			if(x >= width) return width - 1;
		}
		return x - 1;
	}
////////////////////////////////////////////////////////////////////////////////
	function getFirstNotBlackY(xval, yval){
		let x = xval,
			y = yval;

		if(y < height){
			while(getPixelThreshold(x, y) < self.threshold){
				y++;
				if(y >= height) return -1;
			}
		}

		return y;
	}
	function getNextBlackY(xval, yval){
		let x = xval,
			y = yval+1;
		if(y < height){
			while(getPixelThreshold(x, y) > self.threshold){
				y++;
				if(y >= height) return height - 1;
			}
		}
		return y - 1;
	}

	function setSortValue(r, g, b){
		sortValue = (((255 << 8) | r) << 8 | g) << 8 | b;
	}

	function setAverageColor(){
		var pixelInterval = 5,
			count = 0,
			i = -4,
			rgb = {r: 102, g: 102, b:102},
			totalPixelCount = width*height*4;

		while ((i += pixelInterval * 4) < totalPixelCount) {
			count++;
			rgb.r += pixels[i];
			rgb.g += pixels[i+1];
			rgb.b += pixels[i+2];
		}

		// floor the average values to give correct rgb values (ie: round number values)
		rgb.r = Math.floor(rgb.r/count);
		rgb.g = Math.floor(rgb.g/count);
		rgb.b = Math.floor(rgb.b/count);

		avgColor = (((255 << 8) | rgb.r) << 8 | rgb.g) << 8 | rgb.b;
		//getPixelValue(rgb.r, rgb.g, rgb.b);
		//return col(rgb.r, rgb.g, rgb.b);
	}
////////////////////////////////////////////////////////////////////////////////
}
