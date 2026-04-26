import { employeeModel, employeeSessionModel } from "../../models/index";
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
}
