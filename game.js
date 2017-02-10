var _ = require('lodash');

module.exports = function(){
	var waitList = {};
	var players = {};

	return {
		disconnected: disconnected,
		queue: queue,
		update: update
	};

	function queue(socket) {
		if(_.size(waitList)) {
			var player = _.sample(waitList);
			delete waitList[player.id];
			startGame(player, socket);
		} else {
			console.log('Queueing: ', socket.id);
			waitList[socket.id] = socket;
		}
	}

	function update(socket, data) {
		var player = players[socket.id];
		if(!player) return;

		player.enemy.emit('update', data);
	}

	function disconnected(socket) {
		console.log('Disconnected: ', socket.id);

		if(waitList[socket.id]) {
			delete waitList[socket.id];
		} else if(players[socket.id]) {
			var player = players[socket.id];
			player.enemy.emit('enemyleft');
			delete players[player.id];
			delete players[player.enemy.id];
		}
	}

	function startGame(p1, p2) {
		console.log('Starting game: ', p1.id, p2.id);
		players[p1.id] = p1;
		players[p2.id] = p2;
		p1.enemy = p2;
		p2.enemy = p1;
		p1.emit('start', { player: 1 });
		p2.emit('start', { player: 2 });
	}
}();
