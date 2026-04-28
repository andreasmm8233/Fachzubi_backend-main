import mongoose from "mongoose";
import {
  cityModel,
  companyImageModel,
  employeeModel,
  employeeSessionModel,
  employerModel,
  industriesModel,
  jobModel,
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

  public async getJobsByEmployee(employeeId: string) {
    return await jobModel
      .find({ createdBy: employeeId, createdByModel: "Employee", isDeleted: false })
      .populate("company", "companyName")
      .populate("city", "name")
      .populate("industryName", "industryName")
      .select("jobTitle status startDate createdAt company city industryName")
      .sort({ createdAt: -1 });
  }

  public async getJobsByEmployeeAndEmployer(
    employeeId: string,
    employerId: string,
  ) {
    return await jobModel
      .find({
        createdBy: employeeId,
        createdByModel: "Employee",
        company: employerId,
        isDeleted: false,
      })
      .populate("company", "companyName email phoneNo")
      .populate("city", "name")
      .populate("industryName", "industryName")
      .populate("jobType", "jobTypeName")
      .select(
        "jobTitle email status startDate createdAt city industryName jobDescription jobType company",
      )
      .sort({ createdAt: -1 });
  }
}
