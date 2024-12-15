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
const dotenv_1 = require("dotenv");
const user_model_1 = __importDefault(require("../models/user.model"));
const payment_model_1 = require("../models/payment.model");
(0, dotenv_1.configDotenv)();
class PayStackController {
    constructor(paymentService) {
        this.initializePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, email } = req.body;
                const paymentData = yield this.paymentService.createPayment(email, amount);
                res.status(200).json({
                    authorization_url: paymentData.data.authorization_url,
                    reference: paymentData.data.reference
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
        /* public verifyPayment = async (req: Request, res: Response) => {
            try {
                const { reference } = req.params;
    
                // Check if payment already exists to prevent duplicates
                const existingPayment = await this.paymentService.findPaymentByReference(reference);
                console.log('My Reference=>', existingPayment);
                if (existingPayment) {
                    res.status(200).json({
                        status: true,
                        message: 'Payment already processed',
                        amount: existingPayment.amount
                    });
                    return;
                }
    
                const response: any = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`
                    }
                });
    
                const paymentData = response.data.data;
    
                if (paymentData.status === 'success' && paymentData.gateway_response === 'success') {
                    // Save Payment to database
                    const savedPayment = await this.paymentService.createPayment(paymentData);
    
                    res.status(200).json({
                        status: true,
                        amount: paymentData.amount / 100,
                        reference: paymentData.reference,
                        savedPayment
                    });
                } else {
                    res.status(400).json({
                        status: false,
                        message: 'Payment Verification Failed'
                    });
                }
            } catch (error: any) {
                console.error('Payment verification error:', error);
                res.status(500).json({
                    status: false,
                    error: error.message
                });
            }
        }; */
        // handling Webhook
        this.handleWebhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const secret = process.env.PAYSTACK_SECRET_KEY;
                // Verify webhook signature
                const signature = req.headers['x-paystack-signature'];
                const crypto = require('crypto');
                const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
                if (hash !== signature) {
                    res.status(401).send('Invalid signature');
                    return;
                }
                const { event, data } = req.body;
                if (event === 'charge.success') {
                    const { reference, amount, status, customer } = data;
                    // Find the user by email
                    const user = yield user_model_1.default.findOne({ email: customer.email });
                    if (user) {
                        // Save payment details
                        yield payment_model_1.Payment.create({
                            userId: user._id,
                            reference,
                            amount: amount / 100, // Convert from kobo to naira
                            status
                        });
                    }
                }
                res.status(200).send('Webhook received successfully');
            }
            catch (error) {
                console.error('Webhook error:', error);
                res.status(500).send('Webhook handling failed');
            }
        });
        this.paymentService = paymentService;
    }
}
exports.default = PayStackController;
