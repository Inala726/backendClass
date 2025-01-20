import { db } from "../../config/db";
import { LoginDTO } from "../../dtos/login.dto";
import { CustomError } from "../../utils/customError.utils";
import { comparePassword } from "../../utils/password.utils";
import jwt from "jsonwebtoken";
import { AuthService } from "../auth.services";

export class AuthServiceImp implements AuthService {
  async login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await db.user.findUnique({ where: { email: data.email } });

    if (!user) {
      throw new CustomError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password || "");
    if (!isPasswordValid) {
      throw new CustomError(401, "Invalid email or password");
    }

    const fullname = `${user.firstname} ${user.lastname}`;
    const accessToken = this.generateAcessToken(user.id, fullname, user.role);
    const refreshToken = this.generateRefreshToken(user.id, fullname, user.role);

    return { accessToken, refreshToken };
  }

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
}
