import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { db } from "../config/db";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface CustomRequest extends Request {
  userAuth?: string;
}

export const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      res.status(401).json({ message: "Authorization required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (authHeader.startsWith("Bearer google")) {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        res.status(401).json({ message: "Invalid Google token" });
        return;
      }

      let user = await db.user.findUnique({ where: { email: payload.email } });

      if (!user) {
        user = await db.user.create({
          data: {
            email: payload.email,
            firstname: payload.given_name || "",
            lastname: payload.family_name || "",
            isGoogleAuth: true,
          },
        });
      }

      req.userAuth = user.id.toString();
      next();
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET || "", (err, decode) => {
      if (err) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
      }

      const payload = decode as JwtPayload;
      req.userAuth = payload.id;
      next();
    });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
