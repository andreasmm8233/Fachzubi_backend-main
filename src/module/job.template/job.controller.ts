import { type Request, type Response } from "express";
import { JobService } from "./job.service";
import logger from "../../utils/logger";
import { FileHandler } from "../../utils/fileHandler";
import { JobDocumentService } from "./job.documents.service";
import { JobImageHandler } from "../../utils/jobsImageHandler";
class JobController {
  private readonly jobService: JobService;
  private readonly fileHandler: FileHandler;
  private readonly jobDocumentService: JobDocumentService;
  private readonly jobImageHandler: JobImageHandler;
  constructor() {
    this.jobService = new JobService();
    this.fileHandler = new FileHandler();
    this.jobDocumentService = new JobDocumentService();
    this.jobImageHandler = new JobImageHandler();
  }

  public getAllJobs = async (req: Request, res: Response) => {
    try {
      const {
        searchValue,
        pageNo,
        filter,
        recordPerPage,
        slectedCity,
        isFillter,
        isFrontend,
      } = req.query;
      const creatorFilter = req.employee
        ? { createdBy: req.employee._id, createdByModel: "Employee" }
        : undefined;
      const jobs = await this.jobService.getAllJobsService(
        searchValue as string,
        Number(pageNo),
        filter as string,
        Number(recordPerPage),
        slectedCity as string[],
        isFillter as string,
        isFrontend as string,
        creatorFilter,
      );
      const totalRecords = await this.jobService.getCount(creatorFilter);
      const recordPerPageValue = recordPerPage ? Number(recordPerPage) : 10;
      const count = Math.ceil(totalRecords / recordPerPageValue);
      res.sendSuccess200Response("Jobs retrieved successfully", {
        jobs,
        count,
      });
    } catch (error) {
      logger.error("getAllJobs", error);
      res.sendErrorResponse("Error retrieving jobs", error);
    }
  };

  public getJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const job = await this.jobService.getJobByIdService(id);
      if (!job) {
        res.sendNotFound404Response("Job not found", null);
        return;
      }
      res.sendSuccess200Response("Job retrieved successfully", job);
    } catch (error) {
      res.sendErrorResponse("Error retrieving job", error);
    }
  };

  public updateJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      if (!req.body.startTime) {
        req.body.startTime = null;
      }
      // eslint-disable-next-line no-empty
      if (req.body.videoLink && Array.isArray(req.body.videoLink)) {
      } else {
        if (!req.body.videoLink) {
          req.body.videoLink = [];
        } else {
          const newVideoLink: string[] = [];
          newVideoLink.push(req.body.videoLink);
          req.body.videoLink = newVideoLink;
        }
      }
      const files: any = Array.isArray(req.files?.attachments)
        ? req.files?.attachments
        : [req.files?.attachments];
      const attachments: any = [];
      for (const file of files) {
        const id: any = await this.fileHandler.saveFileAndCreateMedia(file);
        attachments.push(id);
      }
      if (req.body.newCity) {
        req.body.city = req.body.newCity;
      }
      const updatedJob = await this.jobService.updateJobByIdService(
        id,
        req.body,
      );
      const { removedFile } = req.body;
      const jobsImages = req.files?.jobsImages;
      if (updatedJob) {
        await this.jobImageHandler.saveFileAndCreateMedia(
          jobsImages as any[],
          removedFile,
          id,
        );
      }
      if (req.files?.attachments) {
        await this.jobDocumentService.addDocuments(attachments, id);
      }
      if (req.body?.deletedAttachment) {
        const deletedAttachments = Array.isArray(req.body?.deletedAttachment)
          ? req.body?.deletedAttachment
          : [req.body?.deletedAttachment];
        await this.jobDocumentService.deleteDocuments(deletedAttachments);
      }
      res.sendSuccess200Response("Job updated successfully", updatedJob);
    } catch (error) {
      res.sendErrorResponse("Error updating job", error);
    }
  };

  public deleteJobById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedJob = await this.jobService.deleteJobByIdService(id);
      res.sendSuccess200Response(
        "Job marked as deleted successfully",
        deletedJob,
      );
    } catch (error) {
      res.sendErrorResponse("Error deleting job", error);
    }
  };

  public addJob = async (req: Request, res: Response) => {
    try {
      const creator = req.user || req.employee;
      const _id = creator?._id;
      const createdByModel: "User" | "Employee" = req.user ? "User" : "Employee";
      const {
        company,
        jobTitle,
        email,
        additionalEmail,
        address,
        zipCode,
        jobDescription,
        status,
        isDeleted,
        industryName,
        newCity: city,
        jobType,
      } = req.body;
      if (!req.body.startTime) {
        req.body.startTime = null;
      }
      const { startDate } = req.body;
      // eslint-disable-next-line no-empty
      if (req.body.videoLink && Array.isArray(req.body.videoLink)) {
      } else {
        if (!req.body.videoLink) {
          req.body.videoLink = [];
        } else {
          const newVideoLink: string[] = [];
          newVideoLink.push(req.body.videoLink);
          req.body.videoLink = newVideoLink;
        }
      }
      const { videoLink } = req.body;
      const files: any = Array.isArray(req.files?.attachments)
        ? req.files?.attachments
        : [req.files?.attachments];
      const attachments: any = [];
      for (const file of files) {
        if (file) {
          const id: any = await this.fileHandler.saveFileAndCreateMedia(file);
          attachments.push(id);
        }
      }

      const newJob = await this.jobService.addJobService({
        city,
        company,
        jobTitle,
        startDate,
        email,
        additionalEmail,
        address,
        zipCode,
        jobDescription,
        status,
        createdBy: _id,
        createdByModel,
        isDeleted,
        industryName,
        videoLink,
        jobType,
      });
      const { removedFile } = req.body;
      const jobsImages = req.files?.jobsImages;
      if (newJob) {
        await this.jobImageHandler.saveFileAndCreateMedia(
          jobsImages as any[],
          removedFile,
          newJob._id,
        );
      }
      await this.jobDocumentService.addDocuments(attachments, newJob._id);

      res.sendCreated201Response("Job added successfully", newJob);
    } catch (error) {
      res.sendErrorResponse("Error adding job", error);
    }
  };

  public getJobSuggestion = async (req: Request, res: Response) => {
    try {
      const { suggestion } = req.query;
      const data = await this.jobService.getSuggestionService(
        suggestion as string,
      );
      res.sendCreated201Response("Success", data);
    } catch (error) {
      res.sendErrorResponse("error", error);
    }
  };

  public addApplication = async (req: Request, res: Response) => {
    try {
      void this.jobService.addApplicationService(req.body);
      res.sendSuccess200Response("submit successfully", null);
    } catch (error) {
      res.sendErrorResponse("error", error);
    }
  };
}
export default JobController;
