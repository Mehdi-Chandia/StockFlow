import jwt from "jsonwebtoken"
import type { UserRole } from "../enums/user.enum.js";
import { v4 as uuidv4 } from 'uuid';


interface tokenPayload{
    id: string,
    email: string,
    role: UserRole,
    jti?: string
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

    let jti= uuidv4();
    let token= jwt.sign(
        {
        ...payload,
        tokenType: "refresh" as const,
        jti
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY!
        }
    )


    return{
        token,
        jti
    }

}

export function generateFamilyId() {
    const familyId=uuidv4();

    return familyId;
}