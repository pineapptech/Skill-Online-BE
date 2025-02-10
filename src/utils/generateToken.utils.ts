import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, user: { _id: string }) => {
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY as string, { expiresIn: '30d' });

    if (token) {
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production only
            sameSite: 'none', //prevent CSRF attacks
            partitioned: true,
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
        });
    }
    console.log(`Token generated for user ${user._id}`);

    return token;
};

export default generateToken;
