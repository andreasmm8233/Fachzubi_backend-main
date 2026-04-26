import { type Request, type Response } from "express";
import { UserService } from "../user.template/user.service";
import {
  type JwtAccessTokenPayload,
  type JwtRefreshTokenPayload,
} from "./auth.types";
import { type UserSession } from "src/models/session";
import { AuthService } from "./auth.service";
import { employeeModel, employeeSessionModel } from "../../models/index";
import JwtService from "../../utils/jwt";

const ALL_PERMISSIONS = {
  manage_jobs: true,
  manage_cities: true,
  manage_employers: true,
  manage_industries: true,
  job_types: true,
  manage_content: true,
};

class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;
  private readonly jwtService = new JwtService();
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  public createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      res.sendCreated201Response("User created successfully", user);
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };

  public loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // --- Try admin ---
      const user = await this.userService.findOneWithOptions({ email });
      if (user) {
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
          res.sendUnauthorized401Response("Incorrect password", null);
          return;
        }
        const payload: UserSession = {
          userAgent: req.headers["user-agent"] ?? "",
          ipAddress: req.ip ?? "",
          userId: user._id,
        };
        const session = await this.userService.createSession(payload);
        const accessTokenPayload: JwtAccessTokenPayload = {
          sessionId: session._id,
        };
        const refreshTokenPayload: JwtRefreshTokenPayload = {
          sessionId: session._id,
        };
        const accessToken =
          this.authService.createAccessToken(accessTokenPayload);
        const refreshToken =
          this.authService.createRefreshToken(refreshTokenPayload);
        res.sendCreated201Response("Login successful", {
          accessToken,
          refreshToken,
          role: "admin",
          permissions: ALL_PERMISSIONS,
        });
        return;
      }

      // --- Try employee ---
      const employee = await employeeModel.findOne({
        email,
        isDeleted: false,
        isActive: true,
      });
      if (employee) {
        const isPasswordMatch = await employee.comparePassword(password);
        if (!isPasswordMatch) {
          res.sendUnauthorized401Response("Incorrect password", null);
          return;
        }
        const session = await employeeSessionModel.create({
          employeeId: employee._id,
          ipAddress: req.ip ?? "",
          userAgent: req.headers["user-agent"] ?? "",
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
        res.sendCreated201Response("Login successful", {
          accessToken,
          refreshToken,
          role: "employee",
          permissions: employee.permissions,
          employee: employeeObj,
        });
        return;
      }

      res.sendNotFound404Response("Invalid email or password", null);
    } catch (error) {
      res.sendErrorResponse("Error during login", error);
    }
  };

  public generateAccessTokenFromRefreshToken = async (
    req: Request,
    res: Response,
  ) => {
    const { token } = req.body;
    const accessToken = await this.authService.getAccessTokenFromRefreshToken(
      token as string,
    );
    if (!accessToken) {
      res.sendUnauthorized401Response(
        "Refresh token expired. Please re-authenticate to generate a new token.",
        {},
      );
    } else {
      res.sendSuccess200Response("New access token generated successfully.", {
        accessToken,
      });
    }
  };
}

export default AuthController;
