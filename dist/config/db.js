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
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MONGO_URL) {
        console.log("MONGO_URL environment variable is not set");
        process.exit(1);
    }
    try {
        const con = yield mongoose_1.default.connect(process.env.MONGO_URL);
        // console.log(`Connected: ${con.connection.host} : ${con.connection.name}`);
        mongoose_1.default.connection.on('disconnect', () => {
            console.error('MongoDB Connection Lost');
            process.exit(1);
        });
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
});
exports.default = connectDB;
