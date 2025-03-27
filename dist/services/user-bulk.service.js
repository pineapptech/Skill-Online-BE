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
const mongoose_1 = require("mongoose");
const user_bulk_model_1 = __importDefault(require("../models/user-bulk.model"));
class UserBulkService {
    constructor() {
        this.createUser = (bulkId, userInfo) => __awaiter(this, void 0, void 0, function* () {
            if (!userInfo || !mongoose_1.Types.ObjectId.isValid(bulkId)) {
                throw new Error('Admin ID is Invalid or missing!');
            }
            const userData = Object.assign({ bulkAdmin: new mongoose_1.Types.ObjectId(bulkId) }, userInfo);
            return yield user_bulk_model_1.default.create(userData);
        });
        // getAllUsers = async (page: number = 1, limit: number = 100): Promise<string[]> => {
        //     // Validate page and limit
        //     const pageNum = Math.max(1, page);
        //     const pageSize = Math.min(Math.max(1, limit), 500); // Limit max page size to 500
        //     try {
        //         const users = await UserBulk.find()
        //             .select('email') // Only select email field
        //             .skip((pageNum - 1) * pageSize) // Skip previous pages
        //             .limit(pageSize); // Limit results per page
        //         // Extract just the email addresses
        //         return users.map((user) => user.email);
        //     } catch (error) {
        //         console.error('Error retrieving users:', error);
        //         throw new Error('Failed to retrieve users');
        //     }
        // };
    }
}
exports.default = UserBulkService;
