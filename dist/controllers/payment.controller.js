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
const payment_model_1 = require("../models/payment.model");
class PaymentController {
    constructor(secretKey) {
        this.getUsersWithSuccessfulPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const usersWithSuccessfulPayments = yield payment_model_1.Payment.aggregate([
                    {
                        $match: { status: 'success' } // Step 1: Get only successful payments
                    },
                    {
                        $lookup: {
                            from: 'users', // Step 2: Join with users collection
                            localField: 'email', // Match by email instead of userId
                            foreignField: 'email',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user' // Convert array to object
                    },
                    {
                        $group: {
                            _id: '$user.email', // Step 3: Group users by email
                            firstName: { $first: '$user.firstName' },
                            lastName: { $first: '$user.lastName' },
                            email: { $first: '$user.email' },
                            regNo: { $first: '$user.regNo' },
                            phone: { $first: '$user.phone' },
                            courses: { $addToSet: '$user.course' }, // Ensure all registered courses are included
                            payments: {
                                $push: {
                                    amount: '$amount',
                                    reference: '$reference',
                                    status: '$status'
                                }
                            } // Collect all successful payments
                        }
                    },
                    {
                        $project: {
                            _id: 0, // Exclude MongoDB's default _id
                            firstName: 1,
                            lastName: 1,
                            email: 1,
                            regNo: 1,
                            phone: 1,
                            courses: 1,
                            payments: 1
                        }
                    }
                ]);
                res.status(200).json({
                    message: 'Users with successful payments fetched successfully',
                    length: usersWithSuccessfulPayments.length,
                    usersWithSuccessfulPayments
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching users with successful payments', error });
            }
        });
        this.paymentCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const successfulPaymentCount = yield payment_model_1.Payment.countDocuments({ status: 'success' });
                res.status(200).json({ successCount: successfulPaymentCount });
            }
            catch (error) {
                res.status(500).json({ message: 'Error counting successful payments', error });
            }
        });
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
                            payments: { $elemMatch: { status: 'success' } } // Correct way to match array elements
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
                            payments: {
                                $filter: {
                                    input: '$payments',
                                    as: 'payment',
                                    cond: { $eq: ['$$payment.status', 'success'] } // Filter out non-success payments
                                }
                            }
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
