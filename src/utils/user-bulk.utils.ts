import Joi from 'joi';

class UserBulkValidation {
    // Define the schema for the specified fields
    static userBulkSchema = Joi.object({
        fullname: Joi.string().trim().required().messages({
            'string.empty': 'Full name is required',
            'any.required': 'Full name is required'
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

        gender: Joi.string().valid('male', 'female', 'other').required().messages({
            'string.empty': 'Gender is required',
            'any.required': 'Gender is required',
            'any.only': 'Gender must be one of: male, female, other'
        }),

        address: Joi.string().trim().required().messages({
            'string.empty': 'Address is required',
            'any.required': 'Address is required'
        }),

        province: Joi.string().trim().required().messages({
            'string.empty': 'Province is required',
            'any.required': 'Province is required'
        }),

        course: Joi.string().trim().required().messages({
            'string.empty': 'Course is required',
            'any.required': 'Course is required'
        })
    });

    // Validation method
    static validate = (data: any, schema = this.userBulkSchema) => {
        const { error, value } = schema.validate(data, {
            abortEarly: false, // Collect all errors, not just the first one
            allowUnknown: true // Allow additional fields (if any)
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

export { UserBulkValidation, ValidationError };
