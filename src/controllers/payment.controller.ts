import axios from 'axios';
import { Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import PaymentService from '../services/payment.service';

configDotenv();

class PayStackController {
    private PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    private paymentService: PaymentService;

    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
    }

    public initializePayment = async (req: Request, res: Response) => {
        try {
            const { amount, email } = req.body;

            const response: any = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                {
                    amount: amount * 100, // Convert to kobo
                    email,
                    // metadata: { userId }, // Pass user ID in metadata
                    callback_url: 'http://localhost:3000/dashboard'
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            res.json({
                authorization_url: response.data.data.authorization_url,
                reference: response.data.data.reference
            });
        } catch (error: any) {
            console.error('Payment initialization error:', error);
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    };

    public verifyPayment = async (req: Request, res: Response) => {
        try {
            const { reference } = req.params;

            // Check if payment already exists to prevent duplicates
            const existingPayment = await this.paymentService.findPaymentByReference(reference);
            console.log('My Reference=>', existingPayment);
            if (existingPayment) {
                res.status(200).json({
                    status: true,
                    message: 'Payment already processed',
                    amount: existingPayment.amount
                });
                return;
            }

            const response: any = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`
                }
            });

            const paymentData = response.data.data;

            if (paymentData.status === 'success' && paymentData.gateway_response === 'success') {
                // Save Payment to database
                const savedPayment = await this.paymentService.createPayment(paymentData);

                res.status(200).json({
                    status: true,
                    amount: paymentData.amount / 100,
                    reference: paymentData.reference,
                    savedPayment
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Payment Verification Failed'
                });
            }
        } catch (error: any) {
            console.error('Payment verification error:', error);
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    };
}

export default PayStackController;
