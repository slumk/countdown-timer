// /Users/salahumk/countdown-timer/web/db/init.js

import mongoose from "mongoose";

/**
 * Connect to MongoDB via mongoose.
 * Call await connect() early in your app startup.
 */
export async function db_connect() {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Connected to MongoDB: ${process.env.MONGO_URI}`)
    return mongoose.connection
}

