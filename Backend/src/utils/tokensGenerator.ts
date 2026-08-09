import jwt from "jsonwebtoken"
import type { UserRole } from "../enums/user.enum.js";

interface tokenPayload{
    id: string,
    email: string,
    role: UserRole,
}

export function generateAccessToken (payload: tokenPayload){

    let token= jwt.sign(
        {
        ...payload,
        tokenType: "access" as const
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY!
        }
    )

    return token;

}

export function generateRefreshToken (payload: tokenPayload){

    let token= jwt.sign(
        {
        ...payload,
        tokenType: "refresh" as const
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY!
        }
    )

    return token;

}