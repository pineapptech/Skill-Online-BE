import { Request, Response } from 'express';
import { UserBulkValidation, ValidationError } from '../utils/user-bulk.utils'; // Import the validation class
import IBulkUser from '../interfaces/user-bulk.interface';
import BulkAdmin from '../models/bulk.model';
import UserBulkService from '../services/user-bulk.service';
import UserBulk from '../models/user-bulk.model';
// import { AdminLetter } from '../emails/admin-letter.email';

export class UserBulkController {
    private userBulkService: UserBulkService;
    // private adminLetter: AdminLetter;

    constructor() {
        this.userBulkService = new UserBulkService();
        // this.adminLetter = new AdminLetter();
    }
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userInfo: IBulkUser = req.body;

            // Validate the user input
            const validatedData = UserBulkValidation.validate(userInfo);

            const bulkAdmin = await BulkAdmin.findOne({ bulkId: validatedData.bulkId });

            if (!bulkAdmin) {
                res.status(403).json({
                    status: false,
                    message: 'UNAUTHORIZED ACCESS / Invalid Bulk ID Provided...'
                });
                return;
            }

            const adminStatus = bulkAdmin.status;
            if (adminStatus === false) {
                res.status(403).json({
                    status: false,
                    message: 'UNVERIFIED ADMIN ACCOUNT'
                });
                return;
            }
            const id = bulkAdmin._id;
            // const bulkId = bulkAdmin.bulkId;

            // if (userInfo.bulkId !== bulkId) {
            //     res.status(403).json({
            //         status: false,
            //         message: 'UNAUTHORIZED ACCESS',
            //         details: 'Invalid bulk ID'
            //     });
            //     return;
            // }

            // If everything is fine, proceed with creating the user
            // await this.userBulkService.createUser(validatedData); // Assuming you have a method like this in your service

            const email = validatedData.email;
            const fullname = validatedData.fullname;
            const bulkUser = await this.userBulkService.createUser(String(id), validatedData);

            // const userLetter = await this.adminLetter.sendRegistrationEmailWithoutAttachment({ email, fullname });
            res.status(201).json({
                status: true,
                message: 'User created successfully',
                data: bulkUser
            });
        } catch (error: any) {
            if (error instanceof ValidationError) {
                res.status(400).json({
                    status: false,
                    message: error.message,
                    errors: error.errors
                });
            } else {
                res.status(500).json({
                    status: false,
                    message: error.message
                });
            }
        }
    };

    // public getUsers = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const users = await this.userBulkService.getAllUsers();
    //         res.status(200).json({
    //             status: true,
    //             data: users
    //         });
    //     } catch (error: any) {
    //         res.status(500).json({
    //             status: false,
    //             message: error.message
    //         });
    //     }
    // };

    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            // Parse page and limit from query parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 100;

            // Validate inputs (removed upper limit constraint)
            const pageNum = Math.max(1, page);
            const pageSize = Math.max(1, limit); // No upper limit restriction

            // Get fields to select (default to email, fullname, and courses)
            const fields = ((req.query.fields as string) || 'email,fullname,course, -_id').split(',').join(' ');

            // Retrieve total count of users
            const totalUsers = await UserBulk.countDocuments();

            // Calculate total pages
            const totalPages = Math.ceil(totalUsers / pageSize);

            // Retrieve paginated users with selected fields
            const users = await UserBulk.find()
                .select(fields)
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize);

            // Send response
            res.json({
                page: pageNum,
                limit: pageSize,
                totalUsers,
                totalPages,
                count: users.length,
                users: users
            });
        } catch (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({
                message: 'Failed to retrieve users',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
