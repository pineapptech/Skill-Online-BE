import express, { Application, Request, Response, NextFunction } from 'express';
import connectDB from './config/db';
import { configDotenv } from 'dotenv';
import CustomError from './errors/CustomError';
import router from './routes/user.route';
import paymentRouter from './routes/payment.route';
import cors from 'cors';

configDotenv();
connectDB();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: 'https://etsap-fe.vercel.app', // Your frontend URL
        credentials: true
    })
);
app.use('/api/v1/auth', router);
app.use('/api', paymentRouter);
// DEFAULT ROUTE
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Oops...., It seems like the Route ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});

// app.use(globalError);
app.listen(port, () => console.log(`Listening on ${port}`));
