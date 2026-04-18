
import 'dotenv/config';
import { INDEX_HTML, STATIC_ASSETS, INDEX_AS_STRING } from '../enums/SERVER_ENUMS.js';

import mongoose from 'mongoose';
import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import helmet from 'helmet';

import rateLimit from './middlewares/rateLimiter.js'
import routeMaster from './routes/routeMaster.js';
import serverListener from './listener.js';


const
    mongoUri = process.env.NODE_ENV === 'production'
        ? process.env.MONGO_PROD    // Cloud server (Live)
        : process.env.MONGO_DEV, // Local server (Dev)

    app = express();

//MONGO_DB Connection
// bypass for testing without mongo installed.
const hasMongo = true;
if (hasMongo) {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully!')
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
    };
};

function enforceWWW(req, res, next) {
    const host = req.headers.host;
    if (host && !host.startsWith('www.')) {
        return res.redirect(301, `https://www.${host}${req.url}`);
    }
    next();
};

app
    .use(cors(
        {
            origin: process.env.DOMAIN,
            credentials: true
        }
    ))
    .use(compress())
    .use(cookieParser())
    .use(express.json({ limit: '10mb' }))
    .use(express.urlencoded({ limit: '10mb', extended: true }))
    .use(helmet())
    .use(express.static(STATIC_ASSETS()))

    .get('/health', (_, res) => { rateLimit, res.status(200).json({ status: 'OK' }); })
    .use(/^(?!\/api).*/, rateLimit, enforceWWW, async (_, res) => res.send(await INDEX_AS_STRING()));

await routeMaster(app);
await serverListener(app);

