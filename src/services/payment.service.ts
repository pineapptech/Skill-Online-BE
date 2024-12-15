import { Types } from 'mongoose';
import { IPayment } from '../interfaces/payment.interface';
import { Payment } from '../models/payment.model';

class PaymentService {
    public createPayment = async (payload: Partial<IPayment>): Promise<IPayment> => {
        try {
            if (!payload.reference || !payload.amount) {
                throw new Error('Payment reference and amount are required');
            }

            const userPayload = await Payment.create({
                reference: payload.reference,
                userId: payload?.userId ? new Types.ObjectId(payload.userId) : undefined
            });

            return userPayload;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    };

    // Optional: Add method to find payment by reference
    public findPaymentByReference = async (reference: string) => {
        return await Payment.findOne({ reference });
    };
}

export default PaymentService;
