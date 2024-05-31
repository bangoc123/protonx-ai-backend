import sha256 from 'sha256';
import { URL } from 'url';
import { validationResult } from 'express-validator';


export function generateServerErrorCode(res, code, msg, location = 'server') {
    const errors = {};
    errors[location] = {
        msg,
        readableMsg: msg
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase())
            .replace(/_/g, ' '),
    };

    return res.status(code).json({
        code,
        errors,
    });
}

export function generateInputErrorCode(res, code, msg, location, key, value) {
    const errors = {};
    errors[key] = {
        location,
        msg,
        param: key,
        value,
    };

    return res.status(code).json({
        code,
        errors,
    });
}

export function validationHandler(req, res, next) {
    const errorsAfterValidation = validationResult(req);
    if (!errorsAfterValidation.isEmpty()) {
        return res.status(400).json({
            code: 400,
            errors: errorsAfterValidation.mapped(),
        });
    }

    return next();
}