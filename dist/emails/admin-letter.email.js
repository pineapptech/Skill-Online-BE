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
exports.AdminLetter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
class AdminLetter {
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
    sendAdminMessage(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield this.createEmailTransport();
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
                const info = yield transporter.sendMail(mailOptions);
                console.log('Email Sent Successfully...', info.response);
            }
            catch (error) {
                console.error('Email Sending Failed', error);
                throw error;
            }
        });
    }
    notifySupperAdmins(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const transporter = yield this.createEmailTransport();
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: ['chidubemanowor@gmail.com', 'graciousobeagu@gmail.com', 'jjustinalexx@gmail.com'],
                subject: 'New Admin Registration - Activation Required',
                html: `<b>Hello Super Admin</b>,
    
                <p>A new admin has just registered on the platform. Please review their details and activate their account if necessary.</p>
    
                <b>Admin Details:</b>
                
                <p><b>Fullname: </b> ${adminData.fullname}</p>
                <p><b>Email: </b> ${(_a = adminData.email) === null || _a === void 0 ? void 0 : _a.toLowerCase()}</p>

               
                <p>Best regards,</p>
                <p>SkillOnline ETSAP Onboarding team</p>
                `
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
    supperAdminsPayment(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield this.createEmailTransport();
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: adminData.email,
                subject: 'Your Registration Summary & Payment Details 💰',
                html: `<b>Hello ${adminData.fullname}</b>,
    
                <p>Congratulations! Your admin account has been successfully activated. Now, let’s talk business.</p>
    
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
exports.AdminLetter = AdminLetter;
