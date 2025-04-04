import { NextFunction, Request, Response } from 'express';
import PromoService from '../services/promo.service';
import CustomError from '../errors/CustomError';
import PromoEmail from '../emails/promo-letter.email';

class PromoController {
    private promo: PromoService;
    private emailPromo: PromoEmail;

    constructor() {
        this.promo = new PromoService();
        this.emailPromo = new PromoEmail();
    }

    public createPromo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { ...payload } = req.body;

            if (!payload.fullName || !payload.email) {
                return next(new CustomError('All Fields must be provided.', 400));
            }

            const promo = await this.promo.createPromo(payload);

            await this.emailPromo.sendPromoCodeEmail(promo);
            res.status(201).json({
                message: 'Promo Code Created Successfully',
                status: true,
                data: promo
            });
        } catch (error: any) {
            res.status(500).json({
                message: 'Promo Code Creation failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error.stack
            });
        }
    };
}

export default PromoController;
