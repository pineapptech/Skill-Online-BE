// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PayStackService } from '../services/payment.service';
import User from '../models/user.model';
import { countReset, log } from 'console';

export class PaymentController {
    private paystackService: PayStackService;

    constructor(secretKey: string) {
        this.paystackService = new PayStackService(secretKey);
    }

    async initiatePayment(req: Request, res: Response): Promise<void> {
        try {
            const { userId, amount, email } = req.body;
            const paymentUrl = await this.paystackService.initiatePayment(userId, amount, email);
            res.json({ paymentUrl });
        } catch (error: any) {
            res.status(500).json({
                error: 'Payment initiation failed',
                message: error.message
            });
        }
    }

    async verifyPayment(req: Request, res: Response): Promise<void> {
        try {
            const { reference } = req.query;
            const isVerified = await this.paystackService.verifyPayment(reference as string);
            res.json({ verified: isVerified });
        } catch (error: any) {
            res.status(500).json({
                error: 'Payment verification failed',
                message: error.message
            });
        }
    }

    async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            await this.paystackService.handleWebhook(req.body);
            res.status(200).send('Webhook received');
        } catch (error) {
            res.status(500).send('Webhook processing failed');
        }
    }

    async getPaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            const status = await this.paystackService.getPaymentStatus();
            res.json({
                message: 'Payment status fetched successfully',
                length: status.length,
                status
            });
        } catch (error) {
            console.error('Error fetching payment status:', error);
            throw error;
        }
    }
    async getUserDetails(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: 'payments', // Name of the collection in MongoDB
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'payments'
                    }
                },
                {
                    $match: {
                        'payments.status': 'success' // Filter for users with at least one successful payment
                    }
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        regNo: 1,
                        phone: 1,
                        course: 1,
                        payments: 1 // Include payment details if needed
                    }
                }
            ]);

            res.status(200).json({
                message: 'Users fetched successfully',
                length: users.length,
                users
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching users', error });
            log(error.message);
        }
    }
}
