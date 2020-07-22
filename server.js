const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    socket.emit('message', 'Hello new user!');

    socket.broadcast.emit('message', 'A new user has joined the chat');

    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has disconnected the chat');
    })
})

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000 || process.env.PORT;

server.listen(PORT, console.log(`Server running at ${PORT}`) );
