import { sessionMiddleware } from "../middlewares.js";
import { currentTime } from "../../globals.js";

/*
    This connection 
*/ 

function privateChatSocket(privateChat_io){

    let active_users = [];
    let active_user_socket_list = [];

    privateChat_io.on('connection', (socket)=>{
        

        let sessions = socket.request.session;

        // check if the user is active
        if(!sessions.user){
            console.log('Session Expired...');
            socket.emit('sessionExpired', 'Your session has expired. Disconnecting...');
            socket.disconnect(true); // Disconnect the socket
            return false;
        }

        console.log(`${sessions.user.name} is Online`);
        
        const socketId = socket.id;

        active_users[socketId] = sessions.user;
        active_user_socket_list[sessions.user.user_id] = socketId;


        // User Sent's a message
        socket.on("chat-message", (messageBody)=>{
            let socket_id = active_user_socket_list[messageBody.to.id];
            privateChat_io.to(socket_id).emit('chat-response', messageBody);
            console.log(messageBody);
        });


        // DISCONNECT
        socket.on('disconnect', () => {
            console.log(`${sessions.user.name} has disconnected`);

            privateChat_io.emit('disconnect-message', {
                // user_data: USER_DATA,
                // message: `User ${USER_DATA.username} has left the chat.`
            });

            // let index = active_users.indexOf(USER_DATA.metaData.socket_id);
            // if (index !== -1) {
            //     active_users.splice(index, 1);
            // }
            active_users.splice(socketId, 1);
            // console.log(active_users)
        });
    });
}

export{
    privateChatSocket
};