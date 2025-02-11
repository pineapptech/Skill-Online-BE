"use strict";
/* import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BulkAdmin from '../models/bulk.model';
import { log } from 'console';

// Extend the Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any; // You can replace 'any' with your specific User type
        }
    }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check for token in cookies
        const token = req.cookies.jwt;
        log(token);

        // If no token is present
        if (!token) {
            res.status(401).json({
                status: false,
                message: 'Not authorized, no token'
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { id: string }; // Type assertion for the decoded token

        // Find user by ID from the token, excluding password
        const user = await BulkAdmin.findById(decoded.id).select('-password');

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
    } catch (error: any) {
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
};

export default verifyToken;
 */
