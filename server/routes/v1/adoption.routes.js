
import { Router } from 'express';
import {isAdmin, isAuthorized, isShelterStaff} from '../../middlewares/auth.js';
import adoptionController from '../../controllers/adoption.controller.js';


export default Router()
  .get('/', isAuthorized, adoptionController.getAllApplications)
  .get('/user', isAuthorized, adoptionController.getUserApplications)
  .get('/:id', isAuthorized, adoptionController.getApplicationById)
  .post('/', isAuthorized, adoptionController.createApplication)
  .put('/:id/status', isAuthorized, (req, res, next) => {
    if (isShelterStaff(req) || isAdmin(req)) {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  }, adoptionController.updateApplicationStatus)
  .put('/:id', isAuthorized, adoptionController.updateApplication)
  .delete('/:id', isAuthorized, adoptionController.deleteApplication);
