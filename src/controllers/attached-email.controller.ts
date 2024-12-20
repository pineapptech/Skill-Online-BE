import { Request, Response } from 'express';
import OfferEmail from '../emails/offer-letter.email';
import User from '../models/user.model';
import { Payment } from '../models/payment.model';
import { trace } from 'console';

class AttachmentEmailController {
    // private attachedEmailService: AttachmentEmailService;
    private offerEmail: OfferEmail;

    constructor(offerEmail: OfferEmail) {
        this.offerEmail = offerEmail;
    }

    public sendAttachmentEmail = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });

            if (!user) {
                res.status(404).json({
                    status: false,
                    message: 'User not found Kindly Apply Before you can make Payments'
                });
                return;
            }
            const firstName = user.firstName;
            const lastName = user.lastName;
            // const userEmail = user.email
            const course = user.course;
            const city = user.city;
            const regNo = user.regNo;
            const phone = user.phone;
            const address = user.address;

            const payment = await Payment.findOne({ email: user.email });
            if (payment?.email === user.email && payment?.status === 'success') {
                await this.offerEmail.sendRegistrationEmailWithAttachment({
                    firstName,
                    lastName,
                    email,
                    course,
                    city,
                    regNo,
                    phone,
                    address
                });

                res.status(200).json({
                    status: true,
                    message: 'Email Offer Letter Sent successfully...'
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Payment not successful Kindly make payment to get your offer letter'
                });
            }
        } catch (error) {
            trace(error);
        }
    };
}

export default AttachmentEmailController;
