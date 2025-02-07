import { LoginDTO } from "../dtos/login.dto";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { User } from "@prisma/client";
import { EmailOtpDTO, ResetPasswordDTO, VerifyEmailDTO } from "../dtos/verifyEmail.dto";

export interface AuthService {
  login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }>;
  createUser(data: CreateUserDTO): Promise<User>;
  verifyEmail(data: VerifyEmailDTO): Promise<User>;
  forgotPassword(data:EmailOtpDTO):Promise<User>;
  resetPassword(data: ResetPasswordDTO): Promise<string>
}
