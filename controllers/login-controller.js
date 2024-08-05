import path from 'path';
import { MongoClient } from 'mongodb';

import {ROOT_DIR, database_name, DB_CONNECTION_STRING} from '../globals.js';




// Login Controller for users
async function userLogin(client_request, server_response){
    console.log(client_request.body);

    // server_response.send(`Email: ${client_request.body.userEmail}`);

    // Establishes connection... well sort of
    const client = new MongoClient(DB_CONNECTION_STRING);

    try{
        await client.connect();

        const user_detail = await ifUserExists(client_request.body, client);
        if(!user_detail){
            console.log("Incorrect Username or Password.");    
            server_response.redirect('login?err_msg=Incorrect Username or Password.');
            return false;
        }

        // set session
        client_request.session.user = {
            _id: null,
            name: user_detail.userFullName,
            username: user_detail.userEmail,
            email: user_detail.userEmail,
            socket_id: null
        };

        server_response.redirect('home');

    }
    catch (error){
        console.error(error, "User was unable to login");
        server_response.redirect('login?err_msg=Something went Wrong. Try again later.');
    }
    finally{
        client.close();
    }

    // let return_view = path.join(ROOT_DIR, 'views', 'index.html');
    // server_response.redirect('home')
}

// A dummy Login Controller
function dummyLogin(client_request, server_response){
    client_request.session.user = {
        user_id: 11,
        name: 'ALU',
        email: 'amr@gm.com'
    }
    
    let return_view = path.join(ROOT_DIR, 'views', 'index.html');
    server_response.redirect('home')
}


// check if user exists then return the collection record
async function ifUserExists(userCred, mongo_client){

    const database = mongo_client.db(database_name);
    const collection_users = database.collection("users");

    const query = {
        username: userCred.userEmail,
        password: userCred.userPassword
    };

    // options.. not needed herer

    const user = await collection_users.findOne(query);
    const docCount = await collection_users.countDocuments(query);
    return user;
}

export {
    userLogin,
    dummyLogin
};