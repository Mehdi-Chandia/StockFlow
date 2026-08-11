import type { UserRole } from "./user.enum.js";

export interface jwtPayload{
    id: string;
    email:string;
    role:UserRole;
    tokenType: "access" | "refresh";
    jti?: string
}