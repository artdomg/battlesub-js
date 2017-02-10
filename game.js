var lodash = require('lodash');

module.exports = function(){
	var waitList = {};

	return {
		disconnected: disconnected,
		queue: queue
	};

	function queue(socket) {
		console.log('Queueing: ', socket.id);
		waitList[socket.id] = socket;
	}

	function disconnected(socket) {
		console.log('Disconnected: ', socket.id);
		if(waitList[socket.id]) {
			delete waitList[socket.id];
		}
	}
}();
