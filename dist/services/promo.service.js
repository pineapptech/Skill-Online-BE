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
const console_1 = require("console");
const promo_model_1 = __importDefault(require("../models/promo.model"));
const promo_1 = __importDefault(require("../utils/promo"));
class PromoService {
    constructor() {
        this.createPromo = (payload) => __awaiter(this, void 0, void 0, function* () {
            const emailExists = yield this.emailExists(payload.email);
            if (emailExists) {
                throw new Error('Email Already Exists');
            }
            const promoCode = (0, promo_1.default)();
            payload.promoCode = promoCode;
            (0, console_1.table)(payload);
            const promo = new promo_model_1.default(Object.assign({}, payload));
            return yield promo.save();
        });
        this.emailExists = (email) => __awaiter(this, void 0, void 0, function* () {
            const emailExists = yield promo_model_1.default.findOne({ email });
            return emailExists;
        });
    }
}
exports.default = PromoService;
