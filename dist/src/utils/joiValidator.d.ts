import { type Request, type Response, type NextFunction } from "express";
import type Joi from "joi";
declare class JoiValidator {
    validate(schema: Joi.ObjectSchema<any>, source: "body" | "params" | "query"): (req: Request, res: Response, next: NextFunction) => void;
}
export default JoiValidator;
