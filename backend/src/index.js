import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: '../.env',
});

// connect to the database
connectDB()
.then(() => {
    // run the server after connecting to the database
    app.listen(process.env.PORT || 5000, () => {
        console.log(`\nServer running on port: '${process.env.PORT || 5000}'.`);
    });
})
.catch((error) => {
    console.log(`\nMongoDB connection failed: Error: ${error}`);
});