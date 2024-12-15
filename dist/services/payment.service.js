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
const mongoose_1 = require("mongoose");
const payment_model_1 = require("../models/payment.model");
class PaymentService {
    constructor() {
        this.createPayment = (payload) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!payload.reference || !payload.amount) {
                    throw new Error('Payment reference and amount are required');
                }
                const userPayload = yield payment_model_1.Payment.create({
                    reference: payload.reference,
                    userId: (payload === null || payload === void 0 ? void 0 : payload.userId) ? new mongoose_1.Types.ObjectId(payload.userId) : undefined
                });
                return userPayload;
            }
            catch (error) {
                console.error('Error creating payment:', error);
                throw error;
            }
        });
        // Optional: Add method to find payment by reference
        this.findPaymentByReference = (reference) => __awaiter(this, void 0, void 0, function* () {
            return yield payment_model_1.Payment.findOne({ reference });
        });
    }
}
exports.default = PaymentService;
