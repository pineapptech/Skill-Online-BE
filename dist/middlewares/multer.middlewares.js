"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
class UploadMiddleWare {
    constructor() {
        this.storage = multer_1.default.diskStorage({
            destination: './uploads/',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
            }
        });
        this.fileFilter = (req, file, cb) => {
            const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type. Only JPEG, PNG  are allowed'));
            }
        };
        this.upload = (0, multer_1.default)({
            storage: this.storage,
            limits: {
                fileSize: 5 * 1024 * 1024 // 24
            },
            fileFilter: this.fileFilter
        });
    }
}
exports.default = new UploadMiddleWare();
