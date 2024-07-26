/**
 * USING EXPRESS
 */
import app from './config/express.js';  // HOLDS our route
import io from './config/socket.js';    // GETTING socket instance `io`
const PORT = process.env.PORT;      // GETTING PORT ADDRESS

/*

    ENTRY/STARTING POINT OF OUR NODE APPLICATION

*/


// EXPRESS Instance
app.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`);
});


///////////////////////////////////////////////// 
////////////////////----/////////////////////////
/////////////////////////////////////////////////



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

