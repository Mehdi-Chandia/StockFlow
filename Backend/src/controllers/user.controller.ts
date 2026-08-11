import { AsyncHandler } from "../utils/AsyncHandler.js";
import type { Request, Response } from "express";
import {
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "../validations/user.validation.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto"
import User from "../models/user.model.js";
import { generateEmpID } from "../utils/generateEmpId.js";
import { generateTempPassword } from "../utils/generateTemporaryPassword.js";
import { UserRole, UserStatus } from "../enums/user.enum.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/generateOTP.js";
import { otpEmailTemplate, resetPasswordTemplate, welcomeEmailTemplate } from "../services/templates/email.templates.js";
import { sendEmail } from "../services/email/email.service.js";
import { log } from "node:console";
import { generateForgotPasswordToken } from "../utils/generateforgotPasswordToken.js";
import { generateAccessToken, generateFamilyId, generateRefreshToken } from "../utils/tokensGenerator.js";
import type { jwtPayload } from "../enums/constants.js";
import { email } from "zod";
import RefreshSession from "../models/refreshSession.model.js";



// create User handler 

export const createUser = AsyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, role, warehouse } = req.body;

  const validateBody = registerUserSchema.safeParse({
    firstName,
    lastName,
    email,
    role,
    warehouse,
  });

  if (!validateBody.success) {
    console.log(validateBody.error);
    throw new ApiError(400, validateBody.error.message);
  }

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new ApiError(409, "user already exists with this email address");
  }

  const empId = generateEmpID();

  const tempPassword = generateTempPassword();
  const hashTempPass= await bcrypt.hash(tempPassword, 10);

  if (!empId || !tempPassword) {
    throw new ApiError(400, "error while creating password or empId");
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    role,
    warehouse,
    empID: empId,
    password: hashTempPass,
    mustChangePassword: true,
    resetPasswordToken: null,
    resetPasswordExpiresIn: null,
    otpCode: null,
    otpExpiresIn: null,
    status: UserStatus.ACTIVE,
  });

  const html=welcomeEmailTemplate({
    firstName: newUser.firstName,
    email: newUser.email,
    empID: newUser.empID,
    temporaryPassword:tempPassword
})

    await sendEmail({to:email, subject:"Welcome to StockFlow! ", html})

  return res.status(201).json(
    new ApiResponse(201, "user created successfully", newUser)
  )
});


// login handler

export const loginUser = AsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // console.log("request received ",email, password);
  
  const validate = loginSchema.safeParse({ email, password });

  if (!validate.success) {
    throw new ApiError(400, validate.error.message);
  }

  // console.log("validation passed");
  
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "invalid email or password");
  }

//  console.log("user found");
 

  if (user.status !== UserStatus.ACTIVE) {
    throw new ApiError(400, "this user is Blocked by Admin");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "invalid email or password");
  }

  let OTPcode = generateOTP();
  let otpExpire = new Date(Date.now() + 5 * 60 * 1000);

  user.otpCode = OTPcode;
  user.otpExpiresIn = otpExpire;

  await user.save();

//   generates the email template for otp verification
  let html=otpEmailTemplate({firstName: user.firstName, otp: OTPcode})

  // console.log("html generated ");
  
//   send the otp code to user's email
  await sendEmail({
    to: user.email,
    subject: "Your TechWare Verification Code",
    html:html 
    })

    console.log("mail send");
    
  return res.status(200).json(
    new ApiResponse(
    200,
    "email and password is verified now verify using OTP code",
    null,
  )
)
});


// otp handler

export const verifyOTP = AsyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "missing required fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if (otp !== user.otpCode) {
    throw new ApiError(400, "invalid OTP code");
  }

  if (!user.otpExpiresIn) {
    throw new ApiError(400, "OTP expiry time is missing");
  }

  if (new Date() > user.otpExpiresIn)
    throw new ApiError(400, "OTP is expired ");

  user.otpCode = null;
  user.otpExpiresIn = null;
  await user.save();

  const payload={
    id: user._id.toString(),
    email: user.email,
    role: user.role
  }

  const accessToken= generateAccessToken(payload)
  const {token, jti}= generateRefreshToken(payload)
  const refreshToken=token;

  const hashRefToken= crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex")

  let expires= new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const familyId= generateFamilyId()

  const newRefreshSession= await RefreshSession.create({
    user:user._id,
    tokenHash: hashRefToken,
    expiresAt: expires,
    revokedAt: null,
    jti:jti,
    familyId:familyId

  })

   res.cookie("access-token",accessToken,{
    maxAge: 15 * 60 * 1000,
    httpOnly: true
  })

    res.cookie("refresh-token",refreshToken,{
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true
  })


  return res.status(200).json(
    new ApiResponse(200, "user logged in successfully", null)
  )
});



// forgot password handler

export const forgotPassword= AsyncHandler(async (req:Request, res:Response)=>{
  const {email} = req.body;

  if (!email) {
    throw new ApiError(400, "email is required ")
  }

  const user= await User.findOne({email})

  if (!user) {
    return res.json({message: "if email exists then reset link is sent"})
  }

  let token=generateForgotPasswordToken()
  let expiry=new Date(Date.now() + 10 * 60 * 1000); // 10min

  user.resetPasswordToken=token;
  user.resetPasswordExpiresIn=expiry;
  await user.save();

  let resetLink= `${process.env.FRONTEND_URL}/reset-password/${token}`

  let html= resetPasswordTemplate(resetLink);

  // send the reset link to the user 
  await sendEmail({
    to:email, 
    subject:"your reset password link", 
    html:html
  })

  return res.status(200).json(
    new ApiResponse(200, "reset link is sent ", null)
  )
})


