var game = require('./game');
var socketio = require('socket.io');

module.exports = function(server) {
	var io = socketio(server);

	io.on('connection', setEvents);

	function setEvents(socket) {
		socket.on('disconnect', game.disconnected);
		socket.on('queue', () => game.queue(socket));
	}
};
