import { type Request, type Response } from "express";
declare class IndustriesController {
    private readonly industriesService;
    constructor();
    getAllIndustries: (_: Request, res: Response) => Promise<void>;
    getIndustryById: (req: Request, res: Response) => Promise<void>;
    addIndustry: (req: Request, res: Response) => Promise<void>;
    updateIndustryById: (req: Request, res: Response) => Promise<void>;
    deleteIndustryById: (req: Request, res: Response) => Promise<void>;
    getAllIndustry: (req: any, res: any) => Promise<void>;
}
export default IndustriesController;
