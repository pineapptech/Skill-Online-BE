import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
    userId: Types.ObjectId;
    email: string;
    reference: string;
    amount: number;
    status: string;
}
