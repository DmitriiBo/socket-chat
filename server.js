const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const formatMessage = require('./utils/formatMessage');
const {getCurrentUserById, joinNewUser, leaveUser, getUsersByRoom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const happyChatBot = 'Happy Chat Bot';

io.on('connection', (socket) => {
    socket.on('joinChatRoom', ({username, room}) => {
        const user = joinNewUser(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(happyChatBot, `Hi, ${user.username}! Good to see ya at ${user.room}-room`));

        socket.broadcast.to(user.room).emit('message', formatMessage(happyChatBot, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersByRoom(user.room),
        })
    })

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUserById(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    socket.on('disconnect', () => {
        const leavedUser = leaveUser(socket.id);

        if (leavedUser) {
            io.to(leavedUser.room).emit('message', formatMessage(happyChatBot, `${leavedUser.username} has disconnected the chat`))

            io.to(leavedUser.room).emit('roomUsers', {
                room: leavedUser.room,
                users: getUsersByRoom(leavedUser.room),
            })
        }
    })
})

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000 || process.env.PORT;

server.listen(PORT, console.log(`Server running at ${PORT}`));
