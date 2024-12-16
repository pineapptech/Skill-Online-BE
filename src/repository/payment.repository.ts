import { Payment } from '../models/payment.model';
import { IPayment, IPaymentRepository, PaymentStatus } from '../interfaces/payment.interface';

export class PaymentRepository implements IPaymentRepository {
    async create(paymentData: Partial<IPayment>): Promise<IPayment> {
        const payment = new Payment(paymentData);
        return await payment.save();
    }

    async findByReference(reference: string): Promise<IPayment | null> {
        return await Payment.findOne({ reference });
    }

    async updateStatus(reference: string, status: PaymentStatus): Promise<void> {
        await Payment.updateOne({ reference }, { status });
    }
}
