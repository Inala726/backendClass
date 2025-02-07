import { CreateUserDTO } from "../../dtos/createUser.dto";
import { db } from "../../config/db";
import { LoginDTO } from "../../dtos/login.dto";
import { CustomError } from "../../utils/customError.utils";
import { comparePassword, hashPassword } from "../../utils/password.utils";
import { generateOTP } from "../../utils/otp.utils";
import jwt from "jsonwebtoken";
import { AuthService } from "../auth.services";
import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { EmailOtpDTO, ResetPasswordDTO, VerifyEmailDTO } from "../../dtos/verifyEmail.dto";
import { welcomeEmail, sendOtpEmail } from "../../ui/Email";

export class AuthServiceImp implements AuthService {
  generateAcessToken(userId: number, name: string, role: string): string {
    return jwt.sign({ id: userId, name, role }, process.env.JWT_SECRET || "", {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  generateRefreshToken(userId: number, name: string, role: string): string {
    return jwt.sign({ id: userId, name, role }, process.env.JWT_SECRET || "", {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  generateOtpExpiration() {
    return new Date(Date.now() + 10 * 60 * 1000);
  }

  async verifyEmail(data: VerifyEmailDTO): Promise<User> {
    const user = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
    }
    if (user.emailVerified) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
    }
    if (!user.otp || !user.otpExpiry) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "OTP is not available for this user"
      );
    }

    const isOtPValid = await comparePassword(data.otp, user.otp);
    if (!isOtPValid) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
    }

    const isExpiredOtp = user.otpExpiry < new Date();

    if (isExpiredOtp) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
    }

    const userReg = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });
    //

    await welcomeEmail({
      to: userReg.email,
      subject: "Welcome to Futurerify",
      name: userReg.firstname + " " + userReg.lastname,
    });

    return userReg;
  }

  async login(
    data: LoginDTO
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new CustomError(401, "Invalid password or email");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(401, "Invalid password or email");
    }

    //
    const fullName = user.firstname + " " + user.lastname;
    const accessToken = this.generateAcessToken(user.id, fullName, user.role);

    const refreshToken = this.generateRefreshToken(
      user.id,
      fullName,
      user.role
    );

    return { accessToken, refreshToken };
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const otp = generateOTP();
    const isUserExist = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (isUserExist) {
      throw new CustomError(409, "oops email already taken");
    }

    const hashedOtp = await hashPassword(otp);
    const maRetries = 3;
    for (let attempt = 1; attempt <= maRetries; attempt++) {
      try {
        return await db.$transaction(async (transaction) => {
          const user = await transaction.user.create({
            data: {
              email: data.email,
              password: await hashPassword(data.password),
              firstname: data.firstname,
              lastname: data.lastname,
              role: data.role,
              otp: hashedOtp,
              otpExpiry: this.generateOtpExpiration(),
            },
          });

          await sendOtpEmail({
            to: data.email,
            subject: "Verify your email",
            otp,
          });
          return user;
        });
      } catch (error) {
        console.warn(`Retry ${attempt} due to IDBTransaction failure`, error);
        if (attempt === maRetries) {
          throw new CustomError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to create user after multiple retries"
          );
        }
      }
    }
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unexpected error during user creation"
    );
  }

  async forgotPassword(data: EmailOtpDTO): Promise<User> {
    const otp = generateOTP();
    const isUser = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!isUser) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "User not found");
    }

    const hashedOtp = await hashPassword(otp);

    await db.user.update({
      where: { phoneNumber: data.phoneNumber },
      data: {
        otp: hashedOtp,
        otpExpiry: this.generateOtpExpiration(),
      },
    });


    await sendOtpEmail({
      to: data.email,
      subject: "Password Reset OTP",
      otp: `your password reset otp is ${otp}. It's valid for only ten minutes`,
    });

    return isUser;
  }


  
  async resetPassword(data: ResetPasswordDTO): Promise<string> {
    const { email, otp, newPassword } = data;
  
    const user = await db.user.findFirst({
      where: { email },
    });
  
    if (!user) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "User not found");
    }
  
    if (!user.resetOtp || !user.otpExpiry || new Date() > user.otpExpiry) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "OTP has expired or is invalid");
    }
  
    const isOtpValid = await comparePassword(otp, user.resetOtp); 
    if (!isOtpValid) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
    }
  
    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('New password cannot be the same as the old password');
    }
  

    const hashedPassword = await hashPassword(newPassword);
  
    await db.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetOtp: null,
        otpExpiry: null,
      },
    });
  
    return "Password reset successfully";
  }
  
}
