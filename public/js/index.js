var socket = io();

socket.on('connect', function () {
    console.log('connected');
});

socket.on('disconnect', function () {
    console.log('disconnected');
});

function generateNewMessage(message, templateId) {
    let formattedTime = moment(message.createdAt).format('hh:mm');
    let template = jQuery('#' + templateId).html();
    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
}

socket.on('newMessage', function (message) {
    generateNewMessage(message, 'message-template');
});

socket.on('newLocationMessage', function (message) {
    message.text = 'My current location';
    generateNewMessage(message, 'location-message-template');
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    let messageBox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageBox.val()
    }, function () {
        messageBox.val("");
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Sending location');;
    }, function () {
        locationButton.removeAttr('disabled').text('Sending location');;
        alert('Error');
    });
});
