"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const user_service_1 = require("../services/user.service");
const multer_middlewares_1 = __importDefault(require("../middlewares/multer.middlewares"));
const offer_letter_1 = __importDefault(require("../utils/offer-letter"));
const generate_regno_1 = __importDefault(require("../utils/generate-regno"));
const offer_letter_email_1 = __importDefault(require("../emails/offer-letter.email"));
const router = express_1.default.Router();
// Create instances
const userService = new user_service_1.UserService();
const offerLetter = new offer_letter_1.default();
const offerEmail = new offer_letter_email_1.default(offerLetter);
const registrationController = new user_controller_1.default(userService, offerEmail);
// Registration route
router.post('/register', multer_middlewares_1.default.upload.single('file'), (req, res) => registrationController.registerUser(req, res));
router.delete('/delete', registrationController.deleteUsers);
router.get('/get-users', registrationController.getUsers);
router.get('/get-user', registrationController.getUserEmail);
router.get('/generate-regno', (req, res) => console.log((0, generate_regno_1.default)('Cyber Security')));
exports.default = router;
