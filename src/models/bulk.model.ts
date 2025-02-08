import { model, Schema } from 'mongoose';
import IBulkAdmin from '../interfaces/bulk-interface';

const bulkAdminSchema = new Schema<IBulkAdmin>(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        bulkId: {
            type: String,
            required: true,
            unique: true,
            default: 'BULK/EN/0024'
        },
        bulkName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const BulkAdmin = model<IBulkAdmin>('bulk', bulkAdminSchema);

export default BulkAdmin;
