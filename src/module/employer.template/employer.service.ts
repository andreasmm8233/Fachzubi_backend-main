import ObjectIdConverter from "../../utils/objectIdConvertor";
import {
  appoinmentModel,
  cityModel,
  companyImageModel,
  employerModel,
  industriesModel,
  jobModel,
  mediaModel,
  userModel,
} from "../../models";
import { type Employer } from "src/models/employer";
import { type EmployerBodyPaylaodFrontend } from "./employer.types";
import { type Appoinment } from "src/models/appoinment";
import ejs from "ejs";
import path from "path";
import emailService from "../../utils/emailService";
export class EmployerService {
  private readonly objectIdConverter: ObjectIdConverter;
  constructor() {
    this.objectIdConverter = new ObjectIdConverter();
  }

  public async getAllEmployersService(
    searchValue,
    pageNo,
    filter,
    recordPerPage,
  ) {
    const pipeline: any[] = [];

    // Match stage
    pipeline.push({
      $match: {
        isDeleted: false,
      },
    });

    // Populate industryName and city
    pipeline.push({
      $lookup: {
        from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
        localField: "industryName",
        foreignField: "_id",
        as: "industryName",
      },
    });

    pipeline.push({
      $lookup: {
        from: cityModel.collection.name, // Assuming the collection name is "cityModel"
        localField: "city",
        foreignField: "_id",
        as: "city",
      },
    });

    // Unwind industryName and city arrays
    pipeline.push({
      $unwind: {
        path: "$industryName",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $unwind: {
        path: "$city",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Project stage to select fields and exclude industryName and city
    pipeline.push({
      $project: {
        _id: 1,
        email: 1,
        companyName: 1,
        contactPerson: 1,
        createdAt: 1,
        industryName: "$industryName.industryName",
        status: 1,
        city: "$city.name",
      },
    });

    // Sorting stage
    if (filter) {
      const newFilter = filter === "Date" ? "createdAt" : filter;
      pipeline.push({
        $sort: {
          [newFilter]: 1,
        },
      });
    } else {
      pipeline.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    // Search stage
    if (searchValue) {
      pipeline.push({
        $match: {
          $or: [
            { email: { $regex: new RegExp(searchValue, "i") } },
            { companyName: { $regex: new RegExp(searchValue, "i") } },
            { contactPerson: { $regex: new RegExp(searchValue, "i") } },
            { industryName: { $regex: new RegExp(searchValue, "i") } },
            { city: { $regex: new RegExp(searchValue, "i") } },
          ],
        },
      });
    }

    // Pagination stages
    // Pagination stages
    // Pagination stages
    const skip = Number(pageNo - 1) * recordPerPage; // Calculate skip
    const limit = Number(recordPerPage); // Convert to number

    pipeline.push({
      $facet: {
        metadata: [
          { $count: "total" },
          { $addFields: { pageNo, recordPerPage } },
        ],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    const result = await employerModel.aggregate(pipeline).exec();

    // Return the result
    return result[0] ? result[0].data : [];
  }

  public async getCount() {
    const employer = await employerModel
      .find({
        isDeleted: false,
      })
      .count();
    return employer;
  }

  public async getEmployerByIdService(id: string) {
    const objectId = this.objectIdConverter.convertToObjectId(id);
    let images;
    const employerDetail = await employerModel
      .findById(id)
      .populate("industryName", "industryName")
      .populate("city", "name")
      .populate({
        path: "companyLogo",
        select: "_id",
      })
      .select("-industryName -city");
    if (employerDetail) {
      images = await companyImageModel.aggregate([
        {
          $match: {
            companyId: objectId,
          },
        },
        {
          $lookup: {
            from: mediaModel.collection.name,
            let: { mediaId: "$imageId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$mediaId"],
                  },
                },
              },
            ],
            as: "mediaDetail",
          },
        },
        {
          $unwind: {
            path: "$mediaDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            path: "$mediaDetail.filepath",
            imageId: "$mediaDetail._id",
          },
        },
      ]);
    }
    return { employerDetail, images };
  }

  public async updateEmployerByIdService(id: string, updatedData: Employer) {
    const updatedEmployer = await employerModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      },
    );
    return updatedEmployer;
  }

  public async deleteEmployerByIdService(id: string) {
    const deletedEmployer = await employerModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    );
    return deletedEmployer;
  }

  public async addEmployerService(employerData: Employer) {
    const newEmployer = await employerModel.create({
      ...employerData,
      status: true,
    });
    return newEmployer;
  }

  public async getCompanyByCity(cityId: string) {
    const cityIdsArray = cityId.split(",");
    const objectIdCityIds = cityIdsArray.map((id) =>
      this.objectIdConverter.convertToObjectId(id),
    );
    const employers = await employerModel
      .find({
        city: { $in: objectIdCityIds.length ? objectIdCityIds : cityId }, // Use $in to match any of the values in the array
        isDeleted: false,
      })
      .select("companyName");
    return employers;
  }

  public async getSuggesstionService(suggesstion: string) {
    suggesstion = suggesstion ?? "";
    const suggestionList = await employerModel.aggregate([
      {
        $match: {
          isDeleted: false,
          status: true,
        },
      },
      {
        $lookup: {
          from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
          localField: "industryName",
          foreignField: "_id",
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
        $project: {
          _id: 1,
          companyName: 1,
          industryName: "$industryName.industryName",
        },
      },
      {
        $match: {
          $or: [
            { companyName: { $regex: suggesstion, $options: "i" } },
            { industryName: { $regex: suggesstion, $options: "i" } },
          ],
        },
      },
      {
        $limit: 10,
      },
    ]);
    return suggestionList;
  }

  public async getAllEmployersForFrontendService(
    paylaod: EmployerBodyPaylaodFrontend,
  ) {
    const filterQuery = {};
    const skip = paylaod.skip ?? 0;
    if (paylaod.slectedCity) {
      if (typeof paylaod.slectedCity === "string") {
        paylaod.slectedCity = [paylaod.slectedCity];
      }
      filterQuery["city"] = {
        $in: paylaod.slectedCity.map((data: any) =>
          this.objectIdConverter.convertToObjectId(data),
        ),
      };
    }
    if (paylaod.isFillter) {
      filterQuery["industryName._id"] =
        this.objectIdConverter.convertToObjectId(paylaod.isFillter);
    }
    if (paylaod.searchValue) {
      filterQuery["$or"] = [
        { companyName: { $regex: paylaod.searchValue, $options: "i" } },
        { companyDescription: { $regex: paylaod.searchValue, $options: "i" } },
        {
          "industryName.industryName": {
            $regex: paylaod.searchValue,
            $options: "i",
          },
        },
      ];
    }
    const EmpList = await employerModel.aggregate([
      {
        $match: {
          isDeleted: false,
          status: true,
        },
      },
      {
        $lookup: {
          from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
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
            {
              $project: {
                filepath: 1,
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
        $match: {
          ...filterQuery,
        },
      },
      {
        $skip: Number(skip),
      },
      {
        $limit: 10,
      },
      {
        $project: {
          industryName: "$industryName.industryName",
          companyName: 1,
          companyLogo: "$companyLogo.filepath",
        },
      },
    ]);
    return EmpList;
  }

  public async getCompanyDetailService(companyId: string) {
    const [companyDetail] = await employerModel.aggregate([
      {
        $match: {
          _id: this.objectIdConverter.convertToObjectId(companyId),
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
            {
              $project: {
                filepath: 1,
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
        $lookup: {
          from: industriesModel.collection.name, // Assuming the collection name is "industryModel"
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
                _id: 0,
                name: 1,
                address: 1,
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
          from: companyImageModel.collection.name,
          let: { jobid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$companyId", "$$jobid"],
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
        $project: {
          email: 1,
          companyName: 1,
          address: 1,
          zipCode: 1,
          industryName: "$industryName.industryName",
          contactPerson: 1,
          companyLogo: "$companyLogo.filepath",
          companyDescription: 1,
          videoLink: 1,
          website: 1,
          phoneNo: 1,
          companyImages: {
            $map: {
              input: "$companyImages",
              as: "image",
              in: "$$image.companyImages.filepath",
            },
          },
        },
      },
    ]);
    return companyDetail;
  }

  public async getJobsByCompanyIdService(companyId: string, skip: number) {
    const companyList = await jobModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              "$company",
              this.objectIdConverter.convertToObjectId(companyId),
            ],
          },
        },
      },
      {
        $match: {
          isDeleted: false,
          status: true,
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
                companyId: "$_id",
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
        $skip: Number(skip),
      },
      {
        $limit: 10,
      },
      // {
      //   $project: {
      //     jobTitle: 1,
      //     startDate: 1,
      //     status: 1,
      //     createdAt: 1,
      //     city: { $push: "$city.name" },
      //     industryName: "$industryName.industryName",
      //     company: "$company.companyName",
      //     companyLogo: "$company.companyLogo",
      //     companyId: "$company.companyId",
      //   },
      // },
      {
        $group: {
          _id: "$_id", // Use null to group all documents into a single group
          jobTitle: { $first: "$jobTitle" },
          startDate: { $first: "$startDate" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          city: { $addToSet: "$city.name" },
          industryName: { $first: "$industryName.industryName" },
          company: { $first: "$company.companyName" },
          companyLogo: { $first: "$company.companyLogo" },
          companyId: { $first: "$company.companyId" },
        },
      },
    ]);
    return companyList;
  }

  public async addAppoinmentService(paylaod: Appoinment) {
    const employerDetail = await employerModel.findById(paylaod.companyId);
    const adminDetail = await userModel.findOne();
    const bcc: string[] = [];
    if (employerDetail?.email) {
      bcc.push(employerDetail.email);
    }
    if (adminDetail) {
      bcc.push(adminDetail.email);
    }
    const htmlContent = await ejs.renderFile(
      path.join(path.resolve(path.dirname("")), "views", "appoinment.ejs"),
      {
        jobTitle: employerDetail?.jobTitle,
        payload: paylaod,
      },
    );
    await appoinmentModel.create(paylaod);
    await emailService.sendEmail({
      bcc: bcc,
      subject: `Termin | ${paylaod.applicantName}`,
      html: htmlContent,
    });
  }

  public async getAppoinmentCount() {
    const count = await appoinmentModel.count();
    return count;
  }
}
