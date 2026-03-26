
import express from 'express';

import authRouter from './v1/auth.js';
import userRouter from './v1/user.js';
import petRouter from './v1/pet.routes.js';
import adoptionRouter from './v1/adoption.routes.js';
import sitterRouter from './v1/sitter.routes.js';
import bookingRouter from './v1/booking.routes.js';
import aiRouter from './v1/ai.routes.js';


export default async function RouteMaster(/**@type {express.Express} */app) {
  app
    .use('/api/v1/auth', authRouter)
    .use('/api/v1/users', userRouter)
    .use('/api/v1/pets', petRouter)
    .use('/api/v1/adoptions', adoptionRouter)
    .use('/api/v1/sitters', sitterRouter)
    .use('/api/v1/bookings', bookingRouter)
    .use('/api/v1/ai', aiRouter);
};
