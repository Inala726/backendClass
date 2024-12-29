import { Role } from "@prisma/client";

export class CreateUserDTO{
    
    firstname!:string
    lastname!: string
    email!: string
    role!:Role
}