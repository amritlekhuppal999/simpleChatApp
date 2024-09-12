import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

import { ROOT_DIR, database_name, currentDate, DB_CONNECTION_STRING } from '../../globals.js';


async function getFriendList(requested, response){
    
    const client = new MongoClient(DB_CONNECTION_STRING);

    const user_id = requested.session.user.user_id;

    let page_counter = requested.params.page;
    let search_keyword = requested.params.search_keyword || null;

    try {
        await client.connect();

        const database = client.db(database_name);
        const collection_users = database.collection("users");

        const query = {
            friend_list: {
                $in: [user_id]
            },
            // name: search_keyword
            // block_list:{
            //     $nin:[user_id]
            // }
        };

        if(search_keyword){
            query.name = {
                $regex: search_keyword, $options: 'i'
            }
        }

        const pages = page_counter || 0;
        const records_per_page = 10;
        let skip_records = pages * records_per_page;

        const friends_count = await collection_users.countDocuments(query);

        // console.log('page_counter: '+page_counter, 'skip_records: '+skip_records, 'friends_count: '+friends_count);

        //test
        if(skip_records < friends_count){

            const friend = await collection_users.find(query)
                                    .skip(skip_records)
                                    .limit(records_per_page)
                                    .toArray();
    
            // return chatrooms;
            
            // console.log(chatrooms);
            
            if(friend){
                
                response.send({
                    message: '',
                    error_code: 0,
                    data: {
                        friend_data: friend, 
                        record_count: friends_count
                    },
                    redirect: false,
                    page: ''
                });
            }
            else {
                console.log("No Friends records were found");
                // res.status(500).send("User registration failed.");
                response.send({
                    message: 'No Friends available.',
                    error_code: 2,
                    data: null,
                    redirect: false,
                    page: ''
                });
            }
        }

        //else { /* Send some error msg or do something */}

        else {
            console.log("No more friends to load");
            // res.status(500).send("User registration failed.");
            response.send({
                message: 'No more friends available.',
                error_code: 3,
                data: null,
                redirect: false,
                page: ''
            });
        }

    } 
    catch (error) {
        console.error(error, "Friends list fetch opeation failed.");
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
    getFriendList
}