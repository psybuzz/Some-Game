var io = require('socket.io').listen(8000);
io.set('log level', 1);
console.log('Server started. Listening on port 8000.');


var users = [];
var userQueue = new updateQueue(users);

io.sockets.on('connection', function (socket) {
	userQueue.add(socket);
	userQueue.update();

	console.log("\n**********\nNow, users:", users.map(function(u){return u.id}));

	// tell others about my birthday
	// broadcast this socket's data to all other sockets
	// AND tell me about the others in the room
	var other;
	for (var i=0, len=users.length; i<len; i++){
		other = users[i];
		if (socket.id !== other.id){
			other.emit('news', {id: socket.id, data: null, created: true});
			socket.emit('news', {id: other.id, data: null, created: true});	// should have data: other.data
		}
	}




	
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(socket.id, data);
		if (typeof data['x'] === 'undefined'){
			return;
		}

		// broadcast this socket's data to all other sockets
		var other;
		for (var i=0, len=users.length; i<len; i++){
			other = users[i];
			if (socket.id !== other.id){
				other.emit('news', {id: socket.id, data: data, created: false});
			}
		}
	});
	socket.on('disconnect', function(data) {
		console.log(socket.id + "has DISCONNECTED.");

		userQueue.remove(socket);
		userQueue.update();

		console.log("\n**********\nNow, users:", users.map(function(u){return u.id}));
	});
});




// An attempt to avoid synchronization problems
// when we need to delete multiple IDs at the same time
function updateQueue(dataArray) {
	this.ADD = 0;
	this.DELETE = 1;
	this.queue = [];
	this.locked = false;
	this.dataArray = dataArray;

	this.update = function () {
		// get lock if free
		this.locked = (this.locked === false) ? true : false;
		if (this.locked === false){
			return;
		}

		// lock is acquired
		var pair;
		while (this.queue.length > 0){
			pair = this.queue.shift();
			if (pair[1] === this.ADD){
				this.dataArray.push(pair[0]);
			} else if (pair[1] === this.DELETE){
				this.dataArray.splice( this.dataArray.indexOf(pair[0]), 1 );
			}
		}

		// free lock
		this.locked = false;
	};
	this.add = function (id) {
		this.queue.push([id, this.ADD]);
	};
	this.remove = function (id) {
		this.queue.push([id, this.DELETE]);
	};
};