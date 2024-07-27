/**
 * USING EXPRESS
 */
import app from './config/express.js';  // HOLDS our route
import socketHandler from './config/socket-handler.js';    // GETTING socket instance `io`
import { Server as socketio } from 'socket.io';

/*

    ENTRY/STARTING POINT OF OUR NODE APPLICATION

*/

// GETTING PORT ADDRESS
const PORT = process.env.PORT;      

// EXPRESS Instance
const server = app.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`);
});

// Socket instance
const io = new socketio(server);

// Socket connection handler
socketHandler(io);


/////////////////////////////////////////////////----/////////////////////////////////////////////
/////////////////////////////////////////////////----/////////////////////////////////////////////



/**
 * USING HTTP create server
 */

// import server from './config/server.js';
// import io from './config/socket-old.js';
// const PORT = process.env.PORT;

/*

    ENTRY/STARTING POINT OF OUR NODE APPLICATION

*/

// HTTP INSTANCE
// server.listen(PORT, ()=>{
//     console.log(`Server started at PORT ${PORT}`);
// });

