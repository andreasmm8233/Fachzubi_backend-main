import { type Request, type Response } from "express";
declare class JobTypesController {
    private readonly jobTypesService;
    constructor();
    getJobTypeByName: (req: Request, res: Response) => Promise<void>;
    getAllJobTypes: (_: Request, res: Response) => Promise<void>;
    getJobTypeById: (req: Request, res: Response) => Promise<void>;
    addJobType: (req: Request, res: Response) => Promise<void>;
    updateJobTypeById: (req: Request, res: Response) => Promise<void>;
    deleteJobTypeById: (req: Request, res: Response) => Promise<void>;
    getAllJobTypesByFilter: (req: Request, res: any) => Promise<void>;
}
export default JobTypesController;
