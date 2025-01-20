import { Response, Request, NextFunction } from "express";
import { LoginDTO } from "../dtos/login.dto";
import { AuthServiceImp } from "../service/impl/auth.service.impl";
import passport from "passport";

export class AuthController {
  private authService: AuthServiceImp;

  constructor() {
    this.authService = new AuthServiceImp();
  }

  // Standard login with email and password
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: LoginDTO = req.body;
      const { accessToken, refreshToken } = await this.authService.login(data);
      res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  // Initiate Google OAuth
  public googleLogin = passport.authenticate("google", {
    scope: ["profile", "email"],
  });

  // Handle Google OAuth callback
  public googleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "Google authentication failed" });
      }

      // Generate JWT tokens
      const { id, firstname, lastname, role } = user;
      const fullname = `${firstname} ${lastname}`;
      const accessToken = this.authService.generateAcessToken(id, fullname, role);
      const refreshToken = this.authService.generateRefreshToken(id, fullname, role);

      // Respond with tokens
      res.status(200).json({ accessToken, refreshToken });
    })(req, res, next);
  };
}
