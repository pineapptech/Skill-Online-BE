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
exports.UserService = void 0;
const console_1 = require("console");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generate_regno_1 = __importDefault(require("../utils/generate-regno"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const promo_model_1 = __importDefault(require("../models/promo.model"));
class UserService {
    constructor() {
        this.createUser = (file, firstName, lastName, email, phone, course, city, address, userData) => __awaiter(this, void 0, void 0, function* () {
            // Validate required fields
            if (!firstName || !lastName || !email || !phone || !course || !city || !address) {
                throw new Error('All Fields are required');
            }
            // Check if file is provided
            if (!file) {
                throw new Error('File is required');
            }
            const promoCode = (yield promo_model_1.default.findOne({ promoCode: userData.promoCode })) || '';
            try {
                // Upload file to cloudinary
                const result = yield cloudinary_1.default.uploader.upload(file.path, { folder: 'userPhoto' });
                // Log result only in non-production environment
                process.env.NODE_ENV !== 'production' ? (0, console_1.log)(result) : '';
                // Remove temporary file
                if (fs_1.default.existsSync(file.path)) {
                    fs_1.default.unlinkSync(file.path);
                }
                const regNo = (0, generate_regno_1.default)(course);
                // Create user with uploaded photo URL
                const user = yield user_model_1.default.create(Object.assign({ photoUrl: result.secure_url, firstName,
                    lastName,
                    email,
                    phone,
                    course,
                    regNo,
                    address,
                    promoCode }, userData));
                return user;
            }
            catch (error) {
                // Ensure temporary file is deleted in case of error
                if (file && file.path && fs_1.default.existsSync(file.path)) {
                    fs_1.default.unlinkSync(file.path);
                }
                throw error;
            }
        });
        this.deleteUsers = () => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.deleteMany();
            return user;
        });
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.find();
            return user;
        });
        this.sendContactMessage = (userData) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, message } = userData;
            if (!name || !email || !message) {
                throw new Error('All Fields are required');
            }
            const contact = yield contact_model_1.default.create({
                name,
                email,
                message
            });
            return contact;
        });
        this.getAUserEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const emailExists = yield user_model_1.default.findOne({ email });
            return emailExists;
        });
    }
}
exports.UserService = UserService;
exports.default = UserService;
