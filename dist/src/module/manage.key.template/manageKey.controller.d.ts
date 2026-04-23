import { type Request, type Response } from "express";
declare class ManageKeyController {
    private readonly manageKeyService;
    constructor();
    getAllKeys: (_: any, res: Response) => Promise<void>;
    editKey: (req: Request, res: Response) => Promise<void>;
}
export default ManageKeyController;
