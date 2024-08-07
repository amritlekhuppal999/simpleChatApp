/**
 * USING EXPRESS
 */
import { Server as socketio } from 'socket.io';
import { createServer } from "http";

import app from './config/express.js';  // HOLDS our route
import socketHandler from './config/socket-handler.js';    // GETTING socket instance `io`
/*

    ENTRY/STARTING POINT OF OUR NODE APPLICATION

*/

// GETTING PORT ADDRESS
const PORT = process.env.PORT;      

const httpServer = createServer(app);   // http server instance
const io = new socketio(httpServer);    // Socket instance


// http Server Instance
httpServer.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`);
});


// Socket connection handler
socketHandler(io);


// EXPRESS Instance
// const server = app.listen(PORT, ()=>{
//     console.log(`Server started at PORT ${PORT}`);
// });

// const io = new socketio(server);










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

