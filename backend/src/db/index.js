import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

const connectDB = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); 

        console.log(`\nDATABASE CONNECTED SUCCESSFULLY !!`);

        console.log(`\n\tDatabase running on port: '${connectInstance.connection.port}'\n\tDatabase name: '${connectInstance.connection.name}'`);
    } catch (error) {
        console.log(`\nSomething went wrong, while connecting to MongoDB !!\nError: ${error}`);

        throw error;
    }
}

export default connectDB;