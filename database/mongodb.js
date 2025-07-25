import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI) {
    throw new Error('Please define the DB_URI environment variable inside .env.<development/production>.local');

}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to MongoDB in ${NODE_ENV} mode`);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); //this will stop the app if the connection fails
    }
}

export default connectToDatabase;