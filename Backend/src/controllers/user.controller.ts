import { AsyncHandler } from "../utils/AsyncHandler.js";
import type { Request, Response } from "express";
import {
  loginSchema,
  registerUserSchema,
} from "../validations/user.validation.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { generateEmpID } from "../utils/generateEmpId.js";
import { generateTempPassword } from "../utils/generateTemporaryPassword.js";
import { UserRole, UserStatus } from "../enums/user.enum.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/generateOTP.js";
import { otpEmailTemplate, welcomeEmailTemplate } from "../services/templates/email.templates.js";
import { sendEmail } from "../services/email/email.service.js";
import { log } from "node:console";



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
    password: tempPassword,
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
  console.log("request received ",email, password);
  
  const validate = loginSchema.safeParse({ email, password });

  if (!validate.success) {
    throw new ApiError(400, validate.error.message);
  }

  console.log("validation passed");
  
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "invalid email or password");
  }

 console.log("user found");
 

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

  console.log("html generated ");
  
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
    throw new ApiError(400, "user not found");
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

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );

  res.cookie("token", token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  });

  return res.status(200).json(
    new ApiResponse(200, "user logged in successfully", null)
  )
});