// reset password handler

export const resetPassword= AsyncHandler(async (req:Request, res:Response)=>{
  const{newPassword, confirmPassword}= req.body;
  const { token }= req.params;

  if (!token) {
    throw new ApiError(401,"token not found")
  }

  const validate= resetPasswordSchema.safeParse({newPassword, confirmPassword})

    if (!validate.success) {
    console.log(validate.error);
    throw new ApiError(400, validate.error.message);
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "password does not match ")
  } 

  let user =await User.findOne({
    resetPasswordToken:token,
    resetPasswordExpiresIn: { $gt: Date.now() }
  })

  if (!user) {
    throw new ApiError(400, "invalid or expired token")
  }

  let hashPassword= await bcrypt.hash(newPassword, 10)

  user.password=hashPassword;
  user.resetPasswordToken=null;
  user.resetPasswordExpiresIn=null;

  if (user.mustChangePassword === true) {
    
    user.mustChangePassword=false;
  }

 await user.save();

 return res.status(200).json(
  new ApiResponse(200, "password updated successfully ", null)
 )
})


export const refreshToken=AsyncHandler( async (req:Request, res: Response)=>{
  const refreshToken=req.cookies?.["refresh-token"]

  if (!refreshToken) {
    throw new ApiError(401, "refresh token not found, not authenticated")
  }

  const decode= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwtPayload;

  if (decode.tokenType !== "refresh") {
    throw new ApiError(401, "invalid token type")
  }

  if (!decode.jti) {
    throw new ApiError(401, "refresh token jti is missing");
 }

  const refSession= await RefreshSession.findOne({jti: decode.jti})

  if (!refSession) {
    throw new ApiError(404, "no session found")
  }

  if (refSession.revokedAt) {

    await RefreshSession.updateMany(
      {familyId: refSession.familyId},
      {$set: { revokedAt: new Date() }}
    )

    throw new ApiError(400, "this session is revoked, now your all sessions are revoked! please log in again.")
  }

  if (refSession.expiresAt < new Date()) {
    throw new ApiError(401, "refresh session has expired");
  }

  const incomingTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

 if (incomingTokenHash !== refSession.tokenHash) {
    throw new ApiError(401, "invalid refresh token");
 }


  const user= await User.findById(decode.id.toString())

  if (!user) {
     throw new ApiError(404, "user not found")
  }

  const payload={
    id: user._id.toString(),
    email:user.email,
    role:user.role
  }

  refSession.revokedAt= new Date(Date.now())
  await refSession.save();


  const accessToken= generateAccessToken(payload);
  const {token, jti}= generateRefreshToken(payload)
  const refToken=token;

  const hashRefToken= crypto
  .createHash("sha256")
  .update(refToken)
  .digest("hex")

  let expires= new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const newRefreshSession= await RefreshSession.create({
    user:user._id,
    tokenHash: hashRefToken,
    expiresAt: expires,
    revokedAt: null,
    jti:jti,
    familyId: refSession.familyId

  })

    res.cookie("access-token",accessToken,{
    maxAge: 15 * 60 * 1000,
    httpOnly: true
  })

    res.cookie("refresh-token",refToken,{
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true
  })

  return res.status(200).json(
    new ApiResponse(200, "tokne updated", null)
  )

})


// logout handler

export const logout= AsyncHandler ( async (req: Request, res:Response)=>{
  
  const refreshToken= req.cookies?.["refresh-token"]
  if (!refreshToken) {
    throw new ApiError(401, "refresh token not found")
  }

  const verified= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwtPayload;

  if (!verified.jti) {
    throw new ApiError(401, "jti is not found")
  }

  const refSession= await RefreshSession.findOne({jti: verified.jti})

  if (!refSession) {
     throw new ApiError(404, "session not found")
  }

  if (refSession.revokedAt !== null) {
     throw new ApiError(401, "invalid session")
  }

  if (refSession.expiresAt < new Date()) {
     throw new ApiError(401, "session has expired")
  }

  refSession.revokedAt= new Date();
  await refSession.save();

  res.clearCookie("access-token");
  res.clearCookie("refresh-token");

   return res.status(200).json(
    new ApiResponse(200, "logged out successfully", null)
  );
})



// change password handler

export const changePassword= AsyncHandler( async (req: Request, res: Response)=>{
  const {currentPassword, newPassword, confirmPassword}= req.body;
  const userId = req?.user?.id

  const validate= resetPasswordSchema.safeParse({newPassword, confirmPassword})

  if (!validate.success) {
    throw new ApiError(400, validate.error.message)
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "passwords does not match")
  }


  const user= await User.findById(userId)
  if (!user) {
    throw new ApiError(404, "user not found")
  }

  const isMatch= await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    throw new ApiError(400, "invalid current password")
  }

  if (user.mustChangePassword !== true) {
    throw new ApiError(400, "password already changed")
  }

  const hashPassword= await bcrypt.hash(newPassword, 10);

  user.password=hashPassword;
  user.mustChangePassword=false;
  await user.save();

  await RefreshSession.updateMany(
    { user: user._id, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );

  return res.status(200).json(
    new ApiResponse(200, "password changed successfully! now you will have to login again.", null)
  )

})