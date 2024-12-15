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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
class PayStackController {
    constructor(paymentService) {
        this.PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
        this.initializePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, email } = req.body;
                const response = yield axios_1.default.post('https://api.paystack.co/transaction/initialize', {
                    amount: amount * 100, // Convert to kobo
                    email,
                    // metadata: { userId }, // Pass user ID in metadata
                    callback_url: 'http://localhost:3000/dashboard'
                }, {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                res.json({
                    authorization_url: response.data.data.authorization_url,
                    reference: response.data.data.reference
                });
            }
            catch (error) {
                console.error('Payment initialization error:', error);
                res.status(500).json({
                    status: false,
                    error: error.message
                });
            }
        });
        this.verifyPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { reference } = req.params;
                // Check if payment already exists to prevent duplicates
                const existingPayment = yield this.paymentService.findPaymentByReference(reference);
                console.log('My Reference=>', existingPayment);
                if (existingPayment) {
                    res.status(200).json({
                        status: true,
                        message: 'Payment already processed',
                        amount: existingPayment.amount
                    });
                    return;
                }
                const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`
                    }
                });
                const paymentData = response.data.data;
                if (paymentData.status === 'success' && paymentData.gateway_response === 'success') {
                    // Save Payment to database
                    const savedPayment = yield this.paymentService.createPayment(paymentData);
                    res.status(200).json({
                        status: true,
                        amount: paymentData.amount / 100,
                        reference: paymentData.reference,
                        savedPayment
                    });
                }
                else {
                    res.status(400).json({
                        status: false,
                        message: 'Payment Verification Failed'
                    });
                }
            }
            catch (error) {
                console.error('Payment verification error:', error);
                res.status(500).json({
                    status: false,
                    error: error.message
                });
            }
        });
        this.paymentService = paymentService;
    }
}
exports.default = PayStackController;
