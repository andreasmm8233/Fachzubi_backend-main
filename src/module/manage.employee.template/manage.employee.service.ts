import mongoose from "mongoose";
import {
  cityModel,
  companyImageModel,
  employeeModel,
  employeeSessionModel,
  employerModel,
  industriesModel,
  jobDocumentModel,
  jobImagesModel,
  jobModel,
  jobTypesModel,
  mediaModel,
} from "../../models/index";
import JwtService from "../../utils/jwt";

export class EmployeeService {
  private readonly jwtService = new JwtService();

  public async getAllEmployees() {
    return await employeeModel.find({ isDeleted: false }).select("-password");
  }

  public async getEmployeeById(id: string) {
    return await employeeModel.findById(id).select("-password");
  }

  public async createEmployee(data: Record<string, any>) {
    const employeeData = { ...data };
    delete employeeData.confirm_password;
    const existing = await employeeModel.findOne({
      email: employeeData.email,
      isDeleted: false,
    });
    if (existing) throw new Error("An employee with this email already exists");
    const employee = await employeeModel.create(employeeData);
    const result = employee.toObject() as any;
    delete result.password;
    return result;
  }

  public async updateEmployee(id: string, data: Record<string, any>) {
    const updateData = { ...data };
    delete updateData.id;
    delete updateData.password;
    delete updateData.confirm_password;
    return await employeeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select("-password");
  }

  public async deleteEmployee(id: string) {
    return await employeeModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .select("-password");
  }

  public async loginEmployee(
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const employee = await employeeModel.findOne({
      email,
      isDeleted: false,
      isActive: true,
    });
    if (!employee) throw new Error("Employee not found or account is inactive");
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) throw new Error("Incorrect password");

    const session = await employeeSessionModel.create({
      employeeId: employee._id,
      ipAddress,
      userAgent,
    });

    const accessToken = this.jwtService.sign(
      { empSessionId: String(session._id) },
      { expiresIn: "1h" },
    );
    const refreshToken = this.jwtService.sign(
      { empSessionId: String(session._id) },
      { expiresIn: "30d" },
    );

