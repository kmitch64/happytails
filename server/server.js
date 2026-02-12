
import 'dotenv/config';
// import { STATIC_ASSETS } from '../../enum/SERVER_ENUMS.js';

import mongoose from 'mongoose';
import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import helmet from 'helmet';

import rateLimit from './middlewares/rateLimiter.js'
import routeMaster from './routes/routeMaster.js';
import serverListener from './listener.js';

//this needs to get tidied
const
    PORT = process.env.PORT || 3000,
    BASE_URL = process.env.NODE_ENV === 'production'
        ? process.env.CLOUD_URL
        : `http://localhost:` + PORT,

    mongoUri = process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI    // Cloud server (Live)
        : process.env.MONGO_LOCAL, // Local server (Dev)

    app = express();

//MONGO_DB Connection
try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!')
}
catch (err) {
    console.error('MongoDB connection error:', err);
};

app
    .use(cors(
        {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    ))
    .use(compress())
    .use(cookieParser())
    .use(express.json({ limit: '10mb' }))
    .use(express.urlencoded({ limit: '10mb', extended: true }))
    .use(helmet())

    .use((err, _req, res, _next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).json({ "error": err.name + ": " + err.message })
        }
        else if (err) {
            res.status(400).json({ "error": err.name + ": " + err.message })
            console.log(err)
        }
    })
    .get(/^(?!\/api).*/, rateLimit/*, metadata*/);

await routeMaster(app);
await serverListener(app, PORT, BASE_URL);
