import { Types } from 'mongoose';
import IBulkUser from '../interfaces/user-bulk.interface';
import UserBulk from '../models/user-bulk.model';

class UserBulkService {
    public createUser = async (bulkId: string, userInfo: Partial<IBulkUser>): Promise<IBulkUser> => {
        if (!userInfo || !Types.ObjectId.isValid(bulkId)) {
            throw new Error('Admin ID is Invalid or missing!');
        }

        const userData = {
            bulkAdmin: new Types.ObjectId(bulkId),
            ...userInfo
        };

        return await UserBulk.create(userData);
    };

    // getAllUsers = async (page: number = 1, limit: number = 100): Promise<string[]> => {
    //     // Validate page and limit
    //     const pageNum = Math.max(1, page);
    //     const pageSize = Math.min(Math.max(1, limit), 500); // Limit max page size to 500

    //     try {
    //         const users = await UserBulk.find()
    //             .select('email') // Only select email field
    //             .skip((pageNum - 1) * pageSize) // Skip previous pages
    //             .limit(pageSize); // Limit results per page

    //         // Extract just the email addresses
    //         return users.map((user) => user.email);
    //     } catch (error) {
    //         console.error('Error retrieving users:', error);
    //         throw new Error('Failed to retrieve users');
    //     }
    // };
}

export default UserBulkService;
