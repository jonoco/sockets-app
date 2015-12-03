var socket = io();
var now = moment();

socket.on('connect', function() {
	console.log('Connected to socket.io server');
});

socket.on('message', function(message) {
	console.log(message.text, message.timestamp);

	var timestamp = message.timestamp ? moment(message.timestamp).local().format('h:mm') : '';

	$('.messages').append('<p>'+message.text+'<span class="timestamp">'+timestamp+'</span>'+'</p>');
});

// handles submitting new message
var $form = $('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	var timestamp = moment().valueOf();

	socket.emit('message', {
		text: $message.val(),
		timestamp: timestamp
	});

	$message.val('');
});