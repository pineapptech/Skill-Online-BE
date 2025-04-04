"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promo_controller_1 = __importDefault(require("../controllers/promo.controller"));
const promoRouter = (0, express_1.Router)();
const promoController = new promo_controller_1.default();
promoRouter.route('/create-promo').post(promoController.createPromo);
exports.default = promoRouter;
