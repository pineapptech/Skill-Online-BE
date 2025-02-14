"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bulk_model_1 = __importDefault(require("../models/bulk.model"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const verifyAdminToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.JWT_SECRET) {
            res.status(404).json({
                status: false,
                message: 'Secret Key not set'
            });
            return;
        }
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(401).json({ status: false, message: 'No token provided' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = (yield bulk_model_1.default.findById(decoded.id).select('-password'));
        if (!user) {
            res.status(401).json({ status: false, message: 'User not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        // Handle different types of errors
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                status: false,
                message: 'Invalid token'
            });
            return;
        }
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                status: false,
                message: 'Token expired'
            });
            return;
        }
        res.status(401).json({ status: false, message: 'Invalid token' });
    }
});
exports.verifyAdminToken = verifyAdminToken;
