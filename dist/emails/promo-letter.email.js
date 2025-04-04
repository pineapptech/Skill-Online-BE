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
class PromoEmail {
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
    sendPromoCodeEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield this.createEmailTransport();
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
exports.default = PromoEmail;
