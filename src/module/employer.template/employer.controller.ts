import { type Request, type Response } from "express";
import { EmployerService } from "./employer.service";
import { FileHandler } from "../../utils/fileHandler";
import logger from "../../utils/logger";
import ObjectIdConverter from "../../utils/objectIdConvertor";
import { CompanyImageHandler } from "../../utils/companyImageHandler";
import { type EmployerBodyPaylaodFrontend } from "./employer.types";
import { type Appoinment } from "src/models/appoinment";
class EmployerController {
  private readonly employerService: EmployerService;
  private readonly fileHandler: FileHandler;
  private readonly objectIdConverter: ObjectIdConverter;
  private readonly companyImageHandler: CompanyImageHandler;
  constructor() {
    this.employerService = new EmployerService();
    this.fileHandler = new FileHandler();
    this.objectIdConverter = new ObjectIdConverter();
    this.companyImageHandler = new CompanyImageHandler();
  }

  /**
   * use for Admin side
   * @param req
   * @param res
   */
  public getAllEmployers = async (req: Request, res: Response) => {
    try {
      const { searchValue, pageNo, filter, recordPerPage } = req.query;
      const creatorFilter = req.employee
        ? { createdBy: req.employee._id, createdByModel: "Employee" }
        : undefined;
      const employers = await this.employerService.getAllEmployersService(
        searchValue,
        pageNo,
        filter,
        recordPerPage,
        creatorFilter,
      );
      const totalRecords = await this.employerService.getCount(creatorFilter);
      const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
      const count = Math.ceil(totalRecords / recordPerPageValue);
      res.sendSuccess200Response("Employers retrieved successfully", {
        employers,
        count,
      });
    } catch (error) {
      logger.error("getAllEmployers", error);
      res.sendErrorResponse("Error retrieving employers", error);
    }
  };

