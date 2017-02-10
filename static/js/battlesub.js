var tick = function() {};

(function() {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");
	editor.setValue("tick = function (submarine) {\n\t// Write your code in here\n\t\n};");
	editor.gotoLine(2);

	var windowHeight;

	var $statusBar;
	var socket;
	var isPlaying = false;
	var updater;

	var submarine;

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
	}

	function play() {
		var code = editor.getValue();

		try {
			eval(code);
		}
		catch(e) {
			return setStatus('There is an error on your code. please fix');
		}

		if(isPlaying) {

		} else {
			if(!submarine) submarine = submarineFactory(socket, 250, 150);

			socket.emit('queue');
			setStatus('On queue...');

			if(updater) clearInterval(updater);

			updater = setInterval(function() {
				tick(submarine);
				paint();
			}, 50);
		}
	}

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var subImg = document.getElementById("subImg");

	function paint() {
		ctx.beginPath();
		ctx.rect(0, 0, 600, 400);
		ctx.fillStyle = '#103669';
		ctx.fill();

		var info = submarine.getInfo();
		ctx.translate(info.x, info.y);
		ctx.rotate(Math.PI / 180 * info.rotation);
		ctx.drawImage(subImg , -25, -25);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
})();
