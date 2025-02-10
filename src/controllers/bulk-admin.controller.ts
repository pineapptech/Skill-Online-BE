import { Request, Response } from 'express';
import IBulkAdmin from '../interfaces/bulk-interface';
import BulkAdmin from '../models/bulk.model';
import { BulkAdminService } from '../services/bulk-admin.service';
import bcrypt from 'bcryptjs';
import { AdminLetter } from '../emails/admin-letter.email';
import { generateBulkId } from '../utils/bulk-id';
import { log } from 'console';
import generateToken from '../utils/generateToken.utils';

export interface adminInfo {
    fullname: string;
    email: string;
    bulkId: string;
}
class BulkAdminController {
    private bulkAdminService: BulkAdminService;
    private adminLetter: AdminLetter;
    constructor() {
        this.bulkAdminService = new BulkAdminService();
        this.adminLetter = new AdminLetter();
    }
    public createBulkAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const body: IBulkAdmin = req.body;

            if (!body.email || !body.fullname || !body.province || !body.phone || !body.password) {
                res.status(400).json({
                    status: false,
                    message: 'All fields are required'
                });
                return;
            }

            const adminEmailExists = await BulkAdmin.findOne({ email: body.email });
            if (adminEmailExists) {
                res.status(400).json({
                    status: false,
                    message: 'Email already exists'
                });
                return;
            }

            const hashPassword = bcrypt.hashSync(body.password, 10);
            const bulkId = generateBulkId(body.province);
            const decryptedPassword = bcrypt.compareSync(body.password, hashPassword);

            log('Hash password ' + hashPassword);
            log('decrypted password ' + decryptedPassword);

            const admin = {
                fullname: body.fullname,
                email: body.email,
                province: body.province,
                phone: body.phone,
                password: hashPassword,
                bulkId
            };

            const fullname = body.fullname;
            const email = body.email;

            const bulkAdmin = await this.bulkAdminService.createBulkAdmin(admin);
            const notifySupperAdmins = await this.adminLetter.notifySupperAdmins({ fullname, email });
            res.status(201).json({
                status: true,
                message: 'Bulk admin created statusfully, A verification process is in progress and we will send you a notification through your email once it is completed'
            });
        } catch (error: any) {
            res.status(400).json({
                status: false,
                error: error.message
            });
        }
    };

    public updateAdminStatus = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                res.status(400).json({
                    status: false,
                    message: 'Email is required'
                });
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid email format'
                });
                return;
            }

            const updatedAdmin = await this.bulkAdminService.changeAdminStatus(email);

            if (!updatedAdmin) {
                res.status(404).json({
                    status: false,
                    message: 'Admin not found'
                });
                return;
            }

            if (updatedAdmin.status === true) {
                res.status(200).json({
                    status: true,
                    message: 'Admin Already Verified...'
                });
                return;
            }

            const fullname = updatedAdmin.fullname;
            const bulkId = updatedAdmin.bulkId;

            if (updatedAdmin) {
                const adminMessage = await this.adminLetter.sendAdminMessage({ fullname, bulkId, email });
                res.status(200).json({
                    success: true,
                    message: 'Admin status updated successfully and Mail Delivered successfully...',
                    data: updatedAdmin
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Failed to update admin status',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    };

    public loginAdmin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid email or password'
                });
                return;
            }

            const user = await this.bulkAdminService.loginAdmin(email, password);

            if (user.status === false) {
                res.status(403).json({
                    status: false,
                    message: `Admin Account Not Verified, Please Contact your administrator`
                });
                return;
            }
            const userId = user._id!.toString();
            const token = generateToken(res, { _id: userId });
            res.status(200).json({
                status: true,
                message: `${user.fullname} Admin, Successfully logged in`
            });
        } catch (error: any) {
            res.status(500).json({
                status: false,
                message: 'Login Attempt Failed',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    };

    public adminCount = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                res.status(403).json({
                    status: false,
                    message: 'You must be logged in to access this page'
                });

                return;
            }
            const { province } = req.body;
            if (!province) {
                res.status(400).json({
                    status: false,
                    message: 'Province must be provided'
                });
                return;
            }

            const adminProvince = req.user.province;

            if (adminProvince !== province) {
                res.status(404).json({
                    status: false,
                    message: `Invalid Province Provided by the admin...`
                });
                return;
            }
            const count = await this.bulkAdminService.countPeopleInProvince(province);

            if (!count) {
                res.status(404).json({
                    status: false,
                    message: `NOT FOUND`
                });

                return;
            }

            const record = count > 1 ? 'records' : 'record';
            const yourFee = count * 6000;
            const email = req.user.email;
            const fullname = req.user.fullname;
            res.status(200).json({
                status: true,
                data: `You have ${count} ${record}`,
                fees: `An you are required to pay ${yourFee}`
            });
            const paymentDetails = await this.adminLetter.supperAdminsPayment({ count, yourFee, email, fullname });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Attempting to Count Province Failed',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    };
}

export default BulkAdminController;
