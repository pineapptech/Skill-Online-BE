import { Request, Response } from 'express';
import { UserBulkValidation, ValidationError } from '../utils/user-bulk.utils'; // Import the validation class
import IBulkUser from '../interfaces/user-bulk.interface';
import BulkAdmin from '../models/bulk.model';
import UserBulkService from '../services/user-bulk.service';

export class UserBulkController {
    private userBulkService: UserBulkService;

    constructor() {
        this.userBulkService = new UserBulkService();
    }
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userInfo: IBulkUser = req.body;

            // Validate the user input
            const validatedData = UserBulkValidation.validate(userInfo);

            const bulkAdmin = await BulkAdmin.findOne({ email: validatedData.email });

            if (!bulkAdmin) {
                res.status(403).json({
                    status: false,
                    message: 'UNAUTHORIZED ACCESS'
                });
                return;
            }

            const id = bulkAdmin?._id;
            const bulkId = bulkAdmin?.bulkId;

            if (userInfo.bulkId !== bulkId) {
                res.status(403).json({
                    status: false,
                    message: 'UNAUTHORIZED ACCESS',
                    details: 'Invalid bulk ID'
                });
                return;
            }

            // If everything is fine, proceed with creating the user
            // await this.userBulkService.createUser(validatedData); // Assuming you have a method like this in your service

            const bulkUser = await this.userBulkService.createUser(String(id), validatedData);

            res.status(201).json({
                status: true,
                message: 'User created successfully',
                data: validatedData
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
}
