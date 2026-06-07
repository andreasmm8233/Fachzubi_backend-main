import { type Request, type Response } from "express";
import { RegionService } from "./region.service";
import logger from "../../utils/logger";

class RegionController {
  private readonly regionService: RegionService;

  constructor() {
    this.regionService = new RegionService();
  }

  public getAllRegions = async (_: Request, res: Response) => {
    try {
      const regions = await this.regionService.getAllRegionsService();
      res.sendSuccess200Response(
        "Regions retrieved successfully",
        regions,
      );
    } catch (error) {
      logger.error("getAllRegions", error);
      res.sendErrorResponse("Error retrieving regions", error);
    }
  };

  public getRegionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const region = await this.regionService.getRegionByIdService(id);

      if (!region) {
        res.sendNotFound404Response("Region not found", null);
        return;
      }

      res.sendSuccess200Response("Region retrieved successfully", region);
    } catch (error) {
      res.sendErrorResponse("Error retrieving region", error);
    }
  };

  public addRegion = async (req: Request, res: Response) => {
    try {
      const { name: regionName } = req.body;

      const newRegion =
        await this.regionService.addRegionService(regionName);

      res.sendCreated201Response("Region added successfully", newRegion);
    } catch (error) {
      logger.error("addRegion", error);
      res.sendErrorResponse("Error adding region", error);
    }
  };

  public updateRegionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const { name: updatedRegionData } = req.body;
      const updatedRegion =
        await this.regionService.updateRegionByIdService(
          id,
          updatedRegionData,
        );

      res.sendSuccess200Response(
        "Region updated successfully",
        updatedRegion,
      );
    } catch (error) {
      res.sendErrorResponse("Error updating region", error);
    }
  };

  public deleteRegionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedRegion =
        await this.regionService.deleteRegionByIdService(id);

      res.sendSuccess200Response(
        "Region marked as deleted successfully",
        deletedRegion,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting region", error);
    }
  };

  public getAllRegion = async (req, res) => {
    try {
      const { searchValue, pageNo, recordPerPage } = req.query;
      const data = await this.regionService.getAllRegionsByFilter(
        searchValue,
        pageNo,
        recordPerPage,
      );
      res.sendSuccess200Response("Retrieve Region successfully", data);
    } catch (error) {
      logger.error("getAllRegion", error);
      res.sendErrorResponse("Error retrieving regions", error);
    }
  };
}

export default RegionController;
