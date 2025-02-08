import { Request, Response } from 'express';
import IBulkAdmin from '../interfaces/bulk-interface';
import BulkAdmin from '../models/bulk.model';

class BulkAdminController {
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

            const checkEmail = await BulkAdmin.findOne({ email: body.email });

            if (checkEmail) {
                const updatedAdmin = await BulkAdmin.findOneAndUpdate(
                    { email: body.email },
                    {
                        fullname: body.fullname,
                        province: body.province,
                        bulkId: body.bulkId
                    },
                    { new: true }
                );

                res.status(200).json({
                    status: true,
                    message: 'Admin updated successfully',
                    data: updatedAdmin
                });
                return;
            }
            res.status(403).json({
                status: false,
                message: 'UNAUTHORIZED ACCESS'
            });
        } catch (error: any) {
            res.status(400).json({
                status: false,
                error: error.message
            });
        }
    };
}

export default BulkAdminController;
