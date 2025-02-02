import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { configDotenv } from 'dotenv';
import { RegistrationValidation, ValidationError } from '../utils/user-schema';
import OfferEmail from '../emails/offer-letter.email';
import User from '../models/user.model';
import { Payment } from '../models/payment.model';
import { log } from 'console';
import IContact from '../interfaces/contact.interface';
configDotenv();

export interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    course: string;
    city: string;
    regNo: string;
    phone: string;
    address: string;
}
export interface messageData {
    name: string;
    email: string;
    message: string;
}
class RegistrationController {
    private userService: UserService;
    private offerEmail: OfferEmail;

    constructor(userService: UserService, offerEmail: OfferEmail) {
        this.userService = userService;
        this.offerEmail = offerEmail;
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

            const { firstName, lastName, email, phone, course, city, regNo, address, ...otherData } = validatedData;
            log(regNo);
            // const emailExists = await User.findOne({ email });
            // if (emailExists) {
            //     res.status(400).json({
            //         status: false,
            //         message: 'Email already exists'
            //     });
            //     return;
            // }

            const newUser = await this.userService.createUser(req.file, firstName, lastName, email, phone, course, city, address, otherData);

            if (newUser) {
                await this.offerEmail.sendRegistrationEmailWithoutAttachment({ firstName, email, lastName, phone, course, city, regNo, address });

                res.status(201).json({
                    message: 'Registration successful',
                    user: {
                        id: newUser._id,
                        name: newUser.firstName,
                        email: newUser.email
                    }
                });

                setTimeout(async () => {
                    const payment = await Payment.findOne({ email: newUser.email });
                    if (payment?.status === 'success') {
                        await this.offerEmail.sendRegistrationEmailWithAttachment({ firstName, email, lastName, phone, course, city, regNo, address });
                    }
                }, 5000);
            }
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

    public getUserEmail = async (req: Request, res: Response) => {
        try {
            const email = req.body.email as string;
            if (!email) {
                res.status(400).json({
                    status: false,
                    message: 'Email is required'
                });
                return;
            }
            const emailExists = await this.userService.getAUserEmail(email);
            if (!emailExists) {
                res.status(404).json({
                    status: false,
                    message: 'Email not found'
                });
                return;
            }
            res.status(200).json({
                status: true,
                data: emailExists
            });
        } catch (error: any) {
            res.status(500).json({
                error: 'An error occurred',
                message: error.message
            });
        }
    };
}

export default RegistrationController;
