import { type Request, type Response } from "express";
declare class SMTPController {
    private readonly smtpService;
    constructor();
    getSMTPSettings: (_: Request, res: Response) => Promise<void>;
    updateSMTPSettings: (req: Request, res: Response) => Promise<void>;
}
export default SMTPController;
