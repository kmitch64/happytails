
import { Router } from 'express';
import authMiddleware from '../../middlewares/auth.js';
import Controller from '../../controllers/user.controller.js';

export default Router()
  .get('/', authMiddleware, Controller.getAllUsers)
  .get('/:id', authMiddleware, Controller.getUserById)
  .post('/create', Controller.createUser)
  .put('/update/:id', authMiddleware, Controller.updateUser)
  .delete('/:id', authMiddleware, Controller.deleteUser)
