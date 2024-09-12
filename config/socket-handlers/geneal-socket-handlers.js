import { sessionMiddleware } from "../middlewares.js";
import { currentTime } from "../../globals.js";

/*
    This connection 
*/ 

function generalConnectionSocket(general_connection_io){


    general_connection_io.on('connection', (socket)=>{
        

        let sessions = socket.request.session;

        // check if the user is active
        if(!sessions.user){
            console.log('Session Expired...');
            socket.emit('sessionExpired', 'Your session has expired. Disconnecting...');
            socket.disconnect(true); // Disconnect the socket
            return false;
        }

        console.log('New WS connection');
        const socketId = socket.id;
    });
}