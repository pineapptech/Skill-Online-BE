import { Types } from 'mongoose';
import { IPayment } from '../interfaces/payment.interface';
import { Payment } from '../models/payment.model';
import axios from 'axios';
import { configDotenv } from 'dotenv';

const paystack = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    }
});
class PaymentService {
    public createPayment = async (email: string, amount: number) => {
        const response = await paystack.post('/transaction/initialize', {
            email,
            amount: amount * 100
        });
        return response.data;
    };

    // Optional: Add method to find payment by reference
    public verifyPayment = async (reference: string) => {
        const response = await paystack.post('/transaction/verify-payment');
        return response.data;
    };
}

export default PaymentService;
