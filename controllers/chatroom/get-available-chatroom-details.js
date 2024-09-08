import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

import { ROOT_DIR, database_name, currentDate, DB_CONNECTION_STRING } from '../../globals.js';


async function getAvailableChatroomDetails(requested, response){
    
    const client = new MongoClient(DB_CONNECTION_STRING);

    const user_id = requested.session.user.user_id;

    let page_counter = requested.params.page;

    try {
        await client.connect();

        const database = client.db(database_name);
        const collection_chatrooms = database.collection("chatrooms");

        const query = {
            admin_id: {
                $nin: [user_id]
            }
        };

        const pages = page_counter || 0;
        const records_per_page = 10;
        let skip_records = pages * records_per_page;

        const chatroomCount = await collection_chatrooms.countDocuments(query);

        // console.log('page_counter: '+page_counter, 'skip_records: '+skip_records, 'chatroomCount: '+chatroomCount);

        //test
        if(skip_records < chatroomCount){

            const chatroom = await collection_chatrooms.find(query)
                                    .skip(skip_records)
                                    .limit(records_per_page)
                                    .toArray();
    
            // return chatrooms;
            
            // console.log(chatrooms);
            
            if(chatroom){
                
                response.send({
                    message: '',
                    error_code: 0,
                    data: {
                        chatroom_data: chatroom, 
                        record_count: 0
                    },
                    redirect: false,
                    page: ''
                });
            }
            else {
                console.log("No Chatroom records were found");
                // res.status(500).send("User registration failed.");
                response.send({
                    message: 'Unable to fetch chatrooms.',
                    error_code: 2,
                    data: null,
                    redirect: false,
                    page: ''
                });
            }
        }

        //else { /* Send some error msg or do something */}

        else {
            console.log("No more chatrooms to load");
            // res.status(500).send("User registration failed.");
            response.send({
                message: 'You wanted more??',
                error_code: 3,
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
    getAvailableChatroomDetails
}