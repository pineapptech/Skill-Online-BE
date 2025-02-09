import nodemailer from 'nodemailer';
import { adminInfo } from '../controllers/bulk-admin.controller';
import { configDotenv } from 'dotenv';
configDotenv();

export class AdminLetter {
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

    public async sendAdminMessage(adminData: adminInfo) {
        const transporter = await this.createEmailTransport();
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: adminData.email,
            subject: 'Your Admin Account Has Been Approved',
            html: ` Hi ${adminData.fullname},
    
                <p>Your admin account for the request of Bulk Registration on Emerging Tech SkillOnline has been successfully approved. You can now you can now use the ID below to continue your bulk registration of your candidates.</p>
    
                <b>ID: ${adminData.bulkId}</b>
                
                <p>If you have any questions, please don't hesitate to reach out.</p>
    
                <p>Best regards,</p>
    
                <p>Signed,</p>
                <br/>
                <p>SkillOnline ETSAP Onboarding team</p>
                `
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
