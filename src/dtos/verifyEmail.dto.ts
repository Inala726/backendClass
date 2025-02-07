import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class VerifyEmailDTO {
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp!: string;
}

export class EmailOtpDTO{
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  phoneNumber!: string;

}

export class ResetPasswordDTO{
  @IsString()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp!: string;

  @IsNotEmpty()
  @Length(6, 20)
  newPassword!: string
}

export class ChangePasswordDTO{
  @IsNotEmpty()
  @IsString()
  oldPassword!: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 35)
  newPassword!: string
}