import axios from 'axios';
import { IPayment, IPaymentService, PaymentStatus } from '../interfaces/payment.interface';
import { PaymentRepository } from '../repository/payment.repository';
import { Types } from 'mongoose';

export class PayStackService implements IPaymentService {
    private paystackSecretKey: string;
    private paymentRepository: PaymentRepository;

    constructor(secretKey: string) {
        this.paystackSecretKey = secretKey;
        this.paymentRepository = new PaymentRepository();
    }

    async initiatePayment(userId: string, amount: number, email: string): Promise<string> {
        try {
            const response: any = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                {
                    amount: amount * 100, // Convert to kobo/cents
                    email,
                    callback_url: 'https://etsapsfrica.com/success'
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.paystackSecretKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { reference } = response.data.data;

            // Save payment record
            await this.paymentRepository.create({
                userId: new Types.ObjectId(userId),
                email,
                amount,
                reference,
                status: PaymentStatus.PENDING
            });

            return response.data.data.authorization_url;
        } catch (error: any) {
            console.error('Payment initiation failed:', error.message);
            throw new Error(`Payment initiation failed =>${error.message}`);
        }
    }

    async verifyPayment(reference: string): Promise<boolean> {
        try {
            const response: any = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.paystackSecretKey}`
                }
            });

            const { status } = response.data.data;
            const isSuccessful = status === 'success';

            // Update payment status
            await this.paymentRepository.updateStatus(reference, isSuccessful ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);

            return isSuccessful;
        } catch (error) {
            console.error('Payment verification failed:', error);
            return false;
        }
    }

    async handleWebhook(payload: any): Promise<void> {
        const { event, data } = payload;

        switch (event) {
            case 'charge.success':
                await this.paymentRepository.updateStatus(data.reference, PaymentStatus.SUCCESS);
                break;
            case 'charge.failed':
                await this.paymentRepository.updateStatus(data.reference, PaymentStatus.FAILED);
                break;
        }
    }

    async getPaymentStatus() {
        const status = await this.paymentRepository.getPaymentStatus();
        return status;
    }

    async getUserDetails() {
        const users = await this.paymentRepository.getUserDetails();
        return users;
    }
}
