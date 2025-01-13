import { LoginDTO } from "../dtos/login.dto";


export interface AuthServices{
    login(data: LoginDTO): Promise<{accessToken: string, refreshToken:string}>
}