import express from 'express';
import path from 'path';
import {ROOT_DIR, renderViews} from '../backend-globals.js';
import {getHomepage, getChatroom, getOldChatroom, getOldChatroomUI, getLoginPage, getRegisterPage, getRecoverPasswordPage} from './route-handler.js';
import { setTimeout } from 'timers/promises';

const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;
const app = express();

// console.log(app)

// SET STATIC FOLDER using a MIDDLEWARE
app.use(express.static(path.join(ROOT_DIR, 'public')));

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});


// VIEWS

    // HOME
    app.get('/', getHomepage);
    app.get('/home', getHomepage);

    //Chatroom
    app.get('/chatroom', getChatroom);
    app.get('/chatroom-old', getOldChatroom);
    app.get('/chatroom-ui-demo', getOldChatroomUI);

    // Login Page
    app.get('/login', getLoginPage);
    app.get('/register', getRegisterPage);
    app.get('/forgot-password', getRecoverPasswordPage);

// VIEWS END

// CONTROLLERS
    app.get('/controllers', (client_request, server_response)=>{
        let return_view = path.join(ROOT_DIR, 'views', 'login.html');
        server_response.sendFile(return_view)
    });
// CONTROLLERS



// More MIDDLEWARES
    
    // Add a 404 middleware at the end of all route definitions
    app.use((client_request, server_response, next) => {
        let return_view = path.join(ROOT_DIR, 'views', '404.html');
        server_response.status(404).sendFile(return_view);
    });

// More MIDDLEWARES END

export default app;



// app.listen(PORT, ()=>{
//     console.log('Express started on port', PORT);
// });

// app.get('/', (client_request, server_response)=>{
//     let return_view = path.join(ROOT_DIR, 'views', 'index.html');
//     server_response.sendFile(return_view);
// });