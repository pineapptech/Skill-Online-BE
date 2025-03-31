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
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const user_model_1 = __importDefault(require("../models/user.model"));
const console_1 = require("console");
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
    getPaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.paystackService.getPaymentStatus();
                res.json({
                    message: 'Payment status fetched successfully',
                    length: status.length,
                    status
                });
            }
            catch (error) {
                console.error('Error fetching payment status:', error);
                throw error;
            }
        });
    }
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'payments', // Name of the collection in MongoDB
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'payments'
                        }
                    },
                    {
                        $match: {
                            'payments.status': 'success' // Filter for users with at least one successful payment
                        }
                    },
                    {
                        $project: {
                            firstName: 1,
                            lastName: 1,
                            email: 1,
                            regNo: 1,
                            phone: 1,
                            course: 1,
                            payments: 1 // Include payment details if needed
                        }
                    }
                ]);
                res.status(200).json({
                    message: 'Users fetched successfully',
                    length: users.length,
                    users
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching users', error });
                (0, console_1.log)(error.message);
            }
        });
    }
}
exports.PaymentController = PaymentController;
