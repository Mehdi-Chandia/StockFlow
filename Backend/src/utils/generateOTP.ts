import crypto from 'crypto'

export const generateOTP= ()=>{
    let otp = crypto.randomBytes(4).toString("hex")

    return otp;
}