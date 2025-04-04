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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const user_schema_1 = require("../utils/user-schema");
const console_1 = require("console");
(0, dotenv_1.configDotenv)();
class RegistrationController {
    constructor(userService, offerEmail) {
        this.deleteUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.deleteUsers();
            res.status(200).json({
                status: true,
                message: 'Deleted successfully...',
                user
            });
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUsers();
            if (user.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'No users were found'
                });
                return;
            }
            res.status(200).json({
                status: true,
                data: user
            });
        });
        this.getUserEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                if (!email) {
                    res.status(400).json({
                        status: false,
                        message: 'Email is required'
                    });
                    return;
                }
                const emailExists = yield this.userService.getAUserEmail(email);
                if (!emailExists) {
                    res.status(404).json({
                        status: false,
                        message: 'Email not found'
                    });
                    return;
                }
                res.status(200).json({
                    status: true,
                    data: emailExists
                });
            }
            catch (error) {
                res.status(500).json({
                    error: 'An error occurred',
                    message: error.message
                });
            }
        });
        this.userService = userService;
        this.offerEmail = offerEmail;
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = user_schema_1.RegistrationValidation.validate(Object.assign(Object.assign({}, req.body), { file: req.file }));
                if (!req.file) {
                    res.status(400).json({
                        status: false,
                        message: 'Kindly Select a file to continue this registration'
                    });
                    return;
                }
                const { firstName, lastName, email, phone, course, city, regNo, address } = validatedData, otherData = __rest(validatedData, ["firstName", "lastName", "email", "phone", "course", "city", "regNo", "address"]);
                (0, console_1.log)(regNo);
                // const emailExists = await User.findOne({ email });
                // if (emailExists) {
                //     res.status(400).json({
                //         status: false,
                //         message: 'Email already exists'
                //     });
                //     return;
                // }
                const newUser = yield this.userService.createUser(req.file, firstName, lastName, email, phone, course, city, address, otherData);
                if (newUser) {
                    yield this.offerEmail.sendRegistrationEmailWithoutAttachment({ firstName, email, lastName, phone, course, city, regNo, address });
                    res.status(201).json({
                        message: 'Registration successful',
                        user: {
                            id: newUser._id,
                            name: newUser.firstName,
                            email: newUser.email
                        }
                    });
                }
            }
            catch (error) {
                console.error('Registration error:', error);
                if (error instanceof user_schema_1.ValidationError) {
                    res.status(400).json({
                        message: 'Validation Failed',
                        errors: error.errors
                    });
                    return;
                }
                res.status(500).json({
                    message: 'Registration failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error.stack
                });
            }
        });
    }
}
exports.default = RegistrationController;
