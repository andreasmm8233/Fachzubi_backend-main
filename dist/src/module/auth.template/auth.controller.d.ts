import { type Request, type Response } from "express";
declare class AuthController {
    private readonly userService;
    private readonly authService;
    private readonly jwtService;
    constructor();
    createUser: (req: Request, res: Response) => Promise<void>;
    loginUser: (req: Request, res: Response) => Promise<void>;
    generateAccessTokenFromRefreshToken: (req: Request, res: Response) => Promise<void>;
}
export default AuthController;
