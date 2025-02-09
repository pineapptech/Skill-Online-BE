"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bulkAdminSchema = new mongoose_1.Schema({
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
    province: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});
const BulkAdmin = (0, mongoose_1.model)('bulk', bulkAdminSchema);
exports.default = BulkAdmin;
