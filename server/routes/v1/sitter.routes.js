
import { Router } from 'express';
import {isAuthorized} from '../../middlewares/auth.js';
import sitterController from '../../controllers/sitter.controller.js';


export default Router()
  .get('/', isAuthorized, sitterController.getAllSitters)
  .get('/:id', isAuthorized, sitterController.getSitterById)
  .post('/', isAuthorized, sitterController.createSitterProfile)
  .put('/:id', isAuthorized, sitterController.updateSitterProfile)
  .delete('/:id', isAuthorized, sitterController.deleteSitterProfile)

  // Availability
  .get('/:id/availability', isAuthorized, sitterController.getAvailability)
  .put('/:id/availability', isAuthorized, sitterController.updateAvailability)

  // Reviews
  .get('/:id/reviews', isAuthorized, sitterController.getReviews)
  .post('/:id/reviews', isAuthorized, sitterController.addReview);

