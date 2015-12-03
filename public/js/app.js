var socket = io();
var now = moment();

var room = getQueryVariable('room') || 'Anonymous';
var name = getQueryVariable('name');
console.log(room, name);

// set room name
$('.room-title').text(room);
 
socket.on('connect', function() {
	console.log('Connected to socket.io server');

	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message) {
	console.log(message.text, message.timestamp);
	var $messages = $('.messages');
	var timestamp = message.timestamp ? moment(message.timestamp).local().format('h:mma') : '';

	var messageName = '<span class="name">'+message.name+'</span>';
	var messageTime = '<span class="time">'+timestamp+'</span>'; 
	var messageText = '<p class="text">'+message.text+'</p>';
	$messages.append('<div class="message">'+messageName+messageTime+messageText+'</div>');
});

// handles submitting new message
var $form = $('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	var timestamp = moment().valueOf();

	socket.emit('message', {
		name: name,
		text: $message.val(),
		timestamp: timestamp
	});

	$message.val('');
});