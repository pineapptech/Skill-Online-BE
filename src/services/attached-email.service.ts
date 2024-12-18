import { IPayment } from '../interfaces/payment.interface';
import IUser from '../interfaces/user.interface';
import { Payment } from '../models/payment.model';
import User from '../models/user.model';

class AttachmentEmailService {
    public paymentPayload = async (payload: IPayment): Promise<IPayment[]> => {
        const userPayload = Payment.find();
        return userPayload;
    };

    public userEmail = async (userData: IUser): Promise<IUser[]> => {
        const user = await User.find();
        return user;
    };
}

export default AttachmentEmailService;
