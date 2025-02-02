"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate references
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Payment = mongoose_1.default.model('Payment', PaymentSchema);
