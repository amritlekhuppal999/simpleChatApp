/**
 * USING EXPRESS
 */
import { Server as socketio } from 'socket.io';
import { createServer } from "http";

import app from './config/express.js';  // HOLDS our route
import { sessionMiddleware } from "./config/middlewares.js";

import {chatroomSocketHandler} from './config/socket-handlers/chatroom-socket-handler.js';    // GETTING socket instance `io`
import {privateChatSocket} from './config/socket-handlers/privateChat-socket-handler.js';    // GETTING socket instance `io`

/*

    ENTRY/STARTING POINT OF OUR NODE APPLICATION

*/

// GETTING PORT ADDRESS
const PORT = process.env.PORT;      

const httpServer = createServer(app);   // http server instance
const io = new socketio(httpServer);    // Socket instance

// io.use((socket, next) => {
//     sessionMiddleware(socket.request, {}, next);
// });

io.of("/chatroom").use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.of("/privateChat").use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// http Server Instance
httpServer.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`);
});

const general_connection_io = io.of('/general');
const notification_io = io.of('/notification');
const chatroom_io = io.of('/chatroom');
const privateChat_io = io.of('/privateChat');

// Socket connection handler
chatroomSocketHandler(chatroom_io);

privateChatSocket(privateChat_io);


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

