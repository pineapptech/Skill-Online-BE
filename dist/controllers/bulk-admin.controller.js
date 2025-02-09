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
const admin_letter_email_1 = require("../emails/admin-letter.email");
class BulkAdminController {
    constructor() {
        this.createBulkAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (!body.email || !body.fullname || !body.province) {
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
                const bulkAdmin = yield this.bulkAdminService.createBulkAdmin(body);
                res.status(201).json({
                    status: true,
                    message: 'Bulk admin created successfully, A verification process is in progress and we will send you a notification through your email once it is completed'
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
                        success: false,
                        message: 'Email is required'
                    });
                    return;
                }
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid email format'
                    });
                    return;
                }
                const updatedAdmin = yield this.bulkAdminService.changeAdminStatus(email);
                if (!updatedAdmin) {
                    res.status(404).json({
                        success: false,
                        message: 'Admin not found'
                    });
                    return;
                }
                if (updatedAdmin.status === true) {
                    res.status(200).json({
                        success: true,
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
                    success: false,
                    message: 'Failed to update admin status',
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        });
        this.bulkAdminService = new bulk_admin_service_1.BulkAdminService();
        this.adminLetter = new admin_letter_email_1.AdminLetter();
    }
}
exports.default = BulkAdminController;
