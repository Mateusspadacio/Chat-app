var socket = io();

socket.on('connect', function () {
    console.log('connected');

    socket.emit('createMessage', {
        from: 'Andrew',
        text: 'Yupp'
    });
});

socket.on('disconnect', function () {
    console.log('disconnected');
});

socket.on('newMessage', function(message) {
    console.log(message);
});