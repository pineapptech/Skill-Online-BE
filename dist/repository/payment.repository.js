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
exports.PaymentRepository = void 0;
const payment_model_1 = require("../models/payment.model");
const payment_interface_1 = require("../interfaces/payment.interface");
const user_model_1 = __importDefault(require("../models/user.model"));
class PaymentRepository {
    create(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = new payment_model_1.Payment(paymentData);
            return yield payment.save();
        });
    }
    findByReference(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield payment_model_1.Payment.findOne({ reference });
        });
    }
    updateStatus(reference, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield payment_model_1.Payment.updateOne({ reference }, { status });
        });
    }
    getPaymentStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield payment_model_1.Payment.find({ status: payment_interface_1.PaymentStatus.SUCCESS });
            return payment;
        });
    }
    getUserDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.default.find().populate({
                path: 'payment',
                match: { status: payment_interface_1.PaymentStatus.SUCCESS },
                options: { strictPopulate: false }
            });
            return users;
        });
    }
}
exports.PaymentRepository = PaymentRepository;
