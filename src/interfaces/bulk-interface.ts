import { Document } from 'mongoose';

interface IBulkAdmin extends Document {
    fullname: string;
    email: string;
    bulkId: string;
    bulkName: string;
}

export default IBulkAdmin;
