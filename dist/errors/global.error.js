"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const multer_1 = __importDefault(require("multer"));
const globalError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        res.status(400).json({
            status: false,
            error: error.message
        });
        return;
    }
    res.status(500).json({
        status: false,
        error: error.message || 'An Unexpected Error Occurred',
        name: error.name,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : ''
    });
};
exports.globalError = globalError;
