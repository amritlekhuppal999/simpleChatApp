import path from 'path';
import {ROOT_DIR} from '../globals.js';

function dummyLogin(client_request, server_response){
    client_request.session.user = {
        user_id: 11,
        name: 'ALU',
        email: 'amr@gm.com'
    }
    
    let return_view = path.join(ROOT_DIR, 'views', 'index.html');
    server_response.redirect('home')
}

export {
    dummyLogin
};