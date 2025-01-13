import { LoginDTO } from "../../dtos/login.dto";
import { AuthServices } from "../auth.services";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomError } from "../../utils/customError.utils";
import { db } from "../../config/db";
import { comparePassword } from "../../utils/password.utils";

dotenv.config();

export class AuthServicesImpl implements AuthServices {
  async login(
    data: LoginDTO
  ): Promise<{accessToken: string, refreshToken: string}> {
    const user = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if(!isPasswordValid){
      throw new CustomError(401, "Invalid password or email");
    }

    const fullName = user.firstname + " " + user.lastname;
    const accessToken = this.generateAccessToken(user.id, fullName, user.role);

    const refreshToken = this.generateRefreshToken(user.id, fullName, user.role)

    return {accessToken, refreshToken}
  }

  generateAccessToken(userId: number, name: string, role: string): string {
    return jwt.sign([userId, name, role], process.env.JWT_SECRET || "", {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  generateRefreshToken(userId: number, name: string, role: string): string {
    return jwt.sign([userId, name, role], process.env.JWT_SECRET || "", {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  }
}
