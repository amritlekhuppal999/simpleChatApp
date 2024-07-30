import { sessionMiddleware } from "./middlewares.js";
import { currentTime } from "../globals.js";


export default function socketHandler(io){

    // IO middleware injected with session middleware
    io.engine.use(sessionMiddleware);
    

    // Run when client connects
    io.on('connection', (socket) => {
        console.log('New WS connection');
        let sessions = socket.request.session;

        const socketId = socket.id;
        const user_id = sessions.user.user_id ? sessions.user.user_id : 11;
        const userName = sessions.user.name ? sessions.user.name : 'ALU';
        const email = sessions.user.email ? sessions.user.email : 'amr@gmail.com';
        const device = '';

        // access the express session data 
        // console.log(socket.request.session)
        // console.log(sessions.user)
    
        // Emits to just the connecting user
        socket.emit('new-connection', {
            message: `Welcome to Chatroom ${userName}`,
            socket_id: socketId
        });
    
        // Sends message to everyone except the user that connects
        socket.broadcast.emit('new-user', {
            id: socketId,
            message: `${userName} has joined the chat.`,
            userName: userName,
            time: currentTime(),
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
}

/*
    io is an instance of the entire socket.io circuit/server

    socket is reference to the individual sockets connected. (working on this info)
*/