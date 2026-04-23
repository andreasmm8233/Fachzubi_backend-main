import { type JwtAccessTokenPayload, type JwtRefreshTokenPayload } from "./auth.types";
export declare class AuthService {
    private readonly jwtService;
    private readonly userService;
    constructor();
    createAccessToken(payload: JwtAccessTokenPayload): string;
    createRefreshToken(payload: JwtRefreshTokenPayload): string;
    getAccessTokenFromRefreshToken(refreshToken: string): Promise<string | null>;
}
