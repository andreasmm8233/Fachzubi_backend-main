import ObjectIdConverter from "../../utils/objectIdConvertor";
import mongoose from "mongoose";
import {
  applicationModel,
  cityModel,
  companyImageModel,
  employerModel,
  industriesModel,
  jobDocumentModel,
  jobImagesModel,
  jobModel,
  jobTypesModel,
  mediaModel,
  userModel,
  regionModel,
} from "../../models/index";
import { type Job } from "../../models/jobs";
import { type Application } from "../../models/jobApplication";
import ejs from "ejs";
import path from "path";
import emailService from "../../utils/emailService";
export class JobService {
  private readonly objectIdConverter: ObjectIdConverter;

  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async getAllJobsService(
    searchValue: string,
    pageNo: number,
    filter: string,
    recordPerPage: number,
    slectedCity: any,
    industry: string,
    isFrontend: string,
    creatorFilter?: { createdBy: any; createdByModel: string },
    letter?: string,
    region?: string,
  ) {
    recordPerPage = recordPerPage ?? 10;
    recordPerPage = recordPerPage > 0 ? recordPerPage : 10;
    const filterQuery: Record<string, any> = {};
    if (industry) {
      filterQuery["industryName"] =
        this.objectIdConverter.convertToObjectId(industry);
    }
    if (region) {
      filterQuery["region"] =
        this.objectIdConverter.convertToObjectId(region);
    }
    if (slectedCity) {
      let cityIdsArray: string[] = [];
      if (typeof slectedCity === "string") {
        cityIdsArray = slectedCity.split(",").map((id: string) => id.trim()).filter(Boolean);
      } else if (Array.isArray(slectedCity)) {
        cityIdsArray = slectedCity.map((id: any) => String(id).trim()).filter(Boolean);
      }

      const selectedCityObjectIds = cityIdsArray
        .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
        .map((id: string) => new mongoose.Types.ObjectId(id));

      const cities = await cityModel.find({ _id: { $in: selectedCityObjectIds } });
      const cityRegexes = cities.map((c: any) => new RegExp(`^${c.name.trim()}$`, "i"));

      if (cityRegexes.length > 0) {
        const allMatchingCities = await cityModel.find({
          name: { $in: cityRegexes }
        });
        const allMatchingCityIds = allMatchingCities.map((c: any) => c._id);

        filterQuery["cityInfo._id"] = {
          $in: allMatchingCityIds,
        };
      } else {
        filterQuery["cityInfo._id"] = {
          $in: selectedCityObjectIds,
        };
      }
    }
    const pipeline: any = [
      {
        $match: {
          isDeleted: false,
          ...(creatorFilter ?? {}),
        },
      },
      {
        $match: {
          ...(isFrontend ? { status: true } : {}),
        },
      },
      {
        $lookup: {
          from: employerModel.collection.name,
          let: { companyId: "$company" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$companyId"],
                },
              },
            },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { logoId: "$companyLogo" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$logoId"],
                      },
                    },
                  },
                ],
                as: "companyLogo",
              },
            },
            {
              $unwind: {
                path: "$companyLogo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                companyName: 1,
                companyLogo: "$companyLogo.filepath",
              },
            },
          ],
          as: "company",
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: cityModel.collection.name,
          localField: "city",
          foreignField: "_id",
          as: "cityInfo",
        },
      },
      {
        $lookup: {
          from: industriesModel.collection.name,
          localField: "industryName",
          foreignField: "_id",
          as: "industryInfo",
        },
      },
      {
        $lookup: {
          from: applicationModel.collection.name,
          let: { jobIds: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$jobId", "$$jobIds"],
                },
              },
            },
            {
              $count: "applicationCount",
            },
          ],
          as: "count",
        },
      },
      {
        $unwind: {
          path: "$count",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...filterQuery,
        },
      },
      // {
      //   $project: {
      //     jobTitle: 1,
      //     createdAt: 1,
      //     city: { $arrayElemAt: ["$cityInfo.name", 0] },
      //     industryName: { $arrayElemAt: ["$industryInfo.industryName", 0] },
      //     status: 1,
      //     company: "$company.companyName",
      //     companyLogo: "$company.companyLogo",
      //     companyId: "$company._id",
      //     startDate: 1,
      //     count: 1,
      //   },
      // },
      // start

      {
        $group: {
          _id: "$_id", // Group by the document's _id field or any other unique identifier
          jobTitle: { $first: "$jobTitle" },
          createdAt: { $first: "$createdAt" },
          city: { $addToSet: "$cityInfo.name" },
          industryName: {
            $first: { $arrayElemAt: ["$industryInfo.industryName", 0] },
          },
          status: { $first: "$status" },
          company: { $first: "$company.companyName" },
          companyLogo: { $first: "$company.companyLogo" },
          companyId: { $first: "$company._id" },
          startDate: { $first: "$startDate" },
          count: { $first: "$count" },
          region: { $first: "$region" },
        },
      },

      // End
      {
        $sort: {
          [!filter ? "createdAt" : "startDate"]: filter === "DSC" ? 1 : -1,
        },
      },
      searchValue && {
        $match: {
          $or: [
            { jobTitle: { $regex: new RegExp(searchValue, "i") } },
            { city: { $regex: new RegExp(searchValue, "i") } },
            { industryName: { $regex: new RegExp(searchValue, "i") } },
            { company: { $regex: new RegExp(searchValue, "i") } },
          ],
        },
      },
      letter && {
        $match: {
          jobTitle: { $regex: new RegExp(`^${letter}`, "i") },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: isFrontend ? 0 : (pageNo - 1) * recordPerPage || 0 },
            { $limit: (isFrontend ? pageNo * recordPerPage : recordPerPage) || 10 },
          ],
        },
      },
    ].filter(Boolean);

    const result = await jobModel.aggregate(pipeline).exec();
    const total = result[0]?.metadata[0]?.total ?? 0;
    const limit = recordPerPage || 10;
    return {
      data: result[0]?.data ?? [],
      total,
      pageNo: pageNo || 1,
      recordPerPage: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getCount(creatorFilter?: { createdBy: any; createdByModel: string }) {
    const jobCount = await jobModel
      .find({ isDeleted: false, ...(creatorFilter ?? {}) })
      .count();
    return jobCount;
  }

  public async getJobByIdService(id: string) {
    const jobId = this.objectIdConverter.convertToObjectId(id);
    const [job] = await jobModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$_id", jobId],
          },
        },
      },
      {
        $lookup: {
          from: employerModel.collection.name,
          let: { companyId: "$company" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$companyId"],
                },
              },
            },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { logoId: "$companyLogo" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$logoId"],
                      },
                    },
                  },
                ],
                as: "companyLogo",
              },
            },
            {
              $unwind: {
                path: "$companyLogo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                companyName: 1,
                companyLogo: 1,
                videoLink: 1,
                companyDescription: 1,
                phoneNo: 1,
              },
            },
          ],
          as: "company",
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: industriesModel.collection.name,
          let: { industryId: "$industryName" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$industryId"],
                },
              },
            },
            {
              $project: {
                industryName: 1,
                _id: 1,
              },
            },
          ],
          as: "industryName",
        },
      },
      {
        $unwind: {
          path: "$industryName",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: cityModel.collection.name,
          let: { cityId: "$city" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$cityId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                address: 1,
                zipCode: 1,
                directionLink: 1,
                startTime: 1,
                endTime: 1,
              },
            },
          ],
          as: "city",
        },
      },
      {
        $unwind: {
          path: "$city",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: jobDocumentModel.collection.name,
          let: { jobId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$job", "$$jobId"],
                },
              },
            },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { documentId: "$document" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$documentId"] },
                    },
                  },
                  {
                    $project: {
                      createdAt: 0,
                      updatedAt: 0,
                      __v: 0,
                    },
                  },
                ],
                as: "document",
              },
            },
            {
              $unwind: {
                path: "$document",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                job: 0,
              },
            },
          ],
          as: "attachments",
        },
      },
      {
        $lookup: {
          from: companyImageModel.collection.name,
          let: { jobId: "$company._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$companyId", "$$jobId"],
                },
              },
            },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { documentId: "$imageId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$documentId"] },
                    },
                  },
                  {
                    $project: {
                      createdAt: 0,
                      updatedAt: 0,
                      __v: 0,
                    },
                  },
                ],
                as: "companyImages",
              },
            },
            {
              $unwind: {
                path: "$companyImages",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                companyImages: 1,
              },
            },
          ],
          as: "companyImages",
        },
      },
      {
        $lookup: {
          from: jobImagesModel.collection.name,
          let: { documentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$jobId", "$$documentId"],
                },
              },
            },
          ],
          as: "jobImage",
        },
      },
      {
        $unwind: {
          path: "$jobImage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { documentId: "$jobImage.imageId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$documentId"],
                },
              },
            },
          ],
          as: "Images",
        },
      },
      {
        $unwind: {
          path: "$Images",
          preserveNullAndEmptyArrays: true,
        },
      },
      // start
      {
        $lookup: {
          from: jobTypesModel.collection.name,
          let: { documentId: "$jobType" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$documentId"],
                    },
                    {
                      $eq: ["$isDeleted", false],
                    },
                  ],
                },
              },
            },
          ],
          as: "jobTypeDetail",
        },
      },
      {
        $unwind: {
          path: "$jobTypeDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      // End
      // start region lookup
      {
        $lookup: {
          from: regionModel.collection.name,
          let: { regionId: "$region" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$regionId"],
                },
              },
            },
            {
              $project: {
                regionName: 1,
                _id: 1,
              },
            },
          ],
          as: "regionDetail",
        },
      },
      {
        $unwind: {
          path: "$regionDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      // end region lookup
      {
        $group: {
          _id: "$_id",
          city: {
            $addToSet: "$city",
          },
          cityDetail: {
            $addToSet: "$city",
          },
          jobImages: { $addToSet: "$Images" },
          industryName: { $first: "$industryName" },
          jobType: { $first: "$jobType" },
          company: { $first: "$company" },
          jobTitle: { $first: "$jobTitle" },
          startDate: { $first: "$startDate" },
          email: { $first: "$email" },
          address: { $first: "$address" },
          zipCode: { $first: "$zipCode" },
          jobDescription: { $first: "$jobDescription" },
          status: { $first: "$status" },
          isDeleted: { $first: "$isDeleted" },
          createdBy: { $first: "$createdBy" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          attachments: { $first: "$attachments" },
          companyImages: { $addToSet: "$companyImages" },
          videoLink: { $first: "$videoLink" },
          jobTypeName: { $first: "$jobTypeDetail.jobTypeName" },
          region: { $first: "$regionDetail" },
        },
      },
    ]);
    return job;
  }

  public async updateJobByIdService(id: string, updatedData: Job) {
    const updatedJob = await jobModel.findByIdAndUpdate(
      id,
      { $set: { ...updatedData } },
      {
        new: true,
      },
    );
    return updatedJob;
  }

  public async deleteJobByIdService(id: string) {
    const deletedJob = await jobModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return deletedJob;
  }

  public async addJobService(jobData: Job) {
    const newJob = await jobModel.create({ ...jobData, status: true });
    return newJob;
  }

  public async getSuggestionService(searchValue: string) {
    try {
      const suggestion = await jobModel.aggregate([
        {
          $match: {
            isDeleted: false,
            status: true,
          },
        },
        {
          $lookup: {
            from: employerModel.collection.name,
            let: { companyId: "$company" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$companyId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  companyName: 1,
                },
              },
            ],
            as: "company",
          },
        },
        {
          $unwind: {
            path: "$company",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: industriesModel.collection.name,
            let: { industryId: "$industryName" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$industryId"],
                  },
                },
              },
              {
                $project: {
                  industryName: 1,
                  _id: 1,
                },
              },
            ],
            as: "industryName",
          },
        },
        {
          $unwind: {
            path: "$industryName",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: cityModel.collection.name,
            let: { cityId: "$city" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$cityId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
            as: "city",
          },
        },
        {
          $unwind: {
            path: "$city",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: jobDocumentModel.collection.name,
            let: { jobid: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$job", "$$jobid"],
                  },
                },
              },
              {
                $project: {
                  job: 0,
                },
              },
            ],
            as: "attachments",
          },
        },
        {
          $match: {
            $or: [
              {
                "industryName.industryName": {
                  $regex: searchValue,
                  $options: "i",
                },
              },
              { "company.companyName": { $regex: searchValue, $options: "i" } },
              { jobTitle: { $regex: searchValue, $options: "i" } },
            ],
          },
        },
        // {
        //   $match: {
        //     $expr: {
        //       $or: [
        //         {
        //           $eq: [searchValue, null],
        //         },
        //         {
        //           $eq: [searchValue, ""],
        //         },
        //         {
        //           $regexMatch: {
        //             input: { $ifNull: ["$company.companyName", ""] },
        //             regex: searchValue,
        //           },
        //         },
        //         {
        //           $regexMatch: {
        //             input: { $ifNull: ["$jobTitle", ""] },
        //             regex: searchValue,
        //           },
        //         },
        //       ],
        //     },
        //   },
        // },
        {
          $project: {
            company: "$company.companyName",
            jobTitle: 1,
          },
        },
      ]);
      return suggestion;
    } catch (error) {
      return error;
    }
  }

  public async addApplicationService(payload: Application) {
    const jobDetail = await jobModel.findById(payload.jobId);
    const adminDetail = await userModel.findOne();
    const bcc: string[] = [];
    if (jobDetail) {
      bcc.push(jobDetail.email);
    }
    if (adminDetail) {
      bcc.push(adminDetail.email);
    }
    const htmlContent = await ejs.renderFile(
      path.join(path.resolve(path.dirname("")), "views", "application.ejs"),
      {
        jobTitle: jobDetail?.jobTitle,
        payload,
      },
    );
    await applicationModel.create(payload);
    await emailService.sendEmail({
      bcc,
      subject: `Anwendung | ${payload.applicantName}`,
      html: htmlContent,
    });
  }

  public async getApplicationCount() {
    const count = await applicationModel.count();
    return count;
  }
}
