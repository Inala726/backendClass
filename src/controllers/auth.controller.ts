import {Response, Request, NextFunction } from "express";
import { AuthServicesImpl } from "../service/impl/auth.service.impl";
import { LoginDTO } from "../dtos/login.dto";

export class AuthController {
  private authService: AuthServicesImpl;

  constructor() {
    this.authService = new AuthServicesImpl();
  }

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
        const data: LoginDTO = req.body;
        const {accessToken, refreshToken} = await this.authService.login(data);
        res.status(201).json({accessToken, refreshToken})
    } catch (error) {
        next(error)
    }
  };

}
