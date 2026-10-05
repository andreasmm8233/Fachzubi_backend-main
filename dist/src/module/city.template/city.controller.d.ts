import { type Request, type Response } from "express";
declare class CityController {
    private readonly cityService;
    constructor();
    getAllCities: (req: Request, res: Response) => Promise<void>;
    getAllCitiesByFilter: (req: Request, res: Response) => Promise<void>;
    getCityById: (req: Request, res: Response) => Promise<void>;
    downloadCityQrCode: (req: Request, res: Response) => Promise<void>;
    addCity: (req: Request, res: Response) => Promise<void>;
    updateCityById: (req: Request, res: Response) => Promise<void>;
    deleteCityById: (req: Request, res: Response) => Promise<void>;
    getAllDeletedCities: (req: Request, res: Response) => Promise<void>;
    restoreCityById: (req: Request, res: Response) => Promise<void>;
    hardDeleteCityById: (req: Request, res: Response) => Promise<void>;
    getAllCitiesInFrontend: (_: Request, res: Response) => Promise<void>;
}
export default CityController;
