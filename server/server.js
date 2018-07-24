const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user join'));

    socket.on('createMessage', (message, callback) => {
        callback();
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', 
            generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('disconnected')
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
