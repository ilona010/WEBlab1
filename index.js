var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var formatMessage = require('./utils/messages'); //метод для форматування повідомлень
var { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users'); //методи для роботи з користувачами

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('A user connected');
    
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage('Admin', 'Welcome to the chat!'));

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage('Admin', `${user.username} has joined the chat`));

        // Надсилання списку користувачів і кімнати
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Від'єднання користувача
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage('Admin', `${user.username} has left the chat`)
            );

            // Оновлення списку користувачів в кімнаті
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

server.listen(3000, function() {
    console.log('listening on *:3000');
});

