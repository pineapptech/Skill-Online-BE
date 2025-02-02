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
exports.PayStackService = void 0;
const axios_1 = __importDefault(require("axios"));
const payment_interface_1 = require("../interfaces/payment.interface");
const payment_repository_1 = require("../repository/payment.repository");
const mongoose_1 = require("mongoose");
class PayStackService {
    constructor(secretKey) {
        this.paystackSecretKey = secretKey;
        this.paymentRepository = new payment_repository_1.PaymentRepository();
    }
    initiatePayment(userId, amount, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post('https://api.paystack.co/transaction/initialize', {
                    amount: amount * 100, // Convert to kobo/cents
                    email,
                    callback_url: 'https://etsapsfrica.com/success'
                }, {
                    headers: {
                        Authorization: `Bearer ${this.paystackSecretKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                const { reference } = response.data.data;
                // Save payment record
                yield this.paymentRepository.create({
                    userId: new mongoose_1.Types.ObjectId(userId),
                    email,
                    amount,
                    reference,
                    status: payment_interface_1.PaymentStatus.PENDING
                });
                return response.data.data.authorization_url;
            }
            catch (error) {
                console.error('Payment initiation failed:', error.message);
                throw new Error(`Payment initiation failed =>${error.message}`);
            }
        });
    }
    verifyPayment(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                    headers: {
                        Authorization: `Bearer ${this.paystackSecretKey}`
                    }
                });
                const { status } = response.data.data;
                const isSuccessful = status === 'success';
                // Update payment status
                yield this.paymentRepository.updateStatus(reference, isSuccessful ? payment_interface_1.PaymentStatus.SUCCESS : payment_interface_1.PaymentStatus.FAILED);
                return isSuccessful;
            }
            catch (error) {
                console.error('Payment verification failed:', error);
                return false;
            }
        });
    }
    handleWebhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { event, data } = payload;
            switch (event) {
                case 'charge.success':
                    yield this.paymentRepository.updateStatus(data.reference, payment_interface_1.PaymentStatus.SUCCESS);
                    break;
                case 'charge.failed':
                    yield this.paymentRepository.updateStatus(data.reference, payment_interface_1.PaymentStatus.FAILED);
                    break;
            }
        });
    }
}
exports.PayStackService = PayStackService;
