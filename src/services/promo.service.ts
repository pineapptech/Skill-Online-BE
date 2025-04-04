import { table } from 'console';
import IPromo from '../interfaces/promo.interface';
import Promo from '../models/promo.model';
import generatePromoCode from '../utils/promo';

class PromoService {
    public createPromo = async (payload: IPromo): Promise<IPromo> => {
        const emailExists = await this.emailExists(payload.email);

        if (emailExists) {
            throw new Error('Email Already Exists');
        }
        const promoCode = generatePromoCode();
        payload.promoCode = promoCode;
        table(payload);
        const promo = new Promo({ ...payload });
        return await promo.save();
    };

    private emailExists = async (email: string) => {
        const emailExists = await Promo.findOne({ email });
        return emailExists;
    };
}

export default PromoService;
