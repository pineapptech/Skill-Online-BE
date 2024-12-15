import Joi from 'joi';

class RegistrationValidation {
    static registrationSchema = Joi.object({
        firstName: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'First name is required',
                'any.required': 'First name is required'
            }),

        lastName: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'Last name is required',
                'any.required': 'Last name is required'
            }),

        email: Joi.string()
            .email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } })
            .trim()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),

        phone: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'Phone number is required',
                'any.required': 'Phone number is required'
            }),

        course: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'Course is required',
                'any.required': 'Course is required'
            }),

        address: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'Address is required',
                'any.required': 'Address is required'
            }),

        regNo: Joi.string()
            .trim()
            .required()
            .messages({
                'string.empty': 'Registration number is required',
                'any.required': 'Registration number is required'
            }),

        // Optional additional fields to match the spread operator in the controller
        file: Joi.any() // for file upload
    });

    static validate = (data: any, schema = this.registrationSchema) => {
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
}

// Custom Validation Error
class ValidationError extends Error {
    errors: any[];

    constructor(message: string, errors: any[]) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

export { RegistrationValidation, ValidationError };