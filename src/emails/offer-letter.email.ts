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
            subject: 'ADMISSION LETTER - Emerging Tech Skills for AFrica Program',
            html: `<h2>Welcome ${userData.firstName} ${userData.lastName},<h2/>

            <p>I am pleased to inform you that you have successfully been admitted in to the Emerging Technology Skill For Africa Program. Please find attached to this email, your admission letter and your program onboarding details.</p>
            <p>Congratulations.</p>
            <p>Signed,</p>
            <p>Gabriele Tomasi-Canova</p>
            
            <br>
      <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr>
            <th style="padding: 8px;">Onboarding Details</th>
            <th style="padding: 8px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px;">Start Date</td>
            <td style="padding: 8px;">Online Course Sessions start Monday March 3rd 2025</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Learning Model</td>
            <td style="padding: 8px;">Fully Virtual Classes</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Frequency and allocation</td>
            <td style="padding: 8px;">2 Learning Sessions per week (One and half Hours per session)</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Program Duration</td>
            <td style="padding: 8px;">26 weeks</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Incubation model</td>
            <td style="padding: 8px;">Weekly hands-on task + Capstone Project</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Reg. Closing Date</td>
            <td style="padding: 8px;">Applications and Registrations close Midnight (WAT) March 2nd 2025</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Other Info</td>
            <td style="padding: 8px;">Skillonline will send your login credentials to the LMS on the 2nd of March 2025.</td>
          </tr>
        </tbody>
      </table>

      <p>Click the Link Below to Join the Slack Channel </p>
      <button style="background-color: purple; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"> <a style="color: white; text-decoration: none;" href="https://join.slack.com/t/emergingtechs-n0f7312/shared_invite/zt-2v8mgnt2t-8P6E3O0T4pj2xMfNWpmkBQ">Link To Join the Slack Channel</a></button>
            `,

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
            from: process.env.SMTP_USER,
            to: userData.email,
            subject: 'Registration Successful',
            html: `<span>Dear, </span> <strong> ${userData.firstName} ${userData.lastName},</strong>


            <p>Thank you for registering with us!</p>
            
            <p>We are excited that you have taken this milestone step towards acquiring you tech emerging skill. We are currently processing your application so you'll receive your admission letter and your onboarding details shortly.</p>
            
            <p>Signed,</p>
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

/*         const mailOptions = {
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
                <p>Skillonline will Send Your Login Credentials to your LMS between the 30th and 2nd of February 2025</p>
      `
        }; */
export default OfferEmail;
