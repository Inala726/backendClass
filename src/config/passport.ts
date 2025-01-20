import passport from "passport";
// import { OAuth2Strategy as GoogleStrategy } from "";
import { User } from "@prisma/client"; 
import { CustomError } from "../utils/customError.utils";
import { db } from "./db";


passport.serializeUser((user: User, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return done(new CustomError(404, "User not found"));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(new GoogleStrategy({
    
}))