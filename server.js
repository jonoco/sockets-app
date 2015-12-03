var PORT = process.env.port || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	console.log('User conntected via socket.io');

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text );

		io.emit('message', message);
	});

	socket.emit('message', {
		text: 'Welcome to the room'
	});
});

http.listen(PORT, function() {
	console.log('Server started \nListening on port ' + PORT);
});