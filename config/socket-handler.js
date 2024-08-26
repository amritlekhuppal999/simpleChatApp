import { sessionMiddleware } from "./middlewares.js";
import { currentTime } from "../globals.js";

export default function socketHandler(io){

    // IO middleware injected with session middleware
    io.engine.use(sessionMiddleware);

    const USER_DATA = {
        name: '',
        username: '',
        user_id: '',
        user_email: '',
        user_img: '',

        metaData:{
            socket_id: '',
            device: '',
            connection_timestamp: '',
            sessionExpiry: '',
            connection_message: ''
        }
    };
    
    let users = [];
    let inRoomUsers = [];

    // Run when client connects
    io.on('connection', (socket) => {
        // socket: its the individual socket
        
        let sessions = socket.request.session;  // access the express session data 
        console.log('Session Id:', socket.handshake.query.sessionId);

        // check if the user is active
        if(!sessions.user){
            console.log('Session Expired...');
            socket.emit('sessionExpired', 'Your session has expired. Disconnecting...');
            socket.disconnect(true); // Disconnect the socket
            return false;
        }

        console.log('New WS connection');
        const socketId = socket.id;

        let CHAT_ROOM_NAME = null;

        // initialization data
        USER_DATA.user_id = null;
        USER_DATA.username = sessions.user.name;
        USER_DATA.user_email = sessions.user.email;
        USER_DATA.device = '';
        
        USER_DATA.metaData.sessionExpiry = sessions.cookie.expires;

        // console.log('user array:', users);
        // console.log('sessions:', sessions);

        // these will update as new users connect, so we don't need to redefine them over and over
        USER_DATA.metaData.socket_id = socketId;
        USER_DATA.metaData.connection_timestamp = currentTime();

        // User Table to manage active users
        users[socketId] = USER_DATA;

        
        // We just need to update the info message part, for guest and self connection.
    
        // Emits to just the connecting user (Connection from your POV) //socket.emit('new-connection')
        USER_DATA.metaData.connection_message = `Welcome to Chatroom ${USER_DATA.username}`;
        socket.emit('new-connection', USER_DATA);
    
        // Sends message to everyone except the user that connects (When OTHERS connect from your POV)
        USER_DATA.metaData.connection_message = `${USER_DATA.username} has joined the chat.`;
        socket.broadcast.emit('new-user', USER_DATA);

        // get chatroom data from 
        // socket.on('chatroomData', CHAT_ROOM_DATA=>{
        //     CHAT_ROOM_NAME = CHAT_ROOM_DATA.room_name;
        //     console.log(`User joined ${CHAT_ROOM_NAME}`);
        // });

        // Join a specific Chatroom
        socket.on('joinRoom', CHAT_ROOM_NAME=>{
            socket.join(CHAT_ROOM_NAME);
            
            // returns socket ids of users in a given chatroom
            inRoomUsers = io.sockets.adapter.rooms.get(CHAT_ROOM_NAME);
            console.log("Chatroom Users: ", inRoomUsers);
            
            console.log(`User joined ${CHAT_ROOM_NAME}`);
            socket.to(CHAT_ROOM_NAME).emit('joinedRoom', CHAT_ROOM_NAME);
        });

        // Leave a specific chatroom
        socket.on('leaveRoom', (CHAT_ROOM_NAME) => {
            console.log(`User left: ${CHAT_ROOM_NAME}`);
            socket.to(CHAT_ROOM_NAME).emit('leftRoom', CHAT_ROOM_NAME); // Optionally, send confirmation to client
            socket.to(CHAT_ROOM_NAME).emit('getActiveUsers', getUserDetails(inRoomUsers));
            socket.leave(CHAT_ROOM_NAME);
        });

        // active chatroom users
        socket.on('fetchActiveUsers', (CHAT_ROOM_NAME) => {
            console.log(`User left: ${CHAT_ROOM_NAME}`);
            socket.to(CHAT_ROOM_NAME).emit('getActiveUsers', getUserDetails(inRoomUsers)); 
        });
    
        // Listen for chat message
        socket.on('chat-message', (messageBody) => {
            // Sends message to everyone except the sender
            // socket.broadcast.emit('chat-response', messageBody);
            socket.to(messageBody.room_name).emit('chat-response', messageBody);
        });
    
        // Runs when client disconnects
        socket.on('disconnect', () => {
            // console.log(`${USER_DATA.username} has disconnected`);

            io.emit('disconnect-message', {
                user_data: USER_DATA,
                message: `User ${USER_DATA.username} has left the chat.`
            });

            let index = users.indexOf(USER_DATA.metaData.socket_id);
            if (index !== -1) {
                users.splice(index, 1);
            }
            // console.log(users)
        });
    });

    function getUserDetails(inRoomUsers){
        let inRoomUserDetails = [];
        inRoomUsers.forEach( (element, index)=> {
            inRoomUserDetails.push(users[element]);
        });

        return inRoomUserDetails;
    }
}

/*
    io is an instance of the entire socket.io circuit/server

    socket is reference to the individual sockets connected. (working on this info)
*/



    