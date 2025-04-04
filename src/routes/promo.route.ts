import { Router } from 'express';
import PromoController from '../controllers/promo.controller';

const promoRouter = Router();

const promoController = new PromoController();

promoRouter.route('/create-promo').post(promoController.createPromo);

export default promoRouter;
