import { type Request, type Response } from "express";
declare class UserController {
    private readonly userService;
    private readonly jwtService;
    private readonly authService;
    private readonly jobService;
    private readonly employerService;
    constructor();
    getUser: (req: Request, res: Response) => Promise<void>;
    updateProfile: (req: Request, res: Response) => Promise<void>;
    getForPasswordLink: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
    getAllDashBoardDataHandler: (_: Request, res: Response) => Promise<void>;
}
export default UserController;
