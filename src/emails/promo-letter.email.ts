import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import IPromo from '../interfaces/promo.interface';
configDotenv();

class PromoEmail {
    private async createEmailTransport() {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    public async sendPromoCodeEmail(payload: IPromo) {
        const transporter = await this.createEmailTransport();
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: payload.email,
            subject: 'Your Exclusive Promo Code',
            html: `<span>Dear, </span> <strong> ${payload.fullName},</strong>


            <p>Thank you for being a valued member of our community! As part of our special offer, we are excited to share your exclusive promo code for students who will register under you to use.</p>
            
            <p><strong>Your Promo Code: ${payload.promoCode}</strong></p>
            
            <p>The above Promo code will be used by student who registered under you </p>
            
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            
            <p>Best Regards,</p>
            <br/>
            <br/>
            <p>SkillOnline ETSAP Onboarding team</p>`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email Sent Successfully...', info.response);
        } catch (error) {
            console.error('Email Sending Failed', error);
            throw error;
        }
    }
}

export default PromoEmail;
