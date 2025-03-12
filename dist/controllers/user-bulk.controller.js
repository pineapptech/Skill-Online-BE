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
exports.UserBulkController = void 0;
const user_bulk_utils_1 = require("../utils/user-bulk.utils"); // Import the validation class
const bulk_model_1 = __importDefault(require("../models/bulk.model"));
const user_bulk_service_1 = __importDefault(require("../services/user-bulk.service"));
class UserBulkController {
    // private adminLetter: AdminLetter;
    constructor() {
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = req.body;
                // Validate the user input
                const validatedData = user_bulk_utils_1.UserBulkValidation.validate(userInfo);
                const bulkAdmin = yield bulk_model_1.default.findOne({ bulkId: validatedData.bulkId });
                if (!bulkAdmin) {
                    res.status(403).json({
                        status: false,
                        message: 'UNAUTHORIZED ACCESS / Invalid Bulk ID Provided...'
                    });
                    return;
                }
                const adminStatus = bulkAdmin.status;
                if (adminStatus === false) {
                    res.status(403).json({
                        status: false,
                        message: 'UNVERIFIED ADMIN ACCOUNT'
                    });
                    return;
                }
                const id = bulkAdmin._id;
                // const bulkId = bulkAdmin.bulkId;
                // if (userInfo.bulkId !== bulkId) {
                //     res.status(403).json({
                //         status: false,
                //         message: 'UNAUTHORIZED ACCESS',
                //         details: 'Invalid bulk ID'
                //     });
                //     return;
                // }
                // If everything is fine, proceed with creating the user
                // await this.userBulkService.createUser(validatedData); // Assuming you have a method like this in your service
                const email = validatedData.email;
                const fullname = validatedData.fullname;
                const bulkUser = yield this.userBulkService.createUser(String(id), validatedData);
                // const userLetter = await this.adminLetter.sendRegistrationEmailWithoutAttachment({ email, fullname });
                res.status(201).json({
                    status: true,
                    message: 'User created successfully',
                    data: bulkUser
                });
            }
            catch (error) {
                if (error instanceof user_bulk_utils_1.ValidationError) {
                    res.status(400).json({
                        status: false,
                        message: error.message,
                        errors: error.errors
                    });
                }
                else {
                    res.status(500).json({
                        status: false,
                        message: error.message
                    });
                }
            }
        });
        this.userBulkService = new user_bulk_service_1.default();
        // this.adminLetter = new AdminLetter();
    }
}
exports.UserBulkController = UserBulkController;
