import { MongoClient } from 'mongodb';
import path from 'path';

import {ROOT_DIR, database_name, DB_CONNECTION_STRING, hashPassword} from '../globals.js';

// Login Controller for users
async function userRegister(req, res){
    
    // console.log(req.body);

    // console.log("Connecting to MongoDB with URI:", DB_CONNECTION_STRING.replace(password, '*****'));

    // Establishes connection... well sort of
    const client = new MongoClient(DB_CONNECTION_STRING);

    try{
        await client.connect();

        // check if user exists
        const userCount = await ifUserExists(req.body, client);
        if(userCount){
            
            console.log("Username/Email already in use.");
            // res.status(500).send("Username/Email already in use.");
            res.redirect('register?err_msg=Username/Email already in use.');

            return false;
        }

        // INSERT USER
        const result = await InsertUser(req.body, client);
        // console.log(result);
        if(result.acknowledged && result.insertedId){
            console.log("User successfully inserted with insert ID: "+result.insertedId);
            // res.send("Registration Successful.");
            
            // set session
            req.session.user = {
                // _id: null,
                user_id: result.insertedId.toString(),
                name: req.body.userFullName,
                username: req.body.userEmail,
                email: req.body.userEmail,
                socket_id: null
            };

            res.redirect('home');

        }
        else {
            console.log("User insertion failed.");
            // res.status(500).send("User registration failed.");
            res.redirect('register?err_msg=User registration failed');
        }
    }
    catch (error){
        console.error(error, "User Registration Failed.");
        // res.status(500).send("User Registration failed");
        res.redirect('register?err_msg=User registration failed');
    }
    finally{
        client.close();
    }
    
    // let return_view = path.join(ROOT_DIR, 'views', 'index.html');
    // server_response.redirect('home')
}

// function to insert user 
async function InsertUser(insertData, mongo_client){
    
    const database = mongo_client.db(database_name);
    const collection_users = database.collection("users");

    // console.log(database, collection_users);

    // Hash password
    let user_password = await hashPassword(insertData.password);

    // insert document
    const user_data = {
        user_id: null,  // Unique identifier
        username: insertData.userEmail,  // Username
        name: insertData.userFullName,
        email: insertData.userEmail,  // Email address
        password: user_password,  // Hashed password
        profile_picture_url: "",  // Optional profile picture URL
        status: "available",   // deleted
        active: "",    // Online/offline status
        last_seen_timestamp: null,  // Last seen timestamp,
        room_id: null,
        socket_id: null,
        friend_list: []
    };

    // try{
    //     // Insert Operation
    //     const result = await collection_users.insertOne(user_data);
    //     return result;
    // }
    // catch(error){
    //     console.error("kuch locha hua:", error);
    //     throw error;
    // }

    // Insert Operation
    const result = await collection_users.insertOne(user_data);
    return result;
}

// function to check if a particular user exists
async function ifUserExists(insertData, mongo_client){

    const database = mongo_client.db(database_name);
    const collection_users = database.collection("users");

    const query = {
        username: insertData.userEmail,
        email: insertData.userEmail
    };

    // options.. not needed herer

    const cursor = await collection_users.find(query);
    const docCount = await collection_users.countDocuments(query);
    return docCount;
}




export {
    userRegister
};