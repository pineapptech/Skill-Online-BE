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
const paystack = axios_1.default.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    }
});
class PaymentService {
    constructor() {
        this.createPayment = (email, amount) => __awaiter(this, void 0, void 0, function* () {
            const response = yield paystack.post('/transaction/initialize', {
                email,
                amount: amount * 100
            });
            return response.data;
        });
        // Optional: Add method to find payment by reference
        this.verifyPayment = (reference) => __awaiter(this, void 0, void 0, function* () {
            const response = yield paystack.post('/transaction/verify-payment');
            return response.data;
        });
    }
}
exports.default = PaymentService;
