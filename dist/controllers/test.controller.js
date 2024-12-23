"use strict";
/* import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { UserService } from '../services/user.service';
import { configDotenv } from 'dotenv';
import OfferLetterGenerator from '../utils/offer-letter';
import { RegistrationValidation, ValidationError } from '../utils/user-schema';
configDotenv();

export interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    course: string;
    address: string;
    regNo: string;
    phone: string;
}

class RegistrationController {
    private userService: UserService;
    private offerLetter: OfferLetterGenerator;

    constructor(userService: UserService, offerLetter: OfferLetterGenerator) {
        this.userService = userService;
        this.offerLetter = offerLetter;
    }

    private async createEmailTransporter() {
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

    private async sendRegistrationEmail(userData: RegistrationData) {
        const transporter = await this.createEmailTransporter();

        // generate PDF using the new PDF generator
        const pdfBuffer = await this.offerLetter.generateOfferLetter(userData);

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
                    contentType: 'application/pdf'
                }
            ]
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        } catch (error) {
            console.error('Email sending failed:', error);
        }
    }

    public async registerUser(req: Request, res: Response) {
        try {
            const validatedData = RegistrationValidation.validate({
                ...req.body,
                file: req.file
            });

            if (!req.file) {
                res.status(400).json({
                    status: false,
                    message: 'Kindly Select a file to continue this registration'
                });
                return;
            }
            const { firstName, lastName, email, phone, course, address, regNo, ...otherData } = validatedData;

            const newUser = await this.userService.createUser(req.file, firstName, lastName, email, phone, course, address, otherData);

            await this.sendRegistrationEmail({
                firstName,
                lastName,
                email,
                course,
                address,
                regNo,
                phone
            });

            res.status(201).json({
                message: 'Registration successful',
                user: {
                    id: newUser._id,
                    name: newUser.firstName,
                    email: newUser.email
                }
            });
        } catch (error: any) {
            console.error('Registration error:', error);

            if (error instanceof ValidationError) {
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
    }

    public deleteUsers = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.deleteUsers();
        res.status(200).json({
            status: true,
            message: 'Deleted successfully...',
            user
        });
    };

    public getUsers = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.getUsers();
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
    };
}

export default RegistrationController;


 */
