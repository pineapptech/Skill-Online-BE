"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/payment.routes.ts
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const paymentRouter = express_1.default.Router();
const paymentController = new payment_controller_1.PaymentController(process.env.PAYSTACK_SECRET_KEY || '');
paymentRouter.post('/initialize-payment', paymentController.initiatePayment.bind(paymentController));
paymentRouter.get('/verify', paymentController.verifyPayment.bind(paymentController));
paymentRouter.post('/webhook', paymentController.handleWebhook.bind(paymentController));
exports.default = paymentRouter;
