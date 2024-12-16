import { Document, Types } from 'mongoose';

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed'
}
export interface IPayment extends Document {
    userId: Types.ObjectId;
    email: string;
    reference: string;
    amount: number;
    status: PaymentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPaymentService {
    initiatePayment(userId: string, amount: number, email: string): Promise<string>;
    verifyPayment(reference: string): Promise<boolean>;
    handleWebhook(payload: any): Promise<void>;
}
export interface IPaymentRepository {
    create(payment: Partial<IPayment>): Promise<IPayment>;
    findByReference(reference: string): Promise<IPayment | null>;
    updateStatus(reference: string, status: PaymentStatus): Promise<void>;
}
