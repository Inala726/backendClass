import { LoginDTO } from "../dtos/login.dto";
import { CreateUserDTO } from "../dtos/createUser.dto";

export interface AuthService {
  login(data: LoginDTO): Promise<{ accessToken: string, refreshToken: string }>;
  signIn(data: CreateUserDTO): Promise<{ accessToken: string, refreshToken: string }>;
}
