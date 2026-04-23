import { type Request, type Response } from "express";
declare class CityController {
    private readonly cityService;
    constructor();
    getAllCities: (_: any, res: Response) => Promise<void>;
    getAllCitiesByFilter: (req: any, res: Response) => Promise<void>;
    getCityById: (req: Request, res: Response) => Promise<void>;
    addCity: (req: Request, res: Response) => Promise<void>;
    updateCityById: (req: Request, res: Response) => Promise<void>;
    deleteCityById: (req: Request, res: Response) => Promise<void>;
    getAllCitiesInFrontend: (_: any, res: Response) => Promise<void>;
}
export default CityController;
