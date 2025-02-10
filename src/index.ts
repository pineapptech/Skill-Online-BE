import express, { Application, Request, Response, NextFunction } from 'express';
import connectDB from './config/db';
import { configDotenv } from 'dotenv';
import CustomError from './errors/CustomError';
import router from './routes/user.route';
import paymentRouter from './routes/payment.route';
import cors from 'cors';
import attachedRouter from './routes/attached-email.route';
import { globalError } from './errors/global.error';
import bulkAdminRouter from './routes/bulk-admin.route';
import cookieParser from 'cookie-parser';

configDotenv();
connectDB();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Critical for cookie-based authentication
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/v1/auth', router);
app.use('/api', paymentRouter);
app.use('/api/v1/attachment', attachedRouter);
app.use('/api/v1/bulk-admin', bulkAdminRouter);
// DEFAULT ROUTE
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Oops...., It seems like the Route ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});
app.use(globalError);

// app.use(globalError);
app.listen(port, () => console.log(`Listening on ${port}`));

// const allowedOrigins = ['http://localhost:3000', 'https://etsapsfrica.com', 'https://www.etsapsfrica.com'];

// const corsOptions: cors.CorsOptions = {
//     origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// };
