

export default function socketHandler(io){

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
    
        // socket.on('chat-response', (messageBody) => {
        //     // Sends message to everyone except the sender
        //     socket.broadcast.emit('chat-response', messageBody);
        // });
    
        // Runs when client disconnects
        socket.on('disconnect', () => {
            io.emit('message', 'A user has left the chat.');
        });
    });
}

/*
    io is an instance of the entire socket.io circuit/server

    socket is reference to the individual sockets connected. (working on this info)
*/