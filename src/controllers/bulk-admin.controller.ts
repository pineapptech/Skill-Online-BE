import { Request, Response } from 'express';
import IBulkAdmin from '../interfaces/bulk-interface';
import BulkAdmin from '../models/bulk.model';
import { BulkAdminService } from '../services/bulk-admin.service';
import { log } from 'console';
import OfferEmail from '../emails/offer-letter.email';
import { AdminLetter } from '../emails/admin-letter.email';

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

            if (!body.email || !body.fullname || !body.province) {
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

            const bulkAdmin = await this.bulkAdminService.createBulkAdmin(body);
            res.status(201).json({
                status: true,
                message: 'Bulk admin created successfully, A verification process is in progress and we will send you a notification through your email once it is completed'
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
                    success: false,
                    message: 'Email is required'
                });
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
                return;
            }

            const updatedAdmin = await this.bulkAdminService.changeAdminStatus(email);

            if (!updatedAdmin) {
                res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
                return;
            }

            if (updatedAdmin.status === true) {
                res.status(200).json({
                    success: true,
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
                success: false,
                message: 'Failed to update admin status',
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    };
}

export default BulkAdminController;
