import path from 'path';
import { MongoClient } from 'mongodb';

import {
    ROOT_DIR, database_name, 
    DB_CONNECTION_STRING, checkHashedPassword
} from '../globals.js';




// Login Controller for users
async function userLogin(client_request, server_response){
    // console.log(client_request.body);

    // Establishes connection... well sort of
    const client = new MongoClient(DB_CONNECTION_STRING);

    let {userEmail, userPassword} = client_request.body;

    try{
        await client.connect();

        // check if user exists
        const user_detail = await ifUserExists(userEmail, client);
        if(!user_detail){
            console.log("No such user exist");    
            server_response.redirect('login?err_msg=Incorrect Username or Password.');
            return false;
        }

        // console.log(user_detail)
        // console.log(user_detail._id.toString())

        let saved_password = user_detail.password;  // saved password
        const password_match = await checkHashedPassword(userPassword, saved_password);   // boolean(true/false) on password match        

        // check value if password matches
        if(!password_match){
            console.log("Incorrect Username or Password.");    
            server_response.redirect('login?err_msg=Incorrect Username or Password.');
            return false;
        }

        // set session
        client_request.session.user = {
            // _id: null,
            user_id: user_detail._id.toString(),
            name: user_detail.name,
            username: user_detail.email,
            email: user_detail.email,
            socket_id: null
        };

        // return response
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

// check if user exists then return the collection record
async function ifUserExists(userEmail, mongo_client){

    const database = mongo_client.db(database_name);
    const collection_users = database.collection("users");

    // username or email
    const query = {
        $or:[
            {username: userEmail},
            {email: userEmail}
        ]
    };

    // options.. not needed herer

    const user = await collection_users.findOne(query);
    const docCount = await collection_users.countDocuments(query);
    return user;
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

export {
    userLogin,
    dummyLogin
};