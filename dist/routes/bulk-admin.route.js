"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bulk_admin_controller_1 = __importDefault(require("../controllers/bulk-admin.controller"));
const user_bulk_controller_1 = require("../controllers/user-bulk.controller");
const bulkAdminRouter = (0, express_1.Router)();
const bulkAdminController = new bulk_admin_controller_1.default();
const userBulkController = new user_bulk_controller_1.UserBulkController();
bulkAdminRouter.post('/create', bulkAdminController.createBulkAdmin);
bulkAdminRouter.post('/create-user', userBulkController.createUser);
bulkAdminRouter.patch('/change-status', bulkAdminController.updateAdminStatus);
exports.default = bulkAdminRouter;
