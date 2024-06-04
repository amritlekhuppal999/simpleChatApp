import server from './server.js';
import { Server as socketio } from 'socket.io';

const io = new socketio(server);

// Run when client connects
io.on('connection', socket=>{
    console.log('New WS connection');

    // emits to just the connecting user
    socket.emit('new-connection', {
        message: "Welcome to Chatroom...",
    });

    // Sends message to everyone/Broadcasts to everyone EXCEPT the user that connects
    socket.broadcast.emit('message', {
        message: 'A user has joined the chat.',
        userName: '',
        time: "00:00",
    });

    // broadcast to everybody
    // io.emit();

    // Listen for chat message
    socket.on('chat-message', (message_body)=>{
        // console.log(message_body);
        // io.emit('chat-response', message_body);
        socket.broadcast.emit('chat-response', message_body);
    });

    // Runs when client disconnect
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat.');
    });
});

export default io;