import { Document } from 'mongoose';

interface IBulkAdmin extends Document {
    fullname: string;
    email: string;
    bulkId: string;
    province: string;
}

export default IBulkAdmin;
