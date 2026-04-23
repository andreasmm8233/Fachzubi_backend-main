"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JoiValidator {
    validate(schema, source) {
        return (req, res, next) => {
            const { error } = schema.validate(req[source], {
                abortEarly: false,
                allowUnknown: true,
            });
            if (!!error) {
                const errors = {};
                error.details.forEach((err) => {
                    errors[err.path.join(".")] = err.message;
                });
                res.sendBadRequest400Response("Validation Error", errors);
                return;
            }
            next();
        };
    }
}
exports.default = JoiValidator;
//# sourceMappingURL=joiValidator.js.map