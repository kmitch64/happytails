
import { Router } from 'express';
import {isAuthorized, isAdmin} from '../../middlewares/auth.js';
import bookingController from '../../controllers/booking.controller.js';


export default Router()
  .get('/', isAuthorized, isAdmin, bookingController.getAllBookings)
  .get('/user', isAuthorized, bookingController.getUserBookings)
  .get('/sitter', isAuthorized, bookingController.getSitterBookings)
  .get('/:id', isAuthorized, bookingController.getBookingById)
  .post('/', isAuthorized, bookingController.createBooking)
  .put('/:id/status', isAuthorized, bookingController.updateBookingStatus)
  .put('/:id', isAuthorized, bookingController.updateBooking)
  .delete('/:id', isAuthorized, bookingController.deleteBooking);