    const employeeObj = employee.toObject() as any;
    delete employeeObj.password;
    return { accessToken, refreshToken, employee: employeeObj };
  }

  public async getEmployersByEmployee(employeeId: string) {
    return await employerModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(employeeId),
          createdByModel: "Employee",
          isDeleted: false,
        },
      },
      // Company logo
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { logoId: "$companyLogo" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$logoId"] } } },
            { $project: { filepath: 1 } },
          ],
          as: "companyLogo",
        },
      },
      { $unwind: { path: "$companyLogo", preserveNullAndEmptyArrays: true } },
      // Industry
      {
        $lookup: {
          from: industriesModel.collection.name,
          let: { industryId: "$industryName" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$industryId"] } } },
            { $project: { industryName: 1 } },
          ],
          as: "industryName",
        },
      },
      { $unwind: { path: "$industryName", preserveNullAndEmptyArrays: true } },
      // City
      {
        $lookup: {
          from: cityModel.collection.name,
          let: { cityId: "$city" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$cityId"] } } },
            { $project: { name: 1, address: 1 } },
          ],
          as: "city",
        },
      },
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
      // Company images
      {
        $lookup: {
          from: companyImageModel.collection.name,
          let: { companyId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$companyId", "$$companyId"] } } },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { documentId: "$imageId" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$documentId"] } } },
                  { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
                ],
                as: "companyImages",
              },
            },
            { $unwind: { path: "$companyImages", preserveNullAndEmptyArrays: true } },
            { $project: { companyImages: 1 } },
          ],
          as: "companyImages",
        },
      },
      {
        $project: {
          companyName: 1,
          email: 1,
          contactPerson: 1,
          jobTitle: 1,
          phoneNo: 1,
          address: 1,
          zipCode: 1,
          website: 1,
          companyDescription: 1,
          videoLink: 1,
          status: 1,
          createdAt: 1,
          industryName: "$industryName.industryName",
          city: "$city.name",
          cityAddress: "$city.address",
          companyLogo: "$companyLogo.filepath",
          companyImages: {
            $map: {
              input: "$companyImages",
              as: "img",
              in: "$$img.companyImages.filepath",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
  }

  private jobDetailLookups(): any[] {
    return [
      // Company + logo
      {
        $lookup: {
          from: employerModel.collection.name,
          let: { companyId: "$company" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$companyId"] } } },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { logoId: "$companyLogo" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$logoId"] } } },
                ],
                as: "companyLogo",
              },
            },
            { $unwind: { path: "$companyLogo", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                companyName: 1,
                companyLogo: 1,
                videoLink: 1,
                companyDescription: 1,
                phoneNo: 1,
                email: 1,
                address: 1,
                website: 1,
              },
            },
          ],
          as: "company",
        },
      },
      { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
      // Industry
      {
        $lookup: {
          from: industriesModel.collection.name,
          let: { industryId: "$industryName" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$industryId"] } } },
            { $project: { industryName: 1, _id: 1 } },
          ],
          as: "industryName",
        },
      },
      { $unwind: { path: "$industryName", preserveNullAndEmptyArrays: true } },
      // City
      {
        $lookup: {
          from: cityModel.collection.name,
          let: { cityId: "$city" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$cityId"] } } },
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
      { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
      // Attachments
      {
        $lookup: {
          from: jobDocumentModel.collection.name,
          let: { jobId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$job", "$$jobId"] } } },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { documentId: "$document" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$documentId"] } } },
                  { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
                ],
                as: "document",
              },
            },
            { $unwind: { path: "$document", preserveNullAndEmptyArrays: true } },
            { $project: { job: 0 } },
          ],
          as: "attachments",
        },
      },
      // Company images
      {
        $lookup: {
          from: companyImageModel.collection.name,
          let: { jobId: "$company._id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$companyId", "$$jobId"] } } },
            {
              $lookup: {
                from: mediaModel.collection.name,
                let: { documentId: "$imageId" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$documentId"] } } },
                  { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
                ],
                as: "companyImages",
              },
            },
            { $unwind: { path: "$companyImages", preserveNullAndEmptyArrays: true } },
            { $project: { companyImages: 1 } },
          ],
          as: "companyImages",
        },
      },
      // Job images
      {
        $lookup: {
          from: jobImagesModel.collection.name,
          let: { documentId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$jobId", "$$documentId"] } } },
          ],
          as: "jobImage",
        },
      },
      { $unwind: { path: "$jobImage", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: mediaModel.collection.name,
          let: { documentId: "$jobImage.imageId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$documentId"] } } },
          ],
          as: "Images",
        },
      },
      { $unwind: { path: "$Images", preserveNullAndEmptyArrays: true } },
      // Job type
      {
        $lookup: {
          from: jobTypesModel.collection.name,
          let: { documentId: "$jobType" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$documentId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "jobTypeDetail",
        },
      },
      { $unwind: { path: "$jobTypeDetail", preserveNullAndEmptyArrays: true } },
      // Group to collapse city/image arrays
      {
        $group: {
          _id: "$_id",
          city: { $addToSet: "$city" },
          jobImages: { $addToSet: "$Images" },
          industryName: { $first: "$industryName" },
          jobType: { $first: "$jobType" },
          company: { $first: "$company" },
          jobTitle: { $first: "$jobTitle" },
          startDate: { $first: "$startDate" },
          email: { $first: "$email" },
          additionalEmail: { $first: "$additionalEmail" },
          address: { $first: "$address" },
          zipCode: { $first: "$zipCode" },
          jobDescription: { $first: "$jobDescription" },
          status: { $first: "$status" },
          isDeleted: { $first: "$isDeleted" },
          createdBy: { $first: "$createdBy" },
          createdByModel: { $first: "$createdByModel" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          attachments: { $first: "$attachments" },
          companyImages: { $addToSet: "$companyImages" },
          videoLink: { $first: "$videoLink" },
          jobTypeName: { $first: "$jobTypeDetail.jobTypeName" },
        },
      },
      { $sort: { createdAt: -1 } },
    ];
  }

  public async getJobsByEmployee(employeeId: string) {
    return await jobModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(employeeId),
          createdByModel: "Employee",
          isDeleted: false,
        },
      },
      ...this.jobDetailLookups(),
    ]);
  }

  public async getJobsByEmployeeAndEmployer(
    employeeId: string,
    employerId: string,
  ) {
    return await jobModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(employeeId),
          createdByModel: "Employee",
          company: new mongoose.Types.ObjectId(employerId),
          isDeleted: false,
        },
      },
      ...this.jobDetailLookups(),
    ]);
  }
}
