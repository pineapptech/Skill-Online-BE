import { Document } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    regNo: string;
    phone: string;
    stateOrCountry: string;
    province: string;
    city: string;
    address: string;
    passportId: string;
    photoUrl: string;
    course: string;
    promoCode: string;
}

export default IUser;
