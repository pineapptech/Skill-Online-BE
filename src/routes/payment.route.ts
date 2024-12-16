// src/routes/payment.routes.ts
import express from 'express';
import { PaymentController } from '../controllers/payment.controller';

const paymentRouter = express.Router();
const paymentController = new PaymentController(process.env.PAYSTACK_SECRET_KEY || '');

paymentRouter.post('/initialize-payment', paymentController.initiatePayment.bind(paymentController));
paymentRouter.get('/verify', paymentController.verifyPayment.bind(paymentController));
paymentRouter.post('/webhook', paymentController.handleWebhook.bind(paymentController));

export default paymentRouter;
