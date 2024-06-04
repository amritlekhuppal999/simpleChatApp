//ES6 method
import http from 'http';
import fs from 'fs/promises';
import path from 'path';


// const BASEDIR = require('../index'); // default nodejs method
import {ROOT_DIR, return_page_views} from '../backend-globals.js';
import { setTimeout } from 'timers/promises';



const server = http.createServer( async(client_request, server_response) =>{
    // console.log(client_request.url);
    // console.log(client_request.method);

    let return_page;
    // let requested_page_str = client_request.url;
    let requested_page_array = return_page_views(client_request.url);
    let page_view_1 = requested_page_array[0];

    let status_code = 200;
    let contentType = "text/html";
    
    let errorMsg = "";

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'application/font-woff',
        '.woff2': 'application/font-woff2',
        '.ttf': 'application/font-sfnt',
    };

    // Empty Page Array
    if(requested_page_array.length == 0){
        return_page = path.join(ROOT_DIR, 'views', 'index.html');
    }
    // Non Empty Page array
    else{
        // HOMEPAGE
        if(page_view_1 == "home" || page_view_1 == ""){
            return_page = path.join(ROOT_DIR, 'views', 'index.html');
        }
        
        // CHATROOM
        else if(page_view_1 == "chatroom"){
            return_page = path.join(ROOT_DIR, 'views', 'chatroom.html');
        }

        // CHATROOM UI DEMO
        else if(page_view_1 == "chatroom-ui-demo"){
            return_page = path.join(ROOT_DIR, 'views', 'chatroom-ui-demo.html');
        }

        // CONTROLLERS
        else if(page_view_1 == "controllers"){
            let page_view_2 = requested_page_array[1];
            contentType = "application/javascript";
            
            // chatroom.js
            if(page_view_2 == 'chatroom.js'){
                return_page = path.join(ROOT_DIR, 'controllers', 'chatroom.js');
                // serverPage(serve_data);
            }

            // 404 
            else {
                return_page = path.join(ROOT_DIR, 'views', '404.html');
                status_code = 404;
                console.log("Controller Error!!", "Requested CONTROLLER file '"+page_view_2+"' not found!");
            }
        }

        // PUBLIC RESOURCE
        else if(page_view_1 == "public"){
            let page_view_2 = requested_page_array[1];
            let page_view_3 = requested_page_array[2];
            
            return_page = path.join(ROOT_DIR, page_view_1, page_view_2, page_view_3);
            const extname = String(path.extname(return_page)).toLowerCase();
            contentType = mimeTypes[extname] || 'application/octet-stream';
        }
        
        // 404 Page Not Found
        else {
            return_page = path.join(ROOT_DIR, 'views', '404.html');
            status_code = 404;

            console.log("Routing Error!!", "Requested page '"+page_view_1+"' not found!");
        }
    }

    // ASYNC PROMISE, Read File
    try{
        const data = await fs.readFile(return_page);
        server_response.setHeader('Content-Type', contentType);
        server_response.statusCode = status_code;
        server_response.write(data);
        server_response.end();
    }
    catch(error){
        console.error("Something Went Wrong\n", error);
        
        if(server_response){
            server_response.setHeader('Content-Type', 'text/plain');
            server_response.statusCode = 500;
            server_response.end("Internal Server Error");
        }
    }
    // console.log(page_view_1)
    
    // server_response.setHeader('Content-Type', 'text/html');
    // server_response.statusCode = 200;
    // all of it can be done in one line using writeHead() method

    // server_response.writeHead(200, {'Content-Type': 'text/html'});
    // server_response.end('<h1>Hey There</h1>');  // ends the stream and returns data to client
});

// server.listen(PORT, ()=>{
//     console.log(`Server started at PORT ${PORT}`);
// });

export default server;


