"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
        // unique: true
    },
    regNo: {
        type: String,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true
    },
    stateOrCountry: {
        type: String,
        trim: true
    },
    province: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    passportId: {
        type: String,
        trim: true
    },
    photoUrl: {
        type: String,
        trim: true
    },
    course: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
