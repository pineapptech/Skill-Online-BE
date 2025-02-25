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
exports.BulkAdminService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const bulk_model_1 = __importDefault(require("../models/bulk.model"));
const user_bulk_model_1 = __importDefault(require("../models/user-bulk.model"));
class BulkAdminService {
    constructor() {
        this.createBulkAdmin = (bulkAdminInfo) => __awaiter(this, void 0, void 0, function* () {
            return yield bulk_model_1.default.create(bulkAdminInfo);
        });
        this.changeAdminStatus = (email) => __awaiter(this, void 0, void 0, function* () {
            const adminCheck = yield this.checkAdminStatus(email);
            if (adminCheck === false) {
                return yield bulk_model_1.default.findOneAndUpdate({ email }, { status: true }, { new: true });
            }
            return adminCheck;
        });
        this.checkAdminStatus = (email) => __awaiter(this, void 0, void 0, function* () {
            const adminStatus = yield bulk_model_1.default.findOne({ email });
            if ((adminStatus === null || adminStatus === void 0 ? void 0 : adminStatus.status) === false) {
                return false;
            }
            return adminStatus;
        });
        this.loginAdmin = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield bulk_model_1.default.findOne({ email });
            if (!user) {
                throw new Error(`User not found`);
            }
            const validPassword = bcryptjs_1.default.compareSync(password, user.password);
            if (!validPassword) {
                throw new Error(`Invalid Credentials Provided...`);
            }
            return user;
        });
        this.countPeopleInProvince = (bulkId) => __awaiter(this, void 0, void 0, function* () {
            const count = yield user_bulk_model_1.default.countDocuments({ bulkId });
            return count;
        });
        this.registeredPeopleInProvince = (bulkId) => __awaiter(this, void 0, void 0, function* () {
            const people = yield user_bulk_model_1.default.find({ bulkId });
            return people;
        });
    }
}
exports.BulkAdminService = BulkAdminService;
