
import {Router} from 'express';
import imageController from '../../controllers/image.controller.js';
import {isAuthorized} from '../../middlewares/auth.js';


export default Router()
    .post('/users/avatar', isAuthorized, imageController.uploadUserAvatar )
    .get('/users/avatar/:userId', imageController.getUserAvatar )
    .post('/pets/:petId/images', isAuthorized, imageController.uploadPetImage )
    .get('/pets/:petId/images/:imageIndex', imageController.getPetImage )
    .delete('/pets/:petId/images/:imageIndex', isAuthorized, imageController.deletePetImage )
    .post('/pets/:petId/images/base64', isAuthorized, imageController.uploadPetImageBase64 );
