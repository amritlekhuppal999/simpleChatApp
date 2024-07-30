import path from 'path';
import session from 'express-session';
import {ROOT_DIR, renderViews} from '../globals.js';

const APP_NAME = process.env.APP_NAME;


// Session MiddleWare
const sessionMiddleware = session({
    secret: '#123/*)*&whatyoug0nn@d0', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
    // store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }), // Optional, if using MongoDB
});

// Get route URL
function getURL(req, res, next){
    console.log(`Request URL: ${req.url}`);
    next();
}

// return page 404 Not found
function pageNotFound(client_request, server_response, next){
    let return_view = path.join(ROOT_DIR, 'views', '404.html');
    server_response.status(404).sendFile(return_view);

    // let page_data = {
    //     page: '404.html',
    //     page_title: `${APP_NAME} | 404 Not Found`,
    //     page_css: [],
    //     page_scripts: [],
    // };
    // let return_view = renderViews(page_data);
    // server_response.status(404).send(return_view);
}

export { 
    sessionMiddleware, 
    getURL, 
    pageNotFound 
};