import mongoose from 'mongoose';
import { IPayment } from '../interfaces/payment.interface';

const PaymentSchema = new mongoose.Schema<IPayment>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        email: {
            type: String,
            required: true
        },
        fullName: String,
        amount: {
            type: Number,
            required: true
        },
        reference: {
            type: String,
            required: true,
            unique: true // Ensures no duplicate references
        },
        currency: {
            type: String,
            default: 'NGN'
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending'
        },
        paymentMethod: String,
        lastFourCardDigits: String,
        channel: String
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
