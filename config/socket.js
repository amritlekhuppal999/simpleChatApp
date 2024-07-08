import server from './server.js';
import { Server as socketio } from 'socket.io';

const io = new socketio(server);

// Run when client connects
io.on('connection', socket=>{
    console.log('New WS connection');
    let socket_id = socket.id;

    // emits to just the connecting user
    socket.emit('new-connection', {
        message: "Welcome to Chatroom...",
        socket_id: socket_id
    });

    // Sends message to everyone/Broadcasts to everyone EXCEPT the user that connects
    socket.broadcast.emit('new-user', {
        id: socket_id,
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





/*
    io is an instance of the entire socket.io circuit/server

    socket is reference to the individual sockets connected. (working on this info)
*/