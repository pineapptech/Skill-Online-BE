"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
class OfferEmail {
    constructor(offerLetter) {
        this.offerLetter = offerLetter;
    }
    createEmailTransport() {
        return __awaiter(this, void 0, void 0, function* () {
            return nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        });
    }
    sendRegistrationEmailWithAttachment(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield this.createEmailTransport();
            const pdfBuffer = yield this.offerLetter.generateOfferLetter(userData);
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
            <td style="padding: 8px;">Online Course Sessions start Monday February 3rd 2025</td>
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
            <td style="padding: 8px;">Applications and Registrations close Midnight (WAT) January 31st 2025</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Other Info</td>
            <td style="padding: 8px;">Skillonline will send your login credentials to the LMS on the 2nd of February 2025.</td>
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
                const info = yield transporter.sendMail(mailOptions);
                console.log('Email with Attachment Sent Successfully...', info.response);
            }
            catch (error) {
                console.error('Email Sending Failed', error);
                throw error;
            }
        });
    }
    sendRegistrationEmailWithoutAttachment(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield this.createEmailTransport();
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
                const info = yield transporter.sendMail(mailOptions);
                console.log('Email Sent Successfully...', info.response);
            }
            catch (error) {
                console.error('Email Sending Failed', error);
                throw error;
            }
        });
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
exports.default = OfferEmail;
