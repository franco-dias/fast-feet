import { Router } from 'express';
import multer from 'multer';

import authGuard from './app/middlewares/authGuard';

import SessionController from './app/controllers/SessionControler';
import FileController from './app/controllers/FileController';

import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryHandlingController from './app/controllers/DeliveryHandlingController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import multerConfig from './config/multer';

const upload = multer(multerConfig);


const routes = new Router();

/*
 * Auth Routes
*/

routes.post('/session', SessionController.store);

/*
 * Delivery Handling Routes
*/

routes.get('/deliveryman/:deliveryManId/deliveries', DeliveryHandlingController.index);
routes.put(
  '/deliveryman/:deliveryManId/deliveries/:deliveryId/:action',
  upload.single('file'),
  DeliveryHandlingController.update,
);

/*
 * Delivery Problem Routes
*/

routes.get('/delivery-problems/:deliveryId?', DeliveryProblemController.index);
routes.post('/delivery-problems/:deliveryId', DeliveryProblemController.store);
routes.delete('/delivery-problems/:deliveryId/cancel-delivery', DeliveryProblemController.delete);

/* Activate authGuard */

routes.use(authGuard);

/*
 * Recipients Routes
*/

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

/*
 * Deliverymen routes
*/

routes.get('/deliverymen', DeliveryManController.index);
routes.post('/deliverymen', DeliveryManController.store);
routes.put('/deliverymen/:id', DeliveryManController.update);
routes.delete('/deliverymen/:id', DeliveryManController.delete);

/*
 * Delivery routes
*/

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);
export default routes;
