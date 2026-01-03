/**
 * Validation Error Handler
 * Centralizes validation error handling for consistency
 */

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next();
    }

    const errorMessages = errors.array().map(error => ({
        field: error.param,
        message: error.msg
    }));

    return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
    });
};

module.exports = handleValidationErrors;
