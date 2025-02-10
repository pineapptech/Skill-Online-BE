import { Document, Types } from 'mongoose';

interface IBulkAdmin extends Document {
    fullname: string;
    email: string;
    password: string;
    phone: string;
    bulkId: string;
    province: string;
    status: boolean;
}

export default IBulkAdmin;
