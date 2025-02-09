import IBulkAdmin from '../interfaces/bulk-interface';
import BulkAdmin from '../models/bulk.model';

export class BulkAdminService {
    public createBulkAdmin = async (bulkAdminInfo: IBulkAdmin): Promise<IBulkAdmin> => {
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
}
