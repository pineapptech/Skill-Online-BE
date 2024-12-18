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
const user_model_1 = __importDefault(require("../models/user.model"));
const payment_model_1 = require("../models/payment.model");
const console_1 = require("console");
class AttachmentEmailController {
    constructor(offerEmail) {
        this.sendAttachmentEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    res.status(404).json({
                        status: false,
                        message: 'User not found Kindly Apply Before you can make Payments'
                    });
                    return;
                }
                const firstName = user.firstName;
                const lastName = user.lastName;
                // const userEmail = user.email
                const course = user.course;
                const city = user.city;
                const regNo = user.regNo;
                const phone = user.phone;
                const payment = yield payment_model_1.Payment.findOne({ email: user.email });
                if ((payment === null || payment === void 0 ? void 0 : payment.email) === user.email && (payment === null || payment === void 0 ? void 0 : payment.status) === 'success') {
                    yield this.offerEmail.sendRegistrationEmailWithAttachment({
                        firstName,
                        lastName,
                        email,
                        course,
                        city,
                        regNo,
                        phone
                    });
                    res.status(200).json({
                        status: true,
                        message: 'Email Offer Letter Sent successfully...'
                    });
                }
            }
            catch (error) {
                (0, console_1.trace)(error);
            }
        });
        this.offerEmail = offerEmail;
    }
}
exports.default = AttachmentEmailController;
