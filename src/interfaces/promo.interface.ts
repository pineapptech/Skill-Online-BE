import { Document, Types } from 'mongoose';

interface IPromo extends Document {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    promoCode: string;
}

export default IPromo;
