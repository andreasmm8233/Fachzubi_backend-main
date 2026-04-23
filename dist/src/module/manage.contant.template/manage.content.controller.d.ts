import { type Request, type Response } from "express";
declare class ManageContentController {
    private readonly manageContentService;
    constructor();
    getAllContent: (_: any, res: Response) => Promise<void>;
    editContent: (req: Request, res: Response) => Promise<void>;
}
export default ManageContentController;
