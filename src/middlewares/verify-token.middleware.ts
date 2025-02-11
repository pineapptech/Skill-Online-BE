import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import BulkAdmin from '../models/bulk.model';
import { AdminUser } from '../interfaces/admin.interface';

declare global {
    namespace Express {
        interface Request {
            user?: AdminUser;
        }
    }
}

export const verifyAdminToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!process.env.SECRET_KEY) {
            res.status(404).json({
                status: false,
                message: 'Secret Key not set'
            });
            return;
        }
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ status: false, message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { id: string };

        const user = (await BulkAdmin.findById(decoded.id).select('-password')) as AdminUser;
        if (!user) {
            res.status(401).json({ status: false, message: 'User not found' });
            return;
        }

        req.user = user;
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
        res.status(401).json({ status: false, message: 'Invalid token' });
    }
};
