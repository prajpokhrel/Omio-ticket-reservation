const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('firstName').isAlpha().notEmpty().isLength({min: 3}).trim(),
        body('lastName').isAlpha().notEmpty().isLength({min: 3}).trim(),
        body('email').isEmail().notEmpty().trim(),
        body('password').notEmpty().isStrongPassword().trim()
    ]
};

const adminValidationRules = () => {
    return [
        body('firstName').isAlpha().notEmpty().isLength({min: 3}).trim(),
        body('lastName').isAlpha().notEmpty().isLength({min: 3}).trim(),
        body('userName').isAlphanumeric().notEmpty().isLength({min: 3}).trim(),
        body('email').isEmail().notEmpty().trim(),
        body('password').notEmpty().isStrongPassword().trim()
    ]
}

const busValidationRules = () => {
    return [
        body('busServiceName').notEmpty().trim(),
        body('busNumber').notEmpty().trim(),
        body('busStatus').notEmpty().isIn(['available', 'en route', 'unavailable']).trim(),
    ]
}

const driverValidationRules = () => {
    return [
        body('firstName').notEmpty().isAlpha().isLength({min: 3}).trim(),
        body('lastName').notEmpty().isAlpha().isLength({min: 3}).trim(),
        body('email').notEmpty().isEmail().trim(),
        body('contactNumber').notEmpty().trim(),
        body('citizenshipNumber').notEmpty().trim(),
        body('licenseNumber').notEmpty().trim(),
    ]
}

const destinationValidationRules = () => {
    return [
        body('fromSource').notEmpty().trim(),
        body('toDestination').notEmpty().trim(),
        body('routeFare').notEmpty().trim()
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((error) => {
        extractedErrors.push({ [error.param]: error.msg });
    });

    return res.status(400).json({ errors: extractedErrors });
}

module.exports = {
    validate,
    userValidationRules,
    adminValidationRules,
    busValidationRules,
    driverValidationRules,
    destinationValidationRules
}