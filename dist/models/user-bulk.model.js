"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userBulkSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
const UserBulk = (0, mongoose_1.model)('userbulk', userBulkSchema);
exports.default = UserBulk;
