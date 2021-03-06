var PORT = process.env.port || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') return;

	Object.keys(clientInfo).forEach(function(socketId) {
		if (info.room === clientInfo[socketId].room) {
			users.push(clientInfo[socketId].name);
		}
	});

	socket.emit('message', announce('Current users: ' + users.join(', ')));
};

// returns system message object
function announce(text) {
	return {
		name: 'System',
		text: text,
		timestamp: moment().valueOf()
	}
};

io.on('connection', function(socket) {
	console.log('User conntected via socket.io');

	socket.on('disconnect', function() {
		var userInfo = clientInfo[socket.id];
		if (typeof userInfo !== 'undefined') {
			socket.leave(userInfo.room);
			io.to(userInfo.room).emit('message', {
				name: 'System',
				text: userInfo.name + ' has left',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;

		// socket.io handles joining functionality
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined',
			timestamp: moment().valueOf()
		})
	});

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text );

		switch (message.text) {
			 case '@currentUsers':
				sendCurrentUsers(socket);
				break;
			default:
				io.to(clientInfo[socket.id].room).emit('message', message);	
		};
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the room',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server started \nListening on port ' + PORT);
});