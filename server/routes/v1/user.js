
import { Router } from 'express';
import { isAuthorized, isAdmin } from '../../middlewares/auth.js';
import Controller from '../../controllers/user.controller.js';


export default Router()
  .get('/', isAuthorized, isAdmin, Controller.getAllUsers)
  .get('/:id', isAuthorized, Controller.getUserById)
  .post('/create', Controller.createUser)
  .put('/update/:id', isAuthorized, Controller.updateUser)
  .put('/preferences', isAuthorized, Controller.updateUserPreferences)
  .delete('/:id', isAuthorized, Controller.deleteUser)

  .get('/:id/pets', isAuthorized, Controller.getUserPets)
  .post('/:id/pets/:petId', isAuthorized, Controller.addPetToUser)
  .delete('/:id/pets/:petId', isAuthorized, Controller.removePetFromUser)

  .get('/:id/saved-pets', isAuthorized, Controller.getSavedPets)
  .post('/:id/saved-pets/:petId', isAuthorized, Controller.savePet)
  .delete('/:id/saved-pets/:petId', isAuthorized, Controller.unsavePet);
