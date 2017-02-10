var submarineFactory = function(sock, px, py) {
	var x = px, y = py, deg = 0, socket = sock, speed = 5;

	return {
		moveForward: function() {
			x += speed * Math.cos(Math.PI / 180 * deg);
			y += speed * Math.sin(Math.PI / 180 * deg);
		},
		moveBackwards: function() {
			x -= speed * Math.cos(Math.PI / 180 * deg);
			y -= speed * Math.sin(Math.PI / 180 * deg);
		},
		rotate: function(degrees) {
			deg += degrees;
		},
		getInfo: function() {
			return {
				x: x,
				y: y,
				rotation: deg
			};
		},
		sonarResults: null
	};
};
