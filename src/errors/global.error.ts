import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const globalError = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
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

export { globalError };
