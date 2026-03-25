
import { Router } from 'express';
import {isAuthorized} from '../../middlewares/auth.js';
import petController from '../../controllers/pet.controller.js';


export default Router()
  .get('/', isAuthorized, petController.getAllPets)
  .get('/user', isAuthorized, petController.getUserPets)
  .get('/:id', isAuthorized, petController.getPetById)
  .post('/', isAuthorized, petController.createPet)
  .put('/:id', isAuthorized, petController.updatePet)
  .delete('/:id', isAuthorized, petController.deletePet)

  // Care reminders
  .post('/:id/reminders', isAuthorized, petController.addCareReminder)
  .put('/:id/reminders/:reminderId', isAuthorized, petController.updateCareReminder)
  .delete('/:id/reminders/:reminderId', isAuthorized, petController.deleteCareReminder)

  // Medical records
  .post('/:id/medical-records', isAuthorized, petController.addMedicalRecord)
  .put('/:id/medical-records/:recordId', isAuthorized, petController.updateMedicalRecord)
  .delete('/:id/medical-records/:recordId', isAuthorized, petController.deleteMedicalRecord);

