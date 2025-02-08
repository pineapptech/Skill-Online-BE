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
class BulkAdminController {
    constructor() {
        this.createBulkAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (!body.email || !body.fullname || !body.bulkName) {
                    res.status(400).json({
                        status: false,
                        message: 'All fields are required'
                    });
                    return;
                }
                const checkEmail = yield bulk_model_1.default.findOne({ email: body.email });
                if (checkEmail) {
                    const updatedAdmin = yield bulk_model_1.default.findOneAndUpdate({ email: body.email }, {
                        fullname: body.fullname,
                        bulkName: body.bulkName,
                        bulkId: body.bulkId
                    }, { new: true });
                    res.status(200).json({
                        status: true,
                        message: 'Admin updated successfully',
                        data: updatedAdmin
                    });
                    return;
                }
                res.status(403).json({
                    status: false,
                    message: 'UNAUTHORIZED ACCESS'
                });
            }
            catch (error) {
                res.status(400).json({
                    status: false,
                    error: error.message
                });
            }
        });
    }
}
exports.default = BulkAdminController;
