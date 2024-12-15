"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.RegistrationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
class RegistrationValidation {
}
exports.RegistrationValidation = RegistrationValidation;
_a = RegistrationValidation;
RegistrationValidation.registrationSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    lastName: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required'
    }),
    email: joi_1.default.string()
        .email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } })
        .trim()
        .required()
        .messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    phone: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required'
    }),
    course: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.empty': 'Course is required',
        'any.required': 'Course is required'
    }),
    address: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required'
    }),
    regNo: joi_1.default.string()
        .trim()
        .required()
        .messages({
        'string.empty': 'Registration number is required',
        'any.required': 'Registration number is required'
    }),
    // Optional additional fields to match the spread operator in the controller
    file: joi_1.default.any() // for file upload
});
RegistrationValidation.validate = (data, schema = _a.registrationSchema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false, // collect all errors not just the first one
        allowUnknown: true // allow additional fields from spread operator
    });
    if (error) {
        // Transform Joi Validation Error into a more reusable format
        const validationError = error.details.map((err) => ({
            field: err.path[0],
            message: err.message
                .replace(/^"(.*)" /, '') // Remove quotes from the start of the message
                .replace(/\s*is\s*/, '') // Remove 'is' from the message
        }));
        throw new ValidationError('Validation Failed', validationError);
    }
    return value;
};
// Custom Validation Error
class ValidationError extends Error {
    constructor(message, errors) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