  public getEmployerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employer = await this.employerService.getEmployerByIdService(id);
      if (!employer) {
        res.sendNotFound404Response("Employer not found", null);
        return;
      }
      const newPayloadForFrontend = {
        data: employer.employerDetail,
        images: employer.images,
      };
      res.sendSuccess200Response(
        "Employer retrieved successfully",
        newPayloadForFrontend,
      );
    } catch (error) {
      res.sendErrorResponse("Error retrieving employer", error);
    }
  };

  public updateEmployerById = async (req: Request, res: Response) => {
    try {
      const companyImages = req.files?.companyImages;
      const { id } = req.params;
      if (req.body.companyLogo) {
        const raw = req.body.companyLogo;
        let logoId: string | undefined;
        if (typeof raw === "object" && raw !== null) {
          // { _id, filepath } object sent back from frontend
          logoId = raw._id ? String(raw._id) : undefined;
        } else if (typeof raw === "string" && raw.startsWith("{")) {
          // JSON-stringified object from form-data
          try {
            const parsed = JSON.parse(raw);
            logoId = parsed?._id ? String(parsed._id) : undefined;
          } catch {
            logoId = raw;
          }
        } else {
          logoId = raw;
        }
        // Only pass to convertToObjectId if it's a valid 24-hex ObjectId string
        if (logoId && /^[a-fA-F0-9]{24}$/.test(logoId)) {
          req.body.companyLogo = this.objectIdConverter.convertToObjectId(logoId);
        } else {
          delete req.body.companyLogo;
        }
      }
      if (req?.files?.companyLogo) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(
          req.files.companyLogo,
        );
        req.body.companyLogo = mediaId ?? "";
      }
      const updatedEmployer =
        await this.employerService.updateEmployerByIdService(id, req.body);
      const { removedFile } = req.body;
      if (updatedEmployer) {
        await this.companyImageHandler.saveFileAndCreateMedia(
          companyImages as any[],
          removedFile,
          updatedEmployer._id,
        );
      }
      res.sendSuccess200Response(
        "Employer updated successfully",
        updatedEmployer,
      );
    } catch (error) {
      res.sendErrorResponse("Error updating employer", error);
    }
  };

  public deleteEmployerById = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (id) {
        const deletedEmployer =
          await this.employerService.deleteEmployerByIdService(id as string);
        res.sendSuccess200Response(
          "Employer marked as deleted successfully",
          deletedEmployer,
        );
      }
    } catch (error) {
      res.sendErrorResponse("Error deleting employer", error);
    }
  };

  public addEmployer = async (req: Request, res: Response) => {
    try {
      const creator = req.user || req.employee;
      const _id = creator?._id;
      const createdByModel: "User" | "Employee" = req.user ? "User" : "Employee";
      const companyImages = req.files?.["companyImages[]"];
      const {
        industryName,
        contactPerson,
        jobTitle,
        companyName,
        email,
        website,
        phoneNo,
        address,
        zipCode,
        companyDescription,
        videoLink,
        city,
        status,
      } = req.body;
      let companyLogo = "";
      if (req?.files?.companyLogo) {
        const mediaId = await this.fileHandler.saveFileAndCreateMedia(
          req.files.companyLogo,
        );
        companyLogo = mediaId ?? "";
      }
      const newPayloadCompanyLogo: any = {};
      if (companyLogo) {
        newPayloadCompanyLogo.companyLogo = companyLogo;
      }
      if (city.length) {
        newPayloadCompanyLogo.city = city;
      }
      const newEmployer = await this.employerService.addEmployerService({
        industryName,
        contactPerson,
        jobTitle,
        companyName,
        email,
        website,
        phoneNo,
        address,
        zipCode,
        companyDescription,
        videoLink: JSON.parse(videoLink),
        status,
        createdBy: _id,
        createdByModel,
        isDeleted: false,
        ...newPayloadCompanyLogo,
      });
      const { removedFile } = req.body;
      if (newEmployer) {
        await this.companyImageHandler.saveFileAndCreateMedia(
          companyImages as any[],
          removedFile,
          newEmployer._id,
        );
      }
      res.sendCreated201Response("Employer added successfully", newEmployer);
    } catch (error) {
      res.sendErrorResponse("Error adding employer", error);
    }
  };

  public getEmployerByCityAndIndustriesId = async (
    req: Request,
    res: Response,
  ) => {
    const { city } = req.params;
    try {
      const creatorFilter = req.employee
        ? { createdBy: req.employee._id, createdByModel: "Employee" }
        : undefined;
      const data = await this.employerService.getCompanyByCity(city, creatorFilter);
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getEmpSuggesstion = async (req: Request, res: Response) => {
    try {
      const { suggesstion } = req.query;
      const data = await this.employerService.getSuggesstionService(
        suggesstion as string,
      );
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getAllEmployersForFrontend = async (req: Request, res: Response) => {
    try {
      const {
        searchValue,
        isFillter,
        letter,
        slectedCity,
        skip,
        pageNo,
        recordPerPage,
      }: EmployerBodyPaylaodFrontend = <any>req.query;
      const data = await this.employerService.getAllEmployersForFrontendService(
        {
          searchValue,
          isFillter,
          letter,
          slectedCity,
          skip,
          pageNo,
          recordPerPage,
        },
      );
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getJobsByCompanyId = async (req: Request, res: Response) => {
    try {
      const { companyId, skip }: { companyId: string; skip: number } = <any>(
        req.query
      );
      const data = await this.employerService.getJobsByCompanyIdService(
        companyId,
        skip ?? 0,
      );
      res.sendSuccess200Response("success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public getCompanyDetail = async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params;
      const data =
        await this.employerService.getCompanyDetailService(companyId);
      res.sendSuccess200Response(" success", data);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };

  public addAppointment = async (req: Request, res: Response) => {
    try {
      const appoinmentData: Appoinment = req.body;
      await this.employerService.addAppoinmentService(appoinmentData);
      res.sendSuccess200Response(" success", null);
    } catch (error) {
      res.sendErrorResponse("failed", error);
    }
  };
}

export default EmployerController;
