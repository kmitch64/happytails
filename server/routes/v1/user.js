
import { Router } from 'express';
import isAuthorized from '../../middlewares/auth.js';
import Controller from '../../controllers/user.controller.js';

export default Router()
  .get('/', isAuthorized, Controller.getAllUsers)
  .get('/:id', isAuthorized, Controller.getUserById)
  .post('/create', Controller.createUser)
  .put('/update/:id', isAuthorized, Controller.updateUser)
  .delete('/:id', isAuthorized, Controller.deleteUser)
