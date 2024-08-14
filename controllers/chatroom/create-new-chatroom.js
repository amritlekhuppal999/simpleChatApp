import path from 'path';
import { MongoClient } from 'mongodb';

import { ROOT_DIR, database_name, currentDate, DB_CONNECTION_STRING } from '../../globals.js';


async function createNewChatroom(requested, response){
    
    console.log(requested.body);

    const client = new MongoClient(DB_CONNECTION_STRING);

    let {chatroom_name, chatroom_description, chatroom_privacy, csrf_token} = requested.body;

    const user_id = requested.session.user.user_id;

    try {
        await client.connect();

        const database = client.db(database_name);
        const collection_chatrooms = database.collection("chatrooms");

        const chatroom_data = {
            name: chatroom_name,
            description: chatroom_description,  // Email address
            privacy: chatroom_privacy,  // Hashed password
            admin_id: [user_id],
            status: "available",   // deleted,
            date_created: currentDate()
        };

        // Insert Operation
        const result = await collection_chatrooms.insertOne(chatroom_data);
        // return result;

        if(result.acknowledged && result.insertedId){
            console.log("Chatroom created successfully with insert ID: "+result.insertedId);
            
            // return response
            // server_response.redirect('home');
            response.send({
                message: 'Chatroom created successfully.',
                error_code: 0,
                redirect: true,
                page: ''
            });
        }
        else {
            console.log("Chatroom creation failed.");
            // res.status(500).send("User registration failed.");
            response.send({
                message: 'Unable to create new chatroom at the moment. Try again later.',
                error_code: 2,
                redirect: false,
                page: ''
            });
        }
        

    } 
    catch (error) {
        console.error(error, "Chatroom creation failed.");
        // server_response.redirect('login?err_msg=Something went Wrong. Try again later.');
        response.send({
            message: 'Something went wrong, Try again later.',
            error_code: 1,
            redirect: false,
            page: ''
        });
    }
    finally{
        client.close();
    }


    
}


export {
    createNewChatroom
};