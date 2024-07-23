// const { MongoClient } = require('mongodb');
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const host = process.env.MONGO_HOST;
const mongo_port = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DB;

// const encodedPassword = encodeURIComponent(password);
const uri = `mongodb://${username}:${password}@${host}:${mongo_port}/?authSource=${dbName}`;
console.log("Connecting to MongoDB with URI:", uri.replace(password, '*****'));

// Establishes connection... well sort of
const client = new MongoClient(uri);

fetch_data().catch(console.error)

// Below function output details from the retrived movie document
async function fetch_data() {
    try {
        await client.connect();
        const database = client.db(dbName);
        const users = database.collection('users');
  
        // Query for a movie that has the title 'Back to the Future'
        const query = { name: 'ALU' };
        // const user = await users.findOne(query);
        const cursor = await users.find({});
        let result = await cursor.toArray();
        console.log(result);
        // console.log(user);
    } 
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
  
