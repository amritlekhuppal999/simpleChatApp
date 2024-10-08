import { sessionMiddleware } from "./middlewares.js";
import { currentTime } from "../globals.js";

export default function socketHandler(io){

    // IO middleware injected with session middleware
    io.engine.use(sessionMiddleware);

    // Session Expired Middleware
    // io.use((socket, next)=>{
    //     let sessions = socket.request.session;
        
    //     if(sessions.user){
    //         next();
    //     }
    //     else console.log("Session Expired!!");
    // });

    let initialization_data = {
        userInfo: {
            user_id: '',
            userName: '',
            profileImg:'',
            email: '',
        },

        metaData:{
            socket_id: '',
            device: '',
            connection_timestamp: '',
            sessionExpiry: '',
            connection_message: ''
        }
    };    
    
    let users = [];

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

        // check if the user is active (USING EVENTS)
        // socket.on('checkSession', ()=>{
        //     if(!sessions.user){
        //         console.log('Session Expired...');
        //         socket.emit('sessionExpired', 'Your session has expired. Disconnecting...');
        //         socket.disconnect(true); // Disconnect the socket
        //         return false;    
        //     }
        // }); 

        console.log('New WS connection');
        const socketId = socket.id;

        // initialization data
        initialization_data.userInfo.user_id = null;
        initialization_data.userInfo.userName = sessions.user.name ? sessions.user.name : 'jgfgh';
        initialization_data.userInfo.email = sessions.user.email ? sessions.user.email : 'uydbh@gmail767.com';
        initialization_data.userInfo.device = '';
        
        initialization_data.metaData.sessionExpiry = sessions.cookie.expires;

        // User Table to manage active users
        users[socketId] = sessions.user;

        // console.log('user array:', users);
        // console.log('sessions:', sessions);

        // these will update as new users connect, so we don't need to redefine them over and over
        initialization_data.metaData.socket_id = socketId;
        initialization_data.metaData.connection_timestamp = currentTime();

        
        // We just need to update the info message part, for guest and self connection.
    
        // Emits to just the connecting user (Connection from your POV) //socket.emit('new-connection')
        initialization_data.metaData.connection_message = `Welcome to Chatroom ${initialization_data.userInfo.userName}`;
        socket.emit('new-connection', initialization_data);
    
        // Sends message to everyone except the user that connects (When OTHERS connect from your POV)
        initialization_data.metaData.connection_message = `${initialization_data.userInfo.userName} has joined the chat.`;
        socket.broadcast.emit('new-user', initialization_data);


        // Join a specific Chatroom
        socket.on('joinRoom', CHAT_ROOM_NAME=>{
            socket.join(CHAT_ROOM_NAME);
            console.log(`User joined ${CHAT_ROOM_NAME}`);
            socket.emit('joinedRoom', CHAT_ROOM_NAME);
        });

        // Leave a specific chatroom
        socket.on('leaveRoom', (CHAT_ROOM_NAME) => {
            socket.leave(CHAT_ROOM_NAME);
            console.log(`User left: ${CHAT_ROOM_NAME}`);
            socket.emit('leftRoom', CHAT_ROOM_NAME); // Optionally, send confirmation to client
        });

    
        // Listen for chat message
        socket.on('chat-message', (messageBody) => {
            // Sends message to everyone except the sender
            socket.broadcast.emit('chat-response', messageBody);
        });
    
        // Runs when client disconnects
        socket.on('disconnect', () => {
            // console.log(`${initialization_data.userInfo.userName} has disconnected`);

            io.emit('disconnect-message', {
                user_data: initialization_data,
                message: `User ${initialization_data.userInfo.userName} has left the chat.`
            });

            let index = users.indexOf(initialization_data.metaData.socket_id);
            if (index !== -1) {
                users.splice(index, 1);
            }
            // console.log(users)
        });
    });
}

/*
    io is an instance of the entire socket.io circuit/server

    socket is reference to the individual sockets connected. (working on this info)
*/



    function user_init_data(){
        let initialization_data = {
            userInfo: {
                user_id: '',
                userName: '',
                profileImg:'',
                email: '',
            },
    
            metaData:{
                socket_id: '',
                device: '',
                connection_timestamp: '',
                connection_message: ''
            }
        };

        return initialization_data;
    }