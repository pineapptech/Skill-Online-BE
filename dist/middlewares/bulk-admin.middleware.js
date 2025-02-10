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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bulk_model_1 = __importDefault(require("../models/bulk.model"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for token in cookies
        const token = req.cookies.jwt;
        // If no token is present
        if (!token) {
            res.status(401).json({
                status: false,
                message: 'Not authorized, no token'
            });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY); // Type assertion for the decoded token
        // Find user by ID from the token, excluding password
        const user = yield bulk_model_1.default.findById(decoded.id).select('-password');
        // If no user found
        if (!user) {
            res.status(401).json({
                status: false,
                message: 'Not authorized, user not found'
            });
            return;
        }
        // Attach user to the request object
        req.user = user;
        // Continue to the next middleware
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
        // Generic error handling
        res.status(500).json({
            status: false,
            message: 'Not authorized, token failed',
            error: process.env.NODE_ENV !== 'production' ? error.message : ''
        });
    }
});
exports.default = verifyToken;
