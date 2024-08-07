import path from 'path';
import {ROOT_DIR, renderViews} from '../globals.js';
const APP_NAME = process.env.APP_NAME;

// Homepage
function getHomepage(client_request, server_response){
    // let return_view = path.join(ROOT_DIR, 'views', 'index.html');
    let page_data = {
        page: 'index.html',
        page_title: `${APP_NAME} | Home`,
        page_css: [],
        page_scripts: [],
    };
    let return_view = renderViews(page_data);
    server_response.send(return_view);
}

// Chatroom
function getChatroom(client_request, server_response){
    // let return_view = path.join(ROOT_DIR, 'views', 'chatrooms', 'chatroom.html');
    let page_data = {
        page: path.join('chatrooms', 'chatroom.html'),
        page_title: `${APP_NAME} | Chatroom`,
        page_css: [],
        page_scripts: [],
        user_data: client_request.session.user ?  client_request.session.user : false
    };
    let return_view = renderViews(page_data);
    server_response.send(return_view);
}
// Old Chatroom
function getOldChatroom(client_request, server_response){
    let return_view = path.join(ROOT_DIR, 'public', 'chatroom-OLD.html');
    server_response.sendFile(return_view)
}
// OLD Chatroom UI
function getOldChatroomUI(client_request, server_response){
    let return_view = path.join(ROOT_DIR, 'views', 'chatroom-ui-demo.html');
        server_response.sendFile(return_view)
}

// Login Page
function getLoginPage(client_request, server_response){
    let return_view = path.join(ROOT_DIR, 'views', 'login.html');
    server_response.sendFile(return_view)
}

// Register Page
function getRegisterPage(client_request, server_response){
    let return_view = path.join(ROOT_DIR, 'views', 'register.html');
    server_response.sendFile(return_view);

    // let page_data = {
    //     page: path.join('chatrooms', 'chatroom.html'),
    //     page_title: `${APP_NAME} | Chatroom`,
    //     page_css: [],
    //     page_scripts: [],
    //     user_data: client_request.session.user ?  client_request.session.user : false
    // };
    // let return_view = renderViews(page_data);
}

// Recover Password
function getRecoverPasswordPage(client_request, server_response){
    let return_view = path.join(ROOT_DIR, 'views', 'recover-password.html');
    server_response.sendFile(return_view)
}


//
function getAboutMe(client_request, server_response){
    let return_view = path.join(ROOT_DIR, 'views', 'about-me.html');
    server_response.sendFile(return_view);
}

export {
    getHomepage,
    getChatroom, getOldChatroom, getOldChatroomUI,
    getLoginPage, 
    getRegisterPage,
    getRecoverPasswordPage,
    getAboutMe
};

// export default getHomepage;