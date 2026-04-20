
import { Router } from 'express';
import { isAdmin, isAuthorized, isShelterStaff } from '../../middlewares/auth.js';
import adoptablePetController from '../../controllers/adoption.controller.js';


export default Router()

  .get('/', isAuthorized, adoptablePetController.getAllAdoptablePets)
  .get('/pets/:id', isAuthorized, adoptablePetController.getAdoptablePetById)
  .post('/pets', isAuthorized, adoptablePetController.createAdoptablePet)
  .put('/pets/:id', isAuthorized, adoptablePetController.updateAdoptablePet)
  .delete('/pets/:id', isAuthorized, adoptablePetController.deleteAdoptablePet);

