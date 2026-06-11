import {
  type JwtRefreshTokenClaims,
  type JwtAccessTokenPayload,
  type JwtRefreshTokenPayload,
} from "./auth.types";
import JwtService from "../../utils/jwt";
import { UserService } from "../user.template/user.service";
import logger from "../../utils/logger";
import { employeeModel, employeeSessionModel } from "../../models/index";
export class AuthService {
  private readonly jwtService = new JwtService();
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  public createAccessToken(payload: JwtAccessTokenPayload) {
    return this.jwtService.sign(payload, { expiresIn: "1h" });
  }

  public createRefreshToken(payload: JwtRefreshTokenPayload) {
    return this.jwtService.sign(payload, { expiresIn: "30d" });
  }

  public async getAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      // Verify refreshToken
      const decoded = this.jwtService.verify(
        refreshToken,
      ) as JwtRefreshTokenClaims;
      if (!decoded) {
        return null;
      }
      
      const { sessionId, empSessionId } = decoded;
      
      if (sessionId) {
        const userSession =
          await this.userService.getUserSessionDetailsBySessionId(sessionId);
        if (!userSession?.isValidSession) {
          return null;
        }
        // Generate accessToken
        const userDetails = await this.userService.findById(userSession.userId);
        if (userDetails) {
          const accessTokenPayload: JwtAccessTokenPayload = {
            sessionId: userSession._id,
          };
          const accessToken = this.createAccessToken(accessTokenPayload);
          return accessToken;
        }
      } else if (empSessionId) {
        const session = await employeeSessionModel.findOne({
          _id: empSessionId,
          isValidSession: true,
        });
        if (!session) {
          return null;
        }
        const employee = await employeeModel.findById(session.employeeId);
        if (employee) {
          const accessToken = this.jwtService.sign(
            { empSessionId: String(session._id) },
            { expiresIn: "1h" },
          );
          return accessToken;
        }
      }
      
      return null;
    } catch (error: any) {
      logger.error("getAccessTokenFromRefreshToken", error);
      return null;
    }
  }
}
