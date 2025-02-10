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
        password: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        },
        bulkId: {
            type: String,
            unique: true
        },
        province: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const BulkAdmin = model<IBulkAdmin>('bulk-admin', bulkAdminSchema);

export default BulkAdmin;
