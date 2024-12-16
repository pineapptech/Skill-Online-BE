// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PayStackService } from '../services/payment.service';

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
        } catch (error) {
            res.status(500).json({ error: 'Payment initiation failed' });
        }
    }

    async verifyPayment(req: Request, res: Response): Promise<void> {
        try {
            const { reference } = req.query;
            const isVerified = await this.paystackService.verifyPayment(reference as string);
            res.json({ verified: isVerified });
        } catch (error) {
            res.status(500).json({ error: 'Payment verification failed' });
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
}
