
import express from 'express';


export default async function serverListener(/**@type {express.Express} */app) {

  app
    .listen(3000, () => {
      console.info('\n╔══════════════════════════════════════════════════════════╗');
      console.info('║              🚀 Express Server Starting                  ║');
      console.info('╚══════════════════════════════════════════════════════════╝\n');
      console.info(`Initializing...\n`);
      console.info(`Node:` + process.version + ` | Platform:` + process.platform + ` | Arch:` + process.arch);
      console.info(`PID: ` + process.pid + ` | Memory: ` + Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + `MB`);
      console.info(`Env: ` + (process.env.NODE_ENV || 'development') + ` | Port: ` + process.env.PORT + `\n\n`);
      console.info(`Server is running at ` + process.env.DOMAIN);
      console.info(`Users are visible at ` + process.env.DOMAIN + `/api/users`);
      console.info(`Authentications are visible at ` + process.env.DOMAIN + `/api`);
    })

    .on('error', (err) => {
      console.error('Server error:', err);
    })

    .on('close', () => {
      console.info('Server closed');
    })

    .on('listening', () => {
      console.info(`Server is listening for connectionson port ` + (process.env.PORT || 3000) + ` (` + (process.env.NODE_ENV || 'development') + `)`);
    });

};
