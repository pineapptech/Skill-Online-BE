import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import { RegistrationData } from '../controllers/user.controller';
import OfferLetterGenerator from '../utils/offer-letter';
configDotenv();

class OfferEmail {
    private offerLetter: OfferLetterGenerator;
    constructor(offerLetter: OfferLetterGenerator) {
        this.offerLetter = offerLetter;
    }

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

    public async sendRegistrationEmailWithAttachment(userData: RegistrationData) {
        const transporter = await this.createEmailTransport();

        const pdfBuffer = await this.offerLetter.generateOfferLetter(userData);

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userData.email,
            subject: 'Your Admission Letter Offer',
            html: `<h2>Welcome ${userData.firstName} ${userData.lastName},<h2/>

            <p>I am pleased to inform you that you have successfully been admitted in to the Emerging Technology Skill For Africa Program. Please find attached to this email, your admission letter and your program onboarding details.</p>
            <p>Congratulations.</p>
            <p>Signed,</p>
            <p>Gabriele Tomasi-Canova</p>`,

            attachments: [
                {
                    filename: 'admission-letter.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email with Attachment Sent Successfully...', info.response);
        } catch (error) {
            console.error('Email Sending Failed', error);
            throw error;
        }
    }

    public async sendRegistrationEmailWithoutAttachment(userData: RegistrationData) {
        const transporter = await this.createEmailTransport();
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userData.email,
            subject: 'Registration Successful',
            html: `
                <h1>Welcome, ${userData.firstName}!</h1>
                <h2>Below are Your Onboarding Details...</h2>
                <p>Online Course sessions starts on Monday, February 3rd 2025</p>
                <p>Fully Virtual Class</p>
                <p>2 Learning Sessions Per Week (1 and half Hour per session)</p>
                <p>6 Months duration (26weeks)</p>
                <p>Weekly hands-on task + Capstone Project</p>
                <p>Application form Registration closes Midnight (WAT), January 31st 2025</p>
                <p>Skillonline will Send Your Login Credentials to your LMS between the 30the and 2nd of February 2025</p>
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

export default OfferEmail;
