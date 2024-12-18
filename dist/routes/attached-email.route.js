"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attached_email_controller_1 = __importDefault(require("../controllers/attached-email.controller"));
const offer_letter_email_1 = __importDefault(require("../emails/offer-letter.email"));
const offer_letter_1 = __importDefault(require("../utils/offer-letter"));
const offerLetter = new offer_letter_1.default();
const offerEmail = new offer_letter_email_1.default(offerLetter);
const attachedEmail = new attached_email_controller_1.default(offerEmail);
const attachedRouter = (0, express_1.Router)();
attachedRouter.post('/offer-letter', attachedEmail.sendAttachmentEmail);
exports.default = attachedRouter;
