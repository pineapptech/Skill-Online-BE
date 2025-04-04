// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PayStackService } from '../services/payment.service';
import User from '../models/user.model';
import { countReset, log } from 'console';
import { Payment } from '../models/payment.model';

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
                        payments: { $elemMatch: { status: 'success' } } // Correct way to match array elements
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
                        payments: {
                            $filter: {
                                input: '$payments',
                                as: 'payment',
                                cond: { $eq: ['$$payment.status', 'success'] } // Filter out non-success payments
                            }
                        }
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

    getUsersWithSuccessfulPayments = async (req: Request, res: Response) => {
        try {
            const usersWithSuccessfulPayments = await Payment.aggregate([
                {
                    $match: { status: 'success' } // Step 1: Get only successful payments
                },
                {
                    $lookup: {
                        from: 'users', // Step 2: Join with users collection
                        localField: 'email', // Match by email instead of userId
                        foreignField: 'email',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user' // Convert array to object
                },
                {
                    $group: {
                        _id: '$user.email', // Step 3: Group users by email
                        firstName: { $first: '$user.firstName' },
                        lastName: { $first: '$user.lastName' },
                        email: { $first: '$user.email' },
                        regNo: { $first: '$user.regNo' },
                        phone: { $first: '$user.phone' },
                        courses: { $addToSet: '$user.course' }, // Ensure all registered courses are included
                        payments: {
                            $push: {
                                amount: '$amount',
                                reference: '$reference',
                                status: '$status'
                            }
                        } // Collect all successful payments
                    }
                },
                {
                    $project: {
                        _id: 0, // Exclude MongoDB's default _id
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        regNo: 1,
                        phone: 1,
                        courses: 1,
                        payments: 1
                    }
                }
            ]);

            res.status(200).json({
                message: 'Users with successful payments fetched successfully',
                length: usersWithSuccessfulPayments.length,
                usersWithSuccessfulPayments
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users with successful payments', error });
        }
    };

    paymentCount = async (req: Request, res: Response) => {
        try {
            const successfulPaymentCount = await Payment.countDocuments({ status: 'success' });

            res.status(200).json({ successCount: successfulPaymentCount });
        } catch (error) {
            res.status(500).json({ message: 'Error counting successful payments', error });
        }
    };
}
