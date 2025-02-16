import { model, Schema } from 'mongoose';

const userBulkSchema = new Schema({
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
    course: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bulkAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Bulk',
        required: true
    },
    regNo: {
        type: String,
        required: true,
        default: '12345'
    },
    bulkId: {
        type: String,
        required: true,
        default: 'BULK/EN/0024'
    }
});

const UserBulk = model('userbulk', userBulkSchema);
export default UserBulk;
