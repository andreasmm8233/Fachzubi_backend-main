import * as jwt from "jsonwebtoken";
declare class JwtService {
    private readonly secret;
    constructor();
    sign(payload: any, options?: Omit<jwt.SignOptions, "algorithm">): string;
    verify(token: string): string | jwt.JwtPayload;
}
export default JwtService;
