import { type Request, type Response } from "express";
declare class JobController {
    private readonly jobService;
    private readonly fileHandler;
    private readonly jobDocumentService;
    private readonly jobImageHandler;
    constructor();
    getAllJobs: (req: Request, res: Response) => Promise<void>;
    getJobById: (req: Request, res: Response) => Promise<void>;
    updateJobById: (req: Request, res: Response) => Promise<void>;
    deleteJobById: (req: Request, res: Response) => Promise<void>;
    addJob: (req: Request, res: Response) => Promise<void>;
    getJobSuggestion: (req: Request, res: Response) => Promise<void>;
    addApplication: (req: Request, res: Response) => Promise<void>;
}
export default JobController;
