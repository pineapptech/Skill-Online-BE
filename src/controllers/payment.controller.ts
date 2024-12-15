import axios from 'axios';
import { Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import PaymentService from '../services/payment.service';
import User from '../models/user.model';
import { Payment } from '../models/payment.model';

configDotenv();

class PayStackController {
    private paymentService: PaymentService;

    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
    }

    public initializePayment = async (req: Request, res: Response) => {
        try {
            const { amount, email } = req.body;

            const paymentData: any = await this.paymentService.createPayment(email, amount);
            res.status(200).json({
                authorization_url: paymentData.data.authorization_url,
                reference: paymentData.data.reference
            });
        } catch (error: any) {
            console.error('Payment initialization error:', error);
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    };

    /* public verifyPayment = async (req: Request, res: Response) => {
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
    }; */

    // handling Webhook
    public handleWebhook = async (req: Request, res: Response) => {
        try {
            const secret = process.env.PAYSTACK_SECRET_KEY;

            // Verify webhook signature
            const signature = req.headers['x-paystack-signature'] as string;
            const crypto = require('crypto');
            const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

            if (hash !== signature) {
                res.status(401).send('Invalid signature');
                return;
            }

            const { event, data } = req.body;

            if (event === 'charge.success') {
                const { reference, amount, status, customer } = data;

                // Find the user by email
                const user = await User.findOne({ email: customer.email });
                if (user) {
                    // Save payment details
                    await Payment.create({
                        userId: user._id,
                        reference,
                        amount: amount / 100, // Convert from kobo to naira
                        status
                    });
                }
            }

            res.status(200).send('Webhook received successfully');
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).send('Webhook handling failed');
        }
    };
}

export default PayStackController;
