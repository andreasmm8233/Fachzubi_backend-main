import { type Request, type Response } from "express";
import { CityService } from "./city.service";
import logger from "../../utils/logger";

class CityController {
  private readonly cityService: CityService;

  constructor() {
    this.cityService = new CityService();
  }

  public getAllCities = async (_: Request, res: Response) => {
    try {
      const cities = await this.cityService.getAllCitiesService();
      res.sendSuccess200Response("Cities retrieved successfully", cities);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };

  public getAllCitiesByFilter = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const payload = { searchValue, pageNo, recordPerPage };
      const cities = await this.cityService.getAllCitiesByFilter(payload);
      res.sendSuccess200Response("Cities retrieved successfully", cities);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };

  public getCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const city = await this.cityService.getCityByIdService(id);
      if (!city) {
        res.sendNotFound404Response("City not found", null);
        return;
      }
      res.sendSuccess200Response("City retrieved successfully", city);
    } catch (error) {
      res.sendErrorResponse("Error retrieving city", error);
    }
  };

  public downloadCityQrCode = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const city = await this.cityService.getCityByIdService(id);
      if (!city) {
        res.sendNotFound404Response("City not found", null);
        return;
      }
      if (!city.qrCode) {
        res.sendNotFound404Response("QR code not found for this city", null);
        return;
      }

      const qrResponse = await fetch(city.qrCode);
      if (!qrResponse.ok) {
        res.sendErrorResponse("Failed to fetch QR code image", null);
        return;
      }

      const imageArrayBuffer = await qrResponse.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      const citySlug = city.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      res.setHeader("Content-Type", "image/png");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=\"city-${citySlug || id}-qr.png\"`,
      );
      res.send(imageBuffer);
    } catch (error) {
      logger.error("downloadCityQrCode", error);
      res.sendErrorResponse("Error downloading city QR code", error);
    }
  };

  public addCity = async (req: Request, res: Response) => {
    try {
      const creator = req.user || req.employee;
      logger.info("[CityController.addCity] req.body: " + JSON.stringify(req.body));
      const newCity = await this.cityService.addCityService({
        ...req.body,
        createdBy: creator?._id,
        createdByModel: req.user ? "User" : "Employee",
      });
      res.sendCreated201Response("City added successfully", newCity);
    } catch (error) {
      logger.error("addCity", error);
      res.sendErrorResponse("Error adding city", error);
    }
  };

  public updateCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const updatedCity = await this.cityService.updateCityByIdService(
        id,
        req.body,
      );
      res.sendSuccess200Response("City updated successfully", updatedCity);
    } catch (error) {
      res.sendErrorResponse("Error updating city", error);
    }
  };

  public deleteCityById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedCity = await this.cityService.deleteCityByIdService(id);
      res.sendSuccess200Response("City deleted successfully", deletedCity);
    } catch (error) {
      res.sendErrorResponse("Error deleting city", error);
    }
  };

  public getAllCitiesInFrontend = async (_: Request, res: Response) => {
    try {
      const cities = await this.cityService.getAllCitiesFrontendService();
      res.sendSuccess200Response("Cities retrieved successfully", cities);
    } catch (error) {
      logger.error("getAllCities", error);
      res.sendErrorResponse("Error retrieving cities", error);
    }
  };
}

export default CityController;
