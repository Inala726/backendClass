import { User } from "@prisma/client";
import { CreateUserDTO } from "../dtos/createUser.dto";
import { ChangePasswordDTO } from "../dtos/verifyEmail.dto";

export interface UserServices {
  createUser(data: CreateUserDTO): Promise<User>;
  getUserById(id: number): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  profile(id: number): Promise<Omit<User, "password">>;
  setPassword(id: number, data: ChangePasswordDTO): Promise<void>;
  updateProfilePic(
    id: number,
    data: { profilePic: string }
  ): Promise<Object | any>;
}
