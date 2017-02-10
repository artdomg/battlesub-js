var tick = function() {};

(function() {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");
	editor.setValue([
		'tick = function (submarine) {',
		'\t/*',
		'\tWrite your code in here',
		'\t',
		'\tFunctions available:',
		'\t\tsubmarine.moveForward()',
		'\t\tsubmarine.moveBackwards()',
		'\t\tsubmarine.rotate(degrees)',
		'\t\t\tMax rotation: +-5',
		'\t\tsubmarine.getInfo()',
		'\t\t\tReturns: { x, y, rotation, energy, minX, minY,',
		'\t\t\t\tmaxX, maxY, maxEnergy, collision }',
		'\t\tsubmarine.sonar()',
		'\t\t\tReturns: { distanceToEnemy }',
		'\t*/',
		'\t',
		'\t',
		'};'
	].join('\n'));
	editor.gotoLine(16);

	var windowHeight;

	var $statusBar;
	var socket;
	var isPlaying = false;
	var updater;

	var submarine, enemySubmarine;

	$(document).ready(function() {
		windowHeight = $(window).height();
		$statusBar = $('#statusText');
		resize();

		bindEvents();
		initSocketIO();
	});

	function resize() {
		$('#editor-container').height(windowHeight - 70);
		$('#canvas-container').height(windowHeight - 70);
	}

	function bindEvents() {
		$('#playBtn').click(play);
	}

	function setStatus(status) {
		$statusBar.text(status);
	}

	function initSocketIO() {
		socket = io('//localhost' + location.port ? ':' + location.port : '');
		socket.on('start', startGame);
		socket.on('update', updateEnemy);
		socket.on('disconnect', disconnected);
		socket.on('enemyleft', enemyLeft);
	}

	function enemyLeft() {
		isPlaying = false;
		setStatus('The enemy has left the game!');
	}

	function disconnected() {
		isPlaying = false;
		setStatus('You have been disconnected from the server!');
	}

	function updateEnemy(data) {
		enemySubmarine.update(data);
	}

	function startGame(data) {
		setStatus('Game started!');

		isPlaying = true;

		enemySubmarine = submarineFactory(data.player === 1 ? 2 : 1, true);
		submarine = submarineFactory(data.player, false, enemySubmarine);

		if(updater) clearInterval(updater);

		updater = setInterval(function() {
			if(!isPlaying) return;

			tick(submarine);
			update();
			paint();
		}, 50);
	}

	function play() {
		var code = editor.getValue();

		try {
			eval(code);
		}
		catch(e) {
			return setStatus('There is an error on your code. please fix');
		}

		if(!isPlaying) {
			socket.emit('queue');
			setStatus('In queue...');
		}
	}

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var subImgs = [
		document.getElementById("subImg"),
		document.getElementById("subImg2")
	];

	var lastStatus;

	function update() {
		var currentStatus = submarine.getInfo();

		if(!_.isEqual(currentStatus, lastStatus)) {
			socket.emit('update', {
				x: currentStatus.x,
				y: currentStatus.y,
				rotation: currentStatus.rotation,
				energy: currentStatus.energy
			});
		}

		lastStatus = currentStatus;
	}

	function paint() {
		ctx.beginPath();
		ctx.rect(0, 0, 600, 400);
		ctx.fillStyle = '#103669';
		ctx.fill();

		var info = submarine.getInfo();
		paintEnergyBar(info, 20, 20, 100, 20);

		ctx.beginPath();
		ctx.moveTo(info.x + 18, info.y - 14);
		ctx.lineTo(info.x + 32, info.y - 14);
		ctx.lineTo(info.x + 25, info.y - 3);
		ctx.closePath();
		ctx.fillStyle = "#500";
		ctx.fill();

		paintSubmarine(info);

		info = enemySubmarine.getInfo();
		paintSubmarine(info);
		paintEnergyBar(info, info.x + 5, info.y - 14, 40, 5);
	}

	function paintEnergyBar(info, x, y, w, h) {
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.fillStyle = '#500';
		ctx.fill();
		ctx.beginPath();
		ctx.rect(x, y, info.energy * w / info.maxEnergy, h);
		ctx.fillStyle = '#050';
		ctx.fill();
	}

	function paintSubmarine(info) {
		ctx.translate(info.x + 25, info.y + 25);
		ctx.rotate(Math.PI / 180 * info.rotation);
		ctx.drawImage(subImgs[info.player === 1 ? 0 : 1] , -25, -25);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
})();
