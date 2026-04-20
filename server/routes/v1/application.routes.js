
import { Router } from 'express';
import { isAdmin, isAuthorized, isShelterStaff } from '../../middlewares/auth.js';
import adoptionController from '../../controllers/application.controller.js';


export default Router()

  .get('/', isAuthorized, adoptionController.getAllApplications)
  .get('/:id', isAuthorized, adoptionController.getApplicationById)
  .get('/user', isAuthorized, adoptionController.getUserApplications)
  .post('/submit', isAuthorized, adoptionController.createApplication)
  .put('/:id', isAuthorized, adoptionController.updateApplication)
  .delete('/:id', isAuthorized, adoptionController.deleteApplication)

  .put('/:id/status', isAuthorized, (req, res, next) => {
    if (isShelterStaff(req) || isAdmin(req)) {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  }, adoptionController.updateApplicationStatus);

