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
}

export default UserBulkService;
