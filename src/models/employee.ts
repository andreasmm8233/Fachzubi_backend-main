import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";

export interface EmployeePermissions {
  manage_jobs: boolean;
  manage_cities: boolean;
  manage_employers: boolean;
  manage_industries: boolean;
  job_types: boolean;
  manage_content: boolean;
}

export interface Employee {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  isActive: boolean;
  isDeleted: boolean;
  permissions: EmployeePermissions;
}

export interface EmployeeDocument extends Employee, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const employeeSchema = new Schema<EmployeeDocument>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    permissions: {
      manage_jobs: { type: Boolean, default: false },
      manage_cities: { type: Boolean, default: false },
      manage_employers: { type: Boolean, default: false },
      manage_industries: { type: Boolean, default: false },
      job_types: { type: Boolean, default: false },
      manage_content: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  try {
    const hashed = await bcrypt.hash(this.get("password"), 10);
    this.set("password", hashed);
    next();
  } catch (err: any) {
    next(err);
  }
});

employeeSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

employeeSchema.methods.updatePassword = async function (newPassword: string) {
  this.password = await bcrypt.hash(newPassword, 10);
  await this.save();
};

const EmployeeModel = model<EmployeeDocument>("Employee", employeeSchema);
export default EmployeeModel;
