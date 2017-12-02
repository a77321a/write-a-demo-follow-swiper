	//  橡皮擦效果

	var canvas = document.getElementsByTagName('canvas'),
		ctx = canvas[0].getContext("2d");
	var x1, y1, a = 30,
		timeout,
		totimes = 100,
		distance = 30;
	var saveDot = [];

	var canvasBox = $(".box")[0];

	canvas.width = canvasBox.clientWidth;
	canvas.height = canvasBox.clientHeight;

	var img = new Image();
	img.src = "B12.jpg";
	img.onload = function() {
		var w = canvas.height * img.width / img.height;
		ctx.drawImage(img, (canvas.width - w) / 2, 0, w, canvas.height);
		tapClip();
	};

	function getClipArea(e, hastouch) {
		var x = hastouch ? e.targetTouches[0].pageX : e.clientX;
		var y = hastouch ? e.targetTouches[0].pageY : e.clientY;
		var ndom = canvas;

		while (ndom.tagName !== "BODY") {
			x -= ndom.offsetLeft;
			y -= ndom.offsetTop;
			ndom = ndom.parentNode;
		}
		return {
			x: x,
			y: y
		}
	}
	//通过修改globalCompositeOperation来达到擦除的效果
	function tapClip() {
		var hastouch = "ontouchstart" in window ? true : false,
			tapstart = hastouch ? "touchstart" : "mousedown",
			tapmove = hastouch ? "touchmove" : "mousemove",
			tapend = hastouch ? "touchend" : "mouseup";

		var area;
		var x2, y2;

		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = a * 2;
		ctx.globalCompositeOperation = "destination-out";

		window.addEventListener(tapstart, function(e) {
			clearTimeout(timeout);
			e.preventDefault();
			area = getClipArea(e, hastouch);
			x1 = area.x;
			y1 = area.y;
			drawLine(x1, y1);
			this.addEventListener(tapmove, tapmoveHandler);
			this.addEventListener(tapend, function() {
				this.removeEventListener(tapmove, tapmoveHandler);
				/*
								//检测擦除状态
								timeout = setTimeout(function () {
									var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
									var dd = 0;
									for (var x = 0; x < imgData.width; x += distance) {
										for (var y = 0; y < imgData.height; y += distance) {
											var i = (y * imgData.width + x) * 4;
											if (imgData.data[i + 3] > 0) { dd++ }
										}
									}
									if (dd / (imgData.width * imgData.height / (distance * distance)) < 0.4) {
										canvas.className = "noOp";
									}
								}, totimes)*/
			});

			function tapmoveHandler(e) {
				clearTimeout(timeout);

				e.preventDefault();

				area = getClipArea(e, hastouch);

				x2 = area.x;
				y2 = area.y;

				drawLine(x1, y1, x2, y2);

				x1 = x2;
				y1 = y2;
			}
		})
	}

	function drawLine(x1, y1, x2, y2) {
		ctx.save();
		ctx.beginPath();
		if (arguments.length == 2) {
			ctx.arc(x1, y1, a, 0, 2 * Math.PI);
			ctx.fill();
		} else {
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
		ctx.restore();
	}