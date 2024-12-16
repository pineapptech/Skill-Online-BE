"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
class PaymentController {
    constructor(secretKey) {
        this.paystackService = new payment_service_1.PayStackService(secretKey);
    }
    initiatePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, amount, email } = req.body;
                const paymentUrl = yield this.paystackService.initiatePayment(userId, amount, email);
                res.json({ paymentUrl });
            }
            catch (error) {
                res.status(500).json({
                    error: 'Payment initiation failed',
                    message: error.message
                });
            }
        });
    }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reference } = req.query;
                const isVerified = yield this.paystackService.verifyPayment(reference);
                res.json({ verified: isVerified });
            }
            catch (error) {
                res.status(500).json({
                    error: 'Payment verification failed',
                    message: error.message
                });
            }
        });
    }
    handleWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.paystackService.handleWebhook(req.body);
                res.status(200).send('Webhook received');
            }
            catch (error) {
                res.status(500).send('Webhook processing failed');
            }
        });
    }
}
exports.PaymentController = PaymentController;
