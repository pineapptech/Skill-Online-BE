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
(0, dotenv_1.configDotenv)();
(0, db_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: 'https://etsap-fe.vercel.app', // Your frontend URL
    credentials: true
}));
app.use('/api/v1/auth', user_route_1.default);
app.use('/api', payment_route_1.default);
// DEFAULT ROUTE
app.use('*', (req, res, next) => {
    const error = new CustomError_1.default(`Oops...., It seems like the Route ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});
// app.use(globalError);
app.listen(port, () => console.log(`Listening on ${port}`));
