import { Types, Document } from 'mongoose';

interface IBulkUser extends Document {
    fullname: string;
    email: string;
    course: string;
    bulkId: string;
    province: string;
    gender: string;
    address: string;
    bulkAdmin: Types.ObjectId;
}

export default IBulkUser;
