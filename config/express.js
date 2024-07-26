import express from 'express';
import path from 'path';
import {ROOT_DIR, renderViews, return_page_views} from '../backend-globals.js';
import { setTimeout } from 'timers/promises';


const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;
const app = express();




// SET STATIC FOLDER using a MIDDLEWARE
app.use(express.static(path.join(ROOT_DIR, 'public')));


// NODE MODULES 

    // SOCKET.IO MODULE    
    app.get('/socket.io/socket.io.js', (client_request, server_response)=>{
        let return_module = path.join(ROOT_DIR, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js');
        server_response.sendFile(return_module)
    });

    
// NODE MODULES END

// VIEWS

    // HOME
    app.get('/', (client_request, server_response)=>{
        // let return_view = path.join(ROOT_DIR, 'views', 'index.html');
        let page_data = {
            page: 'index.html',
            page_title: `${APP_NAME} | Home`,
            page_css: [],
            page_scripts: [],
        };
        let return_view = renderViews(page_data);
        server_response.send(return_view);
    });
    app.get('/home', (client_request, server_response)=>{
        // let return_view = path.join(ROOT_DIR, 'views', 'index.html');
        let page_data = {
            page: 'index.html',
            page_title: `${APP_NAME} | Home`,
            page_css: [],
            page_scripts: [],
        };
        let return_view = renderViews(page_data);
        server_response.send(return_view);
    });

    //Chatroom
    app.get('/chatroom', (client_request, server_response)=>{
        // let return_view = path.join(ROOT_DIR, 'views', 'chatrooms', 'chatroom.html');
        let page_data = {
            page: path.join('chatrooms', 'chatroom.html'),
            page_title: `${APP_NAME} | Chatroom`,
            page_css: [],
            page_scripts: [],
        };
        let return_view = renderViews(page_data);
        server_response.send(return_view)
    });
    app.get('/chatroom-old', (client_request, server_response)=>{
        let return_view = path.join(ROOT_DIR, 'views', 'chatroom-old.html');
        server_response.sendFile(return_view)
    });
    app.get('/chatroom-ui-demo', (client_request, server_response)=>{
        let return_view = path.join(ROOT_DIR, 'views', 'chatroom-ui-demo.html');
        server_response.sendFile(return_view)
    });

    // Login Page
    app.get('/login', (client_request, server_response)=>{
        let return_view = path.join(ROOT_DIR, 'views', 'login.html');
        server_response.sendFile(return_view)
    });

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