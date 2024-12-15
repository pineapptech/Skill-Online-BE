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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const user_schema_1 = require("../utils/user-schema");
(0, dotenv_1.configDotenv)();
class RegistrationController {
    constructor(userService, offerLetter) {
        this.deleteUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.deleteUsers();
            res.status(200).json({
                status: true,
                message: 'Deleted successfully...',
                user
            });
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUsers();
            if (user.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'No users were found'
                });
                return;
            }
            res.status(200).json({
                status: true,
                data: user
            });
        });
        this.userService = userService;
        this.offerLetter = offerLetter;
    }
    createEmailTransporter() {
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
    sendRegistrationEmail(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield this.createEmailTransporter();
            // generate PDF using the new PDF generator
            const pdfBuffer = yield this.offerLetter.generateOfferLetter(userData);
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
      `,
                attachments: [
                    {
                        filename: 'admission-letter.pdf',
                        // content: `Welcome to our platform, ${userData.firstName}!\nWe're excited to have you on board.`
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    }
                ]
            };
            try {
                const info = yield transporter.sendMail(mailOptions);
                console.log('Email sent:', info.response);
            }
            catch (error) {
                console.error('Email sending failed:', error);
            }
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = user_schema_1.RegistrationValidation.validate(Object.assign(Object.assign({}, req.body), { file: req.file }));
                if (!req.file) {
                    res.status(400).json({
                        status: false,
                        message: 'Kindly Select a file to continue this registration'
                    });
                    return;
                }
                const { firstName, lastName, email, phone, course, address, regNo } = validatedData, otherData = __rest(validatedData, ["firstName", "lastName", "email", "phone", "course", "address", "regNo"]);
                const newUser = yield this.userService.createUser(req.file, firstName, lastName, email, phone, course, address, otherData);
                yield this.sendRegistrationEmail({
                    firstName,
                    lastName,
                    email,
                    course,
                    address,
                    regNo,
                    phone,
                });
                res.status(201).json({
                    message: 'Registration successful',
                    user: {
                        name: newUser.firstName,
                        email: newUser.email
                    }
                });
            }
            catch (error) {
                console.error('Registration error:', error);
                if (error instanceof user_schema_1.ValidationError) {
                    res.status(400).json({
                        message: 'Validation Failed',
                        errors: error.errors
                    });
                    return;
                }
                res.status(500).json({
                    message: 'Registration failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error.stack
                });
            }
        });
    }
}
exports.default = RegistrationController;
