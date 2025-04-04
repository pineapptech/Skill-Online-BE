"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generatePromoCode = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `ETSAP/PROMO/${randomNumber}`;
};
exports.default = generatePromoCode;
