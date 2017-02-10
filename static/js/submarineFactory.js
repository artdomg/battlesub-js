var submarineFactory = function(player, isEnemy, enemySubmarine) {
	var x = player === 1 ? 50 : 500, y = player === 1 ? 50 : 300,
		deg = player === 1 ? 0 : 180, speed = 5,
		lastMovement = new Date().getTime(), lastRotation = new Date().getTime(),
		maxX = 550, maxY = 350, maxEnergy = 1500, energy, collision = false, submarine;

	energy = maxEnergy;

	submarine = {
		moveForward: function() {
			if(canMove()) {
				x += speed * Math.cos(Math.PI / 180 * deg);
				y += speed * Math.sin(Math.PI / 180 * deg);

				lastMovement = new Date().getTime();

				collision = false;
				if(checkPosition()) {
					collision = true;
				}
				else energy--;
			}
		},
		moveBackwards: function() {
			if(canMove()) {
				x -= speed * Math.cos(Math.PI / 180 * deg);
				y -= speed * Math.sin(Math.PI / 180 * deg);

				lastMovement = new Date().getTime();

				collision = false;
				if(checkPosition()) {
					collision = true;
				}
				else energy--;
			}
		},
		rotate: function(degrees) {
			if(canRotate()) {
				degrees = degrees > 5 ? 5 : degrees;
				degrees = degrees < -5 ? -5 : degrees;
				deg += degrees;

				lastRotation = new Date().getTime();
				energy--;
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
				maxEnergy: maxEnergy,
				collision: collision,
				player: player
			};
		},
		sonar: function() {
			if(energy >= 3) {
				energy -= 3;

				var enemyInfo = enemySubmarine.getInfo();

				return {
					distanceToEnemy: Math.sqrt(Math.pow(x - enemyInfo.x, 2) + Math.pow(y - enemyInfo.y, 2)),
					incline: getIncline(x, y, enemyInfo.x, enemyInfo.y)
				};
			}
		}
	};

	if(isEnemy) {
		submarine.update = function(data) {
			x = data.x;
			y = data.y;
			deg = data.rotation;
			energy = data.energy;
		};
	}

	return submarine;

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
		var result = x < 0 || x > maxX || y < 0 || y > maxY;

		x = x < 0 ? 0 : x;
		x = x > maxX ? maxX : x;
		y = y < 0 ? 0 : y;
		y = y > maxY ? maxY : y;

		return result;
	}

	function getIncline(x1, y1, x2, y2) {
		if(x1 === x2) return y1 > y2 ? 270 : 90;
		
		var degrees = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI;
		if(x2 < x1) degrees = 180 + degrees;
		if(x2 > x1) degrees = 360 + degrees;

		return degrees % 360;
	}
};
