
import express from 'express';


//API Routes (Json)
export default async function RouteMaster(/**@type {express.Express} */app) {
    app
        .get('/health', (_, res) => {
            res.status(200).json({ status: 'OK' });
        });
};
