import server from './config/server.js';
import io from './config/socket.js';
const PORT = process.env.PORT;



/*

    ENTRY/STARTING POINT OF OUR NODE APPLICATION

*/


server.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`);
});