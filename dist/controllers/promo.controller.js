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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promo_service_1 = __importDefault(require("../services/promo.service"));
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const promo_letter_email_1 = __importDefault(require("../emails/promo-letter.email"));
class PromoController {
    constructor() {
        this.createPromo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = __rest(req.body, []);
                if (!payload.fullName || !payload.email) {
                    return next(new CustomError_1.default('All Fields must be provided.', 400));
                }
                const promo = yield this.promo.createPromo(payload);
                yield this.emailPromo.sendPromoCodeEmail(promo);
                res.status(201).json({
                    message: 'Promo Code Created Successfully',
                    status: true,
                    data: promo
                });
            }
            catch (error) {
                res.status(500).json({
                    message: 'Promo Code Creation failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error.stack
                });
            }
        });
        this.promo = new promo_service_1.default();
        this.emailPromo = new promo_letter_email_1.default();
    }
}
exports.default = PromoController;
