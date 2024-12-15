import { Router } from "express";
import PayStackController from "../controllers/payment.controller";
const paymentController = new PayStackController()
const paymentRouter = Router()

paymentRouter.post('/initialize-payment', paymentController.initializePayment)
paymentRouter.get('/verify-payment/:reference', paymentController.verifyPayment)

export default paymentRouter