"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = require("dotenv");
const CustomError_1 = __importDefault(require("./errors/CustomError"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const cors_1 = __importDefault(require("cors"));
const attached_email_route_1 = __importDefault(require("./routes/attached-email.route"));
const global_error_1 = require("./errors/global.error");
const bulk_admin_route_1 = __importDefault(require("./routes/bulk-admin.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, dotenv_1.configDotenv)();
(0, db_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: 'https://etsapsfrica.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'authorization', 'Authorization']
};
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use('/api/v1/auth', user_route_1.default);
app.use('/api', payment_route_1.default);
app.use('/api/v1/attachment', attached_email_route_1.default);
app.use('/api/v1/bulk-admin', bulk_admin_route_1.default);
// DEFAULT ROUTE
app.use('*', (req, res, next) => {
    const error = new CustomError_1.default(`Oops...., It seems like the Route ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});
app.use(global_error_1.globalError);
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
