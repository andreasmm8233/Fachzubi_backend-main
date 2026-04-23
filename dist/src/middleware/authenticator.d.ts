import { type Request, type Response, type NextFunction } from "express";
declare class AuthMiddleware {
    private readonly jwtService;
    private readonly userService;
    constructor();
    verifyToken: (req: Request, _: Response, next: NextFunction) => Promise<void>;
    requireUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default AuthMiddleware;
