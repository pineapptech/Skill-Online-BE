"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const payment_service_1 = __importDefault(require("../services/payment.service"));
const paymentService = new payment_service_1.default();
const paymentController = new payment_controller_1.default(paymentService);
const paymentRouter = (0, express_1.Router)();
paymentRouter.post('/initialize-payment', paymentController.initializePayment);
paymentRouter.get('/verify-payment/:reference', paymentController.verifyPayment);
exports.default = paymentRouter;
