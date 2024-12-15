import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
    userId: Types.ObjectId;
    email: string;
    fullName?: string;
    amount: number;
    reference: string; // Added reference field
    currency?: string;
    status?: 'pending' | 'success' | 'failed';
    paymentMethod?: string;
    lastFourCardDigits?: string;
    channel?: string;
}
