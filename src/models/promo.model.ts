import mongoose, { Schema } from 'mongoose';
import IPromo from '../interfaces/promo.interface';

const promoSchema = new Schema<IPromo>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    promoCode: {
        type: String
    }
});

const Promo = mongoose.model<IPromo>('Promo', promoSchema);
export default Promo;
