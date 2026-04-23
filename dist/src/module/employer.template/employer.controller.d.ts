import { type Request, type Response } from "express";
declare class EmployerController {
    private readonly employerService;
    private readonly fileHandler;
    private readonly objectIdConverter;
    private readonly companyImageHandler;
    constructor();
    getAllEmployers: (req: Request, res: Response) => Promise<void>;
    getEmployerById: (req: Request, res: Response) => Promise<void>;
    updateEmployerById: (req: Request, res: Response) => Promise<void>;
    deleteEmployerById: (req: Request, res: Response) => Promise<void>;
    addEmployer: (req: Request, res: Response) => Promise<void>;
    getEmployerByCityAndIndustriesId: (req: Request, res: Response) => Promise<void>;
    getEmpSuggesstion: (req: Request, res: Response) => Promise<void>;
    getAllEmployersForFrontend: (req: Request, res: Response) => Promise<void>;
    getJobsByCompanyId: (req: Request, res: Response) => Promise<void>;
    getCompanyDetail: (req: Request, res: Response) => Promise<void>;
    addAppointment: (req: Request, res: Response) => Promise<void>;
}
export default EmployerController;
