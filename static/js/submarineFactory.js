var submarineFactory = function(sock, px, py) {
	var x = px, y = py, deg = 0, socket = sock, speed = 5,
		lastMovement = new Date().getTime(), lastRotation = new Date().getTime(),
		maxX = 550, maxY = 350, maxEnergy = 2000, energy;

	energy = maxEnergy;

	return {
		moveForward: function() {
			if(canMove()) {
				x += speed * Math.cos(Math.PI / 180 * deg);
				y += speed * Math.sin(Math.PI / 180 * deg);

				lastMovement = new Date().getTime();
				energy--;
				checkPosition();
			}
		},
		moveBackwards: function() {
			if(canMove()) {
				x -= speed * Math.cos(Math.PI / 180 * deg);
				y -= speed * Math.sin(Math.PI / 180 * deg);

				lastMovement = new Date().getTime();
				energy--;
				checkPosition();
			}
		},
		rotate: function(degrees) {
			if(canRotate()) {
				degrees = degrees > 5 ? 5 : degrees;
				degrees = degrees < -5 ? -5 : degrees;
				deg += degrees;

				lastRotation = new Date().getTime();
			}
		},
		getInfo: function() {
			return {
				x: x,
				y: y,
				rotation: deg,
				energy: energy,
				minX: 0,
				minY: 0,
				maxX: maxX,
				maxY: maxY,
				maxEnergy: maxEnergy
			};
		},
		sonar: function() {

		},
		sonarResults: null
	};

	function canRotate() {
		return getElapsedTime(lastRotation) > 40 && energy > 0;
	}

	function canMove() {
		return getElapsedTime(lastMovement) > 40 && energy > 0;
	}

	function getElapsedTime(lastTime) {
		return new Date().getTime() - lastTime;
	}

	function checkPosition() {
		x = x < 0 ? 0 : x;
		x = x > maxX ? maxX : x;
		y = y < 0 ? 0 : y;
		y = y > maxY ? maxY : y;
	}
};
