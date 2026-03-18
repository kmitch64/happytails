
import { Router } from 'express';

import Controller from '../../controllers/auth.controller.js';
import isAuthorized from '../../middlewares/auth.js';

export default Router()
  .get('/validate', isAuthorized, Controller.validate)
  .post('/logout', Controller.logout)
  .post('/login', Controller.loginUser)
  .post('/2fa/setup', Controller.setup2FA)
  .post('/2fa/verify-setup', Controller.verify2FASetup)
  .post('/2fa/verify', Controller.verifyOTP)
  .post('/2fa/disable', Controller.disable2FA);