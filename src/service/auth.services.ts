import { CreateUserDTO } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";


export interface AuthService{
    login(data: LoginDTO): Promise<{accessToken: string, refreshToken:string}>
    // signIn(data:CreateUserDTO): Promise
}