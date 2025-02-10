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
const bulk_model_1 = __importDefault(require("../models/bulk.model"));
const bulk_admin_service_1 = require("../services/bulk-admin.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_letter_email_1 = require("../emails/admin-letter.email");
const bulk_id_1 = require("../utils/bulk-id");
const console_1 = require("console");
const generateToken_utils_1 = __importDefault(require("../utils/generateToken.utils"));
class BulkAdminController {
    constructor() {
        this.createBulkAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (!body.email || !body.fullname || !body.province || !body.phone || !body.password) {
                    res.status(400).json({
                        status: false,
                        message: 'All fields are required'
                    });
                    return;
                }
                const adminEmailExists = yield bulk_model_1.default.findOne({ email: body.email });
                if (adminEmailExists) {
                    res.status(400).json({
                        status: false,
                        message: 'Email already exists'
                    });
                    return;
                }
                const hashPassword = bcryptjs_1.default.hashSync(body.password, 10);
                const bulkId = (0, bulk_id_1.generateBulkId)(body.province);
                const decryptedPassword = bcryptjs_1.default.compareSync(body.password, hashPassword);
                (0, console_1.log)('Hash password ' + hashPassword);
                (0, console_1.log)('decrypted password ' + decryptedPassword);
                const admin = {
                    fullname: body.fullname,
                    email: body.email,
                    province: body.province,
                    phone: body.phone,
                    password: hashPassword,
                    bulkId
                };
                const fullname = body.fullname;
                const email = body.email;
                const bulkAdmin = yield this.bulkAdminService.createBulkAdmin(admin);
                const notifySupperAdmins = yield this.adminLetter.notifySupperAdmins({ fullname, email });
                res.status(201).json({
                    status: true,
                    message: 'Bulk admin created statusfully, A verification process is in progress and we will send you a notification through your email once it is completed'
                });
            }
            catch (error) {
                res.status(400).json({
                    status: false,
                    error: error.message
                });
            }
        });
        this.updateAdminStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({
                        status: false,
                        message: 'Email is required'
                    });
                    return;
                }
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        status: false,
                        message: 'Invalid email format'
                    });
                    return;
                }
                const updatedAdmin = yield this.bulkAdminService.changeAdminStatus(email);
                if (!updatedAdmin) {
                    res.status(404).json({
                        status: false,
                        message: 'Admin not found'
                    });
                    return;
                }
                if (updatedAdmin.status === true) {
                    res.status(200).json({
                        status: true,
                        message: 'Admin Already Verified...'
                    });
                    return;
                }
                const fullname = updatedAdmin.fullname;
                const bulkId = updatedAdmin.bulkId;
                if (updatedAdmin) {
                    const adminMessage = yield this.adminLetter.sendAdminMessage({ fullname, bulkId, email });
                    res.status(200).json({
                        success: true,
                        message: 'Admin status updated successfully and Mail Delivered successfully...',
                        data: updatedAdmin
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    message: 'Failed to update admin status',
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        });
        this.loginAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({
                        status: false,
                        message: 'Invalid email or password'
                    });
                    return;
                }
                const user = yield this.bulkAdminService.loginAdmin(email, password);
                if (user.status === false) {
                    res.status(403).json({
                        status: false,
                        message: `Admin Account Not Verified, Please Contact your administrator`
                    });
                    return;
                }
                const userId = user._id.toString();
                const token = (0, generateToken_utils_1.default)(res, { _id: userId });
                res.status(200).json({
                    status: true,
                    message: `${user.fullname} Admin, Successfully logged in`
                });
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    message: 'Login Attempt Failed',
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        });
        this.adminCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(403).json({
                        status: false,
                        message: 'You must be logged in to access this page'
                    });
                    return;
                }
                const { province } = req.body;
                if (!province) {
                    res.status(400).json({
                        status: false,
                        message: 'Province must be provided'
                    });
                    return;
                }
                const adminProvince = req.user.province;
                if (adminProvince !== province) {
                    res.status(404).json({
                        status: false,
                        message: `Invalid Province Provided by the admin...`
                    });
                    return;
                }
                const count = yield this.bulkAdminService.countPeopleInProvince(province);
                if (!count) {
                    res.status(404).json({
                        status: false,
                        message: `NOT FOUND`
                    });
                    return;
                }
                const record = count > 1 ? 'records' : 'record';
                const yourFee = count * 6000;
                const email = req.user.email;
                const fullname = req.user.fullname;
                res.status(200).json({
                    status: true,
                    data: `You have ${count} ${record}`,
                    fees: `An you are required to pay ${yourFee}`
                });
                const paymentDetails = yield this.adminLetter.supperAdminsPayment({ count, yourFee, email, fullname });
            }
            catch (error) {
                res.status(500).json({
                    status: false,
                    message: 'Attempting to Count Province Failed',
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        });
        this.bulkAdminService = new bulk_admin_service_1.BulkAdminService();
        this.adminLetter = new admin_letter_email_1.AdminLetter();
    }
}
exports.default = BulkAdminController;
