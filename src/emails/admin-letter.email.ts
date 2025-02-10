import nodemailer from 'nodemailer';
import { adminInfo } from '../controllers/bulk-admin.controller';
import { configDotenv } from 'dotenv';
configDotenv();

interface adminPayment {
    fullname: string;
    count: number;
    email: string;
    yourFee: number;
}
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

    public async notifySupperAdmins(adminData: Partial<adminInfo>) {
        const transporter = await this.createEmailTransport();
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: ['chidubemanowor@gmail.com', 'graciousobeagu@gmail.com', 'jjustinalexx@gmail.com'],
            subject: 'New Admin Registration - Activation Required',
            html: `<b>Hello Super Admin</b>,
    
                <p>A new admin has just registered on the platform. Please review their details and activate their account if necessary.</p>
    
                <b>Admin Details:</b>
                
                <p><b>Fullname: </b> ${adminData.fullname}</p>
                <p><b>Email: </b> ${adminData.email?.toLowerCase()}</p>

               
                <p>Best regards,</p>
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

    public async supperAdminsPayment(adminData: Partial<adminPayment>) {
        const transporter = await this.createEmailTransport();
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: adminData.email,
            subject: 'Your Registration Summary & Payment Details 💰',
            html: `<b>Hello ${adminData.fullname}</b>,
    
                <p>Congratulations! Your admin account has created proxy accounts successfully!</p>
                
                <p>Now, let’s finish the onboarding! </p>
                
                <b>Here’s the summary of your registered users so far:</b>
                
                <p><b>👥 Total Registrations:  </b> ${adminData.count}</p>
                <p><b>💵 Total Amount to Pay: </b> ${adminData.yourFee}</p>
                
                <p><b>🏦 Payment Details:</b></p>
                <ul>
                    <li><b>Bank Name: </b> ZENITH BANK</li>
                    <li><b>Account Name:</b> IBRI-EUREKA EDU PROJECT AFRICA</li>
                    <li><b>Account Number: </b> 5072153472</li>
                </ul>
               
                <p> We’re excited to have you on board, and we know you love smooth operations—so let’s keep things seamless. Kindly make the payment to activate your users and get things rolling.</p>

                <p>Got any questions? We’re just an email away! 📩 </p>
                <p>Cheers,</p>
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
