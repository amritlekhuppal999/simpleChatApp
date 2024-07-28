import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const sessions = session({
    secret: 'your-secret-key', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }), // Optional, if using MongoDB
    cookie: { secure: false } // Set to true if using HTTPS
});