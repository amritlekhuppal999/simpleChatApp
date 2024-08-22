import path from 'path';
import { MongoClient } from 'mongodb';

import { ROOT_DIR, database_name, currentDate, DB_CONNECTION_STRING } from '../../globals.js';


async function getChatroomList(requested, response){
    
    const client = new MongoClient(DB_CONNECTION_STRING);

    // let {chatroom_name, chatroom_description, chatroom_privacy, csrf_token} = requested.body;

    const user_id = requested.session.user.user_id;

    try {
        await client.connect();

        const database = client.db(database_name);
        const collection_chatrooms = database.collection("chatrooms");

        // username or email
        const query = {
            member_id: user_id
        };

        // options.. not needed herer

        const chatrooms = await collection_chatrooms.find(query).toArray();
        const chatroomCount = await collection_chatrooms.countDocuments(query);
        // return chatrooms;
        
        // console.log(chatrooms);
        
        if(chatrooms){
            
            response.send({
                message: '',
                error_code: 0,
                data: {
                    chatroom_data: chatrooms, 
                    record_count: chatroomCount
                },
                redirect: true,
                page: ''
            });
        }
        else {
            console.log("No Chatroom records were found");
            // res.status(500).send("User registration failed.");
            response.send({
                message: '',
                error_code: 2,
                data: null,
                redirect: false,
                page: ''
            });
        }
        

    } 
    catch (error) {
        console.error(error, "Chatroom fetch opeation failed.");
        // server_response.redirect('login?err_msg=Something went Wrong. Try again later.');
        response.send({
            message: 'Something went wrong, Try again later.',
            error_code: 1,
            data: null,
            redirect: false,
            page: ''
        });
    }
    finally{
        client.close();
    }
}



export {
    getChatroomList
}