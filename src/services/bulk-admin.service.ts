import bcrypt from 'bcryptjs';
import IBulkAdmin from '../interfaces/bulk-interface';
import BulkAdmin from '../models/bulk.model';
import UserBulk from '../models/user-bulk.model';

export class BulkAdminService {
    public createBulkAdmin = async (bulkAdminInfo: Partial<IBulkAdmin>): Promise<IBulkAdmin> => {
        return await BulkAdmin.create(bulkAdminInfo);
    };

    public changeAdminStatus = async (email: string) => {
        const adminCheck = await this.checkAdminStatus(email);
        if (adminCheck === false) {
            return await BulkAdmin.findOneAndUpdate({ email }, { status: true }, { new: true });
        }
        return adminCheck;
    };

    private checkAdminStatus = async (email: string) => {
        const adminStatus = await BulkAdmin.findOne({ email });

        if (adminStatus?.status === false) {
            return false;
        }
        return adminStatus;
    };

    public loginAdmin = async (email: string, password: string) => {
        const user = await BulkAdmin.findOne({ email });

        if (!user) {
            throw new Error(`User not found`);
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            throw new Error(`Invalid Credentials Provided...`);
        }

        return user;
    };

    public countPeopleInProvince = async (province: string) => {
        const count = await UserBulk.countDocuments({ province });

        return count;
    };
}
