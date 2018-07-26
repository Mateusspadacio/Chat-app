var socket = io();

socket.on('connect', function () {
    let params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('no error');
        }
    });
});

socket.on('disconnect', function () {
    console.log('disconnected');
});

socket.on('updateUserList', function (users) {
    let ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

function scrollToBottom() {
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

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
    scrollToBottom();
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
    if (!messageBox.val()) return;

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
