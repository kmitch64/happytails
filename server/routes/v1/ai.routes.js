
import { Router } from 'express';
import aiController from '../../controllers/ai.controller.js';
import {isAuthorized} from '../../middlewares/auth.js';

const router = Router();

router.post('/assistant',
  isAuthorized,
  aiController.handleAIRequest
);

export default router;
