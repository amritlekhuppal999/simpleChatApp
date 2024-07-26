// import server from './server.js';

import app from './express.js';
import http from 'http';
import { Server as socketio } from 'socket.io';

// Create HTTP server
const httpServer = http.createServer(app);
// Client Socket instance
const io = new socketio(httpServer);


// Run when client connects
io.on('connection', (socket) => {
    console.log('New WS connection');
    const socketId = socket.id;

    // Emits to just the connecting user
    socket.emit('new-connection', {
        message: "Welcome to Chatroom...",
        socket_id: socketId
    });

    // Sends message to everyone except the user that connects
    socket.broadcast.emit('new-user', {
        id: socketId,
        message: 'A user has joined the chat.',
        userName: '',
        time: "00:00",
    });

    // Listen for chat message
    socket.on('chat-message', (messageBody) => {
        // Sends message to everyone except the sender
        socket.broadcast.emit('chat-response', messageBody);
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat.');
    });
});

export default io;

/*
    io is an instance of the entire socket.io circuit/server

    socket is reference to the individual sockets connected. (working on this info)
*/