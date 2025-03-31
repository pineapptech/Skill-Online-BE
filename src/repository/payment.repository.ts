import { Payment } from '../models/payment.model';
import { IPayment, IPaymentRepository, PaymentStatus } from '../interfaces/payment.interface';
import User from '../models/user.model';
import IUser from '../interfaces/user.interface';

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

    async getPaymentStatus(): Promise<IPayment[]> {
        const payment = await Payment.find({ status: PaymentStatus.SUCCESS });
        return payment;
    }
    async getUserDetails(): Promise<IUser[]> {
        const users = await User.find().populate({
            path: 'payment',
            match: { status: PaymentStatus.SUCCESS },
            options: { strictPopulate: false }
        });

        return users;
    }
}
