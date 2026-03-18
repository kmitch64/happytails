
import express from 'express';

import authRouter from './v1/auth.js';
import userRouter from './v1/user.js';


export default async function RouteMaster(/**@type {express.Express} */app) {
    app
        .use('/api/v1/auth', authRouter)
        .use('/api/v1/users', userRouter);
};
