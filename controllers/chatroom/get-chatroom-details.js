import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

import { ROOT_DIR, database_name, currentDate, DB_CONNECTION_STRING } from '../../globals.js';


async function getChatroomDetails(requested, response){
    
    const client = new MongoClient(DB_CONNECTION_STRING);

    // let {chatroom_name, chatroom_description, chatroom_privacy, csrf_token} = requested.body;

    // const user_id = requested.session.user.user_id;

    let {room_id} = requested.query;
    // console.log("chatroom id: "+room_id)

    try {
        await client.connect();

        const database = client.db(database_name);
        const collection_chatrooms = database.collection("chatrooms");

        // username or email
        const query = {
            _id: new ObjectId(room_id)
        };

        const options = {
            projection: {
                name: 1,
                description: 1,
                _id: 0
            }
        };

        // options.. not needed herer

        const chatroom = await collection_chatrooms.findOne(query, options);
        const chatroomCount = await collection_chatrooms.countDocuments(query);
        // return chatrooms;
        
        // console.log(chatroom);
        
        if(chatroom){
            
            response.send({
                message: '',
                error_code: 0,
                data: {
                    chatroom_data: chatroom, 
                    record_count: chatroomCount
                },
                redirect: false,
                page: ''
            });
        }
        else {
            console.log("No Chatroom records were found");
            // res.status(500).send("User registration failed.");
            response.send({
                message: 'Unable to fetch this chatroom\'s details',
                error_code: 2,
                data: null,
                redirect: false,
                page: ''
            });
        }
        

    } 
    catch (error) {
        console.error(error, "Chatroom details fetch opeation failed.");
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
    getChatroomDetails
}