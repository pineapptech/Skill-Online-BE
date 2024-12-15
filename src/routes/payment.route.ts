import { Router } from 'express';
import PayStackController from '../controllers/payment.controller';
import PaymentService from '../services/payment.service';
const paymentService = new PaymentService();
const paymentController = new PayStackController(paymentService);
const paymentRouter = Router();

paymentRouter.post('/initialize-payment', paymentController.initializePayment);
paymentRouter.get('/verify-payment/:reference', paymentController.verifyPayment);

export default paymentRouter;
